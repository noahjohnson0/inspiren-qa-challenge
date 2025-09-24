Feature: Core Gameplay
  As a player
  I want the game to have proper core gameplay mechanics
  So that I can have a smooth and intuitive gaming experience

  Background:
    Given I am on the tic tac toe game page

  @grid-display
  Scenario: Render 3x3 grid structure
    Then the game should have a proper 3x3 grid structure
    And all squares should be visible
    And the grid should be properly structured

  @grid-display
  Scenario: Start with empty squares
    Then all squares should be empty
    And the grid should be in initial state

  @grid-display
  Scenario: Have clickable squares
    Then all squares should be clickable
    And squares should respond to clicks

  @grid-display
  Scenario: Have visible game board container
    Then the game board container should be visible
    And the game board should be properly displayed

  @grid-display
  Scenario: Have exactly 9 squares
    Then the game should have exactly 9 squares
    And all squares should be accessible

  @grid-display
  Scenario: Have exactly 3 board rows
    Then the game should have exactly 3 board rows
    And each row should contain squares

  @grid-display
  Scenario: Have 3 squares per row
    Then each row should have exactly 3 squares
    And the grid layout should be consistent

  @grid-display
  Scenario: Have proper square positioning
    Then squares should be positioned correctly
    And squares should be accessible by index

  @grid-display
  Scenario: Maintain grid structure after interactions
    When I click square 0
    And I click square 1
    And I click square 2
    Then the game should have a proper 3x3 grid structure
    And the grid should remain intact

  @grid-display
  Scenario: Have consistent square styling
    Then all squares should have consistent styling
    And squares should have the correct CSS class

  @grid-display
  Scenario: Display squares in correct order
    Then squares should be displayed in correct order
    And squares should be accessible sequentially

  @grid-display
  Scenario: Have responsive grid layout
    Then the grid should be responsive at different viewport sizes
    And the grid structure should remain consistent

  @grid-display
  Scenario: Maintain grid integrity during rapid clicks
    When I rapidly click all squares
    Then the game should have a proper 3x3 grid structure
    And the grid should remain intact

  @grid-display @expected-to-fail
  Scenario: Have proper accessibility attributes
    Then squares should have proper accessibility attributes
    And squares should be buttons for accessibility

  @mark-placement
  Scenario: Place X in square 0
    When I click square 0
    Then square 0 should contain "X"

  @mark-placement
  Scenario: Place O in square 1
    When I click square 0
    And I click square 1
    Then square 1 should contain "O"

  @mark-placement
  Scenario: Place X in square 2
    When I click square 0
    And I click square 1
    And I click square 2
    Then square 2 should contain "X"

  @mark-placement
  Scenario: Place marks in all squares
    When I play the complete draw sequence
    Then all squares should contain marks
    And the board should be completely filled

  @mark-placement
  Scenario: Place marks in different patterns
    When I place marks in top row pattern
    Then the top row should contain marks
    When I reset the game
    And I place marks in middle row pattern
    Then the middle row should contain marks
    When I reset the game
    And I place marks in bottom row pattern
    Then the bottom row should contain marks

  @mark-placement
  Scenario: Place marks in random order
    When I place marks in random order
    Then the marks should be placed correctly
    And the game state should remain consistent

  @occupied-square-validation
  Scenario: Not allow placing mark in occupied square
    When I click square 0
    Then square 0 should contain "X"
    When I click square 0 again
    Then square 0 should contain "X"

  @occupied-square-validation
  Scenario: Not allow overwriting existing marks
    When I click square 0
    And I click square 1
    And I click square 2
    And I click square 0 again
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"

  @occupied-square-validation
  Scenario: Prevent multiple marks in same square
    When I click square 0
    And I click square 1
    And I click square 2
    And I rapidly click occupied squares multiple times
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"

  @occupied-square-validation
  Scenario: Maintain mark integrity after rapid clicking
    When I click square 0
    And I click square 1
    And I click square 2
    And I rapidly click occupied squares
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"

  @occupied-square-validation
  Scenario: Handle clicking occupied squares in different orders
    When I click square 0
    And I click square 1
    And I click square 2
    And I click occupied squares in different orders
    Then square 0 should contain "X"
    And square 1 should contain "O"
    And square 2 should contain "X"

  @turn-validation
  Scenario: Alternate between X and O
    When I click square 0
    Then the status should show "Next player: O"
    When I click square 1
    Then the status should show "Next player: X"
    When I click square 2
    Then the status should show "Next player: O"

  @turn-validation
  Scenario: Maintain turn order throughout game
    When I play moves maintaining turn order
    Then the turn order should be maintained correctly
    And marks should be placed in correct sequence

  @turn-validation
  Scenario: Not allow moves after game ends
    When I play the horizontal top winning sequence
    And I click square 5
    Then square 5 should be empty
    And the status should show "Winner: X"

  @turn-validation
  Scenario: Prevent moves after draw
    When I play the complete draw sequence
    And I click square 0
    Then square 0 should contain "X"
    And the status should not contain "Winner:"

  @player-turns
  Scenario: Start with X player
    Then the status should show "Next player: X"
    And X should be the first player

  @player-turns
  Scenario: Switch to O after X plays
    When I click square 0
    Then the status should show "Next player: O"
    And O should be the next player

  @player-turns
  Scenario: Switch to X after O plays
    When I click square 0
    And I click square 1
    Then the status should show "Next player: X"
    And X should be the next player

  @player-turns
  Scenario: Maintain alternating pattern
    When I play 5 moves
    Then the turn alternation should be correct
    And the pattern should be maintained

  @comprehensive-core-gameplay
  Scenario: Test complete core gameplay flow
    Then the game should have a proper 3x3 grid structure
    And all squares should be empty
    And the status should show "Next player: X"
    When I click square 0
    Then square 0 should contain "X"
    And the status should show "Next player: O"
    When I click square 1
    Then square 1 should contain "O"
    And the status should show "Next player: X"
    When I click square 0 again
    Then square 0 should contain "X"
    And the status should show "Next player: X"

  @comprehensive-core-gameplay
  Scenario: Test grid integrity throughout gameplay
    Then the game should have a proper 3x3 grid structure
    When I play several moves
    Then the game should have a proper 3x3 grid structure
    When I rapidly click squares
    Then the game should have a proper 3x3 grid structure
    When I reset the game
    Then the game should have a proper 3x3 grid structure

  @comprehensive-core-gameplay
  Scenario: Test mark placement validation
    When I click square 0
    Then square 0 should contain "X"
    When I click square 0 again
    Then square 0 should contain "X"
    When I click square 1
    Then square 1 should contain "O"
    When I click square 1 again
    Then square 1 should contain "O"

  @comprehensive-core-gameplay
  Scenario: Test turn management
    Then the status should show "Next player: X"
    When I click square 0
    Then the status should show "Next player: O"
    When I click square 1
    Then the status should show "Next player: X"
    When I click square 2
    Then the status should show "Next player: O"
