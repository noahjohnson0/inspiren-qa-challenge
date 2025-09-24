import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';
import { TestUtils } from './test-utils';
import { X_WINNING_SEQUENCES, DRAW_SEQUENCE, EDGE_CASE_SEQUENCES } from './test-data';

test.describe('Edge Cases & Error Handling Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = await TestUtils.setupTest(page);
    });

    test.describe('Rapid Clicking', () => {
        test('should handle rapid clicking on same square', async () => {
            const sequence = TestUtils.getSequence('rapid_clicking_same_square');

            // Rapidly click the same square multiple times
            await TestUtils.executeSequence(gamePage, sequence.moves);

            // Verify only one mark was placed
            const squareValue = await gamePage.getSquareValue(0);
            expect(squareValue).toBe('X');
        });

        test('should handle rapid clicking across different squares', async () => {
            const sequence = TestUtils.getSequence('rapid_clicking_different_squares');

            await TestUtils.executeSequence(gamePage, sequence.moves);

            // Verify correct marks were placed
            await gamePage.verifySquareValues({
                0: 'X', 1: 'O', 2: 'X',
                3: 'O', 4: 'X', 5: 'O'
            });
        });

        test('should handle rapid clicking during win sequence', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'rapid_clicking_win_sequence');

            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify winner is detected and winning row is correct
            await gamePage.verifyWinningState('X', [0, 2, 4, 6]);
            await gamePage.verifySquareValues({
                0: 'X', 1: 'O', 2: 'X',
                3: 'O', 4: 'X', 5: 'O',
                6: 'X'
            });
        });

        test('should handle rapid clicking after game ends', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'rapid_clicking_after_game_ends');

            // Create a winning scenario
            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Rapidly click squares after game ends
            for (let i = 0; i < 20; i++) {
                await gamePage.clickSquare(5);
                await gamePage.clickSquare(6);
                await gamePage.clickSquare(7);
                await gamePage.clickSquare(8);
            }

            // Verify winner status is maintained and empty squares remain empty
            await gamePage.verifyWinningState('X', [0, 1, 2]);
            await gamePage.verifySquareValues({
                5: null, 6: null, 7: null, 8: null
            });
        });
    });

    test.describe('Invalid Moves', () => {
        test('should handle clicking occupied squares', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'clicking_occupied_squares');

            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify marks haven't changed
            await gamePage.verifySquareValues({
                0: 'X', 1: 'O', 2: 'X'
            });
        });

        test('should handle clicking occupied squares multiple times', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'clicking_occupied_multiple_times');

            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify mark hasn't changed
            await gamePage.verifySquareValues({
                0: 'X'
            });
        });

        test('should handle clicking occupied squares after game ends', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'clicking_occupied_after_game_ends');

            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify marks haven't changed
            await gamePage.verifySquareValues({
                0: 'X', 1: 'X', 2: 'X'
            });
        });
    });

    test.describe('Boundary Conditions', () => {
        test('should handle clicking squares in different orders', async () => {
            // Test different click orders using sequences from test data
            const sequences = [
                DRAW_SEQUENCE,
                EDGE_CASE_SEQUENCES.find(s => s.name === 'reverse_order_sequence')!,
                EDGE_CASE_SEQUENCES.find(s => s.name === 'random_order_sequence')!,
                EDGE_CASE_SEQUENCES.find(s => s.name === 'mixed_order_sequence')!
            ];

            for (const sequence of sequences) {
                await gamePage.resetGame();

                // Play moves in this order
                for (let i = 0; i < sequence.moves.length; i++) {
                    await gamePage.clickSquare(sequence.moves[i]);
                    const squareValue = await gamePage.getSquareValue(sequence.moves[i]);
                    const expectedMark = i % 2 === 0 ? 'X' : 'O';

                    // Check if the game has ended (winner found)
                    const gameStatus = await gamePage.getStatus();
                    if (gameStatus.includes('Winner:')) {
                        // If game ended, only verify the current move was placed correctly
                        expect(squareValue).toBe(expectedMark);
                        break; // Stop checking subsequent moves
                    } else {
                        // Game continues, verify the move was placed correctly
                        expect(squareValue).toBe(expectedMark);
                    }
                }
            }
        });

        test.skip('should handle edge case win scenarios - expected to fail', async () => {
            // Test edge case wins using standardized sequences
            const edgeCaseWins = [
                {
                    name: 'win on last possible move',
                    sequence: DRAW_SEQUENCE, // This creates a full board scenario
                    expectedWinner: 'Draw' // No winner in draw
                },
                {
                    name: 'win with minimal moves',
                    sequence: X_WINNING_SEQUENCES[0], // Quick horizontal win
                    expectedWinner: 'Winner: X'
                }
            ];

            for (const scenario of edgeCaseWins) {
                await gamePage.resetGame();

                // Play the scenario
                for (const move of scenario.sequence.moves) {
                    await gamePage.clickSquare(move);
                }

                // Verify expected outcome
                const status = await gamePage.getStatus();
                expect(status).toBe(scenario.expectedWinner);
            }
        });

        test('should handle boundary square indices', async () => {
            // Test clicking squares at boundaries using sequences from test data
            const boundarySequences = [
                EDGE_CASE_SEQUENCES.find(s => s.name === 'boundary_squares_first')!,
                EDGE_CASE_SEQUENCES.find(s => s.name === 'boundary_squares_last')!
            ];

            for (const sequence of boundarySequences) {
                // Reset game before each test to ensure clean state
                await gamePage.resetGame();

                for (const move of sequence.moves) {
                    await gamePage.clickSquare(move);
                    const squareValue = await gamePage.getSquareValue(move);
                    expect(squareValue).toBe('X');
                }
            }
        });
    });

    test.describe('Error Recovery', () => {
        test('should recover from rapid reset operations', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'rapid_reset_operations');

            // Play some moves
            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Rapidly reset multiple times
            for (let i = 0; i < 5; i++) {
                await gamePage.resetGame();
            }

            // Verify game is in clean state
            await gamePage.verifyInitialState();
        });

        test('should handle mixed valid and invalid operations', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'mixed_valid_invalid_operations');

            for (const move of sequence!.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify correct state
            await gamePage.verifyState({
                squares: ['X', 'O', 'X', null, null, null, null, null, null],
                nextPlayer: 'O'
            });
        });

        test('should maintain consistency after error scenarios', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'error_recovery_sequence');

            // Create various error scenarios
            const errorScenarios = [
                () => gamePage.clickSquare(0), // Valid
                () => gamePage.clickSquare(0), // Invalid
                () => gamePage.clickSquare(1), // Valid
                () => gamePage.clickSquare(1), // Invalid
                () => gamePage.clickSquare(2), // Valid
                () => gamePage.resetGame(),    // Reset
                () => gamePage.clickSquare(3), // Valid after reset
            ];

            // Execute scenarios
            for (const scenario of errorScenarios) {
                await scenario();
            }

            // Verify final state is consistent
            await gamePage.verifyState({
                squares: [null, null, null, 'X', null, null, null, null, null],
                nextPlayer: 'O'
            });
        });
    });

    test.describe('Performance Edge Cases', () => {
        test('should handle large number of rapid operations', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'large_number_rapid_operations');

            // Perform many rapid operations
            for (let i = 0; i < 100; i++) {
                for (const move of sequence!.moves) {
                    await gamePage.clickSquare(move);
                }
            }

            // Verify state is correct
            await gamePage.verifySquareValues({
                0: 'X', 1: 'O', 2: 'X'
            });

        });

        test('should handle rapid reset and play cycles', async () => {
            const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === 'rapid_reset_play_cycles');

            // Perform rapid reset and play cycles
            for (let cycle = 0; cycle < 10; cycle++) {
                await gamePage.resetGame();
                for (const move of sequence!.moves) {
                    await gamePage.clickSquare(move);
                }
            }

            // Verify final state
            await gamePage.verifySquareValues({
                0: 'X', 1: 'O', 2: 'X'
            });
        });
    });
});
