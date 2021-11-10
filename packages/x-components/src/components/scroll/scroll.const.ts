import { XInjectKey } from '../decorators/injection.decorators';
import { ScrollVisibilityObserver } from './scroll.types';

export const FirstVisibleItemObserverKey: XInjectKey<ScrollVisibilityObserver | null> =
  'firstVisibleItemObserverKey';
export const PendingScrollTo: XInjectKey<string | null> = 'pendingScrollTo';
