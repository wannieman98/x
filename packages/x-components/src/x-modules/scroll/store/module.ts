import Vue from 'vue';
import { ScrollXStoreModule } from './types';

/**
 * {@link XStoreModule} For the scroll module.
 *
 * @internal
 */
export const scrollXStoreModule: ScrollXStoreModule = {
  state: () => ({
    position: {},
    pendingScrollTo: ''
  }),
  getters: {},
  mutations: {
    setScrollPosition(state, { id, position }) {
      Vue.set(state.position, id, position);
    },
    setPendingScrollTo(state, pendingScrollTo) {
      state.pendingScrollTo = pendingScrollTo;
    }
  },
  actions: {}
};
