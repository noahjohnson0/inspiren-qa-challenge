#### How to record video even for passing tests - makes development easier
```bash
# Run test and record videos in background
npm run test:record

# Run test and record videos with playwright UI
npm run test:record:ui

# Run test and record videos with headed browser
npm run test:record:headed
```

### How to run the tests using only chromium (can save time during development for slow pc or large amount of tests)
```bash
# run test using only chromium browser
npm run test -- --project=chromium
```

### Viewing Test Videos
```bash
npx playwright show-report
```