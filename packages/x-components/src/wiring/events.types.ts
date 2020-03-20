import { NextQueriesRequest, SuggestionsRequest } from '@empathy/search-adapter';
import { NextQuery, Suggestion } from '@empathy/search-types';
import { CurrencyOptions } from '../i18n/currency.types';
import { DocumentDirection } from '../plugins/x-plugin.types';

/**
 * Dictionary of the events of EmpathyX, where each key is the event name, and the value is the
 * event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface XEventsTypes {
  /**
   * The {@link XConfig.consent} has changed
   * * Payload: The new consent.
   */
  ConfigConsentChanged: boolean;
  /**
   * The {@link XConfig.currencyOptions} has changed
   * * Payload: The new currency.
   */
  ConfigCurrencyChanged: CurrencyOptions;
  /**
   * The {@link XConfig.documentDirection} has changed
   * * Payload: The new document direction.
   */
  ConfigDocumentDirectionChanged: DocumentDirection;
  /**
   * The search-box query has changed
   * * Payload: The new search-box query.
   */
  SearchBoxQueryChanged: string;
  /**
   * Any property of the term-suggestions request has changed
   * * Payload: The new suggestions request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  TermSuggestionsRequestChanged: SuggestionsRequest | null;
  /**
   * Any property of the next-queries request has changed
   * * Payload: The new next-queries request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  NextQueriesRequestChanged: NextQueriesRequest | null;
  /**
   * Any property of the popular-searches request has changed
   * * Payload: The new popular-search request.
   */
  PopularSearchesRequestChanged: SuggestionsRequest;
  /**
   * The user removed the focus from the search-box.
   * * Payload: none.
   */
  UserBlurredSearchBox: void;
  /**
   * The user focused the search-box.
   * * Payload: none.
   */
  UserFocusedSearchBox: void;
  /**
   * The user is typing/pasting a query
   * * Payload: the partial query that the user is typing.
   */
  UserIsTypingAQuery: string;
  /**
   * The user pressed the search button
   * * Payload: The query to search.
   */
  UserPressedSearchButton: string;
  /**
   * The user triggered the button that clears the search-box
   * * Payload: none.
   */
  UserPressedClearSearchBoxButton: void;
  /**
   * The user pressed the enter key when the focus was on the search-box
   * * Payload: The new search-box query.
   */
  UserPressedEnterKey: string;
  /**
   * The user pressed an arrow key when the focus was on the search-box
   * * Payload: The pressed arrow key.
   */
  UserPressedArrowKey: string;
  /**
   * The user has selected a next-query
   * * Payload: The next query that has been selected by the user.
   */
  UserSelectedANextQuery: NextQuery;
  /**
   * The user has selected or confirmed a query
   * * Payload: the query that the user selected.
   */
  UserAcceptedAQuery: string;
  /**
   * User selected any kind of suggestion (term-suggestion, popular-search...)
   * * Payload: The suggestion that the user selected.
   */
  UserSelectedASuggestion: Suggestion;
  /**
   * User selected a term suggestion
   * * Payload: The suggestion that the user selected.
   */
  UserSelectedATermSuggestion: Suggestion;
  /**
   * User selected a popular suggestion
   * * Payload: The suggestion that the user selected.
   */
  UserSelectedAPopularSearch: Suggestion;
  /**
   * The user voiced a query
   * * Payload: The spoken query.
   */
  UserTalked: string;
}

/**
 * Name of all available events.
 *
 * @public
 */
export type XEvent = keyof XEventsTypes;

/**
 * Extracts the payload type of an event.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type
 * @public
 */
export type XEventPayload<Event extends XEvent> = XEventsTypes[Event] extends void
  ? undefined
  : XEventsTypes[Event];