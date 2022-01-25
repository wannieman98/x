import { FetchHttpClient } from '@empathyco/x-adapter';
import { identityMapper } from './mappers';
import {
  AnyRequestResponse,
  EndpointAdapter,
  EndpointAdapterExtends,
  EndpointAdapterFactory
} from './types';

export const endpointAdapterFactory: EndpointAdapterFactory<
  AnyRequestResponse,
  AnyRequestResponse,
  AnyRequestResponse,
  AnyRequestResponse
> = function (options) {
  const adapter: EndpointAdapter<
    AnyRequestResponse,
    AnyRequestResponse,
    AnyRequestResponse,
    AnyRequestResponse
  > = async (request, httpClientOptions) => {
    const {
      endpoint,
      httpClient = new FetchHttpClient(),
      requestMapper = identityMapper,
      responseMapper = identityMapper
    } = options;
    // TODO: add the placeholder replace logic to string endpoint
    const apiEndpoint = typeof endpoint === 'function' ? endpoint(request) : endpoint;
    const apiRequest = requestMapper(request, {});
    const apiResponse = await httpClient.get<AnyRequestResponse>(
      apiEndpoint,
      apiRequest,
      httpClientOptions
    );
    return responseMapper(apiResponse, {});
  };
  adapter.options = options;
  return adapter;
};

export const endpointAdapterExtends: EndpointAdapterExtends<
  AnyRequestResponse,
  AnyRequestResponse,
  AnyRequestResponse,
  AnyRequestResponse
> = function (
  adapter,
  options
): EndpointAdapter<AnyRequestResponse, AnyRequestResponse, AnyRequestResponse, AnyRequestResponse> {
  return endpointAdapterFactory(Object.assign({}, adapter.options, options));
};
