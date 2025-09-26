# Tic Tac Toe Test Suite

This directory contains comprehensive end-to-end tests for the Tic Tac Toe game built with Playwright.

## Test Overview

- **Total Tests**: 83 test cases across 6 test files
- **Browsers**: Chromium, Firefox, WebKit, Microsoft Edge
- **Coverage**: All user flows, edge cases, and game rules
- **Architecture**: Page Object Model
- **CI Integration**: Runs on push to main, run on manual user trigger, publishes most recent report to gh pages, right now runs all four major browser

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install 
```

### Running Tests
```bash
# Run all tests across all browsers
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests with headed browser (see browser)
npm run test:headed

# Debug tests
npm run test:debug
```

## structure

### Test Files
| File | Description | Tests |
|------|-------------|-------|
| `core-gameplay.spec.ts` | Basic game mechanics and mark placement | 11 |
| `game-outcomes.spec.ts` | Win detection, draws, and game endings | 28 |
| `edge-cases.spec.ts` | Error handling and boundary conditions | 15 |
| `game-state.spec.ts` | State management and persistence | 10 |
| `history-navigation.spec.ts` | Turn history and navigation features | 8 |
| `grid-layout.spec.ts` | UI structure and responsiveness | 11 |

### Supporting Files
| File | Description |
|------|-------------|
| `game-page.ts` | Page Object Model for game interactions |
| `test-utils.ts` | Utility functions and common test patterns |
| `test-data.ts` | Standardized test sequences and data |

## Test Categories

### Core Gameplay Tests
- Mark placement in empty squares
- Turn alternation (X / O / X)
- Occupied square validation
- Different placement patterns

### Game Outcomes Tests
- All 8 winning patterns (3 horizontal, 3 vertical, 2 diagonal)
-  Win detection for both X and O players
- Draw scenarios
- Winner display and messaging

### Edge Cases & Error Handling
- Rapid clicking scenarios
- Invalid move attempts
- Boundary conditions
- Error recovery patterns
- Performance stress tests

### State Management Tests
- Game state persistence
- Status message consistency
- Reset functionality
- State restoration

### History & Navigation Tests
- Turn history display
- Back navigation functionality
- State restoration from history
- History management

### Grid Layout Tests
- 3x3 grid structure validation
- Square positioning and styling
- Responsive layout testing
- Accessibility considerations

## Development Commands

### Recording Test Videos
```bash
# Record videos for all tests (useful for debugging)
npm run test:record

# Record with Playwright UI
npm run test:record:ui

# Record with headed browser
npm run test:record:headed
```

### Browser-Specific Testing
```bash
# Run tests on specific browsers
npm run test -- --project=chromium
npm run test -- --project=firefox
npm run test -- --project=webkit
npm run test -- --project="Microsoft Edge"
```

### Test Filtering
```bash
# Run test by filename
npm run test tests/core-gameplay.spec.ts

# Run test by name
npm run test -- --grep "should place X in square"
```

### Viewing Results
```bash
# Open most recent report
npx playwright show-report

# Run test and view results in terminal
npm run test -- --reporter=list
```

## Test Architecture

### Page Object Model
The `GamePage` class encapsulates all interactions with the application under test:
```typescript
const gamePage = new GamePage(page);
await gamePage.clickSquare(0);
await gamePage.getSquareValue(0);
await gamePage.resetGame();
```

### Test Utilities
The `TestUtils` class provides common verification patterns:
```typescript
await TestUtils.verifyInitialState(gamePage);
await TestUtils.verifyWinningState(gamePage, 'X', [0, 1, 2]);
await TestUtils.executeSequence(gamePage, moves);
```

### Test Data Management
Standardized test sequences in `test-data.ts`:
- Winning sequences for X and O players
- Draw scenarios
- Edge case sequences
- Partial game states

## Test Coverage

### Game Rules Coverage
- 3x3 grid structure
- Turn-based gameplay (X starts)
- Win detection (3 in a row)
- Draw detection (full board)
- Game restart functionality
- History navigation

### User Flow Coverage
- Complete game scenarios
- Partial game states
- Error scenarios
- Edge cases and boundary conditions
- Cross-browser compatibility

## Configuration

### Playwright Configuration
- **Browsers**: Chromium, Firefox, WebKit, Microsoft Edge
- **Parallel Execution**: 14 workers (configurable)
- **Retries**: 2 retries on CI, 0 locally
- **Video Recording**: On failure (configurable)
- **Screenshots**: On failure
- **Trace**: On first retry

# Run in CI mode
```bash
CI=true npm test
```


## Best Practices Demonstrated

- **Page Object Model**: Clean separation of test logic and page interactions
- **Test Data Management**: Centralized, reusable test sequences
- **Utility Functions**: DRY principle with common verification patterns
- **Comprehensive Coverage**: All user flows and edge cases tested
- **Cross-Browser Testing**: Full browser matrix validation (edge cause I know the folks in healthcare love it 😅)

## Notes

### What We Don't Test
- Extensive initial static states
- Implementation details unrelated to business logic

### Test Design Philosophy
- **Explicit over Dynamic**: Hardcoded test cases for better readability - would reconsider if more variation (4x4 grid anyone?)
- **Comprehensive Coverage**: All possible game scenarios
- **Maintainable Structure**: Clear organization and reusable components
- **Professional Standards**: Enterprise-grade testing practices

---
