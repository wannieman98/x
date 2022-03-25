import { Mapper, MapperContext } from '../types/index';
import { Schema, SchemaTransformer } from './schemas.types';

function createMapperFromSchema<Source, Target>(
  schema: Schema<Source, Target>
): Mapper<Source, Target> {
  const mapper = (source: Source, context: MapperContext = {}): Target => {
    if (Array.isArray(source)) {
      return source.map(reducer) as unknown as Target;
    } else {
      return reducer(source);
    }

    function reducer(source: any): any {
      if (source === undefined || source === null) {
        return source;
      }
      return reduce(
        schema,
        (target, targetKey, transformer: SchemaTransformer<Source, Target, keyof Target>) => {
          const value = createMapperFromSchemaTransformer<Source, Target, keyof Target>(
            transformer,
            mapper
          )(source, context);
          if (value !== undefined) {
            target[targetKey] = value;
          }
          return target;
        },
        {} as Target
      );
    }
  };
  return mapper;
}

function createMapperFromSchemaTransformer<Source, Target, TargetKey extends keyof Target>(
  schemaTransformer: SchemaTransformer<Source, Target, keyof Target>,
  parentMapper: Mapper<Source, Target>
): Mapper<Source, Target[TargetKey]> {
  return typeof schemaTransformer === 'function'
    ? (source, context) => schemaTransformer(source, context)
    : a => a;
}

/**
 * Iterates through the obj properties calling the reducer function.
 *
 * @param obj - The object to iterate through each property.
 * @param reducer - A function that will be called for each property, modifying the initialValue
 * object.
 * @param initialValue - The initial value of the accumulator property of the reducer function.
 * @returns Result of the reducer function.
 * @public
 */
export function reduce<T extends Record<string, any>, V>(
  obj: T | undefined | null,
  reducer: (
    accumulator: V,
    key: keyof T,
    value: Exclude<T[keyof T], undefined>,
    index: number
  ) => V,
  initialValue: V
): V {
  let accumulator = initialValue;
  forEach(obj, (key, value, index) => {
    accumulator = reducer(accumulator, key, value, index);
  });
  return accumulator;
}

export function forEach<T extends Record<string, any>>(
  obj: T | undefined | null,
  callbackFn: (key: keyof T, value: Exclude<T[keyof T], undefined>, index: number) => void
): void {
  if (obj == null) {
    return;
  }

  let index = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      callbackFn(key, obj[key], index++);
    }
  }
}
