import { XStoreModule } from '../../../store';

/**
 * Layouts store state.
 *
 * @public
 */
export interface LayoutsState {}

/**
 * Layouts store getters.
 *
 * @public
 */
export interface LayoutsGetters {}

/**
 * Layouts store mutations.
 *
 * @public
 */
export interface LayoutsMutations {}

/**
 * Layouts store actions.
 *
 * @public
 */
export interface LayoutsActions {}

/**
 * Layouts type safe store module.
 *
 * @public
 */
export type LayoutsXStoreModule = XStoreModule<
  LayoutsState,
  LayoutsGetters,
  LayoutsMutations,
  LayoutsActions
>;
