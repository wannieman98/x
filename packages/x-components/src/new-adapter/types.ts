import { HttpClient, RequestOptions } from '@empathyco/x-adapter';

export type AnyRequestResponse = any;

export interface EndpointAdapterOptions<
  Request extends AnyRequestResponse,
  Response extends AnyRequestResponse,
  ApiRequest extends AnyRequestResponse,
  ApiResponse extends AnyRequestResponse
> {
  endpoint: string | ((request: ApiRequest) => string);
  httpClient?: HttpClient;
  requestMapper?: Mapper<Request, ApiRequest>;
  responseMapper?: Mapper<ApiResponse, Response>;
}

export interface EndpointAdapterFactory<
  Request extends AnyRequestResponse,
  Response extends AnyRequestResponse,
  ApiRequest extends AnyRequestResponse,
  ApiResponse extends AnyRequestResponse
> {
  (options: EndpointAdapterOptions<Request, Response, ApiRequest, ApiResponse>): EndpointAdapter<
    Request,
    Response,
    ApiRequest,
    ApiResponse
  >;
}

export interface EndpointAdapterExtends<
  Request extends AnyRequestResponse,
  Response extends AnyRequestResponse,
  ApiRequest extends AnyRequestResponse,
  ApiResponse extends AnyRequestResponse
> {
  (
    adapter: EndpointAdapter<Request, Response, ApiRequest, ApiResponse>,
    options: Partial<EndpointAdapterOptions<Request, Response, ApiRequest, ApiResponse>>
  ): EndpointAdapter<Request, Response, ApiRequest, ApiResponse>;
}

export interface EndpointAdapter<
  Request extends AnyRequestResponse,
  Response extends AnyRequestResponse,
  ApiRequest extends AnyRequestResponse,
  ApiResponse extends AnyRequestResponse
> {
  (request: Request, httpClientOptions?: RequestOptions): Promise<Response>;
  options: EndpointAdapterOptions<Request, Response, ApiRequest, ApiResponse>;
}

export interface Mapper<From, To> {
  (from: From, to: To): Partial<To>;
}

export interface MutableMapper<From, To> extends Mapper<From, To> {
  pipe(mapper: Mapper<any, To>): this;
}
