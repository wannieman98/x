import { createStoreEmitters } from '../../../store';
import { layoutsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the layouts module.
 *
 * @internal
 */
export const layoutsEmitters = createStoreEmitters(layoutsXStoreModule, {});
