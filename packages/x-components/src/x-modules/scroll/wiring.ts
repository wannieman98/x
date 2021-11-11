import { ScrollDirection } from '../../components/scroll/scroll.types';
import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { WirePayload } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

const moduleName = 'scroll';

const wireCommit = namespacedWireCommit(moduleName);

const setScrollPositionWire = wireCommit(
  'setScrollPosition',
  ({ metadata, eventPayload }: WirePayload<number>) => ({
    position: eventPayload,
    id: metadata.id as string
  })
);

const setScrollDirectionWire = wireCommit(
  'setScrollDirection',
  ({ metadata, eventPayload }: WirePayload<ScrollDirection>) => ({
    direction: eventPayload,
    id: metadata.id as string
  })
);

const setScrollReachedEndWire = wireCommit(
  'setScrollHasReachedEnd',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    value: eventPayload,
    id: metadata.id as string
  })
);

const setScrollHasReachedStartWire = wireCommit(
  'setScrollHasReachedStart',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    value: eventPayload,
    id: metadata.id as string
  })
);

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
  UserChangedScrollDirection: {
    setScrollDirectionWire
  },
  UserReachedScrollStart: {
    setScrollHasReachedStartWire
  },
  UserReachedScrollEnd: {
    setScrollReachedEndWire
  },
  ParamsLoadedFromUrl: {
    setPendingScrollToWire
  },
  ScrollRestoreSucceeded: {
    clearPendingScrollToWire
  }
});
