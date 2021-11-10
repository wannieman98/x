import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

const moduleName = 'scroll';

const wireCommit = namespacedWireCommit(moduleName);

const setScrollPositionWire = wireCommit('setScrollPosition', ({ metadata, eventPayload }) => ({
  position: eventPayload,
  id: metadata.id as string
}));

const setPendingScrollToWire = wireCommit(
  'setPendingScrollTo',
  ({ eventPayload: { scroll } }) => scroll
);

const clearPendingScrollToWire = wireCommit('setPendingScrollTo', '');

/**
 * Wiring configuration for the {@link ScrollXModule | scroll module}.
 *
 * @internal
 */
export const scrollWiring = createWiring({
  UserScrolled: {
    setScrollPositionWire
  },
  ParamsLoadedFromUrl: {
    setPendingScrollToWire
  },
  ScrollRestoreSucceeded: {
    clearPendingScrollToWire
  }
});
