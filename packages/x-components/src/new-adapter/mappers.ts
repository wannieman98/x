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

export function as<From, To>(asPath = '', mapper: Mapper<From, To>): Mapper<From, To> {
  return (from, to) => {
    return createSafePropertyChain(mapper(from, to), asPath);
  };
}

export function select<From, To>(selectPath = '', mapper: Mapper<any, To>): Mapper<From, To> {
  return (from, to) => {
    return mapper(
      getSafePropertyChain(from, selectPath) as From,
      getSafePropertyChain(to, selectPath) as To
    );
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
    Array.isArray(from)
      ? from.reduce((toArray, fromValue, index) => {
          const toValue = to[index];
          toArray[index] = mapper(fromValue, toValue) as To;
          return toArray;
        }, [] as Array<To>)
      : to;
}

export function makeMapperMutable<From, To>(
  mapper: Mapper<any, To>,
  { selectPath, asPath }: { selectPath?: string; asPath?: string } = {}
): MutableMapper<From, To> {
  let pipedMappers: Mapper<any, any>[] = [];
  let replacedMapper: Mapper<any, any> | null = null;
  const mutableMapper = (from: From, to: To): Partial<To> => {
    let finalMapper = replacedMapper ?? mapper;
    if (pipedMappers.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      finalMapper = pipeMappers<From, To>(finalMapper, ...pipedMappers);
    }
    if (selectPath) {
      finalMapper = select(selectPath, finalMapper);
    }
    if (asPath) {
      finalMapper = as(asPath, finalMapper);
    }

    return finalMapper(from, to);
  };
  mutableMapper.pipe = (mapper: Mapper<From, To>) => {
    pipedMappers.push(mapper);
    return mutableMapper;
  };

  mutableMapper.replace = (mapper: Mapper<From, To>) => {
    pipedMappers = [];
    replacedMapper = mapper;
    return mutableMapper;
  };

  mutableMapper.select = (path: string) => {
    selectPath = path;
    return mutableMapper;
  };

  mutableMapper.as = (path: string) => {
    asPath = path;
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
