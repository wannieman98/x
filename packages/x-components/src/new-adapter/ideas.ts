import { EmpathyBanner } from '../../../search-adapter/types/empathy/models/entities/empathy-banner.model';
import { SearchRequest } from '../../../search-adapter/types/types/requests.types';
import { SearchResponse } from '../../../search-adapter/types/types/response.types';
import { Banner, Result } from '@empathyco/x-types';

type ApiRequest = Record<string,any>;
type ApiResponse = any;
type MappedResponse = any;
type PlatformSearchResponse = any;
type PlatformBanner = any;

// UTILS____________________________________________________________________________________________

interface Requestor {
  request(endpoint: string, parameters: ApiRequest): Promise<ApiResponse>;
}
interface HttpRequestor extends Requestor {}
interface BeaconRequestor extends Requestor {}

// ADAPTER ENDPOINT_________________________________________________________________________________

interface EndpointAdapterOptions {
  endpoint: string | ((request: ApiRequest) => string);
  requestor?: Requestor;
  requestMapper?: Mapper<SearchRequest, ApiRequest>;
  responseMapper: Mapper<PlatformSearchResponse, SearchResponse>;
}

interface EndpointAdapter {
  (request: ApiRequest): Promise<MappedResponse>;
  options: EndpointAdapterOptions;
}

const endpointAdapter!: EndpointAdapter;

interface EndpointAdapterFactory {
  (options: EndpointAdapterOptions): EndpointAdapter;
}
const endpointAdapterFactory!: EndpointAdapterFactory;

interface EndpointAdapterExtends {
  (adapter: EndpointAdapter, options: Partial<EndpointAdapterOptions>): EndpointAdapter;
}
const endpointAdapterExtends!: EndpointAdapterExtends;

// MAPPER___________________________________________________________________________________________

interface Mapper<From, To> {
  (from: From, to: To): Partial<To>;
}

// MAPPERS FACTORIES________________________________________________________________________________
interface Pipe {
  <From, To>(...mappers: Array<Mapper<From, To>>): Mapper<From, To>;
}

export type PathTuple<SomeObject> = {
  [Property in keyof SomeObject]: SomeObject[Property] extends Record<keyof any, unknown>
    ? [Property & string] | [Property & string, ...PathTuple<SomeObject[Property]>]
    : [Property & string];
}[keyof SomeObject];

export type PathValue<SomeObject, Path extends PathTuple<SomeObject>> = Path extends [
    any,
    ...infer Rest
  ]
  ? Rest extends PathTuple<SomeObject[Path[0]]>
    ? PathValue<SomeObject[Path[0]], Rest>
    : SomeObject[Path[0]]
  : SomeObject;

const x: PathTuple<Result> = ['identifier','value' ];

interface PickAndDrop {
  <From, To>(fromPath: keyof From | string, toPath: keyof To | string, mapper: Mapper<From[fromPath], To[toPath]>): Mapper<
    From,
    To
    >;
}

interface Foreach {
  <From, To>(mapper: Mapper<From, To>): Mapper<Array<From>, Array<To>>;
}

interface Projection {
  <From, To>(mapping: Record<keyof From | string, keyof To | string>): Mapper<From, To>;
}

interface FromFunction {
  <From, To>(fn: (from: From) => To): Mapper<From, To>;
}


// MAPPERS FACTORIES FAKE IMPLEMENTATIONS___________________________________________________________
const pipe: Pipe = function(...mappers) {
  return (from, to) => to;
};

const pickAndDrop: PickAndDrop = function() {
  return (from, to) => to;
};


const foreach: Foreach = function() {
  return (from, to) => to;
};

const projection: Projection = function (mapping) {
  return (from, to) => to;
};

const fromFunction: FromFunction = function() {
  return (from, to) => to;
};

const bannerMapper1 = projection({
  id: 'id',
  title: 'title',
  url: 'url',
  image_url: 'url'
})

const bannerMapper2 = ()=> ({modelName: 'Banner'}

const bannerMapper: Mapper<PlatformBanner, Banner> = pipe(
  bannerMapper1,
  bannerMapper2
);

const createBannersMapper= (mapper:Mapper<PlatformBanner, Banner>) => pickAndDrop('banner.content', 'banners', foreach(mapper));


mappersConfig= {
  operator: pickAndDrop,
  parameters: [
    'banner.content',
    'banners',
    {
      operator: foreach,
      parameters:[
        {
          operator: pipe,
          parameters:[
            bannerMapper
          ]
        }
      ]
    }
  ]
}


{
  banners: Banner[]
}

const bannersMapper: Mapper<PlatformSearchResponse, SearchResponse> = createBannersMapper(bannerMapper);


declare module '@empathyco/x-types'{
  interface Banner{
    campoNuevo: string;
  }
}

const customBannersMapper = createBannersMapper((from,to)=>({campoNuevo:  from.nuevo_campo}));

SitionComun.bannerMapper.pipe((from,to)=>({campoNuevo:  from.nuevo_campo}))

const customEndpointAdapter = endpointAdapterExtends(endpointAdapter,{
  responseMapper: pipe(endpointAdapter.options.responseMapper, customBannersMapper)
})


const searchMapper: Mapper<PlatformSearchResponse, SearchResponse> = pipe(bannersMapper, resultsMapper);


function resultMapperFactory<From,To>(mapper:Mapper<From,To>):Mapper<From,To> {
  return pickAndDrop('content.catalog', 'results', foreach(mapper));
}

const newResultsMapper: Mapper<any, any> = resultMapperFactory((from, to)=>({
  ...to,
  miNuevoCampo: from.nuevo_campo
})
)
const customResutlsMapper =pickAndDrop('mi.docs', 'content.catalog', resutlsMapper);

endpointAdapterExtends(endpointAdapter,{
  responseMapper: pipe(endpointAdapter.options.responseMapper, newResultsMapper)
})



createAdapter({
  response: {
    results: {
      __path__: 'catalog.content',
      id: 'internal_id',
      price: () => new Price()
    },
    cosas: {}
  }
});

createEndpointAdapter({
  endpoint: 'htltltp',
  responseMappers: {
    responsePath: 'catalog.content',
    mapper: simpleMapper({
      id: 'internal_id',
      price: () => new Price()
    })
  }
} as EndpointAdapterOptions);

function pipeMappers(...mappers: Array<Mapper<From, To>>): Mapper<From, To>;

const resultMapper = pipeMapperspied(
  idMapper,
  nameMapper,
  priceMapper(options),
  urlMapper,
  imagesMapper,
  taggingMapper,
  simpleMapper({
    name: 'title',
    url: 'urlPath'
  }),
  extraFieldsMapper,
  mapperMap('catalog.tagging.query', 'tagging.query', taggingMapper)
);

const customResultMapper = pipeMappers(resultMapper, customMapper, importedMapper);

interface MapperFactory<From, To> {
  (pathFrom: string, pathTo: string, transform: (a: From) => To): Mapper<From, To>;
}
const mapperFactory: MapperFactory<any, any> = function (pathFrom, pathTo, transfrom): any {};

const priceMapper = mapperFactory<{ priceMax: string }, { price: { current: number } }>(
  'priceMax',
  'price.current',
  Number
);

function getEndpointAdapter(options: EndpointAdapterOptions): EndpointAdapter;

const suggestionsMapper: any = function (response: ApiResponse): MappedResponse {};

const platformPopularSearches = getEndpointAdapter({
  endpoint: 'https://search.internal{(.)env}.empathy.co/query/{instance}/empathy/empathize/{lang}',
  responseMapper: suggestionsMapper
});

function extendAdapterEndpoint(
  adapterEndpoint: EndpointAdapter,
  options: Partial<EndpointAdapterOptions>
): EndpointAdapter;

const customPopularSearches = extendAdapterEndpoint(platformPopularSearches, {
  endpoint: 'https://kroger.{env}.empathy.co/query/empathy/empathize'
});

const adapter: any = {
  popularSearches: customPopularSearches
};
