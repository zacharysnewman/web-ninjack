# Ninjack – Refactor Plan

## Step 1: Consolidate Mutable State (Pre-split)

Wrap all mutable globals into a single `state` object. This is a mechanical find-and-replace with no behavior change.

**Variables to consolidate:**
```js
const state = {
  playerX, playerY,
  currentHealth, currentLevel,
  gold, swords,
  currentKeys, currentChutes, currentMoves,
  snakesCount, snakes, rocks,
  doorLocked, buttonsDisabled,
  currentLootTable, currentLootIndex, currentTileTable
};
```

**Why first:** Every future module will take `state` as a single import/argument. Without this, splitting files means importing 20+ individual globals per module or implicitly relying on `window.*`. Doing this step first makes the shape of game state visible and makes all subsequent splits clean.

**Immutable constants** (`SNAKE`, `ROCK`, `worldSize`, etc.) stay as-is — they don't need to be in `state`.

---

## Step 2: Split into Files

Extract modules in dependency order (least-to-most coupled). Each module imports `state` and its direct dependencies only.

| Order | File | Responsibilities |
|---|---|---|
| 1 | `constants.js` | Emoji symbols, world dimensions, loot counts |
| 2 | `timer.js` | `Timer` class |
| 3 | `tileUtils.js` | `hasClass`, `removeClass`, `setTile`, `getNewTileInDirection`, `getRandomDirection` |
| 4 | `ui.js` | `updateGoldDisplay`, `notify`, `showModal`, `disableButtons`, `enableButtons` |
| 5 | `worldGen.js` | `fisherYatesShuffle`, `generateLootTable`, `generateWorld` |
| 6 | `snake.js` | `canSnakeMoveToTile`, `snakeMove`, `killSnake`, `addSnake`, `moveSnakes` |
| 7 | `save.js` | `saveGame`, `loadGame`, `clearSave`, `restoreWorld` |
| 8 | `player.js` | `move`, `checkForMissingKey` |
| 9 | `game.js` | `resetGame`, `endGame`, `handleDamage`, `handleDeath`, `handleWin`, `handleFinalBoss` |
| 10 | `main.js` | Entry point, `onKeyDown`, `main()` |

Update `index.html` to load scripts in this order, or migrate to ES modules with `import/export`.

---

## Step 3: Refine Each Module (Post-split)

Once each system lives in its own file, refine in isolation:

- **`move()` in `player.js`** — Break up the large if/else tile-interaction chain. Each tile type (item pickup, combat, door logic) can become its own handler function.
- **`tileTable` in `worldGen.js`** — Currently evaluated eagerly at load time (top-level `fisherYatesShuffle` call). Move inside a function so world generation is fully on-demand and re-seedable.
- **`game.js`** — `resetGame` handles both new game and next level via a `newGame` boolean flag. Split into `startNewGame()` and `advanceLevel()` for clarity.

---

## Next Steps (Future Architectural Work)

These are larger structural changes best done after the file split is stable.

### DOM as State
Tile contents are currently read from `classList` and `textContent` rather than a separate data model. This couples rendering and game logic throughout — `move()`, the snake AI, and save/load all query the DOM to determine game state.

The fix is to introduce a `grid[][]` array that is the source of truth, with rendering as a pure output step. This unlocks easier testing, replays, and undo.

### State Object vs. Module Encapsulation
The `state` object from Step 1 is a pragmatic first step but still mutable and shared globally. A future improvement is to encapsulate state inside modules and expose only getter/setter interfaces, reducing the surface area for accidental mutation.

### Combat and Interaction System
Snake combat and item pickup logic in `move()` are ad hoc conditionals. A more scalable approach is a tile interaction registry — each tile type registers a handler — so adding new tile types doesn't require modifying the core movement function.

### Scoring and Persistence
`saveGame` currently bakes the DOM grid state directly into the save file. Once DOM-as-state is resolved, save/load can operate purely on the `grid[][]` model, making it simpler and more reliable.
