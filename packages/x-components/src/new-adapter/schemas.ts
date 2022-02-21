import { deepMerge } from '@empathyco/x-deep-merge';
import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { reduce } from '../utils/index';

export function makeSchemaMutable(schema: Schema): MutableSchema {
  let configuredSchema = schema;

  return {
    ...configuredSchema,
    extend(schema) {
      return deepMerge(configuredSchema, schema);
    },
    replace(schema) {
      configuredSchema = schema;
      return configuredSchema;
    },
    toString(): string {
      return JSON.stringify(
        configuredSchema,
        (key, value) =>
          typeof value === 'function'
            ? ['replace', 'toString', 'extend'].includes(key)
              ? undefined
              : (value as string).toString()
            : value,
        2
      );
    }
  };
}

function isSchemaAPI(key: string | number): boolean {
  return typeof key === 'string' && ['extend', 'replace', 'printSchema'].includes(key);
}

export function createMapperFromSchema(
  schema: Schema
): (source: any, destination?: any, context?: any) => any {
  const mapper = (source: any, _destination: any, context: any = {}): any => {
    if (Array.isArray(source)) {
      return source.map(reducer);
    } else {
      return reducer(source);
    }

    function reducer(source: any): any {
      if (!source) {
        return source;
      }
      return reduce(
        schema,
        (result, destinationKey, transformer: SchemaTransformer) => {
          if (!isSchemaAPI(destinationKey)) {
            const value = createMapperFromSchemaTransformer(transformer, mapper, context)(source);
            if (value !== undefined) {
              result[destinationKey] = value;
            }
          }
          return result;
        },
        {} as any
      );
    }
  };
  return mapper;
}

function createMapperFromSchemaTransformer(
  schemaTransformer: SchemaTransformer,
  parentMapper: (source: any, destination?: any, context?: any) => any,
  context: any
): (source: any, destination?: any, context?: any) => any {
  return typeof schemaTransformer === 'function'
    ? source => schemaTransformer(source, context)
    : typeof schemaTransformer === 'string'
    ? source => {
        if (schemaTransformer.startsWith('$context')) {
          return getSafePropertyChain(context, schemaTransformer.replace('$context.', ''));
        } else {
          return getSafePropertyChain(source, schemaTransformer);
        }
      }
    : schemaTransformer.schema === '$self'
    ? source => {
        if (schemaTransformer.path) {
          const value = getSafePropertyChain(source, schemaTransformer.path);
          return value === undefined ? undefined : parentMapper(value, undefined, context);
        } else {
          return undefined;
        }
      }
    : source => {
        if (schemaTransformer.schema !== undefined && schemaTransformer.path !== undefined) {
          const mergedContext = deepMerge(
            {},
            context,
            schemaTransformer.context
              ? createMapperFromSchema(schemaTransformer.context)(source, undefined, context)
              : undefined
          );
          return createMapperFromSchema(schemaTransformer.schema as Schema)(
            getSafePropertyChain(source, schemaTransformer.path),
            undefined,
            mergedContext
          );
        } else {
          return undefined;
        }
      };
}

export type SchemaTransformer =
  | {
      path?: string;
      schema?: Schema | '$self' | ((source: any, context?: any) => any);
      context?: Schema;
    }
  | string
  | ((source: any, context?: any) => any);

export interface Schema {
  [destination: string]: SchemaTransformer;
}

export interface MutableSchema extends Schema {
  extend(schema: Schema): Schema;
  toString(): string;
  replace(schema: Schema): Schema;
}
