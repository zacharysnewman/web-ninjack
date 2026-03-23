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
