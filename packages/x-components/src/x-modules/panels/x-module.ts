import { XModule } from '../x-modules.types';
import { panelEmitters } from './store/emitters';
import { panelWiring } from './wiring';
import { PanelXStoreModule } from './store/types';
import { panelXStoreModule } from './store/module';

export type PanelXModule = XModule<PanelXStoreModule>;

export const panelXModule: PanelXModule = {
  name: 'panel',
  storeModule: panelXStoreModule,
  storeEmitters: panelEmitters,
  wiring: panelWiring
};
