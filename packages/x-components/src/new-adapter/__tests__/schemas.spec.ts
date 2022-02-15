import { createMapperFromSchema, makeSchemaMutable } from '../schemas';
import { searchResponse } from './mock-responses';

describe('test schema', () => {
  it('creates an Endpoint Adapter and uses simple mappers', () => {
    const filterSchema = makeSchemaMutable({
      id: 'id',
      totalResults: 'count',
      label: 'value',
      modelName: () => 'Filter',
      children: {
        path: 'values',
        schema: '$self'
      },
      color: 'color.code',
      facetId: '$context.facetId',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      miPrueba: (_, context) => context.test.toUpperCase()
    });

    const facetSchema = makeSchemaMutable({
      id: 'facet',
      label: 'facet',
      modelName: () => 'Facet',
      filters: {
        path: 'filters',
        schema: filterSchema,
        context: { facetId: 'facet' }
      }
    });

    const searchFacetsSchema = makeSchemaMutable({
      facets: {
        path: 'data.facets',
        schema: facetSchema
      }
    });

    searchFacetsSchema.extend({ facets: { path: 'catalog.facets' } });
    facetSchema.extend({ filters: { path: 'values' } });
    filterSchema.extend({
      children: { path: 'children' },
      filter: 'filter'
    });

    console.log(searchFacetsSchema.toString());

    const mappedResponse = createMapperFromSchema(searchFacetsSchema)(searchResponse, undefined, {
      test: 'prueba'
    });
    expect(mappedResponse.facets).toBeDefined();
    expect(Array.isArray(mappedResponse.facets)).toBe(true);
    expect(mappedResponse.facets).toHaveLength(3);
    expect(mappedResponse.facets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          label: expect.any(String),
          modelName: 'Facet',
          filters: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              totalResults: expect.any(Number),
              facetId: expect.any(String)
            })
          ])
        })
      ])
    );
  });
});
