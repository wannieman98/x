import { endpointAdapterFactory } from '../endpoint-adapter.factory';
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
});
