import { XModule } from '../x-modules.types';
import { layoutsEmitters } from './store/emitters';
import { layoutsXStoreModule } from './store/module';
import { LayoutsXStoreModule } from './store/types';
import { layoutsWiring } from './wiring';

/**
 * Layouts {@link XModule} alias.
 *
 * @public
 */
export type LayoutsXModule = XModule<LayoutsXStoreModule>;

/**
 * Device {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `device` entry point.
 *
 * @public
 */
export const layoutsXModule: LayoutsXModule = {
  name: 'layouts',
  storeModule: layoutsXStoreModule,
  storeEmitters: layoutsEmitters,
  wiring: layoutsWiring
};
