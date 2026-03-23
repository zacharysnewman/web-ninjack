# Known Bugs

## Final Boss: Enemies Spawn on Already-Revealed Rock Tiles (Level 10 / 10+)

**Status: Fixed ✅**

**Description:**
`handleFinalBoss()` in `game.js` iterates over `state.rocks` and spawns an enemy at every position in that array. However, `state.rocks` is never pruned when a rock is revealed during normal play — `addRock()` populates it at level generation and `clearRocks()` only runs at level setup. As a result, if the player has already dug up one or more rocks before the boss trigger fires, enemies are still spawned at those now-empty (or loot-containing) tile positions, overwriting whatever tile was there.

The trigger differs by mode:
- **Level 10 (normal):** triggered by collecting the chute (`interactWithOpenTile` → `handleFinalBoss()`). All remaining rocks burst open as snakes.
- **Level 10+ (NG+):** triggered by collecting the **house key** from a tree (`interactWithVegetation` → `handleFinalBossNG()`). All remaining rocks burst open as crabs (🦀) plus **one scorpion boss** (🦂, randomly assigned from the remaining rocks).

**Level 10+ Boss Sequence (new design):**
1. Player collects 🗝️ from a tree (the final tree loot slot on level 10+, replacing the chute).
2. The house tile changes from 🏠 → 🏚️ (`HOUSE_DAMAGED`) with a ⚡️ notify on the house tile. The house is now non-interactive (treated as a blocked wall tile).
3. All remaining rocks burst open: `(remaining rocks - 1)` crabs (🦀) + 1 scorpion boss (🦂), randomly assigned among rock positions.
4. **Player kills the scorpion boss:**
   - All remaining crabs and snakes on the board are instantly removed (no loot awarded; use `state.removeCrab/removeSnake` directly, bypassing the player-kill loot path).
   - The house tile changes from 🏚️ → 🏠 with another ⚡️ notify on the house tile.
   - The house is now unlockable.
5. Player walks into 🏠 while holding the house key → `handleWin()`.

**Fix Applied:**
- Added `state.removeRock(x, y)` to `state.js`
- `interactWithVegetation()` calls `state.removeRock(newX, newY)` whenever a rock is revealed
- `handleFinalBoss()` (normal) trusts `state.rocks` is current; calls `state.clearRocks()` after burst
- Added `handleFinalBossNG()` in `game.js` for the NG+ boss sequence
- Added `handleBossKill()` in `game.js` for sweeping crabs/snakes and restoring house
- Boss scorpion (`armored: 2`) created via `addBoss()` in `snake.js`

**Scorpion Boss Stats:**
The scorpion boss (🦂) has **2 shields + 1 health = 3 total hits** to kill, vs regular crabs which have 1 shield + 1 health = 2 hits. The `armored` field is now a **numeric armor counter**:
- Regular crabs: `armored: 1`
- Boss scorpion: `armored: 2`
- Hit logic in `interactWithCrabOrBoss()` (`player.js`): `crab.armored--`; `if (crab.armored > 0)` for armor check

**Affected Files:**
- `scripts/game.js` — `handleFinalBoss()`, `handleFinalBossNG()`, `handleBossKill()`
- `scripts/state.js` — `removeRock(x, y)` method added
- `scripts/player.js` — `interactWithVegetation()` calls `state.removeRock()`; `interactWithCrabOrBoss()` uses `armored--`
- `scripts/snake.js` — `addBoss()` uses `armored: 2`; `addCrab()` uses `armored: 1`

---

## Notify: Multi-Icon Notifications Stack Vertically Instead of Side by Side

**Status: Fixed ✅**

**Description:**
When picking up a ⚔️ (`DBL_SWORD`) or being hit by a scorpion (2 damage), the notification should show icons side by side (e.g. `🗡🗡`, `💔💔`). Instead they stack vertically — one icon per line.

**Fix Applied:**
- `notify()` (`ui.js`): changed `width = rect.width` → `width = 'auto'` and added `whiteSpace = 'nowrap'` so the element expands to fit multi-character content
- `handleDamage()` (`game.js`): changed `notify(DAMAGE, ...)` → `notify(DAMAGE.repeat(damage), ...)` so 2-damage hits show `💔💔`

**Affected Files:**
- `scripts/ui.js` — `notify()` uses `width: auto; white-space: nowrap`
- `scripts/game.js` — `handleDamage()` scales icon count to damage amount

---

## Scorpion Emoji Should Be Crab (🦀)

**Status: Fixed ✅**

**Description:**
The regular enemy previously displayed as 🦂 (scorpion) is now displayed as 🦀 (crab). The 🦂 emoji is reserved for the NG+ level 10+ boss scorpion.

**Fix Applied:**
- Added `CRAB = "🦀"` to `constants.js`; kept `SCORPION = "🦂"` for the boss
- All regular armored enemies renamed to "crab" throughout the codebase
- `state.scorpions` → `state.crabs`; all scorpion methods renamed to crab equivalents
- `snake.js`: `addScorpion()` → `addCrab()` (armored: 1); `scorpionMove()` → `crabMove()`; `killScorpion()` → `killCrab()`; `moveScorpions()` → `moveCrabs()`; crab entity stores `tile` field (CRAB or SCORPION) for correct emoji when moving
- `player.js`: `interactWithScorpion()` merged into `interactWithCrabOrBoss()` which handles both CRAB and SCORPION tiles
- `save.js`: field renamed from `scorpions` to `crabs`; legacy `scorpions` field still loaded for backwards compat

**Affected Files:**
- `scripts/constants.js`, `scripts/game.js`, `scripts/worldGen.js`, `scripts/player.js`, `scripts/snake.js`, `scripts/state.js`, `scripts/save.js`

---

## NG+ Trees Should Use Deciduous Emoji (🌳)

**Status: Fixed ✅**

**Description:**
In New Game+, trees display as 🌳 instead of 🌲 to visually distinguish NG+ from normal mode.

**Fix Applied:**
- Added `TREE_NG = "🌳"` to `constants.js`
- `generateTileTable()` (`worldGen.js`): fills tree tiles with `TREE_NG` when `state.ngPlus`
- `canSnakeMoveToTile()` and `canCrabMoveToTile()` (`snake.js`): both `TREE` and `TREE_NG` are blocked
- `checkForMissingKey()` (`player.js`): checks for both `TREE` and `TREE_NG`
- `move()` (`player.js`): handles `TREE_NG` alongside `TREE` for vegetation interaction
- `interactWithVegetation()` (`player.js`): notification shows `TREE_NG` when `state.ngPlus`

**Affected Files:**
- `scripts/constants.js`, `scripts/worldGen.js`, `scripts/player.js`, `scripts/snake.js`

---

## NG+ Should Have 1 Hole + 1 House (🏠) Instead of 2 Holes

**Status: Fixed ✅**

**Description:**
In New Game+, the second hole is replaced by a house tile 🏠. The house acts like a locked door — the player cannot enter it until they hold the house key 🗝️ and the boss has been defeated. On all NG+ levels 1+–9+ the house is permanently locked (key never appears). On level 10+, defeating the boss unlocks the house and entering it triggers `handleWin()`.

**House Visual States:**
- `HOUSE` (🏠) — locked (1+–9+, and again after boss defeated on 10+). `interactWithHouse()` checks `state.houseLocked`.
- `HOUSE_DAMAGED` (🏚️) — only during the boss fight on level 10+. Non-interactive (impassable).

**Fix Applied:**
- Added `HOUSE = "🏠"`, `HOUSE_DAMAGED = "🏚️"`, `HOUSE_KEY = "🗝️"` to `constants.js`
- `generateWorld()` (`worldGen.js`): on NG+, `pickHolePositions(2)` returns two positions; first = HOLE, second = HOUSE
- `generateTileTable()` (`worldGen.js`): uses `specialCount = 2` on NG+ to correctly calculate tree count
- `state.js`: added `houseLocked` (bool), `lockHouse()`, `unlockHouse()`, `houseKeys` (int), `giveHouseKey()`, `resetHouseKeys()`, `setHouseLocked()`, `setHouseKeys()`
- `setupLevel()` (`game.js`): calls `state.lockHouse()` and `state.resetHouseKeys()` each level
- `move()` (`player.js`): dispatches `HOUSE` → `interactWithHouse()`; `HOUSE_DAMAGED` is impassable
- `interactWithHouse()` (`player.js`): locked = LOCK notify; unlocked = `handleWin()`
- `canSnakeMoveToTile()` / `canCrabMoveToTile()` (`snake.js`): both HOUSE and HOUSE_DAMAGED are blocked
- `save.js`: persists `houseLocked` and `houseKeys`

**Affected Files:**
- `scripts/constants.js`, `scripts/worldGen.js`, `scripts/player.js`, `scripts/snake.js`, `scripts/state.js`, `scripts/ui.js`, `scripts/save.js`, `scripts/game.js`

---

## NG+ Tree Enemy Spawn Counts Are Wrong

**Status: Fixed ✅**

**Description:**
In New Game+, crabs and snakes hidden in trees now scale correctly with the level number, capping at 10 total.

**Correct tree enemy counts per NG+ level:**

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

Formula: `crabsInTrees = displayLevel`; `snakesInTrees = max(0, min(4 + displayLevel, 10 - displayLevel))`

**Fix Applied:**
- Removed hardcoded `snakesCount = 9` / `scorpionsCount` tracking from `startNewGamePlus()` / `advanceLevel()`
- `generateLootTable()` and `generateSnakeLootTable()` (`worldGen.js`): compute counts from `state.currentLevel + 1` (display level) at generation time
- `generateRockLootTable()` (`worldGen.js`): reverted NG+ 1+–9+ to normal-mode rock loot (2 hearts + 13 snakes); level 10+ produces all crabs

**Affected Files:**
- `scripts/game.js`, `scripts/worldGen.js`, `scripts/state.js`

---

## Crabs Should Have a Separate Loot Pool

**Status: Fixed ✅**

**Description:**
Crabs now draw from their own `crabLootTable` on death, dropping `RING` (💍, worth 20 gold) or `HEART` (❤️) instead of sharing the snake loot pool.

**Fix Applied:**
- Added `RING = "💍"` to `constants.js`
- Added `generateCrabLootTable()` (`worldGen.js`): 6 hearts + remainder rings, sized to all crabs on the level
- Added `crabLootTable` / `crabLootIndex`, `setCrabLootTable()`, `drawCrabLoot()`, `restoreCrabLoot()` to `state.js`
- `setupLevel()` (`game.js`): calls `state.setCrabLootTable(generateCrabLootTable())`
- `interactWithCrabOrBoss()` (`player.js`): crab kill path calls `state.drawCrabLoot()`; boss kill calls `handleBossKill()` (no loot)
- `collectGold()` (`player.js`): handles `amount >= 20` with `RING` symbol
- `interactWithOpenTile()` (`player.js`): `RING` tile calls `collectGold(x, y, 20)`
- `save.js`: persists `currentCrabLootTable` / `currentCrabLootIndex`

**Affected Files:**
- `scripts/constants.js`, `scripts/worldGen.js`, `scripts/state.js`, `scripts/player.js`, `scripts/save.js`, `scripts/game.js`

---

## Level 10+ Should Have No Key, No Parachute, and a Lethal Hole

**Status: Fixed ✅**

**Description:**
On level 10+ (NG+ final level), the normal key (🔑) and parachute (🪂) do not appear. The house key (🗝️) occupies the final tree loot slot. The hole (🕳️) is always lethal. The win condition is entering the house after the boss fight.

**Fix Applied:**
- `advanceLevel()` (`game.js`): split final-level logic by `state.ngPlus` flag:
  - Level 10+ (NG+): `chuteCount=0, doorCount=0, keyCount=0, houseKeyCount=1`
  - Level 10 (normal): `chuteCount=1, doorCount=0, keyCount=0`
  - Other levels: `chuteCount=0, doorCount=1, keyCount=1`
- `setupLevel()` (`game.js`): accepts `houseKeyCount` parameter, threads it to `generateLootTable()`
- `generateLootTable(chuteCount, doorCount, keyCount, houseKeyCount)` (`worldGen.js`): appends `houseKeyCount` entries of `HOUSE_KEY` at the end (unshuffled, same position as chute on normal level 10)

**Affected Files:**
- `scripts/game.js`, `scripts/worldGen.js`

---

## House Key Should Appear in the Inventory UI

**Status: Fixed ✅**

**Description:**
When the player holds the house key (🗝️) on level 10+, it appears in the inventory bar. Before collecting it, `🗝️0` is shown (mirroring how `🔑0` shows on normal levels before finding the key).

**Fix Applied:**
- `updateGoldDisplay()` (`ui.js`): added branch for `state.ngPlus && state.currentLevel === 9` → shows `🗝️${state.houseKeys}`

```js
const dynamicText = state.currentChutes > 0
    ? ` 🪂${state.currentChutes}`
    : (state.ngPlus && state.currentLevel === 9)
        ? ` 🗝️${state.houseKeys}`
        : ` 🔑${state.currentKeys}`;
```

**Affected Files:**
- `scripts/ui.js`
