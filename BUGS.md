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
