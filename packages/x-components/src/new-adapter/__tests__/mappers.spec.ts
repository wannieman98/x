import { pathTransformer } from '../mappers';
import { Mapper } from '../types';

describe('mappers tests', () => {
  const original = {
    catalog: {
      content: 'data'
    }
  };

  const current = {
    content: {
      custom: {
        catalog: {
          data: 'data'
        }
      }
    }
  };

  const originalMapper: Mapper<typeof original, string> = from => {
    return from.catalog.content.toUpperCase();
  };

  test('pathTransformer', () => {
    const result = originalMapper(original, '');

    const customMapper = pathTransformer(
      'content.custom.catalog.data',
      'catalog.content',
      originalMapper
    );

    const result2 = customMapper(current, '');
    expect(result).toEqual(result2);
  });
});
