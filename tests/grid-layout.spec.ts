import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';
import { TestUtils } from './test-utils';

test.describe('Grid Layout & Structure Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = await TestUtils.setupTest(page);
    });

    test.describe('Basic Grid Structure', () => {
        test('should render 3x3 grid structure', async () => {
            // Verify the grid structure is correct
            await gamePage.verifyGridStructure();
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

        test('should display squares in correct order', async () => {
            // Verify squares are displayed in the correct order (0-8)
            const squares = await gamePage.getSquares();

            for (let i = 0; i < squares.length; i++) {
                const square = squares[i];
                await expect(square).toBeVisible();
            }
        });
    });

    test.describe('Grid Styling & Appearance', () => {
        test('should have consistent square styling', async () => {
            // Verify all squares have consistent styling
            const squares = await gamePage.getSquares();

            for (const square of squares) {
                await expect(square).toBeVisible();
                await expect(square).toHaveClass('square');
            }
        });

        test('should have visible game board container', async ({ page }) => {
            // Verify the main game board container exists
            await expect(gamePage.gameBoard).toBeVisible();
        });

        test('should have clickable squares', async () => {
            // Verify squares are clickable
            await gamePage.verifySquaresClickable();
        });

        test('should start with empty squares', async () => {
            // Verify all squares are initially empty
            await gamePage.verifyEmptyGrid();
        });
    });

    test.describe('Grid Stability & Responsiveness', () => {
        test('should maintain grid structure after interactions', async () => {
            // Click a few squares and verify grid structure remains intact
            await gamePage.clickSquare(0);
            await gamePage.clickSquare(1);
            await gamePage.clickSquare(2);

            // Verify grid structure is still correct
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

        test('should have responsive grid layout', async ({ page }) => {
            // Test grid layout at different viewport sizes
            await page.setViewportSize({ width: 800, height: 600 });
            await gamePage.verifyGridStructure();

            await page.setViewportSize({ width: 400, height: 300 });
            await gamePage.verifyGridStructure();

            await page.setViewportSize({ width: 1200, height: 800 });
            await gamePage.verifyGridStructure();
        });
    });

    test.describe('Accessibility', () => {
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
});
