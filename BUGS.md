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

**Open Question:**
`handleFinalBoss()` is triggered by collecting the chute (`interactWithOpenTile` → `handleFinalBoss()`). On level 10+ there is no chute, so `handleFinalBoss()` is **never called** on 10+. Yet `handleFinalBoss()` already has an NG+ branch (`game.js:33–45`) that spawns a mix of crabs and snakes from rocks. This branch is currently unreachable dead code.

**Decision needed: does level 10+ have a final boss sequence, and if so, what triggers it?** Options:
- No final boss on 10+ — remove the NG+ branch from `handleFinalBoss()` entirely.
- Final boss is triggered by collecting the house key instead of the chute — call `handleFinalBoss()` from the house-key collect path.
- Some other trigger.

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

**Save Compatibility Note:**
`save.js` persists `gridState` as raw emoji strings and restores crabs via `value === SCORPION` in `restoreWorld()`. After renaming `SCORPION = "🦂"` to `CRAB = "🦀"`, any saved game with `"🦂"` in the grid will not be recognised as a crab on load — the check becomes `value === "🦀"`. **Existing saves will silently break.** Decision needed: invalidate old saves on load (simplest) or add a migration pass that replaces `"🦂"` with `"🦀"` in the loaded `gridState`.

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

**Save Compatibility Note:**
`save.js` stores and restores the raw `gridState` emoji grid. An NG+ save made before this change will have `"🌲"` for every tree. On load, `setGridTile` renders it correctly visually, but interaction code will check `tileValue === TREE_NG` (`"🌳"`) and miss those tiles — they'll behave as open ground instead of trees. Decision needed: invalidate NG+ saves or add a migration pass replacing `"🌲"` → `"🌳"` in loaded NG+ `gridState`.

**move() reference:** The bug lists `handleMove()` but the actual function in `player.js` is `move()`. Confirm the function name when implementing.

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
- `scripts/player.js` — add `interactWithHouse()` handler; update `move()` to dispatch on `HOUSE`; add house-key collect path; one crab on level 10+ drops `HOUSE_KEY` on death instead of its normal drop
- `scripts/snake.js` — add `HOUSE` to blocked tiles in `canSnakeMoveToTile()` and `canScorpionMoveToTile()`
- `scripts/state.js` — track house-locked state (`houseLocked`) and house-key count (`houseKeys`)
- `scripts/ui.js` — show house key in inventory when held
- `scripts/save.js` — persist `houseLocked` and `houseKeys`

**Implementation Notes:**
- The house must be placed **visibly** from the start (like the hole), not hidden inside a tree or rock. It should go through the same `pickHolePositions` mechanism: call `pickHolePositions(2)` and assign one position to the hole and one to the house, both excluded from the tile table via `holeSet`.
- **Open question: does the house have a visual locked/unlocked state?** The constants `LOCK = "🔒"` and `UNLOCK = "🔐"` already exist. Options: keep the tile as `🏡` always and rely on the "can't enter" logic, or swap to a different tile when unlocked. Decision needed.
- `save.js` currently saves `scorpions` without a `fromRock` field (see Crabs bug). `houseLocked` and `houseKeys` also need to be added to the save payload once those fields exist on `state`.

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

## Crabs Should Have a Separate Loot Pool and Rock-vs-Tree Spawn Tracking

**Description:**
Crabs currently share `snakeLootTable` with snakes — both call `state.drawSnakeLoot()` on death and drop either `GOLD` (💰) or `HEART` (❤️). Crabs should draw from their own loot pool and drop `RING` (💍, worth 20 gold) or `HEART` (❤️) instead. Additionally, on level 10+, exactly one rock-spawned crab must drop the `HOUSE_KEY` (🗝️) instead of its normal crab loot. This requires tracking whether each living crab was spawned from a rock or a tree, since tree-spawned crabs must never drop the house key.

**Expected Behaviour:**
- All crabs (rock- or tree-spawned) draw from a new `crabLootTable` on kill: `RING` or `HEART` drops, proportioned similarly to the snake table.
- `RING` (💍) is a new constant worth 20 gold, collected via `collectGold(x, y, 20)`.
- On level 10+, the crab loot pool for rock-spawned crabs includes exactly one `HOUSE_KEY` slot in place of one `RING` or `HEART` drop; tree-spawned crabs are unaffected.
- Snakes continue to draw from `snakeLootTable` (GOLD / HEART) unchanged.

**Root Cause:**
`player.js:92` calls `state.drawSnakeLoot()` when a scorpion (crab) is killed — the same table used for snakes. There is no `crabLootTable`, no `drawCrabLoot()`, and no `generateCrabLootTable()`. Furthermore, `addScorpion()` (`snake.js`) receives only `(x, y)` and stores no spawn-origin metadata, so there is no way to distinguish a rock-spawned crab from a tree-spawned crab at kill time. `interactWithVegetation()` (`player.js:135–140`) knows the origin (`isRock`) when it calls `addScorpion()`, but that information is discarded.

**Note on Simpler Flag Approach — Not Viable:**
A `rockCrabKeyPending` boolean was considered but ruled out. Level 10+ has 10 tree-crabs and all rocks also produce crabs, meaning rock-crabs and tree-crabs are alive simultaneously. The flag would fire on whichever crab the player kills first after revealing a rock — which could easily be a tree-crab — incorrectly assigning the house key. Per-entity origin tracking is required.

**Required Changes:**
- Add `RING = "💍"` to `constants.js`; add `collectGold` handling for value 20 in `player.js:interactWithOpenTile` (e.g. `if (tileValue === RING) { collectGold(x, y, 20); }`)
- Add `generateCrabLootTable()` in `worldGen.js` — normal drops are `RING` and `HEART`; on level 10+ the rock-crab sub-pool includes one `HOUSE_KEY` slot
- Add `crabLootTable` / `crabLootIndex`, `drawCrabLoot()`, `setCrabLootTable()`, `restoreCrabLoot()` to `state.js`
- Add `drawRockCrabLoot()` / `rockCrabLootTable` in `state.js` as a separate pool for rock-spawned crabs on level 10+ (or pass origin into a single draw function)
- Update `addScorpion(x, y, fromRock = false)` in `snake.js` and store origin on the scorpion object in `state.js` (`state.scorpions` entries)
- Update `interactWithVegetation()` in `player.js` to pass `isRock` when calling `addScorpion()`
- Update `killScorpion` / crab-kill path in `player.js:88–93` to look up the crab's origin and call `drawRockCrabLoot()` vs `drawCrabLoot()` accordingly
- Update `save.js` to persist `crabLootTable` / index (and rock-crab table if separate)

**Affected Files:**
- `scripts/constants.js` — add `RING = "💍"`
- `scripts/worldGen.js` — add `generateCrabLootTable()`; call it alongside `generateSnakeLootTable()`; add `generateRockCrabLootTable()` for level 10+ (all crabs, one slot is `HOUSE_KEY`)
- `scripts/state.js` — add crab loot table fields and draw methods; store `fromRock` on scorpion entries; add `rockCrabLootTable` fields for level 10+
- `scripts/snake.js` — `addScorpion()` accepts and stores `fromRock` flag
- `scripts/player.js` — `interactWithVegetation()` passes origin; crab-kill path draws from correct pool; `interactWithOpenTile()` handles `RING`
- `scripts/save.js` — persist `crabLootTable`/index and `rockCrabLootTable`/index; add `fromRock` to saved scorpion entries (currently only `{ x, y, armored }` is saved — `save.js:28`)

**Open Questions:**
- **Exact crab loot table composition:** "proportioned similarly to the snake table" is not specific enough to implement. The snake table uses 2 hearts out of the total enemy count. What is the RING : HEART ratio for the crab table? A concrete count is needed.
- **Rock-crab loot pool on levels other than 10+:** On NG+ levels 1+–9+, rocks drop snakes (same as normal), so there are no rock-crabs and no separate pool needed. On level 10+, the rock-crab pool is `rockCrabLootTable` (15 entries: 14 normal crab drops + 1 `HOUSE_KEY`). Confirm this is the only level where a separate pool is needed.
- **`setupLevel()` call site:** `setupLevel()` must call `state.setRockCrabLootTable(generateRockCrabLootTable())` on level 10+ only. This should be gated on `state.ngPlus && state.currentLevel === 9` (checked before `incrementLevel()` runs).

---

## Level 10+ Should Have No Key, No Parachute, and a Lethal Hole

**Description:**
On level 10+ (NG+ final level), the normal key (🔑) and parachute (🪂) should not appear in the loot table. The hole (🕳️) remains on the board and is always lethal — there is no way to safely survive it. The win condition on level 10+ is entering the house (🏡) with the house key (🗝️), not using the parachute. Level 10 (non-NG+) is unaffected and keeps its current parachute-based win condition.

**Expected Behaviour:**
- Level 10 (normal): unchanged — chute appears in tree loot, door and key are absent, chute win applies.
- Level 10+ (NG+): `chuteCount = 0`, `doorCount = 0`, `keyCount = 0` — no key, no parachute, hole kills on contact.

**Root Cause:**
`advanceLevel()` (`game.js:129–133`) checks `isFinalLevel = state.currentLevel === 9` and always sets `chuteCount = 1, doorCount = 0, keyCount = 0` when true, regardless of `state.ngPlus`. The NG+ final level needs `chuteCount = 0` as well.

`interactWithHole()` (`player.js:123–133`) already kills the player when `state.currentChutes === 0`, so no change is needed there — since no chute is placed on level 10+, the hole is naturally lethal.

**Required Change:**
In `advanceLevel()` (`game.js`), split the final-level logic by NG+ flag:

```js
const isFinalLevel = state.currentLevel === 9;
let chuteCount, doorCount, keyCount;
if (isFinalLevel && state.ngPlus) {
    chuteCount = 0; doorCount = 0; keyCount = 0;
} else if (isFinalLevel) {
    chuteCount = 1; doorCount = 0; keyCount = 0;
} else {
    chuteCount = 0; doorCount = 1; keyCount = 1;
}
setupLevel(chuteCount, doorCount, keyCount);
```

**Affected Files:**
- `scripts/game.js` — `advanceLevel()`

**Implementation Note:**
Since `handleFinalBoss()` is never called on level 10+ (no chute to trigger it), the NG+ branch inside `handleFinalBoss()` becomes unreachable after this change. See the open question in the Final Boss bug about whether a final boss sequence should exist on 10+ and what triggers it.

---

## House Key Should Appear in the Inventory UI

**Description:**
The inventory bar (`ui.js:updateGoldDisplay`) shows `🪂N` when the player holds a parachute, and `🔑N` for regular keys. When the player collects the house key (🗝️) on level 10+, it should appear in the same area of the inventory bar. Currently `HOUSE_KEY` has no display logic and would be invisible in the UI after collection.

**Expected Behaviour:**
Display priority (left to right in the dynamic slot) should be:
1. `🪂N` — if player holds a chute (takes priority; only relevant on normal level 10, not 10+)
2. `🗝️` — if player holds the house key (level 10+ only; show when `state.houseKeys > 0`)
3. `🔑N` — otherwise (regular key, levels 1–9 and 1+–9+)

Since level 10+ has no chute and no regular key, on that level the slot will show `🗝️` when collected or be blank until then.

**Root Cause:**
`updateGoldDisplay()` (`ui.js:12–14`) uses a single ternary:
```js
const dynamicText = state.currentChutes > 0 ? ` 🪂${state.currentChutes}` : `🔑${state.currentKeys}`;
```
There is no branch for `state.houseKeys`. `state.houseKeys` does not yet exist (it will be added as part of the NG+ House / House Key bug). Once that field exists, `updateGoldDisplay()` must be updated to include a house-key branch.

**Required Change:**
```js
const dynamicText = state.currentChutes > 0
    ? ` 🪂${state.currentChutes}`
    : state.houseKeys > 0
        ? ` 🗝️`
        : ` 🔑${state.currentKeys}`;
```

**Affected Files:**
- `scripts/ui.js` — `updateGoldDisplay()`
- `scripts/state.js` — depends on `houseKeys` field being added (see NG+ House bug)

**Open Question:**
On level 10+ before the house key is collected, `state.houseKeys === 0` and `state.currentKeys === 0`, so the proposed ternary falls through to ` 🔑0`. Should the slot show `🔑0` (no key) or be blank on a level where a regular key is impossible? If blank is preferred, the ternary needs an additional guard: `state.currentKeys > 0 ? \` 🔑${state.currentKeys}\` : \`\``.
