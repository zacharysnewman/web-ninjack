# Known Bugs

## Final Boss: Enemies Spawn on Already-Revealed Rock Tiles (Level 10 / 10+)

**Description:**
When the player picks up the chute on level 10 (or 10+), `handleFinalBoss()` in `game.js` iterates over `state.rocks` and spawns an enemy at every position in that array. However, `state.rocks` is never pruned when a rock is revealed during normal play — `addRock()` populates it at level generation and `clearRocks()` only runs at level setup. As a result, if the player has already dug up one or more rocks before reaching the chute, enemies are still spawned at those now-empty (or loot-containing) tile positions, overwriting whatever tile was there.

**Steps to Reproduce:**
1. Reach level 10 (or start a New Game+ run and reach level 10+).
2. Dig up one or more rocks before collecting the chute.
3. Collect the chute to trigger the final boss sequence.
4. Observe that enemies appear on tiles where rocks were already revealed, rather than only on tiles that are still rocks.

**Root Cause:**
`handleFinalBoss()` (`game.js:34–51`) iterates `state.rocks` without first filtering for positions that still hold a `ROCK` tile. `state.rocks` accumulates rock positions at world-gen time and is never updated when `interactWithVegetation()` (`player.js:135–142`) reveals a rock. There is no call to remove a rock from `state.rocks` when a rock tile is dug up.

**Affected Files:**
- `scripts/game.js` — `handleFinalBoss()`
- `scripts/state.js` — no `removeRock()` method exists
- `scripts/player.js` — `interactWithVegetation()` does not update `state.rocks`

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

---

## NG+ Should Have 1 Hole + 1 House (🏡) Instead of 2 Holes

**Description:**
In New Game+, the second hole should be replaced by a house tile 🏡. The house acts like a locked door — the player cannot enter it until they hold the house key 🗝️. The house key is only available on Level 10+ and spawns exclusively from a rock whose loot is a crab (i.e. only one specific rock on that level drops the house key instead of its normal rock-loot crab). On all other NG+ levels (1+–9+) the house is present but the key is unobtainable, so it cannot be entered.

**Details:**
- Normal NG+ levels (1+–9+): world has 1 hole + 1 house; house key does not exist yet → house is permanently locked that run.
- Level 10+: one specific crab that spawns from a rock drops the 🗝️ house key when killed; collecting it unlocks the house.
- Entering the unlocked house triggers the NG+ win condition (same as the hole/chute win today).
- The house key 🗝️ is a distinct constant from the regular door key 🔑 (`KEY`).
- Enemies (snakes, crabs) should not be able to move onto the house tile.

**Root Cause:**
`worldGen.js:22` and `worldGen.js:123` use `holeCount = state.ngPlus ? 2 : 1`, placing two `HOLE` tiles. There is no `HOUSE` constant, no house-placement logic, no house-key constant, no house interaction handler, and no rock-loot override for level 10+.

**Affected Files:**
- `scripts/constants.js` — add `HOUSE = "🏡"`, `HOUSE_KEY = "🗝️"`
- `scripts/worldGen.js` — `generateTileTable()`, `generateWorld()` (place 1 hole + 1 house in NG+)
- `scripts/player.js` — add `interactWithHouse()` handler; update `handleMove()` to dispatch on `HOUSE`; add house-key collect path; one crab on level 10+ drops `HOUSE_KEY` on death instead of its normal drop
- `scripts/snake.js` — add `HOUSE` to blocked tiles in `canSnakeMoveToTile()` and `canScorpionMoveToTile()`
- `scripts/state.js` — track house-locked state and house-key inventory
- `scripts/ui.js` — show house key in inventory when held
- `scripts/save.js` — persist house-locked state and house-key count

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
