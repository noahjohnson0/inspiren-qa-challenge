# Issues Found

Two bugs that need fixing:

## Buttons lack type - accessability issue
Buttons in `Square` component lack `type="button"`. This breaks VoiceOver and other assistive tech - users can't navigate the game properly.

```tsx
// src/Game.tsx:10
<button className="square" onClick={onSquareClick}>
```

Should be:
```tsx
<button type="button" className="square" onClick={onSquareClick}>
```

## Broken game state - draw condition never detected
Draw condition isn't handled. Game shows "Next player: X" even when board is full and no one won. Confusing UX.

Need to add draw detection in the status calculation logic.

## Game history seems to have typo or other issue with the button title?
The game history buttons say "Go to move # move" when they could potentially specify more detail or
the player that made that move


