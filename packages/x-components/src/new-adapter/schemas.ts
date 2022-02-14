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
    printSchema(): string {
      return JSON.stringify(configuredSchema, null, 2);
    }
  };
}

function isSchemaAPI(key: string | number): boolean {
  return typeof key === 'string' && ['extend', 'replace', 'printSchema'].includes(key);
}

export function createMapperFromSchema(schema: Schema): (source: any) => any {
  const mapper = (source: any): any => {
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
            const value = createMapperFromSchemaTransformer(transformer, mapper)(source);
            if (value) {
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
  parentMapper: (source: any) => any
): (source: any) => any {
  return typeof schemaTransformer === 'function'
    ? source => schemaTransformer(source)
    : typeof schemaTransformer === 'string'
    ? source => getSafePropertyChain(source, schemaTransformer)
    : schemaTransformer.schema === 'SELF_SCHEMA'
    ? source => {
        if (schemaTransformer.path) {
          const value = getSafePropertyChain(source, schemaTransformer.path);
          return value === undefined ? undefined : parentMapper(value);
        } else {
          return undefined;
        }
      }
    : source =>
        schemaTransformer.schema !== undefined && schemaTransformer.path !== undefined
          ? createMapperFromSchema(schemaTransformer.schema as Schema)(
              getSafePropertyChain(source, schemaTransformer.path)
            )
          : undefined;
}

export type SchemaTransformer =
  | {
      path?: string;
      schema?: Schema | 'SELF_SCHEMA';
    }
  | string
  | ((source: any) => any);

export interface Schema {
  [destination: string]: SchemaTransformer;
}

export interface MutableSchema extends Schema {
  extend(schema: Schema): Schema;
  printSchema(): string;
  replace(schema: Schema): Schema;
}
