import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { AnyRequestResponse, Mapper, MutableMapper } from './types';

export const identityMapper: Mapper<AnyRequestResponse, AnyRequestResponse> = (
  request: AnyRequestResponse
) => request;

export function path<From, FromTo, To>({
  mapper,
  fromPath = '',
  fromToPath = '',
  toPath = ''
}: {
  fromPath?: string;
  mapper: Mapper<FromTo, To>;
  fromToPath?: string;
  toPath?: string;
}): Mapper<From, To> {
  return (from, to) => {
    const dataFrom = createSafePropertyChain(getSafePropertyChain(from, fromPath), fromToPath);
    const dataTo = createSafePropertyChain(getSafePropertyChain(to, fromPath), fromToPath);
    return createSafePropertyChain(mapper(dataFrom, dataTo), toPath);
  };
}

export function pipeMappers<From, To>(
  ...mappers: [Mapper<From, any>, ...Array<Mapper<any, any>>, Mapper<any, To>]
): Mapper<From, To> {
  return (from: any, initialTo: any) =>
    mappers.reduce((to, mapper) => {
      if (to instanceof Object) {
        return { ...to, ...mapper(from, to) };
      } else {
        return mapper(from, to);
      }
    }, initialTo);
}

export function forEachMapper<From, To>(mapper: Mapper<From, To>): Mapper<Array<From>, Array<To>> {
  return (from: Array<From>, to: Array<To> = []): Array<To> =>
    from.reduce((toArray, fromValue, index) => {
      const toValue = to[index];
      toArray[index] = mapper(fromValue, toValue) as To;
      return toArray;
    }, [] as Array<To>);
}

export function makeMapperMutable<From, To>(mapper: Mapper<any, To>): MutableMapper<From, To> {
  const pipedMappers: Mapper<any, any>[] = [];
  const mutableMapper = (from: From, to: To): Partial<To> =>
    pipedMappers.length > 0
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (pipeMappers<From, To>(mapper, ...pipedMappers) as MutableMapper<From, To>)(from, to)
      : mapper(from, to);
  mutableMapper.pipe = (mapper: Mapper<From, To>) => {
    pipedMappers.push(mapper);
    return mutableMapper;
  };
  return mutableMapper;
}

function createSafePropertyChain(data: any, path: string): any {
  return !path
    ? data
    : path
        .split('.')
        .reverse()
        .reduce((chainedData, currentPath) => {
          return currentPath === ''
            ? chainedData
            : {
                [currentPath]: chainedData
              };
        }, data);
}
