
// Standardized test data for tic-tac-toe game tests

export interface GameSequence {
    name: string;
    moves: number[];
    expectedFinalStatus: string;
    description: string;
}

export interface GameState {
    name: string;
    moves: number[];
    expectedStatus: string;
    description: string;
}

// Winning sequences for X player
export const X_WINNING_SEQUENCES: GameSequence[] = [
    {
        name: 'horizontal_top',
        moves: [0, 3, 1, 4, 2], // X wins top row
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with horizontal top row'
    },
    {
        name: 'horizontal_middle',
        moves: [3, 0, 4, 1, 5], // X wins middle row
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with horizontal middle row'
    },
    {
        name: 'horizontal_bottom',
        moves: [6, 0, 7, 1, 8], // X wins bottom row
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with horizontal bottom row'
    },
    {
        name: 'vertical_left',
        moves: [0, 1, 3, 2, 6], // X wins left column
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with vertical left column'
    },
    {
        name: 'vertical_middle',
        moves: [1, 0, 4, 2, 7], // X wins middle column
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with vertical middle column'
    },
    {
        name: 'vertical_right',
        moves: [2, 0, 5, 1, 8], // X wins right column
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with vertical right column'
    },
    {
        name: 'diagonal_main',
        moves: [0, 1, 4, 2, 8], // X wins main diagonal
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with main diagonal'
    },
    {
        name: 'diagonal_anti',
        moves: [2, 0, 4, 1, 6], // X wins anti-diagonal
        expectedFinalStatus: 'Winner: X',
        description: 'X wins with anti-diagonal'
    }
];

// Winning sequences for O player
export const O_WINNING_SEQUENCES: GameSequence[] = [
    {
        name: 'horizontal_top',
        moves: [3, 0, 4, 1, 6, 2], // O wins top row
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with horizontal top row'
    },
    {
        name: 'horizontal_middle',
        moves: [0, 3, 6, 4, 7, 5], // O wins middle row
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with horizontal middle row'
    },
    {
        name: 'horizontal_bottom',
        moves: [0, 6, 1, 7, 3, 8], // O wins bottom row
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with horizontal bottom row'
    },
    {
        name: 'vertical_left',
        moves: [1, 0, 2, 3, 5, 6], // O wins left column
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with vertical left column'
    },
    {
        name: 'vertical_middle',
        moves: [0, 1, 2, 4, 5, 7], // O wins middle column
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with vertical middle column'
    },
    {
        name: 'vertical_right',
        moves: [0, 2, 1, 5, 3, 8], // O wins right column
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with vertical right column'
    },
    {
        name: 'diagonal_main',
        moves: [1, 0, 2, 4, 3, 8], // O wins main diagonal
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with main diagonal'
    },
    {
        name: 'diagonal_anti',
        moves: [0, 2, 1, 4, 3, 6], // O wins anti-diagonal
        expectedFinalStatus: 'Winner: O',
        description: 'O wins with anti-diagonal'
    }
];

// Draw sequence (no winner)
export const DRAW_SEQUENCE: GameSequence = {
    name: 'draw',
    moves: [0, 1, 2, 4, 3, 5, 7, 6, 8], // Complete board with no winner
    expectedFinalStatus: 'Draw', // Game ends in draw
    description: 'Game ends in draw'
};

// Partial game sequences for testing intermediate states
export const PARTIAL_GAME_SEQUENCES: GameState[] = [
    {
        name: 'initial',
        moves: [],
        expectedStatus: 'Next player: X',
        description: 'Initial game state'
    },
    {
        name: 'after_first_move',
        moves: [0],
        expectedStatus: 'Next player: O',
        description: 'After X plays first move'
    },
    {
        name: 'after_second_move',
        moves: [0, 1],
        expectedStatus: 'Next player: X',
        description: 'After O plays second move'
    },
    {
        name: 'after_third_move',
        moves: [0, 1, 2],
        expectedStatus: 'Next player: O',
        description: 'After X plays third move'
    },
    {
        name: 'after_fourth_move',
        moves: [0, 1, 2, 3],
        expectedStatus: 'Next player: X',
        description: 'After O plays fourth move'
    },
    {
        name: 'mid_game',
        moves: [0, 1, 2, 3, 4],
        expectedStatus: 'Next player: O',
        description: 'Mid-game state'
    }
];

// Quick win sequences (minimum moves to win)
export const QUICK_WIN_SEQUENCES: GameSequence[] = [
    {
        name: 'quick_horizontal',
        moves: [0, 3, 1, 4, 2], // X wins in 5 moves
        expectedFinalStatus: 'Winner: X',
        description: 'Quick horizontal win for X'
    },
    {
        name: 'quick_vertical',
        moves: [0, 1, 3, 2, 6], // X wins in 5 moves
        expectedFinalStatus: 'Winner: X',
        description: 'Quick vertical win for X'
    },
    {
        name: 'quick_diagonal',
        moves: [0, 1, 4, 2, 8], // X wins in 5 moves
        expectedFinalStatus: 'Winner: X',
        description: 'Quick diagonal win for X'
    }
];

// Edge case sequences
export const EDGE_CASE_SEQUENCES: GameSequence[] = [
    {
        name: 'rapid_clicking_same_square',
        moves: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Rapid clicking same square
        expectedFinalStatus: 'Next player: O',
        description: 'Rapid clicking on same square should only place one mark'
    },
    {
        name: 'rapid_clicking_different_squares',
        moves: [0, 1, 2, 0, 1, 2, 3, 4, 5], // Rapid clicking different squares
        expectedFinalStatus: 'Next player: O',
        description: 'Rapid clicking across different squares'
    },
    {
        name: 'rapid_clicking_win_sequence',
        moves: [0, 1, 2, 3, 4, 5, 6], // Rapid clicking during win sequence
        expectedFinalStatus: 'Winner: X',
        description: 'Rapid clicking during win sequence'
    },
    {
        name: 'rapid_clicking_after_game_ends',
        moves: [0, 3, 1, 4, 2], // Win first, then rapid clicking
        expectedFinalStatus: 'Winner: X',
        description: 'Rapid clicking after game ends should not affect board'
    },
    {
        name: 'clicking_occupied_squares',
        moves: [0, 1, 2, 0, 1, 2], // Try to click occupied squares
        expectedFinalStatus: 'Next player: O',
        description: 'Clicking occupied squares should not change board'
    },
    {
        name: 'clicking_occupied_multiple_times',
        moves: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Multiple clicks on same occupied square
        expectedFinalStatus: 'Next player: O',
        description: 'Multiple clicks on occupied square should not change board'
    },
    {
        name: 'clicking_occupied_after_game_ends',
        moves: [0, 3, 1, 4, 2, 0, 1, 2], // Win then try to click occupied squares
        expectedFinalStatus: 'Winner: X',
        description: 'Clicking occupied squares after game ends should not change board'
    },
    {
        name: 'reverse_order_sequence',
        moves: [8, 7, 6, 5, 4, 3, 2, 1, 0], // Reverse order
        expectedFinalStatus: 'Draw',
        description: 'Playing moves in reverse order'
    },
    {
        name: 'random_order_sequence',
        moves: [4, 0, 8, 2, 6, 1, 3, 7, 5], // Random order
        expectedFinalStatus: 'Draw',
        description: 'Playing moves in random order'
    },
    {
        name: 'mixed_order_sequence',
        moves: [0, 4, 8, 1, 3, 5, 2, 6, 7], // Mixed order
        expectedFinalStatus: 'Draw',
        description: 'Playing moves in mixed order'
    },
    {
        name: 'boundary_squares_first',
        moves: [0], // First square
        expectedFinalStatus: 'Next player: O',
        description: 'Clicking first boundary square'
    },
    {
        name: 'boundary_squares_last',
        moves: [8], // Last square
        expectedFinalStatus: 'Next player: O',
        description: 'Clicking last boundary square'
    },
    {
        name: 'rapid_reset_operations',
        moves: [0, 1, 2], // Play some moves then rapid reset
        expectedFinalStatus: 'Next player: X',
        description: 'Rapid reset operations should clear board'
    },
    {
        name: 'mixed_valid_invalid_operations',
        moves: [0, 0, 1, 1, 2], // Mix valid and invalid operations
        expectedFinalStatus: 'Next player: O',
        description: 'Mixed valid and invalid operations'
    },
    {
        name: 'error_recovery_sequence',
        moves: [0, 0, 1, 1, 2], // Error scenarios then recovery
        expectedFinalStatus: 'Next player: O',
        description: 'Error recovery sequence'
    },
    {
        name: 'large_number_rapid_operations',
        moves: [0, 1, 2], // Large number of rapid operations
        expectedFinalStatus: 'Next player: O',
        description: 'Large number of rapid operations'
    },
    {
        name: 'rapid_reset_play_cycles',
        moves: [0, 1, 2], // Rapid reset and play cycles
        expectedFinalStatus: 'Next player: O',
        description: 'Rapid reset and play cycles'
    }
];
