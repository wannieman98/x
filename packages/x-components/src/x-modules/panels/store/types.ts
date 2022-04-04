import { XStoreModule } from '../../../store';

export interface PanelState {
  open: string[];
}

export interface PanelGetters {}

export interface PanelMutations {
  setPanelState(payload: any): void;
  togglePanelState(panelId: string): void;
}

export interface PanelActions {}

export type PanelXStoreModule = XStoreModule<
  PanelState,
  PanelGetters,
  PanelMutations,
  PanelActions
>;
