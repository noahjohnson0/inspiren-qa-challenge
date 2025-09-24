Feature: Game Outcomes
  As a player
  I want the game to correctly detect wins, draws, and display appropriate messages
  So that I can have a clear understanding of the game's final state

  Background:
    Given I am on the tic tac toe game page

  @win-detection
  Scenario Outline: Detect horizontal wins
    When I play the <win_type> winning sequence
    Then the status should show "Winner: <winner>"
    And the winning squares should contain "<winner>"

    Examples:
      | win_type | winner |
      | horizontal top X    | X |
      | horizontal top O    | O |
      | horizontal middle X | X |
      | horizontal middle O | O |
      | horizontal bottom X | X |
      | horizontal bottom O | O |

  @win-detection
  Scenario Outline: Detect vertical wins
    When I play the <win_type> winning sequence
    Then the status should show "Winner: <winner>"
    And the winning squares should contain "<winner>"

    Examples:
      | win_type | winner |
      | vertical left X    | X |
      | vertical left O    | O |
      | vertical middle X  | X |
      | vertical middle O  | O |
      | vertical right X   | X |
      | vertical right O   | O |

  @win-detection
  Scenario Outline: Detect diagonal wins
    When I play the <win_type> winning sequence
    Then the status should show "Winner: <winner>"
    And the winning squares should contain "<winner>"

    Examples:
      | win_type | winner |
      | diagonal main X    | X |
      | diagonal main O    | O |
      | diagonal anti X    | X |
      | diagonal anti O    | O |

  @win-detection-edge-cases
  Scenario: Detect win immediately when third mark is placed
    When I click square 0
    And I click square 3
    And I click square 1
    Then the status should not contain "Winner:"
    When I click square 4
    And I click square 2
    Then the status should show "Winner: X"

  @win-detection-edge-cases
  Scenario: Prevent moves after game is won
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    When I click square 5
    Then square 5 should be empty
    And the status should show "Winner: X"

  @draw-detection
  Scenario: Handle draw scenario
    When I play the complete draw sequence
    Then the status should not contain "Winner:"
    And all squares should contain marks

  @draw-detection
  Scenario: Prevent moves after draw is reached
    When I play the complete draw sequence
    And I click square 0
    Then square 0 should contain "X"
    And the status should not contain "Winner:"

  @winner-display
  Scenario: Display winner message when X wins
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    And the status should contain "Winner:"
    And the status should contain "X"

  @winner-display
  Scenario: Display winner message when O wins
    When I click square 0
    And I click square 1
    And I click square 2
    And I click square 4
    And I click square 6
    And I click square 7
    Then the status should show "Winner: O"
    And the status should contain "Winner:"
    And the status should contain "O"

  @winner-display
  Scenario: Display winner message immediately when game ends
    Then the status should not contain "Winner:"
    And the status should contain "Next player:"
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    And the status should contain "Winner:"

  @winner-display
  Scenario: Maintain winner message after game ends
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    When I click square 5
    Then the status should show "Winner: X"
    And the status should contain "Winner:"

  @winner-display
  Scenario: Show correct winner for different win patterns
    When I play the horizontal top winning sequence
    Then the status should contain "Winner: X"
    When I reset the game
    And I play the vertical left winning sequence
    Then the status should contain "Winner: X"
    When I reset the game
    And I play the diagonal main winning sequence
    Then the status should contain "Winner: X"

  @draw-display @expected-to-fail
  Scenario: Display draw message when game ends in draw
    When I play the complete draw sequence
    Then the status should contain "Draw"

  @draw-display @expected-to-fail
  Scenario: Display draw message for different draw scenarios
    When I reset the game
    And I play the complete draw sequence
    Then the status should contain "Draw"

  @draw-display @expected-to-fail
  Scenario: Maintain draw message after game ends
    When I play the complete draw sequence
    Then the status should contain "Draw"
    When I click square 0
    Then the status should contain "Draw"

  @comprehensive-outcomes
  Scenario: Test complete game flow with outcome verification
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    And square 0 should contain "X"
    And square 1 should contain "X"
    And square 2 should contain "X"
    When I reset the game
    Then the status should show "Next player: X"
    And all squares should be empty
    When I play the complete draw sequence
    Then the status should not contain "Winner:"
    And all squares should contain marks

  @edge-case-outcomes
  Scenario: Handle rapid clicking during win sequence
    When I rapidly click squares during win sequence
    Then the status should show "Winner: X"

  @edge-case-outcomes
  Scenario: Handle clicking occupied squares after game ends
    When I play the horizontal top winning sequence
    And I click square 0
    Then square 0 should contain "X"
    And the status should show "Winner: X"

  @edge-case-outcomes
  Scenario: Handle rapid reset after game outcomes
    When I play the horizontal top winning sequence
    And I rapidly reset the game multiple times
    Then the status should show "Next player: X"
    And all squares should be empty

  @boundary-outcomes
  Scenario: Test first and last squares in winning patterns
    When I click square 0
    And I click square 3
    And I click square 1
    And I click square 4
    And I click square 2
    Then the status should show "Winner: X"
    And square 0 should contain "X"
    And square 1 should contain "X"
    And square 2 should contain "X"
    When I reset the game
    And I click square 6
    And I click square 0
    And I click square 7
    And I click square 1
    And I click square 8
    Then the status should show "Winner: X"
    And square 6 should contain "X"
    And square 7 should contain "X"
    And square 8 should contain "X"

  @boundary-outcomes
  Scenario: Test middle square in winning patterns
    When I click square 0
    And I click square 1
    And I click square 4
    And I click square 2
    And I click square 8
    Then the status should show "Winner: X"
    And square 0 should contain "X"
    And square 4 should contain "X"
    And square 8 should contain "X"

  @comprehensive-outcome-testing
  Scenario: Test multiple win patterns in sequence
    When I play the horizontal top winning sequence
    Then the status should show "Winner: X"
    When I reset the game
    And I play the vertical left winning sequence
    Then the status should show "Winner: X"
    When I reset the game
    And I play the diagonal main winning sequence
    Then the status should show "Winner: X"
    When I reset the game
    And I play the complete draw sequence
    Then the status should not contain "Winner:"
