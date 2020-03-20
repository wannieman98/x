import { createStoreEmitters } from '../../../store';
import { searchBoxXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the search-box module.
 *
 * @internal
 */
export const searchBoxEmitters = createStoreEmitters(searchBoxXStoreModule, {
  SearchBoxQueryChanged: (_, getters) => getters.trimmedQuery
});