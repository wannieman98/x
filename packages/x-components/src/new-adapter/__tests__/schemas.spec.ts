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
        schema: 'SELF_SCHEMA'
      },
      color: 'color.code'
    });

    const facetSchema = makeSchemaMutable({
      id: 'facet',
      label: 'facet',
      modelName: () => 'Facet',
      filters: {
        path: 'filters',
        schema: filterSchema
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

    const mappedResponse = createMapperFromSchema(searchFacetsSchema)(searchResponse);
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
              totalResults: expect.any(Number)
            })
          ])
        })
      ])
    );
  });
});
