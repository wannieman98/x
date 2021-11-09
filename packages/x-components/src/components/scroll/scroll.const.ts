import { XInjectKey } from '../decorators/injection.decorators';

export const FirstVisibleItemObserverKey: XInjectKey<IntersectionObserver | null> =
  'firstVisibleItemObserverKey';
export const PendingScrollTo: XInjectKey<string | null> = 'pendingScrollTo';
