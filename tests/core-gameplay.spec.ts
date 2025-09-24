import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';
import { TestUtils } from './test-utils';
import { PARTIAL_GAME_SEQUENCES, DRAW_SEQUENCE } from './test-data';

test.describe('Core Gameplay Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = await TestUtils.setupTest(page);
    });


    test.describe('Mark Placement', () => {
        test.describe('Empty Square Placement', () => {
            test('should place X in square 0', async () => {
                await gamePage.clickSquare(0);
                const squareValue = await gamePage.getSquareValue(0);
                expect(squareValue).toBe('X');
            });

            test('should place O in square 1', async () => {
                await gamePage.clickSquare(0);
                await gamePage.clickSquare(1);
                const squareValue = await gamePage.getSquareValue(1);
                expect(squareValue).toBe('O');
            });

            test('should place X in square 2', async () => {
                await gamePage.clickSquare(0);
                await gamePage.clickSquare(1);
                await gamePage.clickSquare(2);
                const squareValue = await gamePage.getSquareValue(2);
                expect(squareValue).toBe('X');
            });

            test('should place marks in all squares', async () => {
                // Use standardized draw sequence that fills all squares without creating a winner
                await TestUtils.executeSequence(gamePage, DRAW_SEQUENCE.moves);

                // Verify all squares are filled with correct marks
                const expectedMarks = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
                for (let i = 0; i < DRAW_SEQUENCE.moves.length; i++) {
                    const move = DRAW_SEQUENCE.moves[i];
                    const squareValue = await gamePage.getSquareValue(move);
                    const expectedMark = i % 2 === 0 ? 'X' : 'O';
                    expect(squareValue).toBe(expectedMark);
                }
            });

            test('should place marks in different patterns', async () => {
                // Test different placement patterns
                const patterns = [
                    [0, 1, 2], // Top row
                    [3, 4, 5], // Middle row
                    [6, 7, 8], // Bottom row
                    [0, 3, 6], // Left column
                    [1, 4, 7], // Middle column
                    [2, 5, 8], // Right column
                    [0, 4, 8], // Main diagonal
                    [2, 4, 6]  // Anti-diagonal
                ];

                await TestUtils.testMovePatterns(gamePage, patterns, 'Testing different placement patterns');
            });

            test('should place marks in random order', async () => {
                // Test placing marks in random order
                const randomOrder = [4, 0, 8, 2, 6, 1, 3, 7, 5];

                for (let i = 0; i < randomOrder.length; i++) {
                    await gamePage.clickSquare(randomOrder[i]);
                    const squareValue = await gamePage.getSquareValue(randomOrder[i]);
                    const expectedMark = i % 2 === 0 ? 'X' : 'O';
                    expect(squareValue).toBe(expectedMark);

                    // Check if game is over after this move
                    const status = await gamePage.getStatus();
                    if (status.includes('Winner:') || status.includes('Draw')) {
                        // Game ended, no need to continue placing marks
                        break;
                    }
                }
            });
        });

        test.describe('Occupied Square Validation', () => {
            test('should not allow placing mark in occupied square', async () => {
                // Place X in square 0
                await gamePage.clickSquare(0);
                let squareValue = await gamePage.getSquareValue(0);
                expect(squareValue).toBe('X');

                // Try to place O in the same square
                await gamePage.clickSquare(0);
                squareValue = await gamePage.getSquareValue(0);
                expect(squareValue).toBe('X'); // Should remain X
            });

            test('should not allow overwriting existing marks', async () => {
                // Place X in square 0
                await gamePage.clickSquare(0);
                await gamePage.clickSquare(1); // O
                await gamePage.clickSquare(2); // X

                // Try to overwrite square 0
                await gamePage.clickSquare(0);
                const squareValue = await gamePage.getSquareValue(0);
                expect(squareValue).toBe('X'); // Should remain X
            });

            test('should prevent multiple marks in same square', async () => {
                // Place marks in several squares
                await gamePage.clickSquare(0); // X
                await gamePage.clickSquare(1); // O
                await gamePage.clickSquare(2); // X

                // Try to click occupied squares multiple times
                for (let i = 0; i < 3; i++) {
                    await gamePage.clickSquare(0);
                    await gamePage.clickSquare(1);
                    await gamePage.clickSquare(2);
                }

                // Verify marks haven't changed
                await TestUtils.verifySquareValues(gamePage, {
                    0: 'X', 1: 'O', 2: 'X'
                });
            });

            test('should maintain mark integrity after rapid clicking', async () => {
                // Place marks in several squares
                await gamePage.clickSquare(0); // X
                await gamePage.clickSquare(1); // O
                await gamePage.clickSquare(2); // X

                // Rapidly click occupied squares
                for (let i = 0; i < 10; i++) {
                    await gamePage.clickSquare(0);
                    await gamePage.clickSquare(1);
                    await gamePage.clickSquare(2);
                }

                // Verify marks are still correct
                await TestUtils.verifySquareValues(gamePage, {
                    0: 'X', 1: 'O', 2: 'X'
                });
            });

            test('should handle clicking occupied squares in different orders', async () => {
                // Place marks in several squares
                await gamePage.clickSquare(0); // X
                await gamePage.clickSquare(1); // O
                await gamePage.clickSquare(2); // X

                // Click occupied squares in different orders
                await gamePage.clickSquare(2); // Try to overwrite X
                await gamePage.clickSquare(0); // Try to overwrite X
                await gamePage.clickSquare(1); // Try to overwrite O

                // Verify marks haven't changed
                await TestUtils.verifySquareValues(gamePage, {
                    0: 'X', 1: 'O', 2: 'X'
                });
            });
        });

    });

});
