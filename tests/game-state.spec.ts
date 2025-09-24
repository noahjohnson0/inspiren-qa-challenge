import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';
import {
    PARTIAL_GAME_SEQUENCES,
    X_WINNING_SEQUENCES,
    O_WINNING_SEQUENCES,
    DRAW_SEQUENCE,
    QUICK_WIN_SEQUENCES,
} from './test-data';

test.describe('Game State Management Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = new GamePage(page);
        await gamePage.goto();
        await gamePage.applyTestStyling();
    });

    test.describe('Current Player Display', () => {
        test('should show X as next player initially', async () => {
            const status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');
        });

        test('should show O as next player after X plays', async () => {
            await gamePage.clickSquare(0);
            const status = await gamePage.getStatus();
            expect(status).toBe('Next player: O');
        });

        test('should show X as next player after O plays', async () => {
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            const status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');
        });

        test('should maintain correct player display throughout game', async () => {
            const expectedStatuses = [
                'Next player: O',  // After X plays
                'Next player: X', // After O plays
                'Next player: O', // After X plays
                'Next player: X', // After O plays
                'Next player: O'  // After X plays
            ];

            for (let i = 0; i < 5; i++) {
                await gamePage.clickSquare(i);
                const status = await gamePage.getStatus();
                expect(status).toBe(expectedStatuses[i]);
            }
        });
    });

    test.describe('Status Messages', () => {
        test('should show initial status message', async () => {
            const status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');
            expect(status).toContain('Next player:');
            expect(status).toContain('X');
        });

        test('should update status message after each move', async () => {
            // Initial status
            let status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');

            // After first move
            await gamePage.clickSquare(0);
            status = await gamePage.getStatus();
            expect(status).toBe('Next player: O');

            // After second move
            await gamePage.clickSquare(1);
            status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');
        });

        test('should show winner status when game is won', async () => {
            // Use standardized winning sequence
            const winningSequence = X_WINNING_SEQUENCES[0]; // horizontal top win

            // Play the winning sequence
            for (const move of winningSequence.moves) {
                await gamePage.clickSquare(move);
            }

            const status = await gamePage.getStatus();
            expect(status).toBe(winningSequence.expectedFinalStatus);
            expect(status).toContain('Winner:');
        });

        test('should maintain status message consistency', async () => {
            // Use a standardized winning sequence
            const winningSequence = QUICK_WIN_SEQUENCES[0]; // horizontal win

            for (let i = 0; i < winningSequence.moves.length; i++) {
                await gamePage.clickSquare(winningSequence.moves[i]);
                const status = await gamePage.getStatus();

                if (i < winningSequence.moves.length - 1) {
                    // Should show next player until the last move
                    expect(status).toContain('Next player:');
                } else {
                    // Should show winner after the winning move
                    expect(status).toContain('Winner:');
                }
            }
        });
    });

    test.describe('Game Restart', () => {
        test('should reset game to initial state', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Verify game has progressed
            let status = await gamePage.getStatus();
            expect(status).toBe('Next player: O');

            // Reset the game
            await gamePage.resetGame();

            // Verify game is back to initial state
            status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');

            // Verify all squares are empty
            await gamePage.verifyEmptyBoard();
        });

        test('should reset game after win', async () => {
            // Use standardized winning sequence
            const winningSequence = X_WINNING_SEQUENCES[0]; // horizontal top win

            // Play the winning sequence
            for (const move of winningSequence.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify winner
            let status = await gamePage.getStatus();
            expect(status).toBe(winningSequence.expectedFinalStatus);

            // Reset the game
            await gamePage.resetGame();

            // Verify game is back to initial state
            status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');

            // Verify all squares are empty
            await gamePage.verifyEmptyBoard();
        });

        test('should reset game after draw', async () => {
            // Use standardized draw sequence
            for (const move of DRAW_SEQUENCE.moves) {
                await gamePage.clickSquare(move);
            }

            // Reset the game
            await gamePage.resetGame();

            // Verify game is back to initial state
            const status = await gamePage.getStatus();
            expect(status).toBe('Next player: X');

            // Verify all squares are empty
            await gamePage.verifyEmptyBoard();
        });

        test('should allow restart at any time', async () => {
            // Test restart at different game states using standardized data
            const testStates = PARTIAL_GAME_SEQUENCES.slice(0, 5); // Use first 5 partial sequences

            for (const state of testStates) {
                // Reset to clean state
                await gamePage.resetGame();

                // Play the moves for this state
                for (const move of state.moves) {
                    await gamePage.clickSquare(move);
                }

                // Reset the game
                await gamePage.resetGame();

                // Verify game is back to initial state
                const status = await gamePage.getStatus();
                expect(status).toBe('Next player: X');

                // Verify all squares are empty
                for (let i = 0; i < 9; i++) {
                    const squareValue = await gamePage.getSquareValue(i);
                    expect(squareValue).toBeNull();
                }
            }
        });
    });

    test.describe('State Persistence', () => {
        test('should maintain game state during play', async () => {
            // Play several moves
            await gamePage.clickSquare(0); // X
            await gamePage.clickSquare(1); // O
            await gamePage.clickSquare(2); // X

            // Verify state is maintained
            await gamePage.verifyState({
                squares: ['X', 'O', 'X', null, null, null, null, null, null],
                nextPlayer: 'O'
            });
        });

        test('should maintain state after rapid interactions', async () => {
            // Use standardized draw sequence
            for (const move of DRAW_SEQUENCE.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify state is maintained
            const expectedMarks = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

            for (let i = 0; i < 9; i++) {
                const squareValue = await gamePage.getSquareValue(i);
                expect(squareValue).toBe(expectedMarks[i]);
            }
        });

        test('should maintain state consistency across different scenarios', async () => {
            // Test different game scenarios using standardized data
            const scenarios = [
                X_WINNING_SEQUENCES[0], // horizontal win
                X_WINNING_SEQUENCES[3], // vertical win  
                X_WINNING_SEQUENCES[6]  // diagonal win
            ];

            for (const scenario of scenarios) {
                await gamePage.resetGame();

                // Play the scenario
                for (const move of scenario.moves) {
                    await gamePage.clickSquare(move);
                }

                // Verify final state
                const status = await gamePage.getStatus();
                expect(status).toBe(scenario.expectedFinalStatus);
            }
        });
    });
});
