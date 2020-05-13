import { HistoryQuery } from '@empathy/search-types';

/**
 * Dictionary of the events of HistoryQueries XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface HistoryQueriesXEvents {
  /**
   * The current history queries have been displayed to the user.
   * * Payload: The displayed history queries.
   */
  HistoryQueriesDisplayed: HistoryQuery[];
  /**
   * The query for searching inside the history-queries has changed.
   * * Payload: The history-queries query.
   */
  HistoryQueriesQueryChanged: string;
  /**
   * The key for saving the history queries in to the browser storage has changed.
   * * Payload: The new history-queries storage key.
   */
  HistoryQueriesStorageKeyChanged: string;
  /**
   * The queries made in the current session have changed
   * * Payload: The session history queries.
   */
  SessionHistoryQueriesChanged: HistoryQuery[];
  /**
   * The user pressed the button for clearing all the history queries.
   * * Payload: none.
   */
  UserPressedClearHistoryQueries: void;
  /**
   * The user pressed the button for removing a single
   * {@link @empathy/search-types#HistoryQuery | history query}.
   * * Payload: The `HistoryQuery` to remove.
   */
  UserPressedRemoveHistoryQuery: HistoryQuery;
  /**
   * The user has selected a history-query.
   * * Payload: The {@link @empathy/search-types#HistoryQuery | history query} selected.
   */
  UserSelectedAHistoryQuery: HistoryQuery;
}