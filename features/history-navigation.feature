Feature: History & Navigation
  As a player
  I want to navigate through game history
  So that I can review past moves and continue from any point

  Background:
    Given I am on the tic tac toe game page

  @turn-history
  Scenario: Display history of turns
    When I play some moves
    Then I should see the history of turns displayed

  @turn-history
  Scenario: Show correct number of history entries
    When I play 5 moves
    Then I should see 6 history entries

  @back-navigation
  Scenario: Allow going back to previous turns
    When I play some moves
    And I go back to move 1
    Then I should see the game state restored correctly
    And square 0 should contain "X"
    And squares 1 and 2 should be empty

  @back-navigation
  Scenario: Allow going back to game start
    When I play some moves
    And I go back to game start
    Then I should see all squares are empty

  @state-restoration
  Scenario: Properly restore game state when going back
    When I play several moves
    And I go back to move 2
    Then I should see the correct game state restored
    And the next player should be "X"

  @state-restoration
  Scenario: Allow continuing from restored state
    When I play some moves
    And I go back to move 1
    And I continue playing from restored state
    Then I should see the new move was made

  @history-management
  Scenario: Maintain history after game reset
    When I play some moves
    And I reset the game
    Then I should see only the initial state in history

  @history-management
  Scenario: Handle history navigation edge cases
    When I play some moves
    And I navigate through different moves
    Then I should see the final state is correct
