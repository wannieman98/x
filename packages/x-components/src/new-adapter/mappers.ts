import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { AnyRequestResponse, Mapper } from './types';

export const identityMapper: Mapper<AnyRequestResponse, AnyRequestResponse> = (
  request: AnyRequestResponse
) => request;

export function pathTransformer<From, To, To2>(
  fromPath: string,
  toPath: string,
  mapper: Mapper<To, To2>
): Mapper<From, To2> {
  return (from, to) => {
    const dataFrom = getSafePropertyChain(from, fromPath);
    const dataTo = getSafePropertyChain(to, fromPath);

    return to;
  };
}
