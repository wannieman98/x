import { createWiring, namespacedWireCommit } from '../../wiring';

const moduleName = 'panel';

const wireCommit = namespacedWireCommit(moduleName);

const setPanelState = wireCommit('setPanelState', payload => payload);

const togglePanelState = wireCommit('togglePanelState');

export const panelWiring = createWiring({
  UserClickedPanelToggleButton: {
    togglePanelState
  },
  TogglePanelStateChanged: {
    setPanelState
  }
});
