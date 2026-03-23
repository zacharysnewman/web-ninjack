# New Game Plus — Implementation Spec

## Overview

New Game Plus (NG+) is a harder second loop of the same 10-level game, unlocked
immediately after winning. Gold carries forward; all other stats reset. The mode
introduces 🦂 Scorpions, 2 holes per level, and a fixed high enemy count from
the first level.

---

## Availability

NG+ is **permanently unlocked** once the player wins the normal game. It does not
reset on death — if you die mid-NG+ run and restart, you can still choose NG+ again.
Only a fresh normal-mode win is required to unlock it in the first place.

### Persistence mechanism

A separate `localStorage` key `ngPlusUnlocked` tracks unlock status, independent
of save data. `clearSave()` does **not** touch this key.

```js
// On normal win:
localStorage.setItem('ngPlusUnlocked', 'true');

// Check anywhere:
const ngPlusUnlocked = localStorage.getItem('ngPlusUnlocked') === 'true';
```

### Where NG+ appears

| Context | Condition | Layout |
|---|---|---|
| Win modal | Always (you just won) | Two buttons: **New Game** + **New Game+** |
| Welcome screen | `ngPlusUnlocked` OR `devMode` | Two buttons: **New Game** + **New Game+** |
| Welcome screen | Neither | Single button: **New Game** (current behavior) |

NG+ is shown **alongside** New Game, not as a replacement. Both options are always
available when NG+ is unlocked.

Dev mode check (readable from any script):
```js
const devMode = new URLSearchParams(window.location.search).get('dev') === 'true';
```

---

## What Carries Over

| Stat | Carries Over? |
|---|---|
| 💰 Gold | ✅ Yes |
| ❤️ Health | No — resets to 5 |
| 🗡️ Swords | No — resets to 0 |
| 🔑 Keys / 🪂 Chute | No — reset |
| ⏺️ Moves | No — fresh counter |
| 🕥 Timer | No — fresh timer |
| Level | No — back to 1 |

---

## New Constants (`constants.js`)

```js
const SCORPION  = "🦂";
const DBL_SWORD = "⚔️";  // worth 2 swords on pickup
```

---

## State Changes (`state.js`)

New private fields and their methods:

```
#ngPlus = false
  → get ngPlus
  → setNgPlus(v)

#scorpionsCount = 0
  → get scorpionsCount
  → incrementScorpionsCount()
  → resetScorpionsCount()
  → setScorpionsCount(n)

#scorpions = []            // { x, y, justSpawned, armored }
  → get scorpions
  → clearScorpions()
  → addScorpion(s)
  → removeScorpion(x, y)
  → getScorpion(x, y)     // returns object for combat armor lookup
  → setScorpions(arr)
```

---

## NG+ Startup (`game.js`)

```js
function startNewGamePlus() {
    const carriedGold = state.gold;
    clearSave();
    state.setPlayer(4, 4);
    state.setGold(carriedGold);       // carry over
    state.resetSwords();
    state.resetHealth();
    state.resetLevel();
    state.resetChutes();
    state.resetMoves();
    state.setSnakesCount(9);          // fixed at 9 for all NG+ levels
    state.resetScorpionsCount();      // 0 → becomes 1 after first advanceLevel()
    state.setNgPlus(true);
    timer.reset();
    timer.start();
    setupLevel(0, 1, 1);
}
```

`advanceLevel()` changes in NG+:
- `snakesCount` is **not incremented** (stays at 9)
- `scorpionsCount` **is incremented** each level (1 → 9 over the run)

---

## Enemy Scaling

`snakesCount` is fixed at 9 for the entire NG+ run. `scorpionsCount` increments
each level via `advanceLevel()`.

| NG+ Level | snakesCount | scorpionsCount | 🐍 in trees | 🦂 in trees |
|---|---|---|---|---|
| 1 | 9 | 1 | 8 | 1 |
| 2 | 9 | 2 | 7 | 2 |
| 3 | 9 | 3 | 6 | 3 |
| 4 | 9 | 4 | 5 | 4 |
| 5 | 9 | 5 | 4 | 5 |
| 6 | 9 | 6 | 3 | 6 |
| 7 | 9 | 7 | 2 | 7 |
| 8 | 9 | 8 | 1 | 8 |
| 9 | 9 | 9 | 0 | 9 |

Snakes in tree loot = `snakesCount - scorpionsCount` = `9 - scorpionsCount`.

---

## Loot Table Changes (`worldGen.js`)

All changes are **NG+ only** (`state.ngPlus` guard). Normal game loot is untouched.

### Holes

| | Normal | NG+ |
|---|---|---|
| Count | 1 | **2** |
| Placement | anywhere | **inner grid only** (see below) |

### Rock loot (15 rocks)

| | Normal | NG+ |
|---|---|---|
| ❤️ Hearts | 2 | **3** (+50%) |
| 🐍 Snakes | 13 | **12** |

### Enemy loot (shared by snakes and scorpions)

The enemy loot table is sized to match exactly the number of killable enemies
so that every enemy drops loot and the table never runs out of entries.

| | Normal | NG+ |
|---|---|---|
| Total table size | `rockSnakes + snakesCount` | `12 + 9 = 21` |
| ❤️ Hearts | 2 | **3** (+50%) |
| 💰 Gold | table size − 2 | table size − 3 |

`rockSnakes` = rocks that contain snakes (not hearts):
- Normal: `13` (15 rocks − 2 heart slots)
- NG+: `12` (15 rocks − 3 heart slots)

So normal table = `13 + snakesCount` (grows 14→22 over the run).
NG+ table = `21` (fixed: 12 rock snakes + 9 tree enemies regardless of
scorpion/snake split — scorpions draw from the same table as snakes).

### Tree loot — swords

| | Normal | NG+ |
|---|---|---|
| 🗡️ Single sword | 5 | **3** |
| ⚔️ Double sword | 0 | **2** |
| Total sword value | 5 | **7** |

Half (floor) of the 5 sword slots become ⚔️. Compensates for scorpions requiring
2 swords to kill.

### Tree loot — enemies (NG+ only)

```
snakeDrops    = Array(9 - state.scorpionsCount).fill(SNAKE)
scorpionDrops = Array(state.scorpionsCount).fill(SCORPION)
```

### treeCount adjustment

With 2 holes in NG+, one tree tile is displaced:

```js
const holeCount = state.ngPlus ? 2 : 1;
const treeCount = totalTiles - playerCount - holeCount - rockCount;
// Normal: 64   NG+: 63
```

`treeCount` becomes a derived value rather than a fixed constant, used in both
`generateLootTable` and `generateTileTable`.

---

## Hole Placement — Inner Grid Only (`worldGen.js`)

To prevent holes from appearing on the outer edge (required for 2-hole NG+,
applied to both modes for consistency), holes are placed **position-aware**
rather than via the shuffled tile table.

**Eligible positions**: x ∈ [1, 7] **and** y ∈ [1, 7] (inner 7×7 = 49 cells),
excluding the player start tile (4, 4).

**Implementation**:
- `generateTileTable()` no longer includes `HOLE` entries. It produces
  `rockCount + treeCount` tiles.
- A new `pickHolePositions(count)` helper randomly selects `count` positions
  from the eligible inner set (without replacement).
- `generateWorld()` places tiles from the tile table into non-hole positions,
  then sets hole tiles at the picked positions.

Hole positions do not need separate state storage — the grid is fully saved
in `saveGame()` via `gridState`.

---

## 🦂 Scorpion Behavior

### Movement

Scorpions move the same as snakes (random direction each turn, one tile).
`moveScorpions()` mirrors `moveSnakes()`.

Both blocked-tile lists must include the other enemy type:
- `canSnakeMoveToTile`: add `SCORPION` to blocked set
- `canScorpionMoveToTile`: add `SNAKE` to blocked set

### Player attacks scorpion (`interactWithScorpion`)

| Player swords | Scorpion state | Result |
|---|---|---|
| ≥ 1 | Armored | Use 1 sword · set `armored = false` · notify 🛡️ · **knockback player** · scorpion stays |
| ≥ 1 | Unarmored | Use 1 sword · kill scorpion · draw enemy loot · notify 💀 |
| 0 | Either | `handleDamage(2, ...)` · notify 💔💔 · scorpion stays |

Two swords to kill a scorpion. Knockback only on the **armor-break hit**.

### Scorpion attacks player (during `moveScorpions`)

```js
handleDamage(2, newX, newY);   // 2 hearts damage
```

### Scorpion loot

On kill, scorpions draw from the same enemy loot table as snakes
(`drawSnakeLoot()`). No separate loot table needed.

---

## Knockback (armor-break hit only)

`direction` is threaded from `move(dir)` → `interactWithOpenTile(x, y, dir)`
→ `interactWithScorpion(x, y, dir)`.

```js
const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };

const backDir = opposite[direction];
const { newX: backX, newY: backY } =
    getNewTileInDirection(backDir, state.playerX, state.playerY);

const atWall = backX === state.playerX && backY === state.playerY;
const backTile = getGridTile(backX, backY);
const knockbackable = ['', COIN, GOLD, GEM, SWORD, DBL_SWORD, HEART, HOLE].includes(backTile);

if (!atWall && knockbackable) {
    notifyKnockbackEcho(backDir, getTileElement(state.playerX, state.playerY));
    if (backTile === HOLE) {
        interactWithHole(backX, backY);   // death or chute-win, same as normal move
    } else {
        if (backTile !== '') interactWithOpenTile(backX, backY, backDir); // collect item
        movePlayerTo(backX, backY);
    }
}
```

**Knockback-eligible tiles**: empty, collectible item, or hole.

| Tile behind player | Result |
|---|---|
| Empty (`''`) | Knockback — player moves |
| Gold / Coin / Gem / ❤️ / 🗡️ / ⚔️ | Knockback — player moves and collects |
| 🕳️ Hole | Knockback — `interactWithHole` fires (death or chute-win) |
| 🌲 Tree / 🪨 Rock | No knockback |
| 🐍 Snake / 🦂 Scorpion | No knockback |
| 🚪 Door / 🔑 Key | No knockback |
| Map edge | No knockback |

### Knockback echo notify (`notifyKnockbackEcho`)

On every successful knockback (including hole knockbacks, before death resolves),
a ghost 🥷 animates from the player's **current tile** in the **knockback direction**
(i.e. away from the scorpion). It is semi-transparent from the start, travels
farther than a normal notify, and fades out faster — a visual echo of the
displacement.

**`ui.js`** — new function:

```js
function notifyKnockbackEcho(direction, sourceElement) {
    const container = document.getElementById('notification-container');
    const rect = sourceElement.getBoundingClientRect();

    const el = document.createElement('div');
    el.textContent = NINJA;
    el.classList.add('knockback-echo');

    const dist = rect.width * 2;   // travel ~2 tile widths
    const translate = {
        up:    `0px, -${dist}px`,
        down:  `0px,  ${dist}px`,
        left:  `-${dist}px, 0px`,
        right: ` ${dist}px, 0px`,
    };
    el.style.setProperty('--kb-translate', translate[direction]);
    el.style.width      = `${rect.width}px`;
    el.style.height     = `${rect.height}px`;
    el.style.fontSize   = `${rect.height * 0.8}px`;
    el.style.lineHeight = `${rect.height}px`;
    el.style.left       = `${rect.left}px`;
    el.style.top        = `${rect.top}px`;

    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
}
```

**`styles.css`** — new keyframe and class:

```css
@keyframes knockbackEcho {
    0%   { transform: translate(0, 0);                      opacity: 0.55; }
    100% { transform: translate(var(--kb-translate));        opacity: 0;    }
}

.knockback-echo {
    position: absolute;
    pointer-events: none;
    animation: knockbackEcho 0.25s ease-out forwards;
}
```

Key differences from the existing `floatUpAndFade` notify:
- Starts at `opacity: 0.55` (already ghosted — it's an echo, not a solid object)
- Direction follows knockback, not always upward
- Duration `0.25s` vs `0.8s` — snappier
- Distance `2 × tile width` vs `1 × tile height` — travels noticeably farther

**Turn cost**: none. Knockback is part of the attack action.
- `incrementMoves()` already fired at top of `move()` — not called again.
- `moveSnakes()` / `moveScorpions()` — not called (early return path, same as
  current snake combat).
- Timer — real-time, unaffected automatically.

---

## Final Boss (NG+, `handleFinalBoss`)

Rocks convert to a mix mirroring the tree loot ratio:
- `scorpionsCount` rocks → 🦂 (armored)
- Remainder → 🐍

Shuffle `state.rocks` before splitting to avoid positional bias (without
shuffling, the top-left rocks always become scorpions since rocks are stored
in row-major order from world generation):

```js
const shuffledRocks = [...state.rocks].sort(() => Math.random() - 0.5);
shuffledRocks.forEach((rock, i) => {
    const isScorpion = i < state.scorpionsCount;
    const enemy = isScorpion ? SCORPION : SNAKE;
    setGridTile(rock.x, rock.y, enemy);
    isScorpion ? addScorpion(rock.x, rock.y) : addSnake(rock.x, rock.y);
});
```

---

## UI Changes

### Inventory display (`ui.js`)

```js
const levelStr = `🚪${state.currentLevel}${state.ngPlus ? '+' : ''}`;
inventory.textContent = `${levelStr} ❤️${state.currentHealth} 🗡${state.swords}${dynamicText}`;
```

Single ASCII `+` — no layout impact at `font-size: 16px`.

### Win modal — two buttons

New `showWinModal(bodyText)` returns a Promise resolving to `'new'` or `'ngplus'`.
Renders two `.modal-button` elements side by side:

```
[ New Game ]   [ New Game+ ]
```

On normal win, also sets `localStorage.setItem('ngPlusUnlocked', 'true')` before
showing the modal.

`handleWin()`:
```js
const choice = await showWinModal(alertMessages.win());
choice === 'ngplus' ? startNewGamePlus() : startNewGame();
```

### Welcome modal — NG+ unlocked or dev mode

In `main()`:
```js
const ngPlusUnlocked = localStorage.getItem('ngPlusUnlocked') === 'true';
if (ngPlusUnlocked || devMode) {
    const choice = await showTwoButtonModal(alertMessages.welcome);
    // showTwoButtonModal: same two-button structure as showWinModal
    if (choice === 'ngplus') startNewGamePlus();
    else startNewGame();
} else {
    await showModal(alertMessages.welcome);
    startNewGame();
}
```

### Win message — gold display

The win message shows **total gold** (carried gold + gold earned during the run)
as a single number. Gold is not broken out separately.

### ⚔️ pickup notification

When the player picks up `DBL_SWORD`, the pickup notification shows **`🗡️🗡️`**
(two separate sword emoji), not `⚔️`.

---

## Save / Load (`save.js`)

Add to `saveData`:
```js
ngPlus:          state.ngPlus,
scorpionsCount:  state.scorpionsCount,
scorpions:       state.scorpions.map(s => ({ x: s.x, y: s.y, armored: s.armored })),
```

Restore in `loadGame()`:
```js
state.setNgPlus(d.ngPlus ?? false);
state.setScorpionsCount(d.scorpionsCount ?? 0);
state.setScorpions((d.scorpions ?? []).map(s => ({ ...s, justSpawned: false })));
```

`restoreWorld()` must also recognise `SCORPION` tiles and call `addScorpion`
(with `armored` restored from scorpions array by position lookup).

---

## Implementation Notes

### `restoreWorld` must rebuild `#scorpions`

`restoreWorld()` in `save.js` iterates the saved grid and calls `addRock` for
`ROCK` tiles. It must also call `addScorpion` for `SCORPION` tiles, restoring the
`armored` value from the saved scorpions array (look up by `{ x, y }` position).
Without this, the visual grid restores correctly but combat breaks — no scorpion
object exists in state to check armor.

### `interactWithOpenTile` — optional `dir` param

`dir` is added as an optional 3rd parameter. It is only used in the scorpion
branch. All existing call sites pass 2 arguments and are unaffected.

### Enemy freeze during scorpion combat

`moveSnakes()` and `moveScorpions()` are not called when the player attacks a
scorpion — same as current snake combat behavior. All enemies freeze for the
turn during any melee interaction. This is intentional.

### `ngPlusUnlocked` vs `ngPlus` in save

- `ngPlusUnlocked` — `localStorage` key, never cleared, tracks whether the
  feature is accessible. Set when winning a normal run.
- `ngPlus` — in save data, tracks whether the **current run** is NG+. Cleared
  with save data on death/new game, restored on load.

## New / Modified Files Summary

| File | Changes |
|---|---|
| `constants.js` | Add `SCORPION`, `DBL_SWORD` |
| `state.js` | `#ngPlus`, `#scorpionsCount`, `#scorpions[]` + all getters/setters |
| `worldGen.js` | `holeCount`/`treeCount` derived per mode; `pickHolePositions()`; hole-free tile table; NG+ loot variants (hearts, ⚔️, scorpion slots) |
| `snake.js` | `addScorpion()`, `killScorpion()`, `moveScorpions()`, `canScorpionMoveToTile()`; add `SCORPION` to `canSnakeMoveToTile` blocked list |
| `player.js` | `interactWithScorpion(x, y, dir)`; `DBL_SWORD` pickup (+2 swords); `SCORPION` branch in `interactWithVegetation`; thread `dir` through `interactWithOpenTile` |
| `game.js` | `startNewGamePlus()`; `handleWin()` modal branching; `advanceLevel()` scorpion increment (no snake increment in NG+); NG+ final boss mix |
| `ui.js` | `+` suffix in inventory; `showWinModal()` two-button variant; dev mode `showWelcomeModal()`; win message variants |
| `save.js` | Persist/restore `ngPlus`, `scorpionsCount`, `scorpions` (with `armored`); `restoreWorld` handles `SCORPION` tiles |
| `index.html` | Bump `app.js` and `styles.css` version query params after all changes |
| `styles.css` | Two-button modal layout (buttons side-by-side); `knockbackEcho` keyframe + `.knockback-echo` class |
