import { Result } from '@empathyco/x-types';
import { cssFullThemeRollupConfig } from '../../../build/rollup.config';
import { endpointAdapterFactory } from '../endpoint-adapter.factory';
import { forEachMapper, makeMapperMutable, path, pipeMappers } from '../mappers';
import { AnyRequestResponse, Mapper } from '../types';
import { searchResponse } from './mock-responses';

const searchEndpoint = 'https://api.staging.empathy.co/search/v1/query/empathy/search';

describe('test endpoint adapter factory', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => searchResponse }));
    jest.clearAllMocks();
  });

  it('creates an Endpoint Adapter and uses simple mappers', async () => {
    const endpointAdapter = endpointAdapterFactory({
      endpoint: searchEndpoint
    });

    expect(endpointAdapter).toBeDefined();

    const mappedResponse = await endpointAdapter({
      query: 'sunglasses',
      lang: 'en'
    });

    expect(window.fetch).toHaveBeenCalledWith(
      searchEndpoint + '?query=sunglasses&lang=en',
      expect.anything()
    );

    expect(mappedResponse).toBeDefined();
    expect(mappedResponse).toMatchObject({ catalog: { content: expect.any(Array) } });
  });

  it('uses request mapper', async () => {
    const endpointAdapter = endpointAdapterFactory({
      endpoint: searchEndpoint,
      requestMapper: ({ q, l }) => ({
        query: q,
        lang: l
      })
    });

    const mappedResponse = await endpointAdapter({
      q: 'sunglasses',
      l: 'en'
    });

    expect(mappedResponse).toBeDefined();
    expect(window.fetch).toHaveBeenCalledWith(
      searchEndpoint + '?query=sunglasses&lang=en',
      expect.anything()
    );
  });

  it('uses response mapper', async () => {
    const endpointAdapter = endpointAdapterFactory({
      endpoint: searchEndpoint,
      responseMapper: ({ catalog: { content } }) =>
        (content as any[]).map((result: { name: string }) => result.name)
    });

    const mappedResponse = await endpointAdapter({});

    expect(mappedResponse).toBeDefined();
    expect(Array.isArray(mappedResponse)).toBe(true);
    expect(mappedResponse).toHaveLength(24);
    expect(mappedResponse).toContain('Polaroid Women Sunglasses');
  });

  it('uses pathTransformer mapper factory to select deep element', async () => {
    const nameMapper: Mapper<{ name: string }, Result> = ({ name }) => ({
      name: name.toUpperCase()
    });

    const priceMapper: Mapper<{ price: number; originalPrice: number }, Result> = ({
      price,
      originalPrice
    }) => ({
      price: {
        value: price,
        originalValue: originalPrice ? originalPrice : price,
        hasDiscount: !!originalPrice && originalPrice < price
      }
    });

    const resultMapper = makeMapperMutable(pipeMappers(nameMapper, priceMapper));
    const resultsMapper = forEachMapper(resultMapper);
    const searchResultsMapper = path({
      fromPath: 'data.content',
      mapper: resultsMapper,
      fromToPath: '',
      toPath: 'results'
    });

    const urlMapper: Mapper<{ url: string }, Result> = ({ url }) => ({ url });

    /*    const newResultMapper = pipeMappers(resultMapper, urlMapper);
    const newResultsMapper = forEachMapper(newResultMapper);
    const modifiedSearchMapper = pipeMappers(
      searchResultsMapper,
      path('catalog.content', newResultsMapper, 'results')
    );*/

    const endpointAdapter = endpointAdapterFactory({
      endpoint: searchEndpoint,
      responseMapper: path({
        fromPath: 'catalog.content',
        fromToPath: 'data.content',
        mapper: searchResultsMapper
      })
    });

    resultMapper.pipe(urlMapper);

    const mappedResponse = await endpointAdapter({});

    expect(mappedResponse.results).toBeDefined();
    expect(Array.isArray(mappedResponse.results)).toBe(true);
    expect(mappedResponse.results).toHaveLength(24);
    expect(mappedResponse.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          url: expect.any(String),
          price: expect.anything()
        })
      ])
    );
  });
});
