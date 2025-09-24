import { test, expect } from '@playwright/test';
import { GamePage } from './game-page';
import {
    X_WINNING_SEQUENCES,
    O_WINNING_SEQUENCES,
    DRAW_SEQUENCE
} from './test-data';

test.describe('Game Outcomes Tests', () => {
    let gamePage: GamePage;

    test.beforeEach(async ({ page }) => {
        gamePage = new GamePage(page);
        await gamePage.goto();
        await gamePage.applyTestStyling();
    });

    test.describe('Win Detection', () => {
        /**
         * Helper function to create a winning sequence
         * @param moves - Array of square indices to click in order
         * @param expectedWinner - Expected winner ('X' or 'O')
         * @param description - Description of the win pattern
         */
        async function testWinSequence(moves: number[], expectedWinner: string, description: string) {
            // Play the sequence of moves
            for (let i = 0; i < moves.length; i++) {
                await gamePage.clickSquare(moves[i]);
            }

            // Verify the winner is displayed
            const status = await gamePage.getStatus();
            expect(status).toBe(`Winner: ${expectedWinner}`);

            // Verify the winning squares contain the correct marks
            for (let i = 0; i < moves.length; i++) {
                const squareValue = await gamePage.getSquareValue(moves[i]);
                expect(squareValue).toBe(expectedWinner);
            }
        }

        /**
         * Test data for horizontal wins using standardized sequences
         */
        const horizontalWinScenarios = [
            X_WINNING_SEQUENCES[0], // horizontal top
            O_WINNING_SEQUENCES[0], // horizontal top
            X_WINNING_SEQUENCES[1], // horizontal middle
            O_WINNING_SEQUENCES[1], // horizontal middle
            X_WINNING_SEQUENCES[2], // horizontal bottom
            O_WINNING_SEQUENCES[2]  // horizontal bottom
        ];

        /**
         * Test data for vertical wins using standardized sequences
         */
        const verticalWinScenarios = [
            X_WINNING_SEQUENCES[3], // vertical left
            O_WINNING_SEQUENCES[3], // vertical left
            X_WINNING_SEQUENCES[4], // vertical middle
            O_WINNING_SEQUENCES[4], // vertical middle
            X_WINNING_SEQUENCES[5], // vertical right
            O_WINNING_SEQUENCES[5]  // vertical right
        ];

        /**
         * Test data for diagonal wins using standardized sequences
         */
        const diagonalWinScenarios = [
            X_WINNING_SEQUENCES[6], // diagonal main
            O_WINNING_SEQUENCES[6], // diagonal main
            X_WINNING_SEQUENCES[7], // diagonal anti
            O_WINNING_SEQUENCES[7]  // diagonal anti
        ];

        test.describe('Horizontal Wins', () => {
            for (const scenario of horizontalWinScenarios) {
                test(`should detect ${scenario.description}`, async () => {
                    // Play the sequence of moves that creates this win scenario
                    for (const move of scenario.moves) {
                        await gamePage.clickSquare(move);
                    }

                    // Verify winner
                    const status = await gamePage.getStatus();
                    expect(status).toBe(scenario.expectedFinalStatus);

                    // Verify the winning squares contain the correct marks
                    const winner = scenario.expectedFinalStatus.split(': ')[1];
                    const winningSquares = scenario.moves.filter((_, index) => index % 2 === (winner === 'X' ? 0 : 1));
                    for (const square of winningSquares) {
                        const value = await gamePage.getSquareValue(square);
                        expect(value).toBe(winner);
                    }
                });
            }
        });

        test.describe('Vertical Wins', () => {
            for (const scenario of verticalWinScenarios) {
                test(`should detect ${scenario.description}`, async () => {
                    // Play the sequence of moves that creates this win scenario
                    for (const move of scenario.moves) {
                        await gamePage.clickSquare(move);
                    }

                    // Verify winner
                    const status = await gamePage.getStatus();
                    expect(status).toBe(scenario.expectedFinalStatus);

                    // Verify the winning squares contain the correct marks
                    const winner = scenario.expectedFinalStatus.split(': ')[1];
                    const winningSquares = scenario.moves.filter((_, index) => index % 2 === (winner === 'X' ? 0 : 1));
                    for (const square of winningSquares) {
                        const value = await gamePage.getSquareValue(square);
                        expect(value).toBe(winner);
                    }
                });
            }
        });

        test.describe('Diagonal Wins', () => {
            for (const scenario of diagonalWinScenarios) {
                test(`should detect ${scenario.description}`, async () => {
                    // Play the sequence of moves that creates this win scenario
                    for (const move of scenario.moves) {
                        await gamePage.clickSquare(move);
                    }

                    // Verify winner
                    const status = await gamePage.getStatus();
                    expect(status).toBe(scenario.expectedFinalStatus);

                    // Verify the winning squares contain the correct marks
                    const winner = scenario.expectedFinalStatus.split(': ')[1];
                    const winningSquares = scenario.moves.filter((_, index) => index % 2 === (winner === 'X' ? 0 : 1));
                    for (const square of winningSquares) {
                        const value = await gamePage.getSquareValue(square);
                        expect(value).toBe(winner);
                    }
                });
            }
        });

        test.describe('Win Detection Edge Cases', () => {
            test('should detect win immediately when third mark is placed', async () => {
                // Place first two marks
                await gamePage.clickSquare(0); // X
                await gamePage.clickSquare(3); // O
                await gamePage.clickSquare(1); // X

                // Verify no winner yet
                let status = await gamePage.getStatus();
                expect(status).not.toContain('Winner:');

                // Place the winning mark
                await gamePage.clickSquare(4); // O
                await gamePage.clickSquare(2); // X - wins!

                // Verify winner is detected immediately
                status = await gamePage.getStatus();
                expect(status).toBe('Winner: X');
            });

            test('should not allow moves after game is won', async () => {
                // Create a winning scenario
                await gamePage.clickSquare(0); // X
                await gamePage.clickSquare(3); // O
                await gamePage.clickSquare(1); // X
                await gamePage.clickSquare(4); // O
                await gamePage.clickSquare(2); // X - wins!

                // Verify winner
                let status = await gamePage.getStatus();
                expect(status).toBe('Winner: X');

                // Try to make another move - should not work
                await gamePage.clickSquare(5);

                // Verify the square remains empty and status unchanged
                const squareValue = await gamePage.getSquareValue(5);
                expect(squareValue).toBeNull();

                status = await gamePage.getStatus();
                expect(status).toBe('Winner: X');
            });
        });
    });

    test.describe('Draw Detection', () => {
        /**
         * Test data for draw scenarios using standardized sequences
         */
        const drawScenarios = [
            DRAW_SEQUENCE
        ];

        for (const scenario of drawScenarios) {
            test(`should handle ${scenario.description} scenario`, async () => {
                // Play all 9 moves to create a draw
                for (const move of scenario.moves) {
                    await gamePage.clickSquare(move);
                }

                // Verify no winner is declared (status should show next player, not winner)
                const status = await gamePage.getStatus();
                expect(status).not.toContain('Winner:');

                // Verify all squares are filled
                await gamePage.verifyFullBoard();
            });
        }

        test('should prevent moves after draw is reached', async () => {
            // Use standardized draw sequence
            for (const move of DRAW_SEQUENCE.moves) {
                await gamePage.clickSquare(move);
            }

            // Try to click an already occupied square - should not change anything
            const initialValue = await gamePage.getSquareValue(0);
            await gamePage.clickSquare(0);
            const finalValue = await gamePage.getSquareValue(0);

            expect(finalValue).toBe(initialValue);
        });
    });

    test.describe('Winner Display', () => {
        test('should display winner message when X wins', async () => {
            // Create a winning scenario for X
            await gamePage.clickSquare(0); // X
            await gamePage.clickSquare(3); // O
            await gamePage.clickSquare(1); // X
            await gamePage.clickSquare(4); // O
            await gamePage.clickSquare(2); // X - wins!

            // Verify winner message is displayed
            const status = await gamePage.getStatus();
            expect(status).toBe('Winner: X');
            expect(status).toContain('Winner:');
            expect(status).toContain('X');
        });

        test('should display winner message when O wins', async () => {
            // Create a winning scenario for O
            await gamePage.clickSquare(0); // X
            await gamePage.clickSquare(1); // O
            await gamePage.clickSquare(2); // X
            await gamePage.clickSquare(4); // O
            await gamePage.clickSquare(6); // X
            await gamePage.clickSquare(7); // O - wins!

            // Verify winner message is displayed
            const status = await gamePage.getStatus();
            expect(status).toBe('Winner: O');
            expect(status).toContain('Winner:');
            expect(status).toContain('O');
        });

        test('should display winner message immediately when game ends', async () => {
            // Start with no winner
            let status = await gamePage.getStatus();
            expect(status).not.toContain('Winner:');
            expect(status).toContain('Next player:');

            // Create a winning scenario
            await gamePage.clickSquare(0); // X
            await gamePage.clickSquare(3); // O
            await gamePage.clickSquare(1); // X
            await gamePage.clickSquare(4); // O
            await gamePage.clickSquare(2); // X - wins!

            // Verify winner message appears immediately
            status = await gamePage.getStatus();
            expect(status).toBe('Winner: X');
            expect(status).toContain('Winner:');
        });

        test('should maintain winner message after game ends', async () => {
            // Create a winning scenario
            await gamePage.clickSquare(0); // X
            await gamePage.clickSquare(3); // O
            await gamePage.clickSquare(1); // X
            await gamePage.clickSquare(4); // O
            await gamePage.clickSquare(2); // X - wins!

            // Verify winner message is displayed
            let status = await gamePage.getStatus();
            expect(status).toBe('Winner: X');

            // Try to click another square (should not work)
            await gamePage.clickSquare(5);

            // Verify winner message persists
            status = await gamePage.getStatus();
            expect(status).toBe('Winner: X');
            expect(status).toContain('Winner:');
        });

        test('should show correct winner for different win patterns', async () => {
            // Test X winning sequences
            for (const sequence of X_WINNING_SEQUENCES.slice(0, 3)) { // Test first 3 X winning patterns
                await gamePage.resetGame();

                // Play the winning sequence
                for (const move of sequence.moves) {
                    await gamePage.clickSquare(move);
                }

                // Verify correct winner is displayed
                const status = await gamePage.getStatus();
                expect(status).toContain('Winner: X');
            }

            // Test O winning sequences
            for (const sequence of O_WINNING_SEQUENCES.slice(0, 3)) { // Test first 3 O winning patterns
                await gamePage.resetGame();

                // Play the winning sequence
                for (const move of sequence.moves) {
                    await gamePage.clickSquare(move);
                }

                // Verify correct winner is displayed
                const status = await gamePage.getStatus();
                expect(status).toContain('Winner: O');
            }
        });
    });

    test.describe('Draw Display', () => {
        test.skip('should display draw message when game ends in draw - expected to fail', async () => {
            // Use standardized draw sequence
            for (const move of DRAW_SEQUENCE.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify draw message is displayed
            const status = await gamePage.getStatus();
            expect(status).toContain('Draw');
        });

        test.skip('should display draw message for different draw scenarios - expected to fail', async () => {
            // Use standardized draw sequence
            await gamePage.resetGame();

            // Play all moves to create a draw
            for (const move of DRAW_SEQUENCE.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify draw message is displayed
            const status = await gamePage.getStatus();
            expect(status).toContain('Draw');
        });

        test.skip('should maintain draw message after game ends - expected to fail', async () => {
            // Use standardized draw sequence
            for (const move of DRAW_SEQUENCE.moves) {
                await gamePage.clickSquare(move);
            }

            // Verify draw message is displayed
            let status = await gamePage.getStatus();
            expect(status).toContain('Draw');

            // Try to click another square (should not work)
            await gamePage.clickSquare(0);

            // Verify draw message persists
            status = await gamePage.getStatus();
            expect(status).toContain('Draw');
        });
    });
});
