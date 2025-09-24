Feature: Edge Cases & Error Handling
  As a player
  I want the game to handle edge cases and errors gracefully
  So that I can have a robust and reliable gaming experience

  Background:
    Given I am on the tic tac toe game page

  @rapid-clicking
  Scenario: Handle rapid clicking on same square
    When I rapidly click square 0 multiple times
    Then square 0 should contain "X"
    And the status should show "Next player: O"

  @rapid-clicking
  Scenario: Handle rapid clicking across different squares
    When I rapidly click squares 0, 1, 2, 0, 1, 2, 3, 4, 5
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"
    And square 3 should contain "O"
    And square 4 should contain "X"
    And square 5 should contain "O"

  @rapid-clicking
  Scenario: Handle rapid clicking during win sequence
    When I rapidly click squares during win sequence
    Then the status should show "Winner: X"
    And square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"
    And square 3 should contain "O"
    And square 4 should contain "X"
    And square 5 should contain "O"
    And square 6 should contain "X"

  @rapid-clicking
  Scenario: Handle rapid clicking after game ends
    When I play the horizontal top winning sequence
    And I rapidly click squares 5, 6, 7, 8 multiple times
    Then the status should show "Winner: X"
    And square 5 should be empty
    And square 6 should be empty
    And square 7 should be empty
    And square 8 should be empty

  @invalid-moves
  Scenario: Handle clicking occupied squares
    When I click square 0
    And I click square 1
    And I click square 2
    And I click square 0 again
    And I click square 1 again
    And I click square 2 again
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"

  @invalid-moves
  Scenario: Handle clicking occupied squares multiple times
    When I rapidly click square 0 multiple times
    Then square 0 should contain "X"
    And the status should show "Next player: O"

  @invalid-moves
  Scenario: Handle clicking occupied squares after game ends
    When I play the horizontal top winning sequence
    And I click square 0
    And I click square 1
    And I click square 2
    Then the status should show "Winner: X"
    And square 0 should contain "X"
    And square 1 should contain "X"
    And square 2 should contain "X"

  @boundary-conditions
  Scenario: Handle clicking squares in different orders
    When I play moves in reverse order
    Then the game should handle the moves correctly
    And the game state should remain consistent

  @boundary-conditions
  Scenario: Handle clicking squares in random order
    When I play moves in random order
    Then the game should handle the moves correctly
    And the game state should remain consistent

  @boundary-conditions
  Scenario: Handle clicking squares in mixed order
    When I play moves in mixed order
    Then the game should handle the moves correctly
    And the game state should remain consistent

  @boundary-conditions @expected-to-fail
  Scenario: Handle edge case win scenarios
    When I play the complete draw sequence
    Then the status should contain "Draw"
    When I reset the game
    And I play the horizontal top winning sequence
    Then the status should show "Winner: X"

  @boundary-conditions
  Scenario: Handle boundary square indices
    When I click square 0
    Then square 0 should contain "X"
    And the status should show "Next player: O"
    When I reset the game
    And I click square 8
    Then square 8 should contain "X"
    And the status should show "Next player: O"

  @error-recovery
  Scenario: Recover from rapid reset operations
    When I play some moves
    And I rapidly reset the game multiple times
    Then the status should show "Next player: X"
    And all squares should be empty

  @error-recovery
  Scenario: Handle mixed valid and invalid operations
    When I click square 0
    And I click square 0 again
    And I click square 1
    And I click square 1 again
    And I click square 2
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"
    And the status should show "Next player: O"

  @error-recovery
  Scenario: Maintain consistency after error scenarios
    When I click square 0
    And I click square 0 again
    And I click square 1
    And I click square 1 again
    And I click square 2
    And I reset the game
    And I click square 3
    Then square 3 should contain "X"
    And the status should show "Next player: O"

  @performance-edge-cases
  Scenario: Handle large number of rapid operations
    When I perform many rapid operations
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"
    And the game state should remain consistent

  @performance-edge-cases
  Scenario: Handle rapid reset and play cycles
    When I perform rapid reset and play cycles
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"
    And the game state should remain consistent

  @comprehensive-edge-testing
  Scenario: Test comprehensive edge case handling
    When I rapidly click square 0 multiple times
    Then square 0 should contain "X"
    When I click square 1
    And I click square 0 again
    Then square 0 should contain "X"
    And square 1 should contain "O"
    When I rapidly reset the game multiple times
    Then all squares should be empty
    And the status should show "Next player: X"

  @stress-testing
  Scenario: Stress test with multiple edge cases
    When I perform stress test operations
    Then the game should handle all operations correctly
    And the game state should remain consistent

  @boundary-testing
  Scenario: Test all boundary conditions
    When I test first square boundary
    Then square 0 should contain "X"
    When I reset the game
    And I test last square boundary
    Then square 8 should contain "X"
    When I reset the game
    And I test middle square boundary
    Then square 4 should contain "X"

  @error-handling
  Scenario: Test error handling robustness
    When I perform various error operations
    Then the game should handle errors gracefully
    And the game state should remain consistent
    And I should be able to continue playing

  @comprehensive-edge-validation
  Scenario: Validate all edge case scenarios
    When I test rapid clicking scenarios
    Then the game should handle rapid clicking correctly
    When I test invalid move scenarios
    Then the game should handle invalid moves correctly
    When I test boundary condition scenarios
    Then the game should handle boundary conditions correctly
    When I test error recovery scenarios
    Then the game should recover from errors correctly
