import { Result } from '@empathyco/x-types';
import { endpointAdapterFactory } from '../endpoint-adapter.factory';
import { forEachMapper, makeMapperMutable, path, pipeMappers, select, as } from '../mappers';
import { Mapper } from '../types';
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
    const resultsMapper = makeMapperMutable(as('results', forEachMapper(resultMapper)));
    const bannerMapper = makeMapperMutable(({ url, image }) => ({
      url: url.toUpperCase(),
      image: image.toUpperCase()
    }));
    const bannersMapper = makeMapperMutable(as('banners', forEachMapper(bannerMapper)));
    const searchResultsMapper = makeMapperMutable(select(' catalog.content', resultsMapper));
    const searchResultsBanners = makeMapperMutable(select('banner.content', bannersMapper));

    const searchMapper = pipeMappers(searchResultsMapper, searchResultsBanners);

    const urlMapper: Mapper<{ url: string }, Result> = ({ url }) => ({ url });

    const endpointAdapter = endpointAdapterFactory({
      endpoint: searchEndpoint,
      responseMapper: searchMapper
    });

    resultMapper.pipe(urlMapper);
    bannerMapper.pipe((from, to) => {
      console.log('from', from);
      console.log('to', to);
      return to;
    });

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
