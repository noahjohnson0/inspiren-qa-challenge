import { Page, Locator, expect } from '@playwright/test';
import { TestUtils } from './test-utils';

/**
 * Page Object Model for the Tic Tac Toe Game
 * This class encapsulates all interactions with the game UI components
 */
export class GamePage {
    readonly page: Page;

    // Game board elements
    readonly gameBoard: Locator;
    readonly boardRows: Locator;
    readonly squares: Locator;

    // Game status elements
    readonly status: Locator;

    // Control elements
    readonly resetButton: Locator;

    // History elements
    readonly historySection: Locator;
    readonly historyButtons: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.gameBoard = page.locator('.game-board');
        this.boardRows = page.locator('.board-row');
        this.squares = page.locator('.square');
        this.status = page.locator('.status');
        this.resetButton = page.locator('button:has-text("Reset")');
        this.historySection = page.locator('.game-info');
        this.historyButtons = page.locator('.game-info button');
    }

    /**
     * Navigate to the game page
     */
    async goto() {
        await this.page.goto('/');
    }


    /**
     * Get all square elements as an array
     */
    async getSquares() {
        return await this.squares.all();
    }

    /**
     * Click on a specific square by index (0-8)
     */
    async clickSquare(index: number) {
        const squares = await this.getSquares();
        if (index >= 0 && index < squares.length) {
            await squares[index].click();
        } else {
            throw new Error(`Square index ${index} is out of range. Valid range: 0-8`);
        }
    }

    /**
     * Get the text content of a specific square by index
     */
    async getSquareValue(index: number): Promise<string | null> {
        const squares = await this.getSquares();
        if (index >= 0 && index < squares.length) {
            const text = await squares[index].textContent();
            return text?.trim() || null;
        }
        throw new Error(`Square index ${index} is out of range. Valid range: 0-8`);
    }

    /**
     * Get the current game status text
     */
    async getStatus(): Promise<string> {
        return await this.status.textContent() || '';
    }

    /**
     * Click the reset button
     */
    async resetGame() {
        await this.resetButton.click();
    }

    /**
     * Get all history buttons
     */
    async getHistoryButtons() {
        return await this.historyButtons.all();
    }

    /**
     * Click on a history button by move number
     */
    async goToMove(moveNumber: number) {
        const buttons = await this.getHistoryButtons();
        if (moveNumber >= 0 && moveNumber < buttons.length) {
            await buttons[moveNumber].click();
        } else {
            throw new Error(`Move number ${moveNumber} is out of range`);
        }
    }

    /**
     * Verify that the grid has exactly 9 squares arranged in 3 rows
     */
    async verifyGridStructure() {
        // Verify we have exactly 3 board rows
        await expect(this.boardRows).toHaveCount(3);

        // Verify we have exactly 9 squares total
        await expect(this.squares).toHaveCount(9);

        // Verify each row has exactly 3 squares
        const rows = await this.boardRows.all();
        for (let i = 0; i < rows.length; i++) {
            const squaresInRow = rows[i].locator('.square');
            await expect(squaresInRow).toHaveCount(3);
        }
    }

    /**
     * Verify that all squares are initially empty
     */
    async verifyEmptyGrid() {
        const squares = await this.getSquares();
        for (let i = 0; i < squares.length; i++) {
            const value = await this.getSquareValue(i);
            expect(value).toBeNull();
        }
    }

    /**
     * Verify that squares are clickable (not disabled)
     */
    async verifySquaresClickable() {
        const squares = await this.getSquares();
        for (let i = 0; i < squares.length; i++) {
            await expect(squares[i]).toBeEnabled();
        }
    }

    /**
     * Convenience method to verify square values
     * @param squareValues - Object mapping square indices to expected values
     */
    async verifySquareValues(squareValues: Record<number, string | null>) {
        await TestUtils.verifySquareValues(this, squareValues);
    }

    /**
     * Convenience method to verify game state
     * @param expectedState - Object describing expected state
     */
    async verifyState(expectedState: {
        squares?: (string | null)[];
        status?: string;
        nextPlayer?: 'X' | 'O';
        winner?: 'X' | 'O' | null;
    }) {
        await TestUtils.verifyState(this, expectedState);
    }

    /**
     * Convenience method to verify winning state
     * @param winner - The expected winner ('X' or 'O')
     * @param winningSquares - Array of square indices that should contain the winning mark
     */
    async verifyWinningState(winner: 'X' | 'O', winningSquares: number[]) {
        await TestUtils.verifyWinningState(this, winner, winningSquares);
    }

    /**
     * Convenience method to verify initial state
     */
    async verifyInitialState() {
        await TestUtils.verifyInitialState(this);
    }

    /**
     * Convenience method to verify empty board
     */
    async verifyEmptyBoard() {
        await TestUtils.verifyEmptyBoard(this);
    }

    /**
     * Convenience method to verify full board
     */
    async verifyFullBoard() {
        await TestUtils.verifyFullBoard(this);
    }

}
