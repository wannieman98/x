import { createStoreEmitters } from '../../../store';
import { panelXStoreModule } from './module';

export const panelEmitters = createStoreEmitters(panelXStoreModule, {});
