import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';

test.describe('History & Navigation Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = new GamePage(page);
        await gamePage.goto();
        await gamePage.applyTestStyling();
    });

    test.describe('Turn History', () => {
        test('should display history of turns', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Verify history is displayed
            const historyButtons = await gamePage.getHistoryButtons();
            expect(historyButtons.length).toBeGreaterThan(0);
        });

        test('should show correct number of history entries', async () => {
            // Play several moves
            for (let i = 0; i < 5; i++) {
                await gamePage.clickSquare(i);
            }

            // Verify correct number of history entries
            const historyButtons = await gamePage.getHistoryButtons();
            expect(historyButtons.length).toBe(6); // 5 moves + initial state
        });
    });

    test.describe('Back Navigation', () => {
        test('should allow going back to previous turns', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Go back to move 1 (after first move)
            await gamePage.goToMove(1);

            // Verify state is restored correctly
            // Move 1 = after first move: square 0 = 'X', others empty
            await gamePage.verifySquareValues({
                0: 'X', 1: null, 2: null
            });
        });

        test('should allow going back to game start', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Go back to game start
            await gamePage.goToMove(0);

            // Verify all squares are empty
            await gamePage.verifyEmptyBoard();
        });
    });

    test.describe('State Restoration', () => {
        test('should properly restore game state when going back', async () => {
            // Play several moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);
            await gamePage.clickSquare(3);

            // Go back to move 2
            await gamePage.goToMove(2);

            // Verify state is correctly restored
            await gamePage.verifyState({
                squares: ['X', 'O', null, null, null, null, null, null, null],
                nextPlayer: 'X'
            });
        });

        test('should allow continuing from restored state', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Go back to move 1
            await gamePage.goToMove(1);

            // Continue playing from restored state
            await gamePage.clickSquare(3);

            // Verify new move was made
            await gamePage.verifySquareValues({
                3: 'O'
            });
        });
    });

    test.describe('History Management', () => {
        test('should maintain history after game reset', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);

            // Reset game
            await gamePage.resetGame();

            // Verify history is cleared
            const historyButtons = await gamePage.getHistoryButtons();
            expect(historyButtons.length).toBe(1); // Only initial state
        });

        test('should handle history navigation edge cases', async () => {
            // Play some moves
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Test navigation to different moves
            await gamePage.goToMove(0);
            await gamePage.goToMove(1);
            await gamePage.goToMove(2);
            await gamePage.goToMove(3);

            // Verify final state is correct
            await gamePage.verifySquareValues({
                0: 'X', 1: 'O', 2: 'X'
            });
        });
    });
});
