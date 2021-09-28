Feature: Partial results component

  Background:
    Given a related tags API with a known response
    Given a query suggestions API with a known response
    Given a next queries API with a known response
    Given a recommendations API with a known response

  Scenario Outline:  1. Shows no partial results if there are enough results
    Given no special config for partial-results view
    Given a results API
    And   start button is clicked
    When  "<query>" is searched
    Then  at least 4 related results are displayed
    And   no partial results are displayed

    Examples:
      | query  |
      | lego   |

  Scenario Outline: 2. Show partial results if there are not enough results
    Given no special config for partial-results view
    Given a partial results API with partials
    And   start button is clicked
    When  "<query>" is searched
    Then  less than 4 related results are displayed
    And   partial results are displayed

    Examples:
      | query             |
      | lego verde y azul |

  Scenario Outline: 3. Click on partial query button launches new search
    Given no special config for partial-results view
    Given a partial results API with partials
    And   start button is clicked
    When  "<query>" is searched
    Then  less than 4 related results are displayed
    And   partial results are displayed
    And   "<query>" contains the partial query
    Given a partial results API with partials
    And   first partial query button is clicked
    Then  at least 4 related results are displayed

    Examples:
      | query           |
      | verde azul lego |


