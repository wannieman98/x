import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../../../plugins/x-plugin';
import { map } from '../../../../utils';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getMockedAdapter } from '../../../../__tests__/utils';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';
import { resetQuerySuggestionsStateWith } from './utils';

describe('testing history queries module actions', () => {
  const mockedSuggestions = getSuggestionsStub('QuerySuggestion');

  const adapter = getMockedAdapter({ suggestions: { suggestions: mockedSuggestions } });

  const actionKeys = map(querySuggestionsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  let store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any);
  localVue.use(XPlugin, { adapter, store });

  beforeEach(() => {
    resetQuerySuggestionsStateWith(store, { query: '' });
  });

  describe(`${actionKeys.getSuggestions}`, () => {
    it('should return suggestions if there is request', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });

      const suggestions = await store.dispatch(actionKeys.getSuggestions);
      expect(suggestions).toEqual(mockedSuggestions);
    });

    it('should return empty array if there is not request', async () => {
      const suggestions = await store.dispatch(actionKeys.getSuggestions);
      expect(suggestions).toEqual([]);
    });
  });

  describe(`${actionKeys.getAndSaveSuggestions}`, () => {
    it('should request and store suggestions in the state', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });

      await store.dispatch(actionKeys.getAndSaveSuggestions);
      expect(store.state.suggestions).toEqual(mockedSuggestions);
    });

    it('should clear suggestions in the state if the query is empty', async () => {
      await store.dispatch(actionKeys.getAndSaveSuggestions);
      expect(store.state.suggestions).toEqual([]);
    });
  });
});