# Known Bugs

## Final Boss: Enemies Spawn on Already-Revealed Rock Tiles (Level 10 / 10+)

**Description:**
`handleFinalBoss()` in `game.js` iterates over `state.rocks` and spawns an enemy at every position in that array. However, `state.rocks` is never pruned when a rock is revealed during normal play — `addRock()` populates it at level generation and `clearRocks()` only runs at level setup. As a result, if the player has already dug up one or more rocks before the boss trigger fires, enemies are still spawned at those now-empty (or loot-containing) tile positions, overwriting whatever tile was there.

The trigger differs by mode:
- **Level 10 (normal):** triggered by collecting the chute (`interactWithOpenTile` → `handleFinalBoss()`). All remaining rocks burst open as snakes.
- **Level 10+ (NG+):** triggered by collecting the **house key** from a tree (`interactWithVegetation` → `handleFinalBoss()`). All remaining rocks burst open as crabs (🦀) plus **one scorpion boss** (🦂, randomly assigned from the remaining rocks).

**Level 10+ Boss Sequence (new design):**
1. Player collects 🗝️ from a tree (the final tree loot slot on level 10+, replacing the chute).
2. The house tile changes from 🏡 → 🏚️ (`HOUSE_DAMAGED`) with a ⚡️ notify on the house tile. The house is now non-interactive (treated as a blocked wall tile).
3. All remaining rocks burst open: `(remaining rocks - 1)` crabs (🦀) + 1 scorpion boss (🦂), randomly assigned among rock positions.
4. **Player kills the scorpion boss:**
   - All remaining crabs and snakes on the board are instantly removed (no loot awarded; use `state.removeCrab/removeSnake` directly, bypassing the player-kill loot path).
   - The house tile changes from 🏚️ → 🏡 with another ⚡️ notify on the house tile.
   - The house is now unlockable.
5. Player walks into 🏡 while holding the house key → `handleWin()`.

**Steps to Reproduce (stale rocks bug):**
1. Reach level 10 normal (or level 10+).
2. Dig up one or more rocks before the boss trigger.
3. Trigger the boss (collect the chute on 10 normal; collect the house key on 10+).
4. Observe that enemies appear on tiles where rocks were already dug, overwriting those tiles.

**Root Cause:**
`handleFinalBoss()` (`game.js:34–51`) iterates `state.rocks` without first filtering for positions that still hold a `ROCK` tile. `state.rocks` accumulates rock positions at world-gen time and is never updated when `interactWithVegetation()` (`player.js:135–142`) reveals a rock. There is no call to remove a rock from `state.rocks` when a rock tile is dug up.

**Fix:** Add `state.removeRock(x, y)` to `state.js` and call it inside `interactWithVegetation()` when a rock is revealed. `handleFinalBoss()` can then trust that `state.rocks` only contains positions that are still `ROCK` tiles, so no additional filtering is required at boss-trigger time.

**Scorpion Boss Stats:**
The scorpion boss (🦂) has **2 shields + 1 health = 3 total hits** to kill, vs regular crabs which have 1 shield + 1 health = 2 hits. The existing `armored` field is a boolean (`true`/`false`), which only supports one shield level. It must be changed to a **numeric armor counter**:
- Regular crabs: `armored: 1`
- Boss scorpion: `armored: 2`
- Hit logic in `interactWithScorpion()` (`player.js:68`): change `scorpion.armored = false` → `scorpion.armored--`; change `if (scorpion.armored)` → `if (scorpion.armored > 0)` (already works since any positive number is truthy, but explicit is clearer)
- `save.js` saves `armored` as a value; numeric saves fine with no migration needed.

**Affected Files:**
- `scripts/game.js` — `handleFinalBoss()`: NG+ path spawns crabs + 1 scorpion boss (with `armored: 2`); add boss-kill handler that mass-removes remaining enemies and restores house tile
- `scripts/state.js` — add `removeRock(x, y)` method; boss-active state can be inferred from `HOUSE_DAMAGED` tile presence (no extra flag needed)
- `scripts/player.js` — `interactWithVegetation()` calls `state.removeRock(x, y)` when rock is revealed; collecting `HOUSE_KEY` from a tree calls `handleFinalBoss()` on level 10+; `interactWithScorpion()` uses `armored--` instead of `armored = false`
- `scripts/snake.js` — `addScorpion()` uses `armored: 1` for regular crabs (replacing `true`)
- `scripts/constants.js` — add `HOUSE_DAMAGED = "🏚️"`

---

## Notify: Multi-Icon Notifications Stack Vertically Instead of Side by Side

**Description:**
When picking up a ⚔️ (`DBL_SWORD`) or being hit by a scorpion (2 damage), the notification should show icons side by side (e.g. `🗡🗡`, `💔💔`). Instead they stack vertically — one icon per line.

**Steps to Reproduce (⚔️):**
1. Find and walk into a ⚔️ tile.
2. Observe the `🗡🗡` notification floats up with one sword on top of the other.

**Steps to Reproduce (scorpion hit):**
1. Walk into an unarmored 🦂 tile without a sword equipped.
2. Observe the `💔💔` damage notification stacks vertically.

**Root Cause:**
Two separate issues:

1. **⚔️ pickup** (`player.js:153`): `collectItem` is called with `SWORD + SWORD` (`"🗡🗡"`) as the emoji string. `notify()` (`ui.js:18`) creates a div sized to a single tile (`width = rect.width`) with no `white-space: nowrap`, so the two-character string wraps to two lines.

2. **Scorpion hit** (`game.js:5–13`): `handleDamage(damage, x, y)` always calls `notify(DAMAGE, ...)` — a single `💔` — regardless of the `damage` value. A scorpion deals 2 damage (`player.js:98`) but only shows one heart. It should pass `DAMAGE.repeat(damage)` (or equivalent) so a 2-damage hit shows `💔💔`. Once that string is passed, the same vertical-stacking problem in `notify()` applies.

**Affected Files:**
- `scripts/ui.js` — `notify()` needs `white-space: nowrap` (or similar) on the notification element
- `scripts/game.js` — `handleDamage()` should scale the icon count to the damage amount
- `scripts/player.js` — `collectItem()` call for `DBL_SWORD` already passes `SWORD + SWORD` (correct intent, wrong rendering)

**Implementation Note:**
`white-space: nowrap` alone will not fix the stacking. `notify()` sets `emojiElement.style.width = rect.width` (one tile width), so the multi-character string still overflows that fixed width. The element's width must also be changed to `auto` (or `max-content`) so it expands to fit the content; the centering math (`x = rect.left + rect.width / 2 - emojiRect.width / 2`) already handles variable widths correctly after the `getBoundingClientRect()` call.

---

## Scorpion Emoji Should Be Crab (🦀)

**Description:**
The enemy currently displayed as 🦂 (scorpion) should be displayed as 🦀 (crab).

**Root Cause:**
`SCORPION = "🦂"` is defined in `constants.js:3`. The constant, its value, and all references throughout the codebase need to be renamed/revalued to use the crab emoji and a `CRAB` identifier.

**Affected Files:**
- `scripts/constants.js` — `SCORPION` definition
- `scripts/game.js` — references to `SCORPION` and `scorpionsCount`
- `scripts/worldGen.js` — references to `SCORPION` and `scorpionsCount`
- `scripts/player.js` — references to `SCORPION`
- `scripts/snake.js` — `addScorpion`, `scorpionMove`, etc.
- `scripts/state.js` — `scorpionsCount`, `scorpions` fields and methods
- `scripts/save.js` — scorpion save/load logic


---

## NG+ Trees Should Use Deciduous Emoji (🌳)

**Description:**
In New Game+, trees should display as 🌳 instead of 🌲 to visually distinguish NG+ from normal mode.

**Root Cause:**
`TREE = "🌲"` is a single constant in `constants.js:5` used everywhere. NG+ needs its own tree constant (e.g. `TREE_NG = "🌳"`) and all world-generation, rendering, and interaction code needs to use `TREE_NG` when `state.ngPlus` is true. Affected logic includes `generateTileTable()`, `generateWorld()`, `interactWithVegetation()` (reveal notification), `canSnakeMoveToTile()`, `canScorpionMoveToTile()`, and the `tileValue === TREE` check in `handleMove()`.

**Affected Files:**
- `scripts/constants.js` — add `TREE_NG = "🌳"`
- `scripts/worldGen.js` — `generateTileTable()`, `generateWorld()`
- `scripts/player.js` — `interactWithVegetation()`, `handleMove()`
- `scripts/snake.js` — `canSnakeMoveToTile()`, `canScorpionMoveToTile()`

**move() reference:** The bug lists `handleMove()` but the actual function in `player.js` is `move()`. Confirm the function name when implementing.

---

## NG+ Should Have 1 Hole + 1 House (🏡) Instead of 2 Holes

**Description:**
In New Game+, the second hole should be replaced by a house tile 🏡. The house acts like a locked door — the player cannot enter it until they hold the house key 🗝️. The house key is only available on Level 10+ and is the **final tree loot slot** (replacing the chute). On all other NG+ levels (1+–9+) the house is present but the key never appears, so it cannot be entered.

**Details:**
- Normal NG+ levels (1+–9+): world has 1 hole + 1 house; house key does not appear in loot → house is permanently locked that run.
- Level 10+: the house key 🗝️ is placed as the last slot of the tree loot table (replacing the chute). Collecting it from a tree triggers the final boss sequence (see Final Boss bug).
- After the boss is defeated the house becomes unlockable. Entering it triggers `handleWin()`.
- The house key 🗝️ is a distinct constant from the regular door key 🔑 (`KEY`).
- Enemies (snakes, crabs) should not be able to move onto the house tile in any state.

**House Visual States:**
The house tile uses two emoji constants:
- `HOUSE` (🏡) — used in **all** accessible states: initially locked, and again after the boss is defeated (unlockable). The tile never changes emoji to reflect locked vs unlocked; `interactWithHouse()` checks `state.houseLocked` at walk-in time: if locked, shows a notify and does nothing; if unlocked, calls `handleWin()`.
- `HOUSE_DAMAGED` (🏚️) — used **only during the boss fight** (set when the house key is collected from a tree). Non-interactive: `move()` treats it as a blocked tile; the player cannot move onto it at all.

The transition back from 🏚️ → 🏡 happens when the scorpion boss is killed, accompanied by a ⚡️ notify. At that point `state.houseLocked` is also set to `false`.

**Root Cause:**
`worldGen.js:22` and `worldGen.js:123` use `holeCount = state.ngPlus ? 2 : 1`, placing two `HOLE` tiles. There is no `HOUSE` / `HOUSE_DAMAGED` constant, no house-placement logic, no house-key constant, no house interaction handler, and no tree-loot slot for the house key on level 10+.

**Affected Files:**
- `scripts/constants.js` — add `HOUSE = "🏡"`, `HOUSE_DAMAGED = "🏚️"`, `HOUSE_KEY = "🗝️"`
- `scripts/worldGen.js` — `generateTileTable()`, `generateWorld()` (place 1 hole + 1 house via `pickHolePositions(2)`); `generateLootTable()` places `HOUSE_KEY` as the last slot on level 10+ (instead of `CHUTE`)
- `scripts/player.js` — add `interactWithHouse()` handler; `move()` dispatches on `HOUSE` (calls `interactWithHouse()`) and treats `HOUSE_DAMAGED` as impassable; collecting `HOUSE_KEY` from a tree calls `handleFinalBoss()`
- `scripts/snake.js` — add `HOUSE` and `HOUSE_DAMAGED` to blocked tiles in `canSnakeMoveToTile()` and `canCrabMoveToTile()`
- `scripts/state.js` — add `houseLocked` (bool) field and setter; add `houseKeys` (int) field and `giveHouseKey()` / `resetHouseKeys()` methods
- `scripts/ui.js` — show house key in inventory when held
- `scripts/save.js` — persist `houseLocked` and `houseKeys`

**Implementation Notes:**
- The house must be placed **visibly** from the start (like the hole), not hidden inside a tree or rock. Call `pickHolePositions(2)` and assign one returned position to `HOLE` and the other to `HOUSE`; both are excluded from the tile table via `holeSet`.
- `save.js` needs `houseLocked` and `houseKeys` added to the save payload once those fields exist on `state`.

---

## NG+ Tree Enemy Spawn Counts Are Wrong

**Description:**
In New Game+, the number of crabs (currently scorpions) and snakes hidden in **trees** should scale with the level number, capping the total at 10. Currently, `snakesCount` is fixed at 9 for all NG+ levels and `scorpionsCount` increments by 1 per level with no cap (`worldGen.js:61–62`), so the total can exceed 9 and the ratio is wrong.

**Expected tree enemy counts per NG+ level:**

| Level | Crabs | Snakes | Total |
|-------|-------|--------|-------|
| 1+    | 1     | 5      | 6     |
| 2+    | 2     | 6      | 8     |
| 3+    | 3     | 7      | 10    |
| 4+    | 4     | 6      | 10    |
| 5+    | 5     | 5      | 10    |
| 6+    | 6     | 4      | 10    |
| 7+    | 7     | 3      | 10    |
| 8+    | 8     | 2      | 10    |
| 9+    | 9     | 1      | 10    |
| 10+   | 10    | 0      | 10    |

- Crabs = `currentLevel` (1-indexed display level)
- Snakes = `min(4 + currentLevel, 10 - currentLevel)`
- Total = `min(6 + 2*(currentLevel-1), 10)`, capped at 10 from level 3+ onward
- Rock enemy spawns are **not** affected — rocks should use the same loot table as normal mode.

**Root Cause:**
`startNewGamePlus()` (`game.js:114`) initialises `snakesCount = 9` and `scorpionsCount = 0`. `advanceLevel()` (`game.js:123–124`) increments only `scorpionsCount`. `generateLootTable()` (`worldGen.js:61–62`) uses `9 - state.scorpionsCount` snakes and `state.scorpionsCount` crabs, keeping total fixed at 9 and never applying the level-based formula above. `generateRockLootTable()` (`worldGen.js:44–47`) adds extra hearts in NG+ which also needs to revert to normal-mode behaviour.

**Affected Files:**
- `scripts/game.js` — `startNewGamePlus()`, `advanceLevel()`
- `scripts/worldGen.js` — `generateLootTable()`, `generateRockLootTable()`, `generateSnakeLootTable()`
- `scripts/state.js` — `snakesCount` / `scorpionsCount` initialisation and increment logic

**Clarification — Rock Loot Scope:**
"Same as normal mode" for rock loot applies to NG+ levels **1+–9+ only**. On level 10+, all rocks produce crabs (handled by the Crabs Loot Pool bug). `generateRockLootTable()` will need a `state.ngPlus && state.currentLevel === 9` branch for the all-crabs case; this bug's revert covers the 1+–9+ path only.

---

## Crabs Should Have a Separate Loot Pool

**Description:**
Crabs currently share `snakeLootTable` with snakes — both call `state.drawSnakeLoot()` on death and drop either `GOLD` (💰) or `HEART` (❤️). Crabs should draw from their own loot pool and drop `RING` (💍, worth 20 gold) or `HEART` (❤️) instead.

**Expected Behaviour:**
- All crabs draw from a new `crabLootTable` on player-kill: `RING` or `HEART` drops.
- `RING` (💍) is a new constant worth 20 gold, collected via `collectGold(x, y, 20)`.
- Crabs killed by the boss-death sweep (see Final Boss bug) are removed from the board without awarding any loot — the `state.removeCrab()` path is called directly, bypassing the player-kill loot draw.
- Snakes continue to draw from `snakeLootTable` (GOLD / HEART) unchanged.

**Root Cause:**
`player.js:92` calls `state.drawSnakeLoot()` when a crab is killed — the same table used for snakes. There is no `crabLootTable`, no `drawCrabLoot()`, and no `generateCrabLootTable()`.

**Required Changes:**
- Add `RING = "💍"` to `constants.js`; add `collectGold` handling for value 20 in `player.js:interactWithOpenTile` (e.g. `if (tileValue === RING) { collectGold(x, y, 20); }`)
- Add `generateCrabLootTable()` in `worldGen.js` — drops are `RING` and `HEART`
- Add `crabLootTable` / `crabLootIndex`, `drawCrabLoot()`, `setCrabLootTable()`, `restoreCrabLoot()` to `state.js`
- Update the crab-kill path in `player.js:88–93` to call `drawCrabLoot()` instead of `drawSnakeLoot()`
- Update `save.js` to persist `crabLootTable` / `crabLootIndex`

**Affected Files:**
- `scripts/constants.js` — add `RING = "💍"`
- `scripts/worldGen.js` — add `generateCrabLootTable()`; call it from `setupLevel()` alongside `generateSnakeLootTable()`
- `scripts/state.js` — add crab loot table fields and draw methods
- `scripts/player.js` — crab-kill path draws from `crabLootTable`; `interactWithOpenTile()` handles `RING`
- `scripts/save.js` — persist `crabLootTable`/`crabLootIndex` (currently only `{ x, y, armored }` is saved for scorpions — `save.js:28`)

**Crab loot table composition:** 6 of the total entries are `HEART`; the remainder are `RING`. For example, on level 10+ with 10 tree-crabs: 6 hearts + 4 rings.

---

## Level 10+ Should Have No Key, No Parachute, and a Lethal Hole

**Description:**
On level 10+ (NG+ final level), the normal key (🔑) and parachute (🪂) should not appear in the loot table. Instead the house key (🗝️) occupies the final tree loot slot. The hole (🕳️) remains on the board and is always lethal. The win condition on level 10+ is entering the house (🏡) after the boss fight, not using a parachute. Level 10 (non-NG+) is unaffected.

**Expected Behaviour:**
- Level 10 (normal): unchanged — chute appears in tree loot as the last slot, door and key are absent, chute win applies.
- Level 10+ (NG+): `chuteCount = 0`, `doorCount = 0`, `keyCount = 0`, `houseKeyCount = 1` — house key replaces chute as the final tree loot slot; hole kills on contact.

**Root Cause:**
`advanceLevel()` (`game.js:129–133`) checks `isFinalLevel = state.currentLevel === 9` and always sets `chuteCount = 1, doorCount = 0, keyCount = 0` when true, regardless of `state.ngPlus`. `generateLootTable()` and `setupLevel()` have no concept of `houseKeyCount`.

`interactWithHole()` (`player.js:123–133`) already kills the player when `state.currentChutes === 0`, so no change is needed there.

**Required Changes:**
1. `advanceLevel()` (`game.js`): split the final-level logic by NG+ flag:

```js
const isFinalLevel = state.currentLevel === 9;
let chuteCount, doorCount, keyCount, houseKeyCount = 0;
if (isFinalLevel && state.ngPlus) {
    chuteCount = 0; doorCount = 0; keyCount = 0; houseKeyCount = 1;
} else if (isFinalLevel) {
    chuteCount = 1; doorCount = 0; keyCount = 0;
} else {
    chuteCount = 0; doorCount = 1; keyCount = 1;
}
setupLevel(chuteCount, doorCount, keyCount, houseKeyCount);
```

2. `generateLootTable(chuteCount, houseKeyCount)` (`worldGen.js`): append `houseKeyCount` entries of `HOUSE_KEY` at the end of the shuffled loot table (after all tree-enemy entries, same position the chute occupies on normal level 10).

3. `setupLevel(chuteCount, doorCount, keyCount, houseKeyCount = 0)` (`game.js`): thread `houseKeyCount` through to `generateLootTable()`.

**Affected Files:**
- `scripts/game.js` — `advanceLevel()`, `setupLevel()`
- `scripts/worldGen.js` — `generateLootTable()`

---

## House Key Should Appear in the Inventory UI

**Description:**
The inventory bar (`ui.js:updateGoldDisplay`) shows `🪂N` when the player holds a parachute, and `🔑N` for regular keys. When the player collects the house key (🗝️) on level 10+, it should appear in the same area of the inventory bar. Currently `HOUSE_KEY` has no display logic and would be invisible in the UI after collection.

**Expected Behaviour:**
Display priority (left to right in the dynamic slot) should be:
1. `🪂N` — if player holds a chute (only relevant on normal level 10)
2. `🗝️N` — if on level 10+ (`state.ngPlus && state.currentLevel === 9`); shows `🗝️0` before collecting and `🗝️1` after, mirroring how `🔑0` shows on normal level 10 before the key is found
3. `🔑N` — all other levels (regular key count)

**Root Cause:**
`updateGoldDisplay()` (`ui.js:12–14`) uses a single ternary:
```js
const dynamicText = state.currentChutes > 0 ? ` 🪂${state.currentChutes}` : `🔑${state.currentKeys}`;
```
There is no branch for `state.houseKeys`.

**Required Change:**
```js
const dynamicText = state.currentChutes > 0
    ? ` 🪂${state.currentChutes}`
    : (state.ngPlus && state.currentLevel === 9)
        ? ` 🗝️${state.houseKeys}`
        : ` 🔑${state.currentKeys}`;
```

**Affected Files:**
- `scripts/ui.js` — `updateGoldDisplay()`
- `scripts/state.js` — depends on `houseKeys` field being added (see NG+ House bug)
