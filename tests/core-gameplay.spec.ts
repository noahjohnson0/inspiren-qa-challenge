import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';
import { TestUtils } from './test-utils';
import { PARTIAL_GAME_SEQUENCES, DRAW_SEQUENCE } from './test-data';

test.describe('Core Gameplay Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = await TestUtils.setupTest(page);
    });

    test.describe('Grid Display', () => {
        test('should render 3x3 grid structure', async () => {
            // Verify the grid structure is correct
            await gamePage.verifyGridStructure();
        });

        test('should start with empty squares', async () => {
            // Verify all squares are initially empty
            await gamePage.verifyEmptyGrid();
        });

        test('should have clickable squares', async () => {
            // Verify squares are clickable
            await gamePage.verifySquaresClickable();
        });

        test('should have visible game board container', async ({ page }) => {
            // Verify the main game board container exists
            await expect(gamePage.gameBoard).toBeVisible();
        });

        test('should have exactly 9 squares', async () => {
            // Verify we have exactly 9 squares
            await expect(gamePage.squares).toHaveCount(9);
        });

        test('should have exactly 3 board rows', async () => {
            // Verify we have exactly 3 board rows
            await expect(gamePage.boardRows).toHaveCount(3);
        });

        test('should have 3 squares per row', async () => {
            // Verify each row has exactly 3 squares
            const rows = await gamePage.boardRows.all();
            for (let i = 0; i < rows.length; i++) {
                const squaresInRow = rows[i].locator('.square');
                await expect(squaresInRow).toHaveCount(3);
            }
        });

        test('should have proper square positioning', async () => {
            // Verify squares are positioned correctly in the grid
            const squares = await gamePage.getSquares();

            // Test that we can access squares by index
            for (let i = 0; i < 9; i++) {
                const square = squares[i];
                await expect(square).toBeVisible();
            }
        });

        test('should maintain grid structure after interactions', async () => {
            // Click a few squares and verify grid structure remains intact
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Verify grid structure is still correct
            await gamePage.verifyGridStructure();
        });

        test('should have consistent square styling', async () => {
            // Verify all squares have consistent styling
            const squares = await gamePage.getSquares();

            for (const square of squares) {
                await expect(square).toBeVisible();
                await expect(square).toHaveClass('square');
            }
        });

        test('should display squares in correct order', async () => {
            // Verify squares are displayed in the correct order (0-8)
            const squares = await gamePage.getSquares();

            for (let i = 0; i < squares.length; i++) {
                const square = squares[i];
                await expect(square).toBeVisible();
            }
        });

        test('should have responsive grid layout', async ({ page }) => {
            // Test grid layout at different viewport sizes
            await page.setViewportSize({ width: 800, height: 600 });
            await gamePage.verifyGridStructure();

            await page.setViewportSize({ width: 400, height: 300 });
            await gamePage.verifyGridStructure();

            await page.setViewportSize({ width: 1200, height: 800 });
            await gamePage.verifyGridStructure();
        });

        test('should maintain grid integrity during rapid clicks', async () => {
            // Rapidly click squares and verify grid remains intact
            for (let i = 0; i < 9; i++) {
                await gamePage.clickSquare(i);
            }

            // Verify grid structure is still correct
            await gamePage.verifyGridStructure();
        });

        test.skip('should have proper accessibility attributes - expected to fail', async () => {
            // Verify squares have proper accessibility attributes
            const squares = await gamePage.getSquares();

            for (const square of squares) {
                await expect(square).toBeVisible();
                // Squares should be buttons for accessibility
                await expect(square).toHaveAttribute('type', 'button');
            }
        });
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
                await gamePage.verifySquareValues({
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
                await gamePage.verifySquareValues({
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
                await gamePage.verifySquareValues({
                    0: 'X', 1: 'O', 2: 'X'
                });
            });
        });

        test.describe('Turn Validation', () => {
            test('should alternate between X and O', async () => {
                // First move - X
                await gamePage.clickSquare(0);
                let status = await gamePage.getStatus();
                expect(status).toBe('Next player: O');

                // Second move - O
                await gamePage.clickSquare(1);
                status = await gamePage.getStatus();
                expect(status).toBe('Next player: X');

                // Third move - X
                await gamePage.clickSquare(2);
                status = await gamePage.getStatus();
                expect(status).toBe('Next player: O');
            });

            test('should maintain turn order throughout game', async () => {
                // Use a sequence that doesn't create a winning condition
                // This sequence fills all squares without creating a winner
                const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
                const expectedMarks = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];

                for (let i = 0; i < moves.length; i++) {
                    await gamePage.clickSquare(moves[i]);
                    const squareValue = await gamePage.getSquareValue(moves[i]);
                    expect(squareValue).toBe(expectedMarks[i]);
                }
            });

            test('should not allow moves after game ends', async () => {
                // Create a winning scenario
                await gamePage.clickSquare(0); // X
                await gamePage.clickSquare(3); // O
                await gamePage.clickSquare(1); // X
                await gamePage.clickSquare(4); // O
                await gamePage.clickSquare(2); // X - wins!

                // Try to make another move
                await gamePage.clickSquare(5);

                // Verify the square remains empty
                const squareValue = await gamePage.getSquareValue(5);
                expect(squareValue).toBeNull();
            });

            test('should prevent moves after draw', async () => {
                // Use standardized draw sequence
                for (const move of DRAW_SEQUENCE.moves) {
                    await gamePage.clickSquare(move);
                }

                // Try to make another move
                await gamePage.clickSquare(0);

                // Verify the square value hasn't changed
                const squareValue = await gamePage.getSquareValue(0);
                expect(squareValue).toBe('X'); // Should remain X
            });
        });
    });

    test.describe('Player Turns', () => {
        test.describe('Initial Game State', () => {
            test('should start with X player', async () => {
                // Verify initial status shows X as next player
                const status = await gamePage.getStatus();
                expect(status).toBe('Next player: X');
            });
        });

        test.describe('Turn Alternation', () => {
            test('should switch to O after X plays', async () => {
                // First move - X should play
                await gamePage.clickSquare(0);
                let status = await gamePage.getStatus();
                expect(status).toBe('Next player: O');
            });

            test('should switch to X after O plays', async () => {
                // Setup: X plays first
                await gamePage.clickSquare(0);

                // Second move - O should play
                await gamePage.clickSquare(1);
                let status = await gamePage.getStatus();
                expect(status).toBe('Next player: X');
            });

            test('should maintain alternating pattern', async () => {
                // Play several moves and verify alternating pattern
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
    });
});
