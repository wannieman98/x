import { PanelXStoreModule } from './types';

export const panelXStoreModule: PanelXStoreModule = {
  state: () => ({
    open: []
  }),
  getters: {},
  mutations: {
    setPanelState(state, payload) {
      const panelId = payload.metadata.id;
      const panelState = payload.eventPayload;
      if (!panelState) {
        state.open = state.open.filter(element => element !== panelId);
      } else if (!state.open.includes(panelId)) {
        state.open.push(panelId);
      }
    },
    togglePanelState(state, panelId) {
      if (state.open.includes(panelId)) {
        state.open = state.open.filter(element => element !== panelId);
      } else {
        state.open.push(panelId);
      }
    }
  },
  actions: {}
};
