import { FacetModelName, FilterModelName, RangeValue } from '@empathyco/x-types';
import { createMapperFromSchema, makeSchemaMutable } from '../schemas';
import { searchResponse } from './mock-responses';

describe('test schema', () => {
  it('creates an Endpoint Adapter and uses simple mappers', () => {
    function numberRangeFilterTransformer(
      { value }: { value: string },
      { facetModelName }: any
    ): RangeValue | undefined {
      if (facetModelName === 'NumberRangeFacet') {
        const [min, max] = value.split('-');
        return {
          min: Number.parseFloat(min) || null,
          max: Number.parseFloat(max) || null
        };
      }
    }

    function facetModelNameTransformer({ facet }: { facet: string }): FacetModelName {
      switch (facet) {
        case 'categoryPaths':
          return 'HierarchicalFacet';
        case 'price':
          return 'NumberRangeFacet';
        default:
          return 'SimpleFacet';
      }
    }

    function filterModelNameTransformer(_: any, { facetModelName }: any): FilterModelName {
      switch (facetModelName) {
        case 'HierarchicalFacet':
          return 'HierarchicalFilter';
        case 'NumberRangeFacet':
          return 'NumberRangeFilter';
        default:
          return 'SimpleFilter';
      }
    }

    const filterSchema = makeSchemaMutable({
      id: 'id',
      totalResults: 'count',
      label: 'value',
      modelName: filterModelNameTransformer,
      range: numberRangeFilterTransformer,
      children: {
        path: 'values',
        schema: '$self'
      },
      facetId: '$context.facetId'
    });

    const facetSchema = makeSchemaMutable({
      id: 'facet',
      label: 'facet',
      modelName: facetModelNameTransformer,
      filters: {
        path: 'filters',
        schema: filterSchema,
        context: { facetId: 'facet', facetModelName: facetModelNameTransformer }
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
