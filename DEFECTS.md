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

## Game history buttons push the grid/board to the left
The player turn game history buttons are wider than the "Go to game start" button, and no layout is
specified to prevent the game board from moving left when the first player turn game history button renders

## No keyboard cmds / poor accessability support
Players with mobility issues or inability to use a mouse might not be able to play the game


## Game history should have a pointer or other ui element to distinguish what move we are currently viewing
Its good that the user can click to go to a specific move, and the game reacts accordingly, but we should
better specify what move we are on. Should write follow up test once dev fixes