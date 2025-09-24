Feature: Game State Management
  As a player
  I want the game to maintain proper state throughout gameplay
  So that I can have a consistent and reliable gaming experience

  Background:
    Given I am on the tic tac toe game page

  @current-player-display
  Scenario: Show X as next player initially
    Then the status should show "Next player: X"

  @current-player-display
  Scenario: Show O as next player after X plays
    When I click square 0
    Then the status should show "Next player: O"

  @current-player-display
  Scenario: Show X as next player after O plays
    When I click square 0
    And I click square 1
    Then the status should show "Next player: X"

  @current-player-display
  Scenario: Maintain correct player display throughout game
    When I play 5 moves in sequence
    Then the status should show "Next player: O"

  @status-messages
  Scenario: Show initial status message
    Then the status should show "Next player: X"
    And the status should contain "Next player:"
    And the status should contain "X"

  @status-messages
  Scenario: Update status message after each move
    Then the status should show "Next player: X"
    When I click square 0
    Then the status should show "Next player: O"
    When I click square 1
    Then the status should show "Next player: X"

  @status-messages
  Scenario: Show winner status when game is won
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    And the status should contain "Winner:"

  @status-messages
  Scenario: Maintain status message consistency during winning sequence
    When I play the quick horizontal winning sequence
    Then the status should show "Winner: X"
    And the status should contain "Winner:"

  @game-restart
  Scenario: Reset game to initial state
    When I play some moves
    And I reset the game
    Then the status should show "Next player: X"
    And all squares should be empty

  @game-restart
  Scenario: Reset game after win
    When I play the horizontal top winning sequence
    And I reset the game
    Then the status should show "Next player: X"
    And all squares should be empty

  @game-restart
  Scenario: Reset game after draw
    When I play the complete draw sequence
    And I reset the game
    Then the status should show "Next player: X"
    And all squares should be empty

  @game-restart
  Scenario: Allow restart at any time
    When I play some moves
    And I reset the game
    Then the status should show "Next player: X"
    And all squares should be empty

  @state-persistence
  Scenario: Maintain game state during play
    When I play several moves
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"
    And the status should show "Next player: X"

  @state-persistence
  Scenario: Maintain state after rapid interactions
    When I play the complete draw sequence
    Then the board should contain the expected draw pattern
    And the status should show "Next player: O"

  @state-persistence
  Scenario: Maintain state consistency across different scenarios
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    When I reset the game
    And I play the vertical left winning sequence
    Then the status should show "Winner: X"
    When I reset the game
    And I play the diagonal main winning sequence
    Then the status should show "Winner: X"

  @edge-cases
  Scenario: Handle rapid clicking on same square
    When I rapidly click square 0 multiple times
    Then square 0 should contain "X"
    And the status should show "Next player: O"

  @edge-cases
  Scenario: Handle clicking occupied squares
    When I click square 0
    And I click square 0 again
    Then square 0 should contain "X"
    And the status should show "Next player: O"

  @edge-cases
  Scenario: Handle clicking after game ends
    When I play the horizontal top winning sequence
    And I click square 5
    Then the status should show "Winner: X"
    And square 5 should be empty

  @edge-cases
  Scenario: Handle rapid reset operations
    When I play some moves
    And I rapidly reset the game multiple times
    Then the status should show "Next player: X"
    And all squares should be empty

  @boundary-testing
  Scenario: Test first and last squares
    When I click square 0
    Then square 0 should contain "X"
    And the status should show "Next player: O"
    When I reset the game
    And I click square 8
    Then square 8 should contain "X"
    And the status should show "Next player: O"

  @boundary-testing
  Scenario: Test middle square
    When I click square 4
    Then square 4 should contain "X"
    And the status should show "Next player: O"

  @comprehensive-state-testing
  Scenario: Test complete game flow with state verification
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    And square 0 should contain "X"
    And square 1 should contain "X"
    And square 2 should contain "X"
    When I reset the game
    Then the status should show "Next player: X"
    And all squares should be empty
    When I play the complete draw sequence
    Then the status should show "Next player: O"
    And all squares should contain marks
