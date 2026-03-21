# Ninjack – Refactor Plan

## ✅ Step 1: Consolidate Mutable State (Pre-split)

Wrapped all mutable globals into a single `state` object. Mechanical find-and-replace with no behavior change.

```js
const state = {
  playerX, playerY, grid,
  currentHealth, currentLevel,
  gold, swords,
  currentKeys, currentChutes, currentMoves,
  snakesCount, snakes, rocks,
  doorLocked, buttonsDisabled,
  currentLootTable, currentLootIndex, currentTileTable
};
```

**Immutable constants** (`SNAKE`, `ROCK`, `worldSize`, etc.) stay as-is.

---

## ✅ Step 2: Split into Files

Extracted modules in dependency order. Scripts loaded via `<script>` tags in `index.html`.

| File | Responsibilities |
|---|---|
| `constants.js` | Emoji symbols, world dimensions, loot counts |
| `state.js` | Single mutable state object |
| `timer.js` | `Timer` class + instance |
| `tileUtils.js` | `getTileElement`, `getGridTile`, `setGridTile`, `getNewTileInDirection`, `getRandomDirection` |
| `ui.js` | `updateGoldDisplay`, `notify`, `showModal`, `disableButtons`, `enableButtons` |
| `worldGen.js` | `fisherYatesShuffle`, `generateTileTable`, `generateLootTable`, `generateWorld` |
| `snake.js` | `canSnakeMoveToTile`, `snakeMove`, `killSnake`, `addSnake`, `moveSnakes` |
| `save.js` | `saveGame`, `loadGame`, `clearSave`, `restoreWorld` |
| `game.js` | `startNewGame`, `advanceLevel`, `endGame`, `handleDamage`, `handleDeath`, `handleWin`, `handleFinalBoss`, `setupLevel` |
| `player.js` | `move`, `checkForMissingKey`, per-tile interaction handlers |
| `main.js` | Entry point, `onKeyDown`, `main()` |

---

## ✅ Step 3: Refine Each Module (Post-split)

- **`player.js`** — `move()` broken into named per-tile handler functions: `interactWithHole`, `interactWithVegetation`, `interactWithDoor`, `interactWithSnake`, `interactWithOpenTile`, `collectGold`, `collectItem`, `movePlayerTo`.
- **`worldGen.js`** — Eager top-level `tileTable` replaced by `generateTileTable()`. World generation is fully on-demand and re-seedable.
- **`game.js`** — `resetGame(newGame)` split into `startNewGame()` and `advanceLevel()` with shared `setupLevel()` helper.

---

## ✅ DOM as State

`state.grid[y][x]` is now the single source of truth for tile contents. The DOM is a pure rendering output, written only via `setGridTile(x, y, value)`.

- `tileUtils.js`: `hasClass`/`removeClass`/`setTile` removed; replaced by `getGridTile` / `setGridTile` / `getTileElement`.
- All game logic reads from `state.grid` directly instead of querying `classList` or `textContent`.
- `handleDamage(damage, x, y)` and `handleDeath(x, y)` no longer take DOM tile references.
- `snakeMove(snake, newX, newY)` no longer takes tile parameters.
- `state.rocks` stores `{x, y}` only (no DOM reference).
- `state.centerTile` DOM reference removed from state.

---

## ✅ Step 4: Scoring and Persistence

With `state.grid[][]` as the source of truth, save/load operates purely on the grid model.

- `saveGame` serializes `state.grid.map(row => [...row])` — no DOM scraping.
- `restoreWorld(gridState)` rebuilds `state.grid` and DOM from the 2D array; `state.rocks` re-derived by scanning the grid.
- `currentTileTable` removed from the save payload — the grid is the world state, and the next level generates a fresh tile table on demand.

---

## Next Steps (Future Architectural Work)

### State Object vs. Module Encapsulation
The `state` object is a pragmatic solution but still mutable and shared globally. A future improvement is to encapsulate state inside modules and expose only getter/setter interfaces, reducing the surface area for accidental mutation.

### Combat and Interaction System (Deferred)
Snake combat and item pickup logic in `player.js` are still ad hoc conditionals. A tile interaction registry — where each tile type registers a handler — would make adding new tile types non-invasive to the core movement function.

Deferred: the current handler functions are already well-named and readable. The registry pattern adds indirection without a concrete benefit until new tile types are actually needed. Revisit if the game is extended.
