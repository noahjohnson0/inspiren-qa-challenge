import { expect, Page } from '@playwright/test';
import { GamePage } from './game-page';
import { EDGE_CASE_SEQUENCES, X_WINNING_SEQUENCES, O_WINNING_SEQUENCES, DRAW_SEQUENCE, PARTIAL_GAME_SEQUENCES } from './test-data';

/**
 * Test utilities for common state verification patterns
 */
export class TestUtils {
    /**
     * Verify the current state of the game board
     * @param gamePage - The GamePage instance
     * @param expectedState - Object describing expected state
     * @param expectedState.squares - Array of expected square values (null for empty)
     * @param expectedState.status - Expected status message
     * @param expectedState.nextPlayer - Expected next player ('X' or 'O')
     * @param expectedState.winner - Expected winner ('X', 'O', or null)
     */
    static async verifyState(
        gamePage: GamePage,
        expectedState: {
            squares?: (string | null)[];
            status?: string;
            nextPlayer?: 'X' | 'O';
            winner?: 'X' | 'O' | null;
        }
    ) {
        // Verify square states
        if (expectedState.squares) {
            for (let i = 0; i < expectedState.squares.length; i++) {
                const actualValue = await gamePage.getSquareValue(i);
                expect(actualValue).toBe(expectedState.squares[i]);
            }
        }

        // Verify status message
        if (expectedState.status) {
            const actualStatus = await gamePage.getStatus();
            expect(actualStatus).toBe(expectedState.status);
        }

        // Verify next player
        if (expectedState.nextPlayer) {
            const actualStatus = await gamePage.getStatus();
            expect(actualStatus).toBe(`Next player: ${expectedState.nextPlayer}`);
        }

        // Verify winner
        if (expectedState.winner !== undefined) {
            const actualStatus = await gamePage.getStatus();
            if (expectedState.winner === null) {
                expect(actualStatus).not.toContain('Winner:');
            } else {
                expect(actualStatus).toBe(`Winner: ${expectedState.winner}`);
            }
        }
    }

    /**
     * Verify that specific squares contain expected values
     * @param gamePage - The GamePage instance
     * @param squareValues - Object mapping square indices to expected values
     */
    static async verifySquareValues(
        gamePage: GamePage,
        squareValues: Record<number, string | null>
    ) {
        for (const [index, expectedValue] of Object.entries(squareValues)) {
            const actualValue = await gamePage.getSquareValue(parseInt(index));
            expect(actualValue).toBe(expectedValue);
        }
    }

    /**
     * Verify that all squares are empty
     * @param gamePage - The GamePage instance
     */
    static async verifyEmptyBoard(gamePage: GamePage) {
        for (let i = 0; i < 9; i++) {
            const value = await gamePage.getSquareValue(i);
            expect(value).toBeNull();
        }
    }

    /**
     * Verify that all squares are filled (no null values)
     * @param gamePage - The GamePage instance
     */
    static async verifyFullBoard(gamePage: GamePage) {
        for (let i = 0; i < 9; i++) {
            const value = await gamePage.getSquareValue(i);
            expect(value).not.toBeNull();
        }
    }

    /**
     * Verify the initial game state
     * @param gamePage - The GamePage instance
     */
    static async verifyInitialState(gamePage: GamePage) {
        await this.verifyState(gamePage, {
            squares: [null, null, null, null, null, null, null, null, null],
            status: 'Next player: X',
            nextPlayer: 'X',
            winner: null
        });
    }

    /**
     * Verify a winning state
     * @param gamePage - The GamePage instance
     * @param winner - The expected winner ('X' or 'O')
     * @param winningSquares - Array of square indices that should contain the winning mark
     */
    static async verifyWinningState(
        gamePage: GamePage,
        winner: 'X' | 'O',
        winningSquares: number[]
    ) {
        const actualStatus = await gamePage.getStatus();
        expect(actualStatus).toBe(`Winner: ${winner}`);

        // Verify winning squares contain the winner's mark
        for (const squareIndex of winningSquares) {
            const value = await gamePage.getSquareValue(squareIndex);
            expect(value).toBe(winner);
        }
    }

    /**
     * Verify a draw state (all squares filled, no winner)
     * @param gamePage - The GamePage instance
     */
    static async verifyDrawState(gamePage: GamePage) {
        const actualStatus = await gamePage.getStatus();
        expect(actualStatus).not.toContain('Winner:');

        // Verify all squares are filled
        await this.verifyFullBoard(gamePage);
    }

    /**
     * Verify that marks haven't changed after invalid moves
     * @param gamePage - The GamePage instance
     * @param expectedMarks - Object mapping square indices to expected values
     */
    static async verifyMarksUnchanged(
        gamePage: GamePage,
        expectedMarks: Record<number, string | null>
    ) {
        await this.verifySquareValues(gamePage, expectedMarks);
    }

    /**
     * Verify turn alternation pattern
     * @param gamePage - The GamePage instance
     * @param moves - Array of square indices to click
     * @param expectedMarks - Array of expected marks for each move
     */
    static async verifyTurnAlternation(
        gamePage: GamePage,
        moves: number[],
        expectedMarks: string[]
    ) {
        for (let i = 0; i < moves.length; i++) {
            await gamePage.clickSquare(moves[i]);
            const actualValue = await gamePage.getSquareValue(moves[i]);
            expect(actualValue).toBe(expectedMarks[i]);
        }
    }

    /**
     * Verify that moves are prevented after game ends
     * @param gamePage - The GamePage instance
     * @param squareIndex - Square to try clicking
     * @param expectedValue - Expected value that should remain unchanged
     */
    static async verifyMovePrevented(
        gamePage: GamePage,
        squareIndex: number,
        expectedValue: string | null
    ) {
        const valueBefore = await gamePage.getSquareValue(squareIndex);
        await gamePage.clickSquare(squareIndex);
        const valueAfter = await gamePage.getSquareValue(squareIndex);

        expect(valueAfter).toBe(expectedValue);
        expect(valueAfter).toBe(valueBefore);
    }

    /**
     * Verify game state after reset
     * @param gamePage - The GamePage instance
     */
    static async verifyAfterReset(gamePage: GamePage) {
        await this.verifyInitialState(gamePage);
    }

    /**
     * Verify specific square patterns (useful for testing different win conditions)
     * @param gamePage - The GamePage instance
     * @param pattern - Object describing the pattern
     */
    static async verifySquarePattern(
        gamePage: GamePage,
        pattern: {
            name: string;
            squares: Record<number, string | null>;
            status?: string;
        }
    ) {
        await this.verifySquareValues(gamePage, pattern.squares);

        if (pattern.status) {
            const actualStatus = await gamePage.getStatus();
            expect(actualStatus).toBe(pattern.status);
        }
    }

    /**
     * Test setup utility - eliminates repetitive beforeEach patterns
     * @param page - Playwright page instance
     * @returns Configured GamePage instance
     */
    static async setupTest(page: Page): Promise<GamePage> {
        const gamePage = new GamePage(page);
        await gamePage.goto();
        await gamePage.applyTestStyling();
        return gamePage;
    }

    /**
     * Execute a sequence of moves - eliminates repetitive move loops
     * @param gamePage - The GamePage instance
     * @param moves - Array of square indices to click
     */
    static async executeSequence(gamePage: GamePage, moves: number[]): Promise<void> {
        for (const move of moves) {
            await gamePage.clickSquare(move);
        }
    }

    /**
     * Get test sequence by name - eliminates repetitive .find() patterns
     * @param sequenceName - Name of the sequence to find
     * @returns The found sequence or throws error if not found
     */
    static getSequence(sequenceName: string) {
        const sequence = EDGE_CASE_SEQUENCES.find(s => s.name === sequenceName);
        if (!sequence) {
            throw new Error(`Sequence '${sequenceName}' not found in EDGE_CASE_SEQUENCES`);
        }
        return sequence;
    }

    /**
     * Get winning sequence by index and type
     * @param type - 'X' or 'O'
     * @param index - Index of the winning sequence
     * @returns The winning sequence
     */
    static getWinningSequence(type: 'X' | 'O', index: number) {
        const sequences = type === 'X' ? X_WINNING_SEQUENCES : O_WINNING_SEQUENCES;
        if (index >= sequences.length) {
            throw new Error(`${type} winning sequence at index ${index} not found`);
        }
        return sequences[index];
    }

    /**
     * Test move patterns with automatic verification
     * @param gamePage - The GamePage instance
     * @param patterns - Array of move patterns to test
     * @param description - Description of what's being tested
     */
    static async testMovePatterns(
        gamePage: GamePage,
        patterns: number[][],
        description: string
    ): Promise<void> {
        for (const pattern of patterns) {
            await gamePage.resetGame();

            for (let i = 0; i < pattern.length; i++) {
                await gamePage.clickSquare(pattern[i]);
                const squareValue = await gamePage.getSquareValue(pattern[i]);
                const expectedMark = i % 2 === 0 ? 'X' : 'O';
                expect(squareValue).toBe(expectedMark);
            }
        }
    }

    /**
     * Execute and verify a complete game sequence
     * @param gamePage - The GamePage instance
     * @param sequence - The sequence to execute
     * @param expectedOutcome - Expected final outcome
     */
    static async executeAndVerifySequence(
        gamePage: GamePage,
        sequence: { moves: number[]; expectedFinalStatus?: string },
        expectedOutcome?: {
            winner?: 'X' | 'O' | null;
            status?: string;
            squares?: (string | null)[];
        }
    ): Promise<void> {
        // Execute the sequence
        await this.executeSequence(gamePage, sequence.moves);

        // Verify expected outcome if provided
        if (expectedOutcome) {
            if (expectedOutcome.winner !== undefined) {
                if (expectedOutcome.winner === null) {
                    const status = await gamePage.getStatus();
                    expect(status).not.toContain('Winner:');
                } else {
                    await gamePage.verifyWinningState(expectedOutcome.winner, sequence.moves);
                }
            }

            if (expectedOutcome.status) {
                const actualStatus = await gamePage.getStatus();
                expect(actualStatus).toBe(expectedOutcome.status);
            }

            if (expectedOutcome.squares) {
                await gamePage.verifySquareValues(
                    Object.fromEntries(expectedOutcome.squares.map((value, index) => [index, value]))
                );
            }
        }
    }

    /**
     * Create a test that executes a sequence and verifies outcome
     * @param gamePage - The GamePage instance
     * @param sequenceName - Name of the sequence to execute
     * @param expectedOutcome - Expected outcome after sequence
     */
    static async testSequenceOutcome(
        gamePage: GamePage,
        sequenceName: string,
        expectedOutcome?: {
            winner?: 'X' | 'O' | null;
            status?: string;
            squares?: (string | null)[];
        }
    ): Promise<void> {
        const sequence = this.getSequence(sequenceName);
        await this.executeAndVerifySequence(gamePage, sequence, expectedOutcome);
    }
}
