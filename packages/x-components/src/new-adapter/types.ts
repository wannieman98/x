import { HttpClient } from '../../../search-adapter/types/empathy/http-clients/http-client.types';

export interface EndpointAdapterOptions<
  Request extends Record<string, any>,
  Response extends Record<string, any>,
  ApiRequest extends Record<string, any>,
  ApiResponse extends Record<string, any>
> {
  endpoint: string | ((request: ApiRequest) => string);
  httpClient?: HttpClient;
  requestMapper?: Mapper<Request, ApiRequest>;
  responseMapper: Mapper<ApiResponse, Response>;
}

export interface EndpointAdapterFactory<
  Request extends Record<string, any>,
  Response extends Record<string, any>,
  ApiRequest extends Record<string, any>,
  ApiResponse extends Record<string, any>
> {
  (options: EndpointAdapterOptions<Request, Response, ApiRequest, ApiResponse>): EndpointAdapter<
    Request,
    Response,
    ApiRequest,
    ApiResponse
  >;
}

export interface EndpointAdapterExtends {
  (adapter: EndpointAdapter, options: Partial<EndpointAdapterOptions>): EndpointAdapter;
}

export interface EndpointAdapter {
  (request: ApiRequest): Promise<Response>;
  options: EndpointAdapterOptions;
}

interface Mapper<From, To> {
  (from: From, to: To): Partial<To>;
}
