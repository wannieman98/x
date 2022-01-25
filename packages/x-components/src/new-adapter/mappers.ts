import { AnyRequestResponse, Mapper } from './types';

export const identityMapper: Mapper<AnyRequestResponse, AnyRequestResponse> = (
  request: AnyRequestResponse
) => request;
