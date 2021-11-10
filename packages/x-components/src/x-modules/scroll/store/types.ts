import { XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils/types';

/**
 * Scroll store state.
 *
 * @public
 */
export interface ScrollState {
  position: Dictionary<number>;
  pendingScrollTo: string;
}

/**
 * Scroll store getters.
 *
 * @public
 */
export interface ScrollGetters {}

/**
 * Scroll store mutations.
 *
 * @public
 */
export interface ScrollMutations {
  setScrollPosition(scrollPosition: ScrollPosition): void;
  setPendingScrollTo(pendingScrollTo: string): void;
}

/**
 * Payload object containing the identifier of the scroll and its position.
 *
 * @public
 */
export interface ScrollPosition {
  /**
   * The amount of pixels scrolled.
   */
  position: number;
  /**
   * The identifier of the scroll element.
   */
  id: string;
}

/**
 * Scroll store actions.
 *
 * @public
 */
export interface ScrollActions {}

/**
 * Scroll type safe store module.
 *
 * @public
 */
export type ScrollXStoreModule = XStoreModule<
  ScrollState,
  ScrollGetters,
  ScrollMutations,
  ScrollActions
>;
