import"./modulepreload-polyfill-Dezn_h7o.js";import{C as e,D as t,I as n,S as r,a as i,ft as a,h as o,m as s,o as c,p as l,t as u,wt as d}from"./tile-Df9jxjOA.js";import{Bn as f,Dn as p,Gt as m,Hn as h,Ht as g,Jn as _,Mt as v,Sn as y,Un as b,Ut as x,Vn as S,Wn as C,Wt as w,X as T,Yn as E,_t as D,at as O,bn as k,bt as A,gt as j,ht as M,it as N,nr as P,ot as F,vt as I,xn as L,yt as R}from"./worldGen-CBxCWdHp.js";import{a as z,c as B,d as V,l as H,n as ee,o as U,r as te,s as ne,t as re,u as ie}from"./ink-full-BYrTmwjX.js";var W=`# Ninjack

A browser-based roguelike played on a 9×9 grid. You're a 🥷 navigating a world of hidden loot, roaming snakes, and 10 increasingly dangerous levels.

## How to Play

Move by tapping/clicking the directional buttons or using arrow keys. Bumping into a tile interacts with it.

| Tile | |
|------|---|
| 🌲 Tree | Drops: 🗡 💰 💎 🐍 🔑 🚪 |
| 🪨 Rock | Drops: 🐍 ❤️ |
| 🐍 Snake | Costs: 🗡️, Drops: 💰 ❤️ |
| 🗡 Sword | Auto-used when attacking 🐍 |
| 🚪 Door | Needs 🔑 to unlock, walk through to advance |
| 🕳️ Hole | 💀 |
| 🪙 Coin | Worth 1 gold |
| 💰 Gold | Worth 5 gold |
| 💎 Gem | Worth 10 gold |
| ❤️ Heart | Worth 1 health |

## Objective

Survive 10 levels. Each level: clear 🌲 to find a 🔑, unlock the 🚪, and walk through.
`,G="# Ninjack – Development Notes\n\nFor release configuration (version fields, secrets, TODOs), see [RELEASE.md](RELEASE.md).\n\n## Build System\n\nThis project uses **Vite + TypeScript**. All source files are in `scripts/*.ts`.\n\n| Command | What it does |\n|---|---|\n| `npm run dev` | Start Vite dev server (hot reload) |\n| `npm run build` | Production build → `dist/` |\n| `npm run typecheck` | TypeScript type check (no emit) |\n| `npm run sync` | Build + Capacitor sync (both platforms) |\n\n**Cache busting is automatic** — Vite adds content hashes to all output filenames (e.g. `main-abc123.js`). No manual version bumping needed.\n\n## Versioning\n\n`package.json`'s `version` field (`major.minor.patch`) is the single source for the version string shown at the bottom of the main menu (`scripts/menu.ts` imports it directly — `resolveJsonModule` in `tsconfig.json` makes this a typed import, not a manual copy) — editing `package.json` is the only step needed; the displayed string updates automatically on the next build.\n\n**Every commit bumps it** — not just ones that change shipped behavior; docs-only and refactor-only commits bump too. Picking the tier is a judgment call, but making *some* bump isn't optional:\n- **patch** (`1.0.0` → `1.0.1`): the default — bug fixes, small tweaks, copy/balance changes, docs, refactors, no new player-facing feature.\n- **minor** (`1.0.0` → `1.1.0`): a new feature, system, or content addition (a new room, NPC, zone, mechanic) that doesn't break existing saves/behavior.\n- **major** (`1.0.0` → `2.0.0`): a breaking change to core progression or save compatibility (e.g. the linear-level → open-world island transformation).\n\nBump it in the same commit as the change it describes, not as a separate housekeeping pass. This means a multi-commit PR/session bumps once per commit, not once for the whole PR.\n\n## Adding New HTML Pages\n\nEvery new `.html` file must be registered in **two places**:\n\n1. **`vite.config.ts`** — add an entry to `rollupOptions.input`, e.g.:\n   ```ts\n   'my-page': resolve(__dirname, 'my-page.html'),\n   ```\n   Without this the page 404s in the built/served app.\n\n2. **`index.html`** — add a redirect in the inline script if the page should be reachable via a query param, e.g.:\n   ```js\n   if (sp.has('my-page')) { location.replace('my-page.html'); return; }\n   ```\n\n## Adding New Docs\n\nEvery new `.md` file in `docs/` must be registered in **`scripts/docs-page.ts`** in two places:\n\n1. **Import** the file at the top:\n   ```ts\n   import myDocMd from '../docs/my-doc.md?raw';\n   ```\n\n2. **Add an entry** to the `docs` array with an `id`, `title`, `category`, and `content`:\n   ```ts\n   { id: 'my-doc', title: 'My Doc', category: 'Design', kind: 'markdown', content: myDocMd },\n   ```\n\nWithout this the doc exists on disk but never appears in the docs hub sidebar.\n\n### Theming interactive docs (`kind: 'interactive'`)\n\nAn interactive doc's own `<style>` block should **not** hardcode a fixed palette by default — it should inherit the docs hub's light/dark toggle the same way a markdown doc does, using the CSS custom properties already defined for `#docs-content` in `scripts/docs-page.ts` (`--bg`, `--text`, `--heading`, `--muted`, `--border`, `--link`, `--link-card-bg`/`--link-card-border`, `--table-*`, `--code-*`, `--nav-hover`, ...). Most interactive docs are prose/tables/cards describing a design or plan (e.g. Save Slots Plan) and have no reason to look different from a markdown doc's chrome.\n\nThe exception is a doc whose content **is** a mockup of an actual in-game screen or a specific fixed visual context — e.g. the Loot Box UI prototype, Entity Health Bar, NPC Dialogue, Controls, and the animation prototypes all reproduce the real forest backdrop so the UI can be judged in context; House Interior Plan uses a parchment/blueprint look; the Soundboard uses a terminal look. Only the parts of a doc that are genuinely emulating the real game should carry fixed, non-theme-following styling — and that styling should reuse the real game's own constants/CSS where practical (e.g. `FOREST_THEME_COLOR` from `scripts/tile.ts`, not a hand-picked approximation) rather than drift from it. Everything else in that same doc (headings, explanatory text, non-mockup UI chrome) should still use the theme variables.\n\n## Keeping Docs Current\n\nWhen implementing or changing a feature, update the relevant doc(s) in the docs hub to reflect the new behavior. Interactive docs live in `scripts/docs-*.ts`. The \"Animations\" doc (`scripts/docs-animations.ts`) should be updated whenever animation timings or types change.\n\n## Testing\n\nUse **vitest** for all unit tests. Tests live in `tests/*.test.ts`.\n\n| Command | What it does |\n|---|---|\n| `npm test` | Run all unit tests (vitest run) |\n\n**Workflow rule**: For every bug fix or behavior change, write a *failing* unit test first that reproduces the issue, then fix the code so the test passes. Commit both together. If the code under test requires a browser environment (DOM, canvas, Web Audio), test the *logic and ordering contracts* instead — e.g. verify that callbacks fire in the right sequence, that state is correct before/after, or that config objects passed to animation queues have the right shape. Pure logic tests are always possible; \"needs the browser\" is not an excuse to skip.\n\n## Unify by data, not by call site\n\nWhen behavior varies by *kind* (mob species, scene/level type, tile type, ...) but the *operation* is otherwise identical, model the variation as data passed to one shared function — never as N hand-written call sites, each independently enumerating every kind that currently exists.\n\n**The tell:** a bug fix or a new feature requires touching several call sites that all do \"the same thing, but for a different kind\" — and at least one of them was missed, or would be missed the next time a kind is added. If you're writing `clearThingA(); clearThingB(); clearThingC();` (or a body-class + hardcoded hex block that duplicates a mechanism another scene already generalized), stop and ask whether A/B/C are really the same operation over different data.\n\n**The fix shape:** one function taking a plain config/data object; every \"kind\" supplies its own values through that *same* type/interface, not a bespoke shape per kind (a registry entry, a theme config, an entity def); adding a new kind means adding one more value of that shape, not another call site.\n\n## Combat numbers are integers, rounded up\n\nEvery damage/health/armor-rating value in the game (player `maxHealth`, `UNARMED_DAMAGE`, `STARVATION_DAMAGE`, every `EntityDef.attackDamage`/`maxHealth`, every rolled weapon/bow `damage` and armor `armorRating`) is a whole number — no half-points, no floats. Where a calculation doesn't land on one exactly (a scale/multiplier applied to an old value, a rarity roll's `base * mult`), round **up**, never to nearest and never down — a low roll or an awkward scale factor should never come out weaker than the nearest whole number below it. `dropsCore.ts`'s `rollStat` is the one shared function this applies to automatically for every rolled stat (`Math.ceil`, not `Math.round`); a new hand-picked constant elsewhere should follow the same rule by hand.\n\n## Module Structure\n\nScripts are ES modules with explicit imports/exports. Load order is managed by the bundler.\n\nKey files:\n- `scripts/main.ts` — entry point; wires up timer callback and move handler\n- `scripts/tile.ts` — tile types/registry/live-state (renamed from `constants.ts` — see below); exports `NINJA` as a live `let` binding, use `setNinja()` to mutate it\n- `scripts/utils.ts` — small, genuinely generic helpers with no tile/domain connection (`percentOfMaxHealth`, `coordKey`, `devMode`); split out of `constants.ts` in the same rename, since none of the three are tile-related\n- `scripts/state.ts` — `GameState` class + singleton `state`\n- `scripts/game.ts` ↔ `scripts/snake.ts` — safe circular dep (all cross-calls are in function bodies)\n- `scripts/game.ts` ↔ `scripts/menu.ts` — same\n\n### `scripts/gameConfig.ts` — the pure-data aggregator\n\nA single import surface for the game's genuinely pure config data — every plain `Tile`/`GroundTile` display object, core world/player/fullness constants, rarity tiers, every rollable item category's base stat ranges/multipliers, the zone roster/theme table, room definitions, per-species mob stats, the feedback (sound/haptic/toast) table, dungeon-generation tunables, free-tile/gold-drop tunables, and the music-track-to-file table — each still individually exported (`EMPTY`, `TREE`, `WEAPON_CONFIG`, `ZONES_CONFIG`, `ROOMS_CONFIG`, `ENTITIES_CONFIG`, `FEEDBACK_CONFIG`, `DUNGEON_GEN_CONFIG`, ...) and also grouped under one `GAME_CONFIG` object. The file whose logic actually *uses* a given table (`tile.ts`, `dropsCore.ts`, `weapon.ts`/`armor.ts`/`bow.ts`/`shield.ts`/`food.ts`/`healingPotion.ts`/`inventory.ts`, `zones-data.ts`, `rooms-data.ts`, `entityDefs.ts`, `feedback.ts`, `dungeonGen.ts`, `audio.ts`) imports its table back from here and re-exports it under the exact name it had before — so this was a pure relocation of values, not an API change, and every existing importer elsewhere in the codebase needed zero changes.\n\n**`gameConfig.ts` depends on nothing but types — this is the actual source of truth, not a read-through.** `tile.ts` used to own every plain `Tile` object and the core numeric constants (`maxHealth`, `worldSize`, `FULLNESS_MAX`, ...), and `gameConfig.ts` read a handful of them back (`TREE_WALL`, `BED`, `GOLD`, ...) to build `ZONES_CONFIG`/`ROOMS_CONFIG` — which meant `tile.ts` could never safely import anything FROM `gameConfig.ts` in return (a real circular import: a `const` accessed before its own module finishes initializing throws). That direction is now inverted: every plain tile and every core constant is *defined* in `gameConfig.ts`, and `tile.ts` imports them back, re-exporting the tiles unchanged and the scalar constants as `let` + `onConfigFinalized` (same treatment as every other plain-value re-export — see below). `gameConfig.ts` itself only ever imports *types* from `tile.ts` (`Tile`, `GroundTile`, `TileType`, `TerrainType` — erased at compile time, so they can never create a runtime cycle no matter what `tile.ts` does). What stays in `tile.ts`, and why it's logic/live-state rather than data:\n- `NINJA`/`TREE_WALL`/`ALT_WALL` — each needs a live `display` getter over module-mutable state (ninja skin, per-zone wall glyph). `gameConfig.ts`'s `NINJA_BASE`/`TREE_WALL_BASE`/`ALT_WALL_BASE` (typed `Omit<Tile, 'display'>`) are the static shape each spreads its own getter on top of.\n- `isMoverBlocked`, `tileFromType`/`tileFromId`/`groundTileFromType`/`groundTileFromId`, `TILE_FROM_TYPE`/`TILE_FROM_ID`, `ITEM_TYPES` — lookup/dispatch built from the (now gameConfig-sourced) tile objects, still logic.\n- `tileIds.ts`'s `TILE_ID` — already its own single-purpose, append-only file with load-bearing \"never reorder/reuse a value\" rules; relocating it would only add risk for zero benefit. `gameConfig.ts` imports it directly now (tile.ts no longer needs to).\n\n`percentOfMaxHealth`, `coordKey`, and `devMode` aren't in `tile.ts` either, even though they used to live in the same file (`constants.ts`) as everything above — none of the three are tile-related (a heal/fullness rounding helper, a board-position Set/Map key, an environment check), so they live in their own `scripts/utils.ts` instead. Not part of `gameConfig.ts` for the same reason `isMoverBlocked`/`tileFromType` aren't: plain functions, not data a mod would override.\n\n**What's deliberately NOT in `gameConfig.ts`, and why** — don't \"finish the migration\" by moving these; each one is data+logic fused at the same declaration, not a plain table:\n- `npcs-data.ts`'s `GRANTABLE_ITEMS` — a factory-function table (it constructs a live `InventoryItem` via `rollWeapon()` etc.), not data.\n- `soundRegistry.ts`'s `SOUND_REGISTRY` — every value is a real function reference into `audio.ts`'s procedural Web Audio synthesis, so the registry itself isn't moddable data (see \"Sound-key indirection\" below for what *is* moddable about it).\n- Every rolling/weighting/generation *function* (`dropsCore.ts`'s `rollStat`/`rollRarityTier`, `zones-data.ts`'s `pickZoneEnemyType`/`computeWeights`, `dungeonGen.ts`'s layout algorithm, `rooms.ts`'s `enterRoom`/`exitRoom`, `dungeonEquipment.ts`'s `ROLL_BY_CATEGORY`) — logic, stays with its own file.\n\n**Sound-key indirection** (`ENTITIES_CONFIG.<species>.attackSoundKey`, `FEEDBACK_CONFIG.<action>.soundKey`/`.toastKey`) — `entityDefs.ts`'s mob defs and `feedback.ts`'s action table used to embed a live closure (`attackSound: () => audio.snakeAttack()`) at the exact spot a mod would need to override, which is why they were excluded from the original pass. Both are now plain string keys instead: `attackSoundKey`/`soundKey` resolve through `soundRegistry.ts`'s `playSound(key, ...args)` into the real `audio.ts` call, and `toastKey` resolves through `strings.ts`'s `getString(key, ...args)` (already string-keyed, so no new indirection needed there). This makes the *choice* of sound/toast per species/action fully data (a mod can reassign `SNAKE`'s `attackSoundKey` to some other existing key, or swap which sound `goldPickup` reuses) even though the underlying sounds themselves stay fixed engine code — see `moverMovement.ts`'s attack dispatch (`playSound(mob.def.attackSoundKey ?? 'playerHit')`) and `feedback.ts`'s `feedback()` function for the two call sites this unlocked.\n\n**Zone wall tiles by reference, not by embedded copy** (`ZoneDef.wallTile`/`altWallTile`) — these are a `TileType` string (+ optional `wallDisplay`/`altWallDisplay` glyph override), not a baked `GroundTile` object the way they used to be (`zoneWall('🌲')` used to spread `TREE_WALL` once at config-definition time). `zones-data.ts`'s `getZoneWallTile`/`getZoneAltWallTile` resolve a zone's pair back into a real tile (base behavior from `tile.ts`'s own tile registry, glyph from the zone's own override if it set one) wherever rendering needs one (`dungeonTransition.ts`, `save.ts`, `towerCutaway.ts` all call these instead of reading `zone.wallTile` directly). This means a mod can override *just* a zone's glyph (`wallDisplay`) without needing to reconstruct a whole tile object, or swap the underlying tile kind (`wallTile`) independently of the glyph.\n\n**Keyed by id, not array position** (`ZONES_CONFIG`/`ROOMS_CONFIG`) — both are `Record<id, Def>`, not arrays, specifically so a future override/mod layer can target (\"replace Deep Grove's theme\") or extend (\"add a 6th zone\") by key without knowing or preserving array position. `zones-data.ts`'s `ZONES` (an ordered-by-`minFloor` array — the shape `getZoneForFloor`/`computeWeights` actually need) is *derived* from `ZONES_CONFIG` at import time; `rooms-data.ts`'s registration loop iterates `Object.values(ROOMS_CONFIG)` the same way. `rooms.ts`'s own `ROOM_REGISTRY` was already keyed by id internally, so this matches a pattern already established there.\n\n**Override seam** (`GameConfigOverrides`/`applyConfigOverrides`, bottom of the file) — no mod loader exists yet; this is the seam one would call into. `applyConfigOverrides(overrides)` deep-merges a plain, JSON-shaped partial of `GAME_CONFIG`'s own type **in place** — it mutates each nested object's own properties rather than replacing them wholesale, which is what makes an override safe regardless of module-load order: every file that already imported one of `GAME_CONFIG`'s sub-objects (`weapon.ts`'s `WEAPON_DAMAGE_FIELD`, ...) holds a reference to the *same* object this mutates, so it sees the override the next time it reads a field off that object, even though its own top-level code already ran before `applyConfigOverrides` was called (`main.ts` calls it, with no real overrides today, right after imports — see that file). Arrays are replaced outright, never merged element-by-element — naming an array field in an override means \"use this array,\" not \"splice into the existing one.\" Calling `applyConfigOverrides` (even with no arguments) is also what deep-freezes `GAME_CONFIG` afterward, so any other code that tries to poke a config value directly (instead of going through this seam) throws instead of silently drifting — it can only be called once per app run.\n\n**`onConfigFinalized` — keeping plain-value re-exports live too.** An object's own properties (a `StatField`, a `ZoneDef`, an `EntityDef`, a `FeedbackSpec`, a `Tile`) are override-safe automatically, per the paragraph above. A bare number/string/array that some file copied out into its own local `const` at import time is NOT — `weapon.ts`'s `WEAPON_MIN_MULT`, `tile.ts`'s `maxHealth`/`worldSize`/`UNARMED_DAMAGE`/every other core scalar, `dropsCore.ts`'s `RARITY_TIERS`, `dungeonGen.ts`'s `DUNGEON_GRID_SIZE`/`EQUIPMENT_CATEGORY_WEIGHTS`/every `LOOT_CONFIG`-derived tunable, `zones-data.ts`'s derived `ZONES` array, `rooms-data.ts`'s one-shot registration loop — all of these used to go stale the instant their owning file loaded, no matter what an override later said. Every one of them is now declared `let` (or is inside a re-runnable function) and registers an `onConfigFinalized(callback)` — called exactly once, right after `applyConfigOverrides` merges + freezes `GAME_CONFIG`, giving each of these derivations one chance to redo itself against the final values. Registering after the override already ran (a module that only gets imported later) fires the callback immediately instead of queuing it, so load order never matters either way. This is also what makes a mod-added, brand-new `ZONES_CONFIG`/`ROOMS_CONFIG` key actually show up — `zones-data.ts`'s callback re-sorts `Object.values(ZONES_CONFIG)` from scratch, `rooms-data.ts`'s re-runs its whole `registerRoom` loop — see `tests/gameConfig-refresh.test.ts` and `tests/tile-refresh.test.ts` for the regression coverage proving a value imported *before* an override (including one, like `totalTiles`, derived from another overridden value) still reads correctly *after* one.\n\n**Per-stat rarity curve** (`WEAPON_CONFIG.curve`, `ARMOR_CONFIG.curve`, `BOW_CONFIG.curve`, `SHIELD_CONFIG.curve` — all `'geometric'`; `FOOD_CONFIG.curve`/`HEALING_POTION_CONFIG.curve`/`BACKPACK_CONFIG.curve` — all `'linear'`) — previously a `'geometric'`/`'linear'` string literal typed directly into each category's own `rollX()` call to `dropsCore.ts`'s `rollStat`/`rollDurability`, with no config field backing it at all. Now real data, read directly off the category's own config object at roll time (`rollStat(WEAPON_DAMAGE_FIELD, rarity, WEAPON_MIN_MULT, WEAPON_MAX_MULT, rand, WEAPON_CONFIG.curve)`) — always override-safe with no `onConfigFinalized` needed, since it's an object property read at call time, not a copied scalar. Durability deliberately has no curve field of its own — every category's durability roll has always been `'linear'`, so there's no real variation to make configurable there yet.\n\n**Backpack joins the other rollable item categories** (`BACKPACK_CONFIG`, `GAME_CONFIG.items.backpack`) — `inventory.ts`'s capacity/durability stat ranges, multiplier bounds, capacity ceiling, and starting Bag 1 capacity/rarity were the one `DropCategory` never pulled into `gameConfig.ts` at all in the original pass. Same shape and same `onConfigFinalized` treatment as weapon/armor/bow/shield/food/healingPotion now.\n\n### `Tile.movable` / `Tile.interactable` (`scripts/tile.ts`)\n\nEvery `Tile` carries two independent optional booleans describing what bumping it does: `movable` (a move can end on this tile — `player.x`/`y` actually updates) and `interactable` (bumping it always triggers a defined handler — attack, break, damage, dialogue, pickup — whether or not the move completes). All four combinations occur in real tile data: `EMPTY` is movable-only (plain floor); `GOLD`/`HOLE` are both (you move there *and* something happens); `TREE`/`ROCK`/`FIRE`/`SNAKE`/`OLD_MAN`/etc. are interactable-only (bump triggers a handler, but you never end up standing where they are); `WALL`/`ROOM_WALL`/`BED`/`CHAIR` are neither — `player.ts`'s `isBlockedBump` check (backing `executePlayerAction`'s `'blocked'` result — see \"Turn Resolution\" below) is exactly `!tile.movable && !tile.interactable`. Every tile's movable/interactable value is a static fact — nothing here depends on other game state at check time. `ROOM_DOOR` is the one lock-free \"break reveals a different tile\" style exit tile still in the game (see the `Rooms` section below); a future lockable tile should follow the same shape a locked/unlocked pair used to (a distinct locked tile type that gets swapped or picked based on already-known state) rather than a side boolean.\n\n### Turn Resolution (`scripts/player.ts`)\n\n`executePlayerAction` returns one of four results driving `move()`'s post-action bookkeeping: `'full'` (enemy turn + re-enable), `'partial'` (no enemy turn + re-enable — e.g. a non-exiting `ROOM_DOOR` bump), `'terminal'` (no enemy turn + some other handler — dialogue, room exit, death — owns re-enabling buttons itself), and `'blocked'` (a bump that did nothing at all — see `isBlockedBump` above). `move()`'s own `consumeTurn()` (the move counter + fullness tick, bundled into one function so they can't drift apart or get invoked out of order) is gated on `isBlockedBump` computed *up front*, not on `executePlayerAction`'s return value — specifically so `consumeTurn()` can still run **before** calling `executePlayerAction`/`executeBowFire`. That ordering matters: `tickFullness()` can itself deal starvation damage, and a few `'terminal'` results (e.g. falling through a `HOLE`) queue a post-effect that resets fullness for the next floor (`endGame` → `state.resetFullness()`) — that reset only fires later, inside `playPlayerPhase()`'s post-effects, so running `consumeTurn()` first guarantees the tick always lands on the pre-transition fullness value rather than re-ticking a value that was just reset.\n\nThe D-pad's center \"wait\" button (`data-dir=\"wait\"`, `controls-render.ts`) deliberately bypasses `executePlayerAction` entirely rather than resolving as a bump into the player's own tile. This is safe today because the player's current tile is always something they arrived at via a real move, and per the `Tile.movable`/`interactable` rule above, every tile with a handler *except* `ROOM_DOOR` is interactable-only — `FIRE`/`HOLE`/`OLD_MAN`/flavor-dialogue tiles never get a `movePlayerTo` call, so the player can never actually be standing on one between turns. `ROOM_DOOR` is the one exception (`movable: true`); the bypass is exactly what stops `'wait'` from re-triggering a room exit just because the player happens to be waiting on the doorway. `BOX`/`GRAVE` (also `movable: true`, loot piles) lose one minor capability to the same bypass: waiting on one won't retry `tryAutoCollect`/`interactWithOpenTile` (e.g. if backpack space freed up while parked there) — stepping off and back on is the only way to retry that.\n\n**Gotcha for a future tile:** because `'wait'` never touches ground-tile dispatch at all, a future tile with a \"something happens every turn you stand on it\" mechanic (a damage-over-time hazard, a per-turn healing tile, anything beyond today's one-shot-on-arrival handlers) would silently never fire while the player is waiting on it. Such a mechanic needs its own call site in `move()`/`consumeTurn()`, keyed off the player's *current* tile independent of `direction`, rather than assuming `executePlayerAction`'s per-bump dispatch covers it — `'wait'` only ever calls that dispatch on an actual bump, never passively while standing still.\n\n### Ground vs. occupant layer (`scripts/tileUtils.ts` + `scripts/occupancy.ts`)\n\n`state.grid` is the **ground content layer only** — items, hazards, landmarks (WALL, GOLD, FIRE, HOUSE, BOX, ...). It is never written by entity movement. \"Who is standing where\" (player, snakes) is answered separately by `occupancy.ts`'s `getOccupant(x, y)`, which reads each entity's own `x`/`y` directly — there's no second, synced coordinate index, since that redundancy is exactly what used to let entities and ground content overwrite each other (an entity stepping onto an item, hazard, or landmark used to silently erase it).\n\n`tileUtils.ts` splits accordingly: `setGroundTile` mutates only `state.grid` (and, optionally, `state.terrain` — see below); `renderTile` is a DOM-only repaint that composites occupant-over-ground via `getEffectiveTile` (occupant's own tile if one is standing there, else the ground tile); `setGridTile` is the common-case wrapper (`setGroundTile` + `renderTile`) that every ground-only caller (item pickups, world-gen, save/load, debug tools) keeps using unchanged. `entity.ts`'s `moveEntityTo`/`removeEntity` call bare `renderTile` on the affected cells and **never** touch ground — this is what lets an entity rest on or pass over an item without destroying it: the ground is simply never written, so `renderTile` on the vacated cell reveals the untouched real content the instant the entity leaves.\n\nBecause of this split, `getGridTile(x, y) === SNAKE.type` (or `NINJA.type`) is never true — check `getOccupant(x, y)` (or the `isOccupied`/`isOccupiedByOther` helpers) instead. `isOccupiedByOther` excludes the player, for attack-capable movers (snake) whose passability check is \"attack the player, but treat any other live entity as blocked\"; `isOccupied` includes the player, for movers that never attack. Any `syncDestText` callback restoring a moved entity's own resting-tile display (see the Animation Contract Gotchas below) must read `getEffectiveTile(x, y).display`, not a raw ground read — the entity itself, not whatever it's standing on, is what should show at its own destination.\n\n`renderTile`'s own content styling (`el.dataset.tile`/`classList`/`dataset.glow`) must come from the **ground content** tile whenever `getOccupant(x, y)` returns something, never from `getEffectiveTile`'s result — occupant tiles (NINJA/SNAKE/...) carry no styling of their own. `el.textContent` still comes from the effective tile (the occupant's own emoji belongs on screen) — only the styling half needs the ground-tile fallback, and only while occupied: a composited floor item (e.g. a dropped `KEY`) still needs its own effective-tile styling when nothing occupies the cell. Ported from the equivalent fix in the sibling `ninjack-2` repo; see `tests/ground-tile-background-override.test.ts`.\n\n**Terrain is a third, separate layer beneath ground content** (`tile.ts`'s `TerrainType` — currently just `'GRASS' | 'PATH'` — `state.ts`'s `#terrain`, a `worldSize`×`worldSize` array parallel to `#grid`). It answers a different question than content does: not \"what's here\" (a landmark, an item, a hazard, or nothing) but \"what does the bare floor actually look like.\" `renderTile` stamps `el.dataset.terrain` straight from `state.getTerrain(x, y)` on every render, completely independently of occupant/content/styling — this is *never* folded into the `styleTile`/`data-tile` fallback chain above, and `styles.css`'s `.tile[data-terrain=\"PATH\"]` rule is what actually paints a dirt corridor's peru background (reasserted at higher specificity under `body.dungeon-mode`, same reason the rarity-glow border-color needs the same reassertion — see `rarity-glow-border-contrast.test.ts`).\n\nThis split exists because ground content can be **overwritten**, not just occupied — a dropped item pile (`BOX`), a death (`GRAVE`), a landmark (the starting town's `OLD_MAN`/`FOUNTAIN`, standing on a path tile — see \"Starting Town\" below), or a single item composited over `EMPTY` all fully replace whatever `TileType` was in `state.grid[y][x]` (unlike the occupant layer above, which never touches ground content at all). Before the terrain layer existed, a dirt `PATH` tile *was* a content value, so covering it with any of the above discarded that fact outright — permanently \"turning it to grass\" — and the fix at the time (`tileUtils.ts`'s now-removed `coverGround`/`uncoverGround` pair, keyed off a transient `data-ground-beneath` DOM flag) could only ever patch this one call at a time, and never handled a landmark that needs to be *both* a distinct content type *and* visually sit on dirt simultaneously (a fake `animation: PATH.type` override on the landmark's own tile object was tried for that — it silently never worked, since `state.grid` only stores a bare `TileType` string per cell and every repaint re-derives the full tile from `TILE_FROM_TYPE`'s one canonical entry per type, discarding the override). Terrain fixes the whole class at once: `setGroundTile`/`setGridTile` take an optional third `terrain` argument, and every ordinary content-only write (item pickups, `BOX`/`GRAVE` placement, `placeGrave`/`clearGrave`) simply omits it, structurally incapable of disturbing whatever terrain is already there — there's no \"remember what was underneath before overwriting\" step left to forget. Only the handful of call sites that actually *know* a cell's terrain (`dungeonTransition.ts`'s chunk loader, deriving it from the corridor layout; `town.ts`'s `getTownTerrain`; `save.ts`'s save/restore, which persists `state.terrain` the same way it persists `state.grid`) ever pass it. See `tests/dirt-path-identity.test.ts`.\n\n## Rooms (`scripts/rooms.ts` + `scripts/rooms-data.ts`)\n\nA \"room\" is a self-contained 9×9 scene that isn't the forest or dungeon — a themed space with its own furniture, one spawn point, and one exit door to somewhere else (another room, or `{ kind: 'forestLevel1' }`, a destination kind that now just re-enters the chunked dungeon). The house (`rooms-data.ts`'s `'house'` entry) is the first one defined, but it is no longer where a new game starts — `startNewGame()` (`scripts/game.ts`) now opens in the starting town (see \"Starting Town\" below), skipping the room entirely. The house room definition itself is untouched and stays registered (still reachable via `__debug.enterRoom('house')`, or by any future room/door that targets it), it's just not the entry point anymore. The older single-forest-level system (`worldGen.ts`'s `generateWorld`/`planDoorPath`/loot-table functions, `game.ts`'s `setupLevel()`) has been deleted outright — it was fully unreachable from normal play, including the Old Man NPC placement it used to do via `setupLevel()`'s `landmark` object. The Old Man himself is not gone, though: he now lives in the starting town's own fixed layout (`scripts/town.ts`'s `getTownTile`) — he briefly passed through the chunked dungeon's own start room in between (`placeOldManLandmark`/`computeOldManSpot`, level-1-only), but that placement was removed outright once the town became the actual entry point, since a fresh run now meets him before the dungeon even starts. Dungeon rooms do have real content of their own (a chute, a hole, snakes, gold — see \"Chunked Dungeon\" below); re-adding other NPCs beyond the Old Man is still tracked as follow-up work — see `docs/dungeon-generation.md`'s \"Scope of this pass\".\n\nThe cave (`rooms-data.ts`'s `'cave'` entry) is a second registered room, alongside house — it used to be its own bespoke module (`cave.ts`, now deleted) with a money-monster/gold-gate payoff mechanic gating progress to the next floor. That entire mechanic (the money monster mob, `CAVE_GATE`/`LOCKED_CAVE_GATE` tiles, `gatePrice`, and the gold-contribution/gate-unlock persistence in `save.ts`'s slot `progress`) is gone outright — the cave is now just an ordinary enter/exit room like the house (currently empty `decor`, reachable via `__debug.enterRoom('cave')`; a real door into it from a dungeon floor is still follow-up work, same as it was before this change), with room to add NPCs to it later. The rabbit mob (`rabbit.ts`, also deleted) is gone the same way — its spawn trigger was already permanently disabled (a holdover single-forest-level tree-count threshold that never applied to the chunked dungeon), so nothing in normal play could ever reach it.\n\n`scripts/rooms.ts` is the generic engine (types, `registerRoom`/`getRoomDef`/`getRoomTile`, `enterRoom`/door-exit handling, theming via CSS custom properties, save/load restore) — it never needs to change to add a room. `scripts/rooms-data.ts` is the only place concrete rooms are defined: each is one `registerRoom({...})` call with a `theme` (colors, applied as `--room-*` CSS variables — see `body.room-mode` in `styles/styles.css`), a `musicTrack` ('forest' or 'cave'), a `spawn` point, a `door` position + `destination`, and a `decor` list (impassable furniture tiles like `BED`/`CHAIR`/`VASE` from `tile.ts`). Adding a new themed room/destination is just another call in that file — no engine or CSS edits required.\n\nTransitions in and out of a room reuse the same fade-to-black every scene transition uses (`scripts/fade.ts`) so menu → room → forest → dungeon all feel like one consistent transition system.\n\n## Starting Town (`scripts/town.ts`)\n\nThe actual entry point of every run: a fixed, non-procedural 9×9 outdoor square, entered once at the start of every run via `startNewGame()`'s `enterTown()` call — before the chunked dungeon, not inside it. It's a standalone module (not the generic `Room` engine above) because it's an *outdoor* scene: plain `setThemeColor(FOREST_THEME_COLOR)` like the forest/dungeon itself, no `applyTheme()`/`room-mode` indoor palette swap, and its border is `TREE_WALL` (matching the dungeon's own solid filler) rather than `ROOM_WALL`. `getTownTile(x, y)` is the pure layout function (unit-tested cell-by-cell in `tests/town.test.ts`): a `TREE_WALL` ring with a real `HOLE` (🕳️) at top-center flanked by two non-breakable `WALL`s (not `ROCK`, matching the rest of the border's own non-breakable trees), a `HOUSE` in each interior corner (flavor dialogue only, same `FLAVOR_EXAMINE` table `BED`/`CHAIR` already use), `OLD_MAN` and a `FOUNTAIN` landmark on the center column, two `GARDEN_TREE` decorative obstacles (distinct from breakable `TREE` — never choppable) flanking that column, a dirt `PATH` connecting the gate to the Old Man and out to both house pairs, and the player's own spawn point at the bottom of it. The Old Man's and the fountain's own cells sit on that same dirt path — `getTownTerrain(x, y)` (`town.ts`) reports `'PATH'` terrain for those two cells independently of `getTownTile`'s plain `OLD_MAN`/`FOUNTAIN` content there, via the terrain layer described below, rather than the `animation`-as-styling-override trick this used to rely on (which only ever worked for `FIRE`, where `animation` happened to equal its own `type` — a landmark whose `type` differs from `PATH`'s could never actually pick up `PATH`'s styling that way, since `state.grid` only ever stores a bare `TileType` string and every repaint re-derives the tile from `TILE_FROM_TYPE`'s single canonical entry per type, discarding the override).\n\nThe town's dungeon entrance is the exact same `HOLE` tile as every dungeon floor's own hole — not a separate always-open gate. An earlier version had a distinct `DUNGEON_GATE` tile (same glyph, but unconditional, no chute needed) reasoning that a fresh run starts with zero chutes so the very first hole can't require one; that was wrong, since two 🕳️ tiles with different life-or-death rules teaches the player that holes are safe right before the first real dungeon floor kills them for believing it. The fix was to make the mechanic consistent instead: `interactWithHole` (`player.ts`) branches its *success* path on `state.inTown` (`exitTownToDungeon()` vs. the normal `endGame()`), but the failure (no chute → death) path is identical everywhere a hole appears — and the Old Man now grants a starting `CHUTE` (his previous starting `WEAPON` grant is dropped for now — see `ink/old-man.ink`) so a fresh run's first hole is actually survivable. The grant goes through a generic ink `EXTERNAL grantItem(itemType)` (`scripts/npcs-data.ts`'s `bindGrantItem`, dispatching on a small `GRANTABLE_ITEMS` factory table keyed by `TileType` string, which still has a `WEAPON` entry ready for reuse) rather than a dedicated `giveChute()` — any future NPC's `.ink` script reuses this same binding to hand out an item, instead of growing its own external per item kind.\n\nThe town is \"Floor 0\": `startNewGame()`'s `state.resetLevel()` already defaults `currentLevel` to `0`, and no longer calls `state.incrementLevel()` itself — that happens in `town.ts`'s `exitTownToDungeon()` instead, the instant the player actually walks through the gate, right before `loadStartingDungeonChunk()`. So `currentLevel` reads `0` for the entire time a run is parked in town. The one place this was ever surfaced to the player, the slot-select card's location line (`save.ts`'s `getSlotSummary`), gets its own branch for it (`r.inTown → getString('location.town')`, i.e. \"Town\") checked before the generic \"Level N\" fallback, the same pattern `currentRoomId` already used there (`r.currentRoomId === 'cave'` → \"Cave\", any other `currentRoomId` → \"House\" — see the \"Rooms\" section above for why a plain room-id check is what identifies the cave now, not a separate boolean).\n\n`state.inTown` is a boolean alongside `currentRoomId`, persisted as an optional/additive `SerializedRun.inTown` field (no `SAVE_VERSION` bump needed — a save from before the town existed simply has no `inTown` field, which reads as falsy, exactly correct since that save could never have actually been mid-town). The dungeon-only minimap/edge-arrow restore guard in `save.ts`'s `loadGame()` has an exclusion (`!d.currentRoomId && !d.inTown`) so a save frozen mid-town or mid-room doesn't paint dungeon-only chrome over their own grid. `town.ts`'s `syncTownTheme()` (cosmetic re-tint only, matching `syncRoomTheme`) is called from `slots.ts` after a resumed load, not from `save.ts` itself — `town.ts` needs `saveGame` from `save.ts` for `exitTownToDungeon`, so `save.ts` importing back from `town.ts` would be circular; `rooms.ts` already dodges the same problem the same way.\n\n## Chunked Dungeon (`scripts/dungeonGen.ts` + `scripts/dungeonWorld.ts` + `scripts/dungeonTransition.ts` + `scripts/minimap.ts`)\n\nThe game's actual entry point and level structure: a persistent Rogue-1980-style dungeon, a 3×3 grid of 9×9-tile chunks — Rogue's own region-grid size, one chunk per region. The generator is the original Rogue level algorithm at its native scale, not just its shape: every chunk independently rolls a `goneChancePercent` chance (35% default) to be marked GONE (a bare waypoint) rather than a real room, capped at `maxGonePercent` of the grid (44% default, Rogue's own `4/9`), so room count is emergent, not a fixed target — then a randomized spanning tree (Prim's algorithm, orthogonal neighbors only) grows over the whole chunk-adjacency grid until every chunk is connected, digging exactly one randomly-placed 1-tile doorway per connected chunk-edge; a GONE chunk that picks up a corridor along the way becomes a `hallway` chunk. Everything else in a chunk is solid, non-breakable `TREE_WALL` (visually a tree, but distinct from the forest's breakable `TREE` — see `tile.ts`). `dungeonGen.ts` is pure, deterministic, seeded topology (never touches a `GroundTile`); `dungeonWorld.ts` turns one chunk's topology into real tiles, generically over any chunk kind, so it never needed to change when the placement/connectivity algorithm did; `dungeonTransition.ts` ports the screen-to-screen transition mechanism from the sibling `ninjack-2` repo's island/chunk system (the mechanism only, not its heightmap/biome generation) — walking off a chunk's edge fades to black, regenerates the neighbor chunk, and fades back in. Every boundary tile with a live door also gets a small rotated-arrow indicator (`data-edge-arrow`/`data-edge-arrow-b`, `updateChunkEdgeArrows` in `dungeonTransition.ts`) so a connected exit is visible without wandering the whole edge. A fixed bottom-right minimap (`minimap.ts`) shows a \"Floor N\" header over the 3×3 chunk grid with the current chunk highlighted — this replaces the separate top-bar title (\"Slitherwood Lv. N\") that used to show during plain dungeon exploration; `ui.ts`'s `updateGoldDisplay` now hides that bar entirely outside a room/the cave, since neither has a minimap of its own to carry the floor number instead. `game.ts`'s `startNewGame()` and `debugSkipToLevel()` (jumps straight to the start of dungeon floor N, boss floors included) both enter through this system now, never through `worldGen.ts`'s forest generator.\n\nRooms hold real content now (`DungeonLayout.content`, rolled once per seed in `dungeonGen.ts`'s `placeContent`): one `CHUTE`, one `HOLE`, per-room enemy spots (`content.snakes` — the field name predates a second species, see below), and `content.freeTileDrops` — one roll per free interior room tile left over once chute/hole/enemy spots are placed (`placeFreeTileDrops`): `FREE_TILE_NOTHING_CHANCE_PERCENT` nothing (80), `FREE_TILE_GOLD_CHANCE_PERCENT` gold (10, a random amount, `GOLD_DROP_MIN`–`GOLD_DROP_MAX`), `FREE_TILE_ITEM_CHANCE_PERCENT` item (10, a weighted `DropCategory` — `weapon`/`armor`/`shield`/`bow`/`backpack`/`potion` at equal weight, `food` at double — see `EQUIPMENT_CATEGORY_WEIGHTS`). This replaced an earlier design where gold/healing-potion/equipment each independently claimed their own fixed per-floor spot count (`smallGoldCount`/`heartCount`/`EQUIPMENT_SPAWN_COUNT` are gone) — loot density now scales with a floor's own free room space instead of a flat total. `HEALING_POTION` (formerly named `HEART` — see \"Tile Identity & Save Data\" below for why the rename was safe) no longer drops from mob kills — `entityDefs.ts`'s `SNAKE_DEF`/`RAT_DEF` `startingLoot` tables dropped their own flat-heal entries (the freed percentage folds into \"nothing,\" not gold), so a floor's own free-tile rolls are the only source of healing potions now, each with its own rarity-rolled `healPercentPerTurn`/`healDuration` (`healingPotion.ts`'s `rollHealingPotion`) rather than one shared flat rate. Enemy spot count is *not* a flat dungeon-wide total — `getRoomEnemyCount(room)` scales each room's own count with `getRoomTileCount(room)` (width × height, `ROOM_TILE_COUNT_PER_ENEMY` tiles per potential enemy, floor of `MIN_ENEMIES_PER_ROOM`), so a big room reliably gets more enemies than a small one. `placeContent` also rolls `content.pathwayEnemies`, one spot (the chunk's own center) per **hallway** chunk (a GONE chunk that picked up a corridor) — a corridor with no room of its own still isn't necessarily empty. The same pass also rolls `content.shop` (at most one `SHOP` landmark per floor, deterministic-random among whichever hallway chunks qualify for a 3x3 on their north side, `dungeonGen.ts`'s `findOutpostSpots`/`OUTPOST_SIZE` — `null` on the roughly one-third of floors where none do) and `content.ponds` (one `POND` footprint — an area feature, not a point landmark — for every *other* hallway chunk that has room for one, `findPondSpots`/`POND_SIZES`, a side rolled first then a size within it); both are excluded from `content.pathwayEnemies`'s own candidate cells so a pathway enemy can never roll a spot about to become open shop floor or water. See `docs/dungeon-generation.md`'s \"Content\" section for the full placement rules and the \"Empirical footprint availability\" reference data these spawn rates were tuned against. `HOLE` has no lock/unlock state at all (unlike the old `LOCKED_DOOR`/`DOOR` pair it replaced) and is `movable: true`, so it can never wall a room off from its own doorway — it's simply baked directly into that chunk's static tiles (`dungeonWorld.ts`) like any other ground content. The `CHUTE`/free-tile-drop Items and enemy mobs can't be baked the same way, so `dungeonTransition.ts` drops them in as a post-render step: `applyDungeonChunkItems` (CHUTE/freeTileDrops) only on a chunk's first-ever visit, but `spawnDungeonChunkEnemies` (room spots) and `spawnDungeonChunkPathwayEnemies` (hallway spots, indices offset by `content.snakes.length` to avoid cache collisions) on **every** visit — a spot respawns at its original position and full health on every revisit, *unless* that spawn spot's occupant has actually been killed (or fallen in a hole) this floor, in which case it stays gone for the rest of the floor rather than coming back to life (`state.ts`'s `#killedDungeonEnemies`, marked by `clearDungeonEnemyLoot` — the same call already made at every kill site in `player.ts`/`moverMovement.ts` — and checked by both spawn functions before they respawn anything). Which species spawns at a given spot is picked fresh on every respawn from that floor's zone (`zones-data.ts`'s `pickZoneEnemyType`/`pickZonePathwayMobType`, seeded off `(dungeonSeed, spot, index)` via `dropsCore.ts`'s `hashToSeed`/`seededRand` so a given spot always resolves to the same species on a given seed/visit), then handed to a shared `spawnSpeciesAtSpot` helper that dispatches through a `SPECIES_SPAWNERS` table (`SNAKE`/`RAT`/`BAT` today) rather than a per-species branch — see \"Unify by data, not by call site\" above. Each spawn spot's starting loot (`lootChance.ts`'s `rollLootChance` against that spot's own species `EntityDef.startingLoot` — a data-driven, species-agnostic mutually-exclusive roll) is only rolled once per floor and reused on every later respawn (`state.ts`'s `getDungeonEnemyLoot`/`setDungeonEnemyLoot`, keyed by the spot's index), so leaving and re-entering a room can't be farmed for fresh rolls. Walking into the `HOLE` while holding a `CHUTE` (`interactWithHole` in `player.ts`, which consumes the chute) fires `endGame()` → `advanceLevel()` → `game.ts`'s `advanceToNextFloor()`, which advances **directly** from floor N to floor N+1 (fade out, increment `state.currentLevel`, roll a fresh `dungeonSeed`, `loadStartingDungeonChunk()`, fade in). Walking in without a chute is still instant death, same as `HOLE`'s original meaning.\n\n**Mob species (`entityDefs.ts` + `zones-data.ts`)**: `SNAKE`, `RAT`, and `BAT` are all `EntityDef`-driven and move through one unified `moveMobs()`/`updateMobArrows()` loop over `state.mobs` (`scripts/moverMovement.ts`) — there is no per-species move function. Which species can appear where is zone data, not code: `ZoneDef.enemies` (room spots) and `ZoneDef.pathwayMobs` (hallway spots) are each an ordered, weighted `TileType[]` — Slitherwood (floors 1-5, zone 1) is `enemies: [RAT.type, BAT.type, SNAKE.type]` (weakest-to-nastiest — rat/bat are 1-HP fodder, snake is the real 2-HP threat and leans in toward floor 5) / `pathwayMobs: [BAT.type]` (bat also shows up in room-less hallway chunks, on top of its `enemies` entry); every other zone is still `[SNAKE.type]`/`[]` pending its own roster (see `docs/zones.md`). `BAT_DEF.flies = true` is one behavioral fork: a flying mover's passability check (`isMoverBlockedAt`) skips ordinary ground solidity (`TREE_WALL`, room obstacles) entirely — only a level-exit tile or another live occupant still blocks it — and it's immune to `HOLE` death (`moveMob`'s `isHole` check excludes `mob.def.flies`). Rendering a flying occupant over an otherwise-impassable ground tile (so a bat visibly flies over a tree without hiding it) is `tileUtils.ts`'s `renderTile`: when `getOccupant(x, y)` is a flying mob, the ground tile's own `display` is written as the cell's base `textContent` and the occupant's glyph is appended as a separate absolutely-positioned `.tile-flying-overlay` span on top (`styles/styles.css`) — CSS stacking means the in-flow base text always paints under the absolutely-positioned overlay with no `z-index` needed. Any animated mover's `syncDestText` callback (see \"Animation Contract Gotchas\" below) must therefore be a self-contained repaint (`() => renderTile(x, y)`), not a return-a-string callback, so a flying mover's slide/lunge resync goes through the same compositing path. `BAT_DEF.diagonalOnly = true` is a second, independent fork: a mover's `'random'` pattern step (and the one-turn-ahead arrow prediction driving it, `computeNextDir`) normally picks from the 4 cardinal directions (`tileUtils.ts`'s `getRandomDirection`/`DIRS`), but a `diagonalOnly` mover picks from the 4 diagonal directions instead (`getRandomDiagonalDirection`) — both routed through one shared `randomDirectionFor(mob)` helper in `moverMovement.ts` so a bat's actual move always matches its own displayed arrow. `getNewTileInDirection` grew 4 more `case`s (`'up-left'`/`'up-right'`/`'down-left'`/`'down-right'`, moving both axes at once, each independently clamped at the board edge same as the cardinal cases) and `styles.css` grew matching corner-anchored `data-snake-dir`/`-out` rules — chase pathfinding (`findChasePath`) stays cardinal-only regardless, since no diagonal-moving species chases today.\n\nA chunk's *ground* content only generates once per floor: `state.ts`'s `DungeonChunkSnapshot` cache (keyed by chunk coordinate, cleared on every new `dungeonSeed`) snapshots the chunk being left (ground tiles, floor items — no mobs) and restores it on revisit instead of re-rolling `applyDungeonChunkItems`, so a room's progress (picked-up items) survives leaving and coming back. Enemies are deliberately excluded from that snapshot (see above) — they're re-evaluated fresh on every `loadDungeonChunk` call regardless of the snapshot branch, respawning unless their spawn spot is marked killed (see above). `dungeonSeed`/`dungeonChunkX`/`dungeonChunkY`, the chunk cache, and the per-spawn-spot enemy loot cache are persisted (`save.ts`, `SAVE_VERSION` 12) — the full 9-chunk layout and its content are a pure function of the seed, cheaply regenerated on load rather than stored. The per-spawn-spot killed set (`#killedDungeonEnemies`) is persisted too, as `killedDungeonEnemies` — optional/additive rather than `SAVE_VERSION`-gated, since a pre-existing save simply has none, which reads as \"nothing killed yet.\" A live dungeon snake's `Mob.dungeonLootIndex` (also `save.ts`, `SAVE_VERSION` 12) is the deterministic link back to its own slot in that cache — the earlier implementation relied on the snake's live `inventory` array happening to be the same object as its cache entry, which broke across a save/reload and let a killed-and-looted snake's spot hand out the same pre-death loot forever; see `state.ts`'s `clearDungeonEnemyLoot` and `save.ts`'s `deserializeMob`. Full generation algorithm, content placement, chunk cache, rendering rules, tunable parameters are in the docs hub's \"Chunked Dungeon Generation\" doc / `docs/dungeon-generation.md`, with a tunable live preview (seed, room size, grid size, GONE chance — all driving the exact real generation function, not a reimplementation) at `scripts/docs-dungeon-generator.ts`.\n\n## Tile Identity & Save Data (`scripts/tileIds.ts`)\n\nEvery `Tile` (`tile.ts`) carries a stable numeric `id` (`tileIds.ts`'s `TILE_ID` table) alongside its `type` string. `save.ts` persists an item/mob/ground-cell by `id`, never by `type` string or `display` glyph — `SerializedBagItem`/`SerializedInventoryItem`'s `tileId`, `SerializedMob`'s `speciesId`, `SaveData`/`SerializedDungeonChunkSnapshot`'s `gridState` (now `number[][]`, converted at the save.ts boundary via `groundTileFromType(t).id` on save / `tileFromId(id).type` on load — `state.grid`'s own live in-memory representation is untouched, still plain `TileType[][]`, so none of the hundreds of `tile.type ===` comparisons throughout gameplay code needed to change). This is what makes a rename like `HEART` → `HEALING_POTION` safe: the `type` string and `display` emoji are both free to change at any time without orphaning an item already sitting in a real save — only `tileFromId`'s registry lookup matters for persistence, and `TILE_ID`'s own numeric values must never be reassigned or reused (see that file's own comment for the append-only rule). `GraveMarkerItem` (`save.ts`, part of a slot's `progress` — never wiped by a `SAVE_VERSION` bump, see below) follows the same `tileId`-not-`type` rule for the same reason, even though it isn't gated by `SAVE_VERSION` at all.\n\n## Save Slots & Run Persistence Model (`scripts/save.ts`)\n\nThere are 4 independent save slots, each its own `localStorage` key: `ninjack_slot_{n}` (`n` is 1–4), holding one nested object — `{ version, status, run, runHash, progress }`. This is a single key per slot rather than one key per concern (the pre-slots code had 7 separate top-level keys) because writing any of it already means `JSON.stringify`-ing the whole value, so there's no perf reason to keep them apart, and it means deleting a slot is one `removeItem` call instead of remembering every key group. `save.ts` tracks a module-level `activeSlot` (`setActiveSlot`/`getActiveSlot`) — every other save.ts function keeps its pre-slots no-arg signature and just operates on \"whichever slot is active,\" so none of their call sites elsewhere in the codebase (`player.ts`, `rooms.ts`, `dialogue.ts`, `game.ts`) needed to change.\n\nDeath and win don't wipe everything — only the **current run**, and even that isn't wiped immediately. `handleDeath()`/`handleWin()` (`scripts/game.ts`) call `markSlotFinished(getActiveSlot(), 'dead' | 'won')`, which only flips `status` — the `run` itself (position, health, level, gold/swords/chutes, world grid, mobs, loot tables) is left completely alone, so the slot-select screen can still show a \"Died\"/\"Run Complete\" card with real final stats. (`handleWin()`'s only trigger was the level-10-only chute+hole escape from the old forest system; `HOLE`/`CHUTE` are the dungeon's ordinary per-floor progression mechanic now, so `'won'` currently has no reachable trigger — the status/UI plumbing for it is left in place rather than ripped out, in case a real win condition is designed for the endless dungeon later.) `clearSave()` is what actually wipes `run`/`runHash` back to `null` and `status` back to `'active'` — it only runs once the player starts the slot's next run (or starts fresh in an empty slot), both of which go through `startNewGame()`, which still calls it exactly as before.\n\nThis is a permadeath roguelite, and the slot-select UI's language is deliberately roguelite-toned, not arcade-toned: a finished slot's badge says \"Died\" (not \"Game Over\") and its action button says \"Start Run N\" (`getSlotSummary(n).runCount + 1`, not \"Restart\") — matching the exact wording `showDeathModal()`/`handleWin()` already use in-game (`Start Run ${getNextRunNumber()}`), since death is a normal beat of the loop here, not a failure screen to apologize for. `SlotSummary.runCount` (from `progress.runCount`) is what makes \"Slot N · Run R\" and \"Start Run N\" possible — it's a deliberate meta-progression readout, not incidental.\n\n`run`/`runHash`/`version` are versioned and hash-checked independently of the slot's `progress` (graves, run count) — a corrupted or version-mismatched run resets just the run via `clearSave()`, never the slot's meta-progression, matching the pre-slots single-save behavior where a run reset on death but meta-progression survived:\n\n- `progress.runCount` — bumped by `incrementRunCount()` on every new run in this slot, used only for the \"Start Run N\" label.\n- `progress.graves` — `handleDeath()` calls `saveGraveMarker(level, {gold, swords})` *before* `markSlotFinished()`, dropping your gold/swords as a grave at your death's level (up to 5 per level, oldest evicted when full). A *future* run in *this slot* reaching that same dungeon floor finds it via `getGraveMarkers()`.\n\n(A gold-contribution/cave-gate-unlock economy used to live in `progress` too, tied to the cave's old money-monster payoff mechanic — see the \"Rooms\" section above for why that's gone. `progress` is just `runCount` and `graves` now.)\n\nSo \"restarting a slot\" means its character resets to fresh, but the loot from its past deaths is still sitting there waiting to be found — restarting slot 2 has zero effect on slots 1/3/4. `deleteSlot(slot)` is the only thing that wipes a slot completely (one `localStorage.removeItem`) — everything else (`clearSave()`, `startNewGame()`) only ever resets the run, by design.\n\nThe legacy pre-slots single-save keys (`ninjack_save`, `ninjack_save_hash`, `ninjack_gate`, `ninjack_gates_unlocked`, `ninjack_contributions`, `ninjackRunCount`, `ninjack_graves`) are left in place, untouched and never read again — no migration code, since there was no real player base to migrate. See the docs hub's \"Save Slots Plan\" for the full design writeup this was implemented from (note: that writeup predates the cave-gate-economy removal and still describes `progress.gate`/`gatesUnlocked`/`contributions` as live fields — historical only).\n\n## Dynamic Strings (`scripts/strings.ts`)\n\nEvery user-facing string in normal gameplay routes through `getString(key, ...args)` rather than being a literal — this is what lets copy be edited and deployed (`strings/strings.json` → `.github/workflows/deploy-strings.yml` → a public-read Firestore doc) without an app rebuild or store release. `defaultStrings` is the bundled fallback shipped in every build; `loadStrings()` (called fire-and-forget from `main.ts`) overlays the live Firestore value on top at startup, falling back to the last cached copy and then the bundled default if the network is unavailable. `getString(key, ...args)` replaces `{0}`/`{1}` placeholders positionally (e.g. `\"modal.death\": \"You died 💀 on Level {0}!\"`). See the docs hub's \"Dynamic Strings (Firestore)\" doc for the full architecture, deploy mechanics, and security rules.\n\n**The one real gotcha**: `loadStrings()`'s fetch is still in flight when the rest of the module graph finishes its own top-level code, so anything that calls `getString()` exactly once at module-import time and reuses that result across many future renders freezes on the bundled default forever, even after the live fetch resolves. This is why `ui.ts`'s `alertMessages` (`welcome`/`death`/`win`) are typed `() => string` rather than `string` — the object is built once at module import time, so each message has to be resolved lazily at render time (`showModal(alertMessages.death())`), not baked in once. Anything already inside a function that's naturally called fresh each render (menu/slot-card rendering, HUD updates, modal builders) needs no special handling — just call `getString()` inline where the literal used to be.\n\n**Excluded on purpose**: NPC dialogue (ink-script bodies, compiled at runtime by `inkjs`) does not route through `getString()`/Firestore. A live-edited override would only ever be a flat string, which throws away exactly the ink features (inline variable interpolation, alternatives/cycles/shuffles) that make a line worth authoring in ink instead of as a plain string in the first place — that tradeoff only makes sense per-line, deliberately opted into, not as a blanket migration. See \"NPC Dialogue\" below for where the ink content actually lives.\n\n## NPC Dialogue (`ink/*.ink` + `scripts/npcs-data.ts` + `scripts/dialogue.ts`)\n\nEvery NPC's ink script is its own file in `ink/` (`ink/old-man.ink`, `ink/house.ink`, ...), loaded via Vite's `?raw` (the same mechanism `docs/*.md?raw` uses for the docs hub) rather than embedded as a JS template literal — real `.ink` files get proper ink syntax highlighting and no JS-string escaping, and centralizing them in one directory mirrors `docs/` (documentation) and `strings/` (UI copy) each having their own dedicated home. `scripts/npcs-data.ts` re-exports each script's raw text (kept as a named export, e.g. `OLD_MAN_INK`, so `tests/npcs-data.test.ts` can compile and drive it directly with `inkjs` without going through the DOM-driven `runDialogue()`) plus that NPC's trigger function (`talkToOldMan()`, `examineHouse()`) wiring `setup`/`bindExternals` to real game state. `scripts/dialogue.ts` is the reusable engine (same split as `rooms.ts`/`rooms-data.ts`) — adding a new NPC means writing `ink/<name>.ink` and one trigger function here, never touching `dialogue.ts`. An NPC that hands the player an item calls the one generic ink `EXTERNAL grantItem(itemType)` (`npcs-data.ts`'s `bindGrantItem`, bound via `bindExternals: (story) => bindGrantItem(story)`) rather than declaring its own `giveX()` external — `itemType` is a `TileType` string looked up in `GRANTABLE_ITEMS`, a small factory table (add a new entry there for a new grantable item, not a new bind function).\n\n## Main Menu → Slot Select Flow (`scripts/menu.ts` + `scripts/slots.ts`)\n\nThe main menu has one button, **Play**, which always opens the slot-select panel — there's no \"Continue\"/\"Start Run\" branch on the main menu itself anymore, since which-save-to-play is now a slot-screen question, not a main-menu question. The slot panel renders 4 cards via one data-driven `renderSlotCard(n, summary)` (empty/active/won/dead are all the same function branching on `getSlotSummary(n).status`, not 4 hand-written card variants) with `Continue`/`Start Run N`/`Delete` actions; tapping an empty card starts a new run in it immediately (no extra confirmation screen). `Delete` requires a second click within 3s (the button becomes \"Confirm?\") rather than a modal.\n\n**Main Menu and Slot Select are two panels of one persistent overlay, not two separate overlays.** `showMainMenu()` (`scripts/menu.ts`) creates a single `#main-menu` div once and only ever swaps `#menu-content`'s children between `renderMainPanel()` and `slots.ts`'s `renderSlotsPanel()` — Play/Back never touch `#main-menu` itself. `#main-menu` only ever fades out once, via `runTerminalAction()`, when a real game-starting action (continue/start/restart a run, or a dev skip) actually completes. This exists because an earlier version gave Slot Select its *own* separate overlay that faded the main menu out and faded itself in — since `#main-menu`'s backdrop is translucent+blurred, not opaque, that fade-out briefly exposed whatever's sitting behind it: the always-present decorative \"fake Level 0\" scene from `generateBackground()` (`scripts/worldGen.ts`), which has nothing to do with any real save. It only ever looked fine for Continue/New Game because those *awaited the real game loading first* and faded the menu out *after*, so the reveal was always the correct, fully-loaded game — never true for a Play → Slot Select hop, which doesn't load anything by itself. Keeping one overlay whose content merely swaps sidesteps the whole \"which screen fades first\" choreography rather than requiring it to be re-solved for every future panel-to-panel hop.\n\n`slots.ts` takes its navigation as hooks (`onBack`, `runTerminalAction`) from whoever renders it rather than importing `showMainMenu` itself — so `menu.ts` → `slots.ts` is a plain one-way dependency, no circular import.\n\nTapping an empty slot card hands off to a third panel the same way, not straight into `runTerminalAction`: `scripts/new-game.ts`'s `renderNewGamePanel` (a ninja-skin picker + name field, written to the slot's profile via `saveSlotProfile` only once its own `#new-game-start` button is pressed) reuses the identical swap-`#menu-content`'s-children contract and the same `onBack`/`runTerminalAction` hooks, so `slots.ts` → `new-game.ts` stays one-way too. Resuming an already-occupied slot (`Continue`/`Start Run N`) skips this panel entirely and calls `runTerminalAction` directly from the slot card.\n\n`runTerminalAction`'s `transitionend` listener is guarded (`e.target === menu && e.propertyName === 'opacity'`), not a bare `{ once: true }` — `transitionend` bubbles from any descendant's own transition (button hover/active, the skin dropdown's slide, ...), so an unguarded once-listener can consume itself on the wrong event and remove the overlay before its actual opacity fade finishes.\n\n## Animation Contract Gotchas (`scripts/animations.ts`)\n\n- **`slide`/`lunge`/`shoot` configs with a `destEl`/`srcEl` MUST pass `syncDestText`/`syncSrcText` to restore the tile's text after the overlay finishes.** `animateSlide` clears `destEl.textContent` at the start and only restores it via `syncDestText()`; `animateLunge`/`animateShoot` do the same for `srcEl` via `syncSrcText()` — if you omit either, the tile silently stays blank forever after that entity moves (this exact bug once made a removed mover \"vanish\" after every move — a mover queuing a slide with `destEl` but no `syncDestText`). Both are `() => void` — a self-contained repaint callback, not a return-a-string-to-assign callback (they used to be the latter, and `srcEl` used to be an implicit plain-string snapshot/restore with no callback at all — see \"Difficult-to-Diagnose Bugs\" below for why that specific shape was actively dangerous, not just less flexible). When adding a new animated mover, always pass `syncDestText: () => renderTile(x, y)` / `syncSrcText: () => renderTile(x, y)` (`tileUtils.ts`) — the one call that's correct for every occupant, flying or not, styled or plain — rather than hand-rolling a `tileFromType`/`getGridTile` read or snapshotting `.textContent` as a plain string.\n- **`tileFromType()` collapses tile variants that share one `TileType`.** If a future mob reuses one `TileType` string across a ground-statue phase and one or more occupant-display phases (the way the now-removed money monster once did with `MONEY_MONSTER`), `tileFromType(that type)` always returns just the base registered `Tile`, never a specific variant. Never use `tileFromType(getGridTile(...)).display` to resync a tile that might hold one of these — capture the entity's own `tile.display` up front and reuse that instead.\n- **Glow that lives on a tile's `dataset` (e.g. `data-has-chute`) does not carry over to the animated overlay clone.** The overlay is a separate `<div>` appended to `#notification-container` in `makeOverlay()`, not the tile element — a CSS rule scoped to `.tile[data-has-chute]` has no effect on it. To keep a chute-carrying (or otherwise glowing) entity glowing *while it slides/lunges*, pass `glowChute: true` on the `AnimConfig` and let `makeOverlay` add the `.anim-overlay-chute-glow` class (mirrors the tile's radial-gradient glow CSS). Follow this pattern for any future \"glow persists through animation\" need rather than only styling the resting tile.\n- **`kind: 'hit'`'s `syncText` follows the exact same `() => void` self-contained-repaint contract as `syncDestText`/`syncSrcText` above, not a return-a-string callback.** `animateHit`'s el-mode blanks `cfg.el.textContent = ''` at the start the same way slide/lunge do, so any `el` that could be a composited tile (a flying mob's tile, or the player's own tile mid-shield-raise) needs `syncText: () => renderTile(x, y)` for the same flattening reason documented in \"Difficult-to-Diagnose Bugs\" below — a plain-string restore (the fallback when `syncText` is omitted) is only safe when `el` is certain to never be composited. This was missed for a while: `animateHit` originally only grew a `syncText` to fix a *different*, narrower bug (the same `el` getting hit twice in one enemy phase — see `tests/multi-snake-hit-disappear-bug.test.ts`) and that fix was typed `() => string`, which resolved the staleness race but could still flatten a composited `el` on restore. `broodmother.ts`'s `dashResolve`/`quadSpitResolve` both fire `kind: 'hit'` on arbitrary tiles (the player's own cell; a Quad Spit ray's endpoint, which can land on any occupant) with no shield/species precondition at all — the flattening risk there was never conditional on shielding, just on whatever happened to be composited on the affected cell at the time.\n\n## Manual/Live Verification via Console\n\nThis game is heavily DOM/animation-driven and procedurally generated, so unit tests can't exercise real rendering, and organically reaching rare states (e.g. a specific late-zone dungeon floor) is slow. When verifying in a real browser (e.g. via Playwright), the fastest reliable path is to reach into the page's own already-loaded ES module graph rather than reimplementing logic:\n\n```js\n// Bind live handles ONCE, up front — do this in a single page.evaluate() call.\n// (Note the Vite `base` prefix, e.g. /web-ninjack/, from vite.config.ts.)\nawait page.evaluate(async () => {\n  window.__move = (await import('/web-ninjack/scripts/player.ts')).move;\n  window.__state = (await import('/web-ninjack/scripts/state.ts')).state;\n});\n```\n\n`import()` of a URL the page has already loaded returns the *same* live singleton the UI uses (same `state`, same `move()`/`moveSnakes()`/etc.), so calling these from the console is driving the real app, not a reimplementation — safe to use for setup (placing entities, forcing an AI pattern's next step, jumping straight to `advanceLevel()` to skip maze-solving) as long as the actual behavior under test is still triggered through the real production function.\n\nPitfalls hit in practice:\n- **Don't re-import a module for the first time mid-script in a later `page.evaluate()` call** — bind everything you'll need in one evaluate at the start. A fresh dynamic import issued later produced one confusing stale/inconsistent read of `state` during this session's testing (looked like a false game bug; it wasn't).\n- **Space consecutive `move()` calls generously (≥200ms)** — `move()` doesn't always await its enemy animation phase (only when a lunge is queued), so rapid-fire calls can have their slide animations (110ms each) overlap and produce misleading intermediate DOM reads.\n- **Calling `startNewGame()`/`debugSkipToLevel()`/etc. via console does NOT dismiss the main menu overlay.** On every page load, `main.ts` calls `showMainMenu()` (`scripts/menu.ts`), which appends a `<div id=\"main-menu\">` covering the whole page; it's only removed by `handleAction()` inside menu.ts, which runs *only* when one of the menu's own buttons is clicked (`menu.remove()` after its 0.5s opacity transition). The game-state functions underneath update correctly, but the menu `<div>` — and, on a fresh profile with `localStorage['welcomeSeen']` unset, the welcome `.modal` stacked on top of *that* — stays in the DOM and blocks the view. A screenshot/manual check taken right after a console-only call will show the menu, not the game. **First screenshot attempt in this repo's history got this wrong for exactly this reason.**\n  - Fix: drive scene transitions through the **real buttons**, not console calls, whenever a menu path exists:\n    - New game (empty slot): `page.locator('#modal-ok').click()` if present (first-visit welcome modal), then `page.locator('#menu-play').click()`. There is no `#slot-screen` id — the slot panel is just `#menu-content`'s swapped-in children (see \"Main Menu → Slot Select Flow\" above) — so wait for `.slot-card[data-slot=\"1\"]` (or whichever slot) to appear instead, then click an empty slot card. That opens a further **New Game** panel (ninja-skin/name picker, `scripts/new-game.ts`) — click `#new-game-start` there to actually begin the run. Resuming an already-occupied slot only needs its own `[data-action=\"continue\"]`/`[data-action=\"restart\"]` button; it skips the New Game panel entirely.\n    - DevMode \"skip to dungeon floor N\" (`debugSkipToLevel` in `game.ts`): `page.locator('#debug-level-select').selectOption(String(n))` then `page.locator('#debug-skip').click()` — this one's still on the main menu directly, no slot screen involved.\n    - Wait for `page.waitForSelector('#main-menu', { state: 'detached' })`, then a further ~500-600ms for the concurrent `fadeToBlack`/`fadeFromBlack` (0.4s each, `scripts/fade.ts`) to finish before screenshotting.\n  - Only fall back to a console-imported function for a transition with **no menu equivalent** (e.g. entering a room — house or cave — there's no menu shortcut for either, so call the real `enterRoom(id)` and `await` it directly; it resolves only after its own fade-in completes, which is more precise than a guessed timeout).\n  - **Always read back a screenshot (the `Read` tool) before sending it to the user** — confirm it actually shows the intended scene rather than a leftover menu/modal overlay.\n\n### Screenshot standard: iPhone 17 viewport\n\nThis is a Capacitor iOS/Android app (see `npm run sync`), not a desktop web page — any screenshot for visual review should be taken at **iPhone 17** dimensions so it matches what the user actually sees on-device, not an arbitrary desktop window size.\n\n**Use the device's `screen` size, not its `viewport` size, for the Playwright viewport.** Playwright's installed device registry has an `'iPhone 17'` profile with *two* different height figures: `viewport: {width:402, height:681}` and `screen: {width:402, height:874}`. The `viewport` figure approximates Mobile Safari with its address-bar chrome maximally expanded — but this game's `#controls` bar is `position: fixed` (`styles/styles.css`), so if the emulated viewport is shorter than the page actually needs, the fixed D-pad renders on top of the grid instead of below it. **This exact bug happened in this repo**: a screenshot taken at `681`pt tall showed the D-pad overlapping the last grid row; a real device photo at the same page state showed a clean ~40pt gap. Measuring the real photo (`1206×2622px @3x = 402×874pt`) showed the page needs ~753pt just to reach the bottom of the D-pad, and Safari's actual bottom toolbar is a slim translucent overlay (not a large opaque reserved bar), leaving far more usable height than the canned `681`pt `viewport` figure assumes. The device's `screen` field (`874pt`) comfortably covers this with room to spare and matches real screenshots almost exactly — use it:\n\n```js\nimport { chromium, devices } from 'playwright';\nconst browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });\nconst base = devices['iPhone 17'];\nconst device = { ...base, viewport: { width: base.screen.width, height: base.screen.height } };\nconst context = await browser.newContext({ ...device });\n```\n\nThis works fine with the Chromium binary at `/opt/pw-browsers/chromium` even though the profile's own `defaultBrowserType` says `'webkit'` (WebKit isn't installed in this environment; that field is only consulted by the Playwright *test runner*'s project config, not by a plain `chromium.launch()` script, so it's silently ignored here).\n\nUse this context for every manual/visual verification screenshot going forward, combined with the real-button scene-transition approach above.\n\n### `window.__debug` (`scripts/debug.ts`)\n\nLoad the game with `?dev` and `window.__debug` is installed automatically (console-only, no UI) with shortcuts for exactly the setup pain points above: `dump()`/`dumpGrid()`/`dumpGridEffective()` for state snapshots (`dumpGrid` is ground-layer only — see \"Ground vs. occupant layer\" below — `dumpGridEffective` composites entities on top, matching what actually renders), `setTile`/`clearArea`/`teleportPlayer` for board control, `setHealth`/`setGold`/`giveWeapon`/`giveArmor`/`giveBow`/`giveFood`/`giveHealingPotion`/`giveChute`/`giveBackpack`/`setFullness` for inventory, `spawnSnake`/`jumpToChunk` for entities/board navigation, plus raw access to `state` and the real `move`/`moveSnakes`/`advanceLevel`/`enterRoom`/`enterTown` functions for manual turn-stepping (`enterRoom('house')`/`enterRoom('cave')` jump straight into any registered room — see \"Rooms\" below — instead of restarting a new game). Extend this file rather than re-inventing the console-import dance above when a new debug need comes up.\n\n## Difficult-to-Diagnose Bugs\n\nA running log of bugs whose root cause took multiple rounds of real-device investigation to actually find — kept here, with the trail that got there and the dead ends along the way, so a superficially similar future report doesn't restart the same investigation from zero.\n\n### The iPhone Safari \"screen zooms after a hit\" bug\n\n**Symptom**: on a real iPhone (Safari/WebKit only — never reproduced in Chromium/Playwright, no matter how faithfully the real game loop was driven through it), landing a hit — every report specifically named bats — would sometimes make the whole screen appear to zoom in (bigger tiles, fewer columns visible, cut off at the edges), staying that way until the player's next move.\n\n**False leads investigated, in order** (each backed by real evidence at the time, each eventually ruled out by a later on-device capture — not wasted work, just not it):\n1. Native pinch/double-tap zoom (`main.ts`'s `gesturestart`/`gesturechange`/multi-touch `touchmove`/`touchend` guards, still in place as legitimate hardening) — ruled out once `visualViewport.scale` was confirmed to never move during the bug.\n2. A WebKit SVG-filter bug (`filter: url(#hit-flash-white)` and `transform: scale()` combined on one element — cites real WebKit bug 184601) — split onto separate elements (`animHitScale`/`animHitFlash` keyframes in `styles/styles.css`, still the current shape). Ruled out once a capture showed the bug still firing on a hit that never even ran this code path (a shield-blocked, 0-damage hit skips the player's own hit-flash entirely — see `moverMovement.ts`'s `onHit`).\n3. `vmin` resolving to roughly double its correct px value (`.tile`'s size ultimately derives from `font-size: 7vmin`, and the doubled tiles were ~2x) — ruled out by a live hidden 1vmin probe element that never moved from its correct size.\n4. A duplicate DOM element sharing a `.p{x}-{y}` class (`tileUtils.ts`'s `getTileElement` resolves a tile via `document.querySelector`, which silently returns only the first match if two elements ever shared a class) — ruled out by a whole-document scan finding exactly 81 `.tile` elements, always.\n\n**What actually got there**: `scripts/zoomDebug.ts`, a `?dev`-only diagnostic tool (still in the codebase, wired into `main.ts`/`damage.ts`/`player.ts` — harmless to leave running, adds a small 📋 export button top-right under `?dev` that copies a JSON event log to the clipboard). It ran a continuous poll from the moment of a hit until the next move actually cleared it (a single fixed-delay snapshot wasn't enough — the bug reliably outlived it), tracked `document.documentElement.scrollWidth`/`scrollHeight` as the real, measurable overflow signal (not a suspected compositing illusion), and — critically, once the \"check the usual suspects\" approach kept coming back clean — scanned every element in `<body>` rather than guessing which one to check next. That scan named the actual offending elements directly: real `.tile` divs rendering at ~92px instead of their correct ~47px. The single most decisive clue in the whole investigation was a shield-blocked, 0-damage hit still triggering the bug: that ruled out the player's own hit-flash (skipped entirely on a block) and narrowed it to whatever runs on *every* hit regardless of damage — the attacking mob's own lunge animation.\n\n**Root cause**: `animateLunge`/`animateShoot` (`scripts/animations.ts`) used to restore the attacker's own tile after the animation by snapshotting `.textContent` as a plain string *before* the animation started, then writing that raw string back afterward. For a flying mover (a bat), that tile isn't plain text — it's a base ground glyph plus a separate `.tile-flying-overlay` child span for the mover's own glyph (see \"Chunked Dungeon\"'s mob-species paragraph above). The snapshot/restore flattened that two-part structure into a single text node, and on real WebKit specifically, that flattening was enough to throw off the whole `#world` grid's own `1fr` column sizing — not just the one tile's rendering. This is the same hazard the Animation Contract Gotchas section above already documented for a *slide*'s destination tile; it just hadn't been applied to a *lunge*/*shoot*'s source tile too.\n\n**Fix**: replaced the raw snapshot/restore with the `syncSrcText?: () => void` callback described in the Animation Contract Gotchas section above — every real call site passes `syncSrcText: () => renderTile(x, y)`, which reads the ground tile fresh (never overwrites what's underneath — e.g. a tree a bat is resting in stays intact) and recomposites the occupant correctly, flying or not.\n\n**Lesson for next time**: the species differential — \"only bats, never snakes/rats, even though all three attack the player through the exact same code path\" — was sitting in the very first bug report and pointed straight at `flies: true`-specific rendering from the start. It just wasn't leaned on hard enough until very late in the investigation. When a report names one specific mob/entity out of several that share the same interaction, \"why only this one\" deserves to be the first question asked — check what's structurally different about it (here: `EntityDef.flies` and its composited-tile rendering) before reaching for broader theories (browser bugs, gesture handling, rendering engine quirks) that would apply equally to every mob.\n\n",ae=`# Ninjack — Game Design Notes

## Core Loop (as built)

Turn-based roguelike on a 9×9 grid. Each arrow press is one turn:
1. Player moves / interacts with target tile
2. Snakes move (pattern: random × 3, then BFS-chase, repeat)
3. Rabbit moves (if spawned)
4. Rabbit spawn check (once, when trees drop below 50%)
5. Adjacent rock auto-reveals (20% chance, snake-containing rocks near player)
6. Save

Goal: clear 10 levels, each ending with a locked door (key required) or a hole (chute required on level 10).

---

## What's Working

**Input randomness is the foundation.** Loot tables, rock contents, and tile placement are all pre-rolled before the level starts. The player explores a fixed puzzle they didn't know about — not a live slot machine. This aligns with the "front-load the chaos" principle.

**Snake AI has a predictable structure.** The \`random, random, random, chase\` pattern gives experienced players a rhythm to work with. The directional arrow indicator (added in this update) makes the chase step visible one turn in advance, giving players deterministic information to plan around.

**Emergence exists in the destruction loop.** Breaking rocks spawns snakes; snakes can fall into holes; holes pay loot. The cascade (last rock → final boss) is a genuine systemic surprise with no scripted path to it.

**Cave economics create real resource pressure.** The money monster demands gold across levels; the 25-bump death timer forces commitment. This is currently the game's strongest interesting decision: spend on gate progress now, or hoard for safety.

---

## Design Gaps

### Output Randomness Is Leaking

Two places undermine the determinism contract:

**20% adjacent rock auto-reveal** (\`checkAdjacentRockReveals\` in \`player.ts\`): A coin flip fires mid-turn with no player input. It can suddenly expose a snake in a dangerous position the player had no way to anticipate. Possible fix: replace with a guaranteed sonar ping — breaking any rock visually tags adjacent rocks as "contains snake" or "safe" without breaking them. Same information, no coin flip.

**Snake random-phase moves**: When snakes are in their 3-turn random phase, direction is opaque. The new arrow only appears on the chase step. A possible complement: a dim pulsing indicator on random-phase snakes to signal "unpredictable this turn" vs. the solid arrow for "chasing next turn."

### No Discrete Choice Moments

Every decision is positional (which direction to move). The game never presents an explicit "pick one of three" moment. Compare to Slay the Spire's card reward screen or Dicey Dungeons' die-to-gear assignment.

**Opportunity**: When breaking a rock or tree, show a small prompt — e.g., three icons — and let the player pick one, discarding the others. This turns the most common action into a micro-decision that rewards situational awareness.

### Items Don't Interact — No Emergent Synergies

Swords, hearts, keys, and gold are independent. There's no Balatro-style synergy where one item modifies how another works. Every run is structurally identical; only the map layout varies.

**Opportunity**: Introduce 1–2 per-run modifier items — e.g., a Trap tile that kills the next snake to step on it, or a Scroll that reveals all rock contents. These create emergent strategies without changing the core movement loop.

### No Per-Level Identity

Every level starts with the same unknown. There's no modifier that shapes strategy before the first step. Slay the Spire shows enemy intent before combat. Hades names your boon options before the room begins.

**Opportunity**: Show one level modifier at the transition screen (chosen from a small random pool) — e.g., "Snakes move twice this level" or "All rocks contain double gold, but the door stays locked until every snake is dead." Each level gets a distinct identity without touching the core mechanics.

### Cave Is Single-Dimensional

The money monster has one mechanic: pay gold or die after 25 bumps. It creates pressure but no branching decision — the player always takes the same path.

**Opportunity**: Offer 2–3 tribute routes per cave (pay gold / fight guarding snakes / find hidden gems). Same gate outcome, different resource cost, different player experience per run.

---

## Priority Improvements

| Priority | Change | Principle it addresses |
|---|---|---|
| 1 | **Snake directional arrow** *(done)* | Converts output randomness → input randomness on chase turns |
| 2 | Loot choice on rock/tree break | Adds explicit interesting decisions to the most frequent action |
| 3 | Synergistic per-run items | Creates emergent strategies; differentiates runs |
| 4 | Level entry modifier | Front-loads chaos; gives each level a distinct identity |
| 5 | Deterministic rock sonar ping | Eliminates remaining output randomness from auto-reveal |
| 6 | Cave tribute branching | Converts flat payment loop into a risk/resource trade-off |

---

## Reference: Design Principles in Use

| Principle | Current state |
|---|---|
| **Input randomness** | Strong — loot and layout pre-rolled at level start |
| **Output randomness** | Partial leak — 20% rock reveal, random snake phase |
| **Interesting decisions** | Weak — all choices are implicit and positional |
| **Limited choice (3–4 options)** | Missing — no explicit option menus |
| **Emergence (system collisions)** | Moderate — rock→snake→hole chain exists; no item synergies |
| **Telegraphed enemy intent** | Added — directional arrow on chase-step snakes |
`,oe=`# Ninjack — Game Spec

*Turn-Based Roguelike · Grid Puzzle · Dungeon Crawler*

A turn-based roguelike puzzle-dungeon crawler set in a treacherous forest and hidden cave system. Can you escape Slitherwood?

## Overview

**Ninjack** is a browser-based, turn-based roguelike dungeon crawler played on a **9×9 grid**. The player controls a ninja and must fight through **10 levels** of a snake-infested forest called *Slitherwood*, collecting keys, swords, and gold along the way. A parallel cave system called *Greedy Grotto* offers permanent gold-gated progression unlocks.

There are no dice rolls mid-combat and no randomness during play — all loot is pre-rolled at level start using a Fisher-Yates shuffle. Strategy comes from reading enemy patterns, conserving swords, and timing moves against the snake AI cycle.

| Stat | Value |
|---|---|
| Grid Size | 9×9 (81 tiles) |
| Total Levels | 10 (forest) |
| Starting Health | 3 hearts |
| Max Health | 5 hearts |
| Trees / Level | 64 (destructible) |
| Rocks / Level | 15 (destructible) |

## World & Setting

### Slitherwood — Forest (Levels 1–10)

A dense, snake-filled forest. Each level is a freshly generated 9×9 grid packed with 64 trees and 15 rocks. A brown dirt path connects the spawn point to the level's door, which starts revealed and locked; the player must break through rocks to find the key that unlocks it. Trees occasionally hide snakes; rocks hide a heart, a key, or a snake.

### Greedy Grotto — Cave (Parallel System)

A secret cave accessible between forest levels via a paid gate. Each cave room is a fixed layout guarded by a **Money Monster** (🤑) who demands gold tribute. Pay enough and the gate unlocks permanently — even across future runs. The cave offers treasure but is not required to beat the game.

### Key Locations

| Zone | Emoji | Description |
|---|---|---|
| Slitherwood | 🌲 | Forest levels, primary campaign, snakes and rocks |
| Greedy Grotto | 🕳️ | Cave system, money monster, permanent gate unlocks |
| Cave Gate | 🚪 | Entry to Greedy Grotto, blocks access until paid |

## Gameplay Loop

One arrow key press = one turn. All enemies move after the player resolves their action.

1. **Player Input** — Arrow key, on-screen button, or swipe gesture on the game grid (up/down/left/right). No diagonals. Edge of board clamps — can't walk off grid.
2. **Pre-Move Checks** — 20% chance: rocks adjacent to the player containing snakes auto-reveal. Key auto-generated if all trees are gone and no key exists (soft-lock prevention).
3. **Tile Interaction** — Bumping into a tile resolves its interaction: wall (block), tree/rock (break), snake (combat), door/hole (advance or die), items (collect), cave gate/money monster (payment).
4. **Enemy AI** — Every snake advances its pattern: moves 1–3 are random, move 4 is BFS pathfinding chase. Snakes die if they walk into a hole. Rabbit (if spawned) uses weighted AI to flee player and seek the hole.
5. **Rabbit Spawn Check** — Once per run, when trees remaining drop below 50% of starting count, the rabbit (🐇) spawns near the hole — worth 40 gold if caught before it escapes.
6. **State Save** — Full game state persisted to localStorage with SHA-256 hash after every move. Run is resumable on refresh.

### Interaction Priority Order

| # | Tile | Result |
|---|---|---|
| 1 | Wall / Fire | Movement blocked; enemies still take their turn |
| 2 | Hole 🕳️ | Instant death (or win on Level 10 with chute) |
| 3 | Cave Gate 🚪 | Opens if paid; otherwise shows contribution prompt |
| 4 | Money Monster 🤑 | Deducts 10% of current gold; tracks toward gate price |
| 5 | Door 🚪 | Advances level if key was used to unlock |
| 6 | Tree 🌲 / Rock 🪨 | Breaks; reveals loot from pre-rolled table |
| 7 | Open tile / items | Collect item or handle snake/rabbit combat |

## Player Mechanics

### Stats

| Stat | Value | Notes |
|---|---|---|
| Health | 3 | Start, max 5 |
| Swords | 0–99 | No limit shown as 99 |
| Gold | ∞ | Persists across levels |
| Keys | 0–1 | Per level |
| Chutes | 0–1 | Level 10 only |

### Combat

| Situation | Outcome |
|---|---|
| Player has swords + touches snake | 1 sword consumed, snake dies |
| No swords, health > 1 + touches snake | 1 health lost, snake dies |
| No swords, health = 1 + touches snake | Player dies 💀 |
| Touches hole (no chute or not Level 10) | Full damage, instant death |
| Touches hole on Level 10 with chute | **Win condition** |

### Skin Customization

Six ninja emoji variants selectable on the main menu, stored in localStorage. Options: 🥷 🥷🏻 🥷🏼 🥷🏽 🥷🏾 🥷🏿

### Visual Effects

Speed trail: three ghost ninjas follow the player with staggered opacity and timing (0.50s, 0.37s, 0.24s delays). On movement blocked, a wobble animation plays on adjacent rock tiles.

## Enemies

### Snake — Standard Enemy · All Levels

- AI pattern: \`[random, random, random, chase]\` repeating cycle
- Chase phase uses BFS pathfinding toward player
- On chase turn, a directional arrow indicator appears on the snake tile
- Costs 1 sword to kill, or 1 health if no swords (and health > 1)
- Dies if it walks into a hole
- Cannot pass through trees, rocks, doors, other snakes, walls, or the rabbit
- Breaking the final rock triggers the **Final Boss**: all remaining rocks instantly convert to snakes

### Money Monster (🤑) — Cave Boss · Greedy Grotto

- Spawns at position (4, 1) in every cave room, blocking the heart and gate
- Each bump deducts \`max(1, ceil(gold × 0.1))\` gold and counts toward gate payment
- At 75% payment: becomes 🤢 Sick Monster
- At 100% payment: disappears; heart appears at (4, 4)
- If bumped 25 times without paying (no gold): becomes 👹 Mad Monster
- After 5 mad bumps: deals full damage — **instant death**

### Rabbit (🐇) — Friendly NPC · One-Time Spawn

- Spawns **once per run** when trees remaining drop below 50% of starting count
- Spawns near the hole (≥4 Manhattan distance, away from player)
- AI scoring: hole attraction weight 10, player flee weight 7, danger penalty −50
- Catching it rewards **40 gold** (👑 crown notification)
- If it reaches the hole it escapes silently (no death notification)

## Collectibles & Loot

### Forest Loot (from Trees)

| Item | Effect |
|---|---|
| 🪙 Coin | +1 gold · 5 per level |
| 💰 Gold Bag | +5 gold · 2 per level |
| 💎 Gem | +10 gold · 1 per level |
| 🗡️ Sword | +1 sword · 5 per level |
| 🔑 Key | Required to unlock door |
| 🚪 Door | Exit — locked until key used |
| 🐍 Snake | Enemy, hidden in trees |

### Rock Loot (from Rocks)

| Item | Effect |
|---|---|
| ❤️ Heart | +1 health (max 5) · 2 per level |
| 🐍 Snake | Enemy hidden in rock |

### Special Items

| Item | Effect |
|---|---|
| 🪂 Chute | Level 10 only — use hole as escape instead of death |
| 🐇 Rabbit | +40 gold if caught (one-time per run) |

### Gold Values Summary

| Source | Gold | Notes |
|---|---|---|
| 🪙 Coin | 1 | Most common |
| 💰 Gold Bag | 5 | Moderate |
| 💎 Gem | 10 | Rare; also in cave gem rock |
| 🐇 Rabbit | 40 | One-time; must catch before it escapes |
| Max per level | 141 | All loot collected (used in gate price formula) |

## Progression

### Level Advancement

Find the **key**, hidden in one of the level's rocks. Bring it to the **door** — which starts revealed and locked, connected to the spawn point by a dirt path — to unlock it. Walk through to advance. On Level 10, a chute is required — the door is replaced with a hole.

> **Soft-Lock Prevention** — If all trees are broken and no key was ever revealed, the game automatically gives the player one key.

### Carry-Over Between Levels

| Item | Persists? | Notes |
|---|---|---|
| ❤️ Health | Yes | Max health increases permanently with each heart collected |
| 🗡️ Swords | Yes | Accumulate across entire run (0–99) |
| 💰 Gold | Yes | Never lost except to cave payments |
| 🔑 Key | No | Consumed on door unlock |
| 🪂 Chute | No | Only exists on Level 10 |

### Greedy Grotto Gate Prices

Gates are paid permanently — once unlocked they open for all future runs. Formula: \`ceil(gate × 141 × multiplier / 10) × 10\`

| Gate | Price | Multiplier |
|---|---|---|
| 1 | 141 gold | 1× |
| 2 | 282 gold | 2× |
| 3 | 564 gold | 4× |
| 4 | 705 gold | 5× |
| 5+ | ~141 × gate × 5 | 5× |

### Snake Count Scaling (Normal)

Snakes in trees grow each level. Rocks always contain either a heart or a snake, regardless of level. The final boss (breaking the last rock) converts all remaining rocks to snakes instantly.

## Finale & Win/Loss Conditions

### Win Condition

Reach **Level 10**. Collect the **chute** (🪂) hidden in the trees. Find the **hole** (🕳️) and walk into it. Instead of dying, the chute lets the ninja escape — triggering the win screen.

> **Win Screen Text** — "Take a screenshot! 📸 You escaped Slitherwood! Final score: 💰[Gold] Gold · ⏺️[Moves] Moves · 🕥[Seconds] Seconds. Ready to beat your score?"

### Final Boss

Breaking the **15th and final rock** on any level triggers the final boss event: every remaining rock on the board instantly converts into a snake (all spawn with \`justSpawned = true\`, so they don't move on that turn). The player must defeat or survive them all before advancing.

### Death Conditions

All death triggers:
- Contact with snake, no swords, health = 1
- Contact with hole (without chute on Level 10)
- 5th bump on a Mad Money Monster (👹)

On death: 1-second delay → death modal → "You died 💀 on Level X!" → options to start a new run or return to main menu. Save is cleared.

## Greedy Grotto (Cave System)

The cave is a parallel progression layer — not required to beat the game, but offering powerful loot (gems, hearts) and permanent gold-gated unlocks.

### Cave Room Layout (Fixed 9×9)

| Position | Tile | Description |
|---|---|---|
| (4, 0) | 🚪 Cave Gate | Locked until fully paid; blocks top exit |
| (3,1) (5,1) | 🔥 Fire | Impassable walls (visual flavor) |
| (4, 1) | 🤑 Money Monster | Demand tribute, guards heart |
| (4, 4) | 🕳️→❤️ | Hole before payment; Heart after paid |
| Edges | 🪨 Wall | All perimeter except (4, 8) spawn point |
| Random | 💎 Gem Rock | Hidden gem rock on a wall candidate tile |

### Money Monster Payment Logic

Each bump deducts **10% of current gold** (minimum 1, rounded up) and adds to the gate's contribution total.

| Threshold | State | Effect |
|---|---|---|
| 75% paid | 🤢 Sick | Visual change, still demands gold |
| 100% paid | ✅ Gone | Monster removed; heart appears at (4,4) |
| 25 no-pay bumps | 👹 Mad | No longer accepts gold |
| 5 mad bumps | 💀 Kill | Instant full damage, player dies |

### Gate Persistence

Once a gate is paid off, it stays unlocked **forever** — across all runs, stored in \`ninjack_gates_unlocked\` in localStorage. Contribution totals are also saved per gate in \`ninjack_contributions\`.

## Screens & UI

- **🏠 Main Menu** — Skin picker, New Game / Continue buttons, credits.
- **🎮 Game HUD** — Health bar (❤️/🤍), inventory (🗡️ swords, 🔑/🪂, 💰 gold), level name, move counter.
- **🕳️ Cave View** — Same grid, dark music, gate payment progress, money monster states.
- **💀 Death Modal** — "You died 💀 on Level X!" — buttons: Main Menu, New Run {N}.
- **🏆 Win Modal** — Final gold / moves / seconds score, screenshot prompt, return to menu.
- **👋 Welcome Modal** — Shown once per browser session. Brief intro and encouragement.
- **⬛ Fade Transition** — 0.4s black fade with music crossfade on cave entry/exit.

### HUD Inventory Display

\`\`\`
❤️ ❤️ 🤍   🗡️3  🔑1  💰47
\`\`\`

Health / empty hearts · Swords · Key or Chute · Gold total. On Level 10, key slot shows chute (🪂).

## Plot & Narrative

Ninjack is largely mechanics-driven with minimal explicit narrative. The world is communicated through emoji and level names.

### Welcome Message (Shown Once Per Session)

> "Welcome to Ninjack! A rogue-like puzzle-ish dungeon crawler game! Let me know if you love it or have any issues! And good luck!
>
> Can you escape Level 🚪10 of Slitherwood?"

### Implied Narrative

A ninja is trapped deep inside **Slitherwood** — a forest overrun by snakes — and must fight through 10 increasingly dangerous levels to escape. Along the way, a hidden cave system called the **Greedy Grotto** can be explored, where a Money Monster guards treasure behind gold-locked gates. On Level 10, instead of a door, only a dark hole and a parachute offer the path to freedom.

### Music & Atmosphere

| Scene | Track | Artist |
|---|---|---|
| Main Menu | "8 Bit Beginning" | HeatleyBros |
| Starting Town | "Woods of Linzor" | HeatleyBros |
| Zone 1: Slitherwood | "8 Bit Journey" | HeatleyBros |
| Zone 2: Deep Grove | "Dark Alley" | HeatleyBros |
| Zone 3: Withering Palms | "Wakka Boom" | HeatleyBros |
| Zone 4: Dead Branches | "8 Bit Spooky" | HeatleyBros |
| Zone 5: Ashen Depths | "Ancient Passage" | HeatleyBros |
| Boss Floors | "Halloween Dash" | HeatleyBros |

### Notification Symbols (In-Game Storytelling)

| Symbol | Event |
|---|---|
| 💔 | Damage taken |
| 💀 | Enemy killed or player death |
| 👑 | Rabbit caught |
| 🔐 / 🔒 | Door unlocked / locked |

## Constants & Configuration

### World

| Constant | Value | Description |
|---|---|---|
| \`worldSize\` | 9 | Grid dimension (9×9 = 81 tiles) |
| \`rockCount\` | 15 | Rocks per level |
| \`treeCount\` | 64 | Trees per level |
| \`startingLevel\` | 0 | Internal index (displayed as Level 1) |

### Loot per Level

| Item | Count | Gold Value |
|---|---|---|
| 🗡️ Swords | 5 | — |
| 🪙 Coins | 5 | 1 each |
| 💰 Gold Bags | 2 | 5 each |
| 💎 Gems | 1 | 10 |
| 🐇 Rabbit (per run) | 1 | 40 |
| Max total gold/level | — | 141 |

### Timings & Chances

| Parameter | Value |
|---|---|
| Rock auto-reveal chance | 20% per adjacent rock per move |
| Rabbit spawn trigger | Trees < 50% of starting count |
| Cave fade duration | 0.4s |
| Death delay | 1.0s |
| Speed trail durations | 0.50s / 0.37s / 0.24s |
| Money Monster mad threshold | 25 no-pay bumps |
| Money Monster kill threshold | 5 mad bumps |

### Snake AI Pattern

\`\`\`
['random', 'random', 'random', 'chase']
\`\`\`

Cycles continuously. Chase phase uses BFS to find shortest path to player in 4-cardinal directions.

### Rabbit AI Weights

| Factor | Weight |
|---|---|
| Distance to hole (attraction) | +10 |
| Distance from player (flee) | +7 |
| Adjacent to player (penalty) | −50 |

## Special Modes

### Dev Mode (\`?dev\`)

- Level skip dropdown on main menu (jump to levels 1–10)
- "⚡ Max" button: sets health and swords both to 99
- Additional debug UI elements visible
- \`window.__debug\` console toolkit (board/inventory/entity control, no UI)

### Soundboard

Full audio testing interface for all sound effects and the music track switcher — available as the docs hub's "Soundboard" page rather than a standalone in-app mode.

### Reset (\`?reset\`)

- Clears all localStorage data and reloads fresh

### Save System

Full game state saved to localStorage after every move (version 2 format). SHA-256 hash stored separately as \`ninjack_save_hash\` to detect tampering. Cave gate progress saved to \`ninjack_gates_unlocked\` and \`ninjack_contributions\`, persisting indefinitely.

## Core Fantasy

The player fantasy is **the clever, outmatched ninja** — outnumbered by snakes but never outthought. Every sword is precious, every move deliberate. The satisfaction loop is about reading a predictable enemy pattern, planning two steps ahead, and threading a gap that looked closed.

The game is not about reflexes or speed. It rewards *restraint*: knowing when to break a rock, when to spend a sword, and when to let a snake pass. The rabbit is a brief test of greed — drop everything and chase 40 gold, or stay safe and let it escape.

> **The Central Tension** — Trees contain both swords (needed to fight) and snakes (that need fighting). Opening the board makes you richer and more dangerous simultaneously.

## Tone & Mood

Ninjack is **lighthearted and playful**, not grim. Death is a 💀 emoji, not a screen of blood. Enemies are cartoon animals (🐍🐇) and a money-hungry monster (🤑). The world is communicated almost entirely through emoji — there is no written lore, no cutscenes, no dialogue.

The forest music ("Woods of Linzor") is adventure-y and upbeat; the cave music ("Dark Alley") is tenser but not oppressive. Together they keep the mood in the **cozy-but-focused** pocket — casual enough to pick up, engaging enough to think.

| Axis | Rating |
|---|---|
| Tone | Playful |
| Stakes | Medium |
| Violence | Emoji |
| Narrative Density | Minimal |

## Session Length & Pacing

A full run (Level 1–10) is designed for a **single sitting**. There are no checkpoints — death returns the player to the start. A typical run where the player is learning takes 15–30 minutes; an experienced player moving quickly could complete it in under 10.

### Pacing Structure

| Phase | Levels | Feel |
|---|---|---|
| Early game | 1–3 | Sparse snakes, abundant swords — exploration and learning |
| Mid game | 4–7 | Snake density rises, sword economy tightens, keys harder to find |
| Late game | 8–9 | High snake counts, final boss threat looms on every rock |
| Finale | 10 | Must find chute — escape via hole instead of door; one mistake = death |

### Session Micro-Pacing (Within a Level)

Each level follows a natural arc:

1. **Opening** — Harvest trees safely, scout snake positions
2. **Middle** — Manage revealed snakes, break rocks carefully
3. **Key hunt** — Break remaining trees if key hasn't appeared
4. **Final boss** — Last rock converts all remaining rocks to snakes instantly
5. **Exit** — Navigate to unlocked door (or hole on Level 10)

### Break-Point Design

The game saves after every move, so a session can be interrupted at any point. This makes it viable as a **mobile pick-up-and-put-down** game despite having permadeath.

## Difficulty Curve

Ninjack has no explicit difficulty settings. Challenge increases through **structural scaling**: more enemies, tighter resources, and a harder finale — not number inflation (enemy health stays at 1 hit throughout).

### Scaling Axes

| Parameter | Early (Lv 1–3) | Late (Lv 8–10) |
|---|---|---|
| Snakes from trees | Low | High (max 9) |
| Rocks remaining late | Many potential hearts | More snakes on final rock |
| Sword surplus | Usually positive | Tightly managed |
| Win condition | Find key → door | Find chute → hole (riskier) |

### Difficulty Levers Available to the Player

- Accumulate swords aggressively (reduces combat risk)
- Collect hearts early (higher health = more sword-free snake trades)
- Watch snake AI pattern cycle to predict chase turn
- Use directional arrow indicator to dodge chase-phase snakes
- Avoid breaking final rock until board is clear

## Information Model

Ninjack is a game of **partial information**. The grid is fully visible, but the contents of intact trees and rocks are hidden. This creates meaningful decisions from incomplete data.

### What the Player Can See

| Element | Visibility |
|---|---|
| All snakes on open tiles | ✅ Fully visible |
| Snake AI direction (chase turn) | ✅ Arrow indicator shown |
| Snake AI phase (turn 1/2/3/4) | ❌ Hidden |
| Contents of intact trees | ❌ Hidden until broken |
| Contents of intact rocks | ❌ Hidden (heart or snake) |
| Pre-rolled loot tables | ❌ Hidden |
| Rabbit spawn trigger (50% trees) | ⚠️ Inferable from tree count |
| Money Monster payment progress | ✅ Shown in HUD |
| Gate price and contributions | ✅ Shown in cave |

### Key Hidden-Information Decisions

- **Break this rock?** — 50/50 heart vs snake; risk vs reward
- **Break this tree?** — could be a sword or the snake that kills you
- **Is this snake about to chase?** — can't know exactly which phase without counting turns
- The 20% auto-reveal on adjacent rocks adds uncontrollable information reveals

## Risk / Reward Design

Nearly every action in Ninjack carries a trade-off. The game builds tension from resource decisions, not from time pressure or twitch skill.

### Key Risk/Reward Axes

| Decision | Upside | Downside |
|---|---|---|
| Break a tree | Loot (sword, coin, gold, gem) | May spawn a snake |
| Break a rock | Heart (heal) | 50% chance it's a snake |
| Break the final rock | Advance — final boss triggered | All remaining rocks become snakes |
| Chase the rabbit | +40 gold | Expose yourself to snakes; it may escape anyway |
| Spend swords on snakes | Clear board safely | Fewer swords for harder snakes ahead |
| Visit the cave | Gem, heart, permanent gate unlock | Gold drain; mad monster death risk |
| Bump money monster (no gold) | Force payment progress | Increments toward mad state → death |
| Fight snake without sword | Save a sword | Costs 1 health; fatal if at 1 HP |

### Sword Economy

Swords are the central resource of the risk system. They're finite per level, earned from trees, and consumed one-per-snake. At 0 swords, every snake encounter chips health. At low health with no swords, any snake is lethal — creating a downward spiral the player must anticipate and prevent.

## Replayability

### What Changes Each Run

- All loot positions re-randomized per level (Fisher-Yates shuffled)
- Snake spawn positions vary
- Door position and its connecting path vary; key location (hidden in a rock) varies too
- Rabbit spawn position varies (constrained near hole)
- Rock loot order randomized (which rocks have hearts vs snakes)

### What Stays the Same

- Grid size, structure, and tile counts
- Total loot quantities per level
- Snake AI pattern (always \`random×3, chase×1\`)
- Final boss mechanic (always last rock)
- Cave gate prices and layout (fixed)

### Persistent Cross-Run Progression

Greedy Grotto gates are **permanently unlocked** once paid — the cave layer is a long-arc progression system that spans many runs. This gives returning players something to work toward even if they haven't beaten the forest yet. The run counter also increments persistently, surfacing history in the death/new-run modal.

### Replayability Assessment

Procedural loot placement · Permanent cave progression · Score chasing (gold / moves / time) · Fixed enemy AI (learnable)

## Permadeath Type

Ninjack uses **full run permadeath with soft meta-persistence** — the classic roguelike model.

| Layer | Behavior |
|---|---|
| Run save | Cleared on death; no mid-run continues |
| In-run health | No healing except hearts found in rocks |
| Gold | Lost on death (not carried to next run) |
| Swords / keys | Lost on death |
| Cave gate unlocks | **Permanent** — persist across all runs forever |
| Run counter | Increments permanently on every new run |

> **Roguelike Classification** — Ninjack is a *roguelite* by modern convention: full permadeath within a run, but meaningful permanent progression across runs (cave gates). It lacks the deck-building or item-draft "run build" common to contemporary roguelites — its meta-progression is purely gold-gated unlocks rather than power unlocks.

## Accessibility

### Control Options

A fixed on-screen D-pad handles touch input.

Hardware keyboard (arrow keys) also works, making the game usable without touch entirely.

### Visual Accessibility

- All game elements represented as large emoji — no small sprites or pixel art to squint at
- Snake directional arrow indicator gives a heads-up before a chase attack
- Health displayed as large ❤️/🤍 icons, not a number bar
- High contrast between empty tiles and game elements

### Cognitive Accessibility

- Turn-based — no time pressure, player can think as long as needed
- Enemy AI is fixed and learnable (same 4-step pattern every snake)
- All loot is determined before the level starts — no surprise mid-game RNG
- Auto-save after every move means no fear of losing progress to interruption

### Customization

6 ninja skin tone variants available. Game explicitly surfaces skin picker on main menu.

### Gaps / Limitations

- No screen reader support (emoji grid, no ARIA labels on tiles)
- No colorblind mode (relies on emoji identity, not color, so mostly fine)
- No difficulty setting — single fixed difficulty curve

## Platform & Distribution

### Runtime Targets

| Platform | Method | Notes |
|---|---|---|
| Web browser | Hosted HTML/JS (Vite build) | Primary target; served at \`/web-ninjack/\` |
| iOS | Capacitor native wrapper | Synced via \`npm run sync\` |
| Android | Capacitor native wrapper | Synced via \`npm run sync\` |

### Input Methods Supported

Touch (on-screen buttons) · Keyboard (arrow keys) · Swipe gestures · Virtual joystick

### Technical Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (ES modules) |
| Bundler | Vite (content-hash cache busting) |
| Analytics | Firebase Analytics |
| Persistence | localStorage (SHA-256 hash validated) |
| Mobile | Capacitor (iOS + Android) |
| Rendering | DOM + CSS (no canvas, no game engine) |

### No-Engine Design

The game renders entirely in the DOM using CSS-styled div elements with emoji content. There is no canvas, no WebGL, and no external game framework — just TypeScript, HTML, and CSS. This keeps the bundle small and the rendering accessible to assistive technologies.

## Art Style & Aesthetic

### Visual Language

Ninjack uses a **pure emoji visual style** — every game element is a Unicode emoji on a dark grid. There are no hand-drawn sprites, no pixel art, and no 3D models. The aesthetic is intentionally minimal and platform-native: it looks at home on any device that renders emoji well.

### Emoji Palette

| Emoji | Name | Description |
|---|---|---|
| 🥷 | Player | 6 skin tone variants |
| 🌲 | Tree | Destructible terrain |
| 🪨 | Rock / Wall | Solid obstacle |
| 🐍 | Snake | Main enemy |
| 🔥 | Fire | Impassable wall (cave) |
| 🕳️ | Hole | Hazard / Level 10 exit |
| 🤑 | Money Monster | Cave boss (→🤢→👹) |
| 🐇 | Rabbit | Fleeting gold source |

### Motion & Animation

- **Speed trail** — 3 ghost ninja images follow the player at 0.50s / 0.37s / 0.24s delays
- **Rock wobble** — Adjacent rocks shake when a nearby snake auto-reveals
- **Fire flip** — Animated fire tile with configurable timing (stored in localStorage)
- **Snake arrow** — Directional indicator pulses on the snake tile during chase phase
- **Cave fade** — Full-screen black overlay fades in/out (0.4s) on cave transitions

### Audio Aesthetic

35+ distinct sound effects cover every interaction (footstep, sword hit, coin pickup, enemy death, door unlock, etc.). 8 licensed music tracks by **HeatleyBros** establish scene identity — a distinct track each for the main menu, the starting town, every one of the 5 dungeon zones, and boss floors (see "Music & Atmosphere" above). Music switches on scene transitions (menu ↔ town ↔ zone ↔ boss).

## Comparable Titles

Ninjack sits at the intersection of several well-known game traditions. No direct clone — it combines elements in a specific way that distinguishes it.

| Game | Shared Element | Key Difference |
|---|---|---|
| **Rogue / NetHack** | Turn-based grid movement, permadeath, hidden loot | Ninjack is far simpler — no equipment slots, classes, or multi-floor dungeons |
| **Pac-Man** | Grid navigation, enemy chase AI, avoidance loop | Ninjack is turn-based; enemy pattern is predictable rather than reactive |
| **Minesweeper** | Hidden tile contents, risk/reward on reveal | Ninjack has active enemies and progression, not pure deduction |
| **Into the Breach** | Turn-based, small grid, telegraphed enemy moves | No positional puzzle solving; Ninjack is resource management + avoidance |
| **Shattered Pixel Dungeon** | Roguelite, dungeon levels, loot-from-environment | Ninjack has no item build, no stats — stripped to pure movement |
| **Snake (classic)** | Grid, snake enemies, avoidance | Player is the hunter here; snakes are manageable, not the mechanical focus |

> **Elevator Pitch Comp** — "It's Minesweeper meets Snake — on a grid where you control the character instead of the snake, every tile you open could spawn an enemy, and enemies move in a learnable pattern you can exploit."
`,se='# Capacitor Native Mobile Port — Plan\n\n> **Key:** Steps marked 🖱️ are manual GitHub/account actions. Steps marked ⌨️ are code/CLI work done in this repo.\n\n## Overview\n\nPort Ninjack to native iOS and Android using Capacitor, while continuing to support the existing web version. As part of this work, restructure the deployment pipeline to comply with the music sync license (which requires the game be distributed only as a finished, end-user work).\n\n---\n\n## Repo Restructuring\n\n### Problem\nThe current repo is public, which means raw music files in `music/` are publicly accessible and downloadable outside of any game context. The music license requires the music be distributed "only as a finished, end-user work" — a public source repo does not satisfy this.\n\n### Solution\n\n🖱️ **Manual — GitHub.com**\n1. Make this repo private: Settings → Danger Zone → Change visibility → Private\n2. Create a new public repo (e.g. `ninjack-web`) on GitHub — this will be the web deploy target\n3. Enable GitHub Pages on `ninjack-web`: Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`\n4. Create a Personal Access Token (or use a Deploy Key) with write access to `ninjack-web`, and add it as a secret on this private repo: Settings → Secrets → Actions → `DEPLOY_REPO_TOKEN`\n\n⌨️ **Code — this repo**\n5. Add a GitHub Actions workflow that pushes built assets to `ninjack-web` on every push to `main` (see Web Deployment Pipeline below)\n\nThe music license is satisfied because the public-facing artifact is the finished game, not raw source files.\n\n---\n\n## Build Step\n\nCurrently there is no build step — the repo root is served directly. Capacitor requires a `webDir` to copy into native projects, and the deploy pipeline needs a clean output folder (to avoid pushing `node_modules/`, `ios/`, `android/`, etc.).\n\n⌨️ **Code changes**\n- Add `package.json` with a `build` script that copies web assets to `www/`\n- Set `webDir: "www"` in `capacitor.config.json`\n- Add `www/`, `ios/`, `android/`, `node_modules/` to `.gitignore`\n\nThe copy includes: `index.html`, `scripts/`, `styles/`, `music/` (or bundled equivalent — see below).\n\n### Music bundling (optional hardening)\nConverting MP3s to base64 and inlining them in a JS file means the public deploy repo contains no standalone audio files — only a game bundle. This removes any ambiguity about whether the deployed artifact constitutes a "finished work." Not strictly required once the source repo is private, but cleaner.\n\n---\n\n## Capacitor Setup\n\n### Phase 1 — Bootstrap ⌨️\n1. `npm init` — create `package.json`\n2. Install `@capacitor/core`, `@capacitor/cli`\n3. `npx cap init` — app name: Ninjack, app ID: `com.ninjack.app`\n4. Create `capacitor.config.json` with `webDir: "www"`\n\n### Phase 2 — Add Platforms ⌨️\n5. Install `@capacitor/ios`, `@capacitor/android`\n6. `npx cap add ios` / `npx cap add android`\n7. `npx cap sync` — copies `www/` into native projects\n\n### Phase 3 — Compatibility Fixes ⌨️\n\n| Concern | Status | Action |\n|---|---|---|\n| Touch controls | Already implemented (pointer events + joystick mode) | None |\n| Viewport / scaling | Already set (`user-scalable=no`) | None |\n| `localStorage` | Works in Capacitor WebView | None (or upgrade to `@capacitor/preferences`) |\n| `AudioContext` | iOS requires user gesture to unlock | Already handled — verify on device |\n| `crypto.subtle` | Requires secure context | Capacitor serves via localhost — works fine |\n| Safe area insets | iPhone notch / home bar overlap | Add `env(safe-area-inset-*)` padding to game container in CSS |\n\n### Phase 4 — Native Polish (optional) ⌨️\n\n| Plugin | Purpose |\n|---|---|\n| `@capacitor/status-bar` | Hide or style the native status bar |\n| `@capacitor/splash-screen` | Launch screen while app loads |\n| `@capacitor/haptics` | Vibration feedback on hits/deaths |\n\nAll official Capacitor plugins include web fallback implementations — no platform-specific guards needed in game code.\n\n### Phase 5 — Build & Test (mixed)\n\n⌨️ Open native projects:\n- iOS: `npx cap open ios` → Xcode → run on simulator/device\n- Android: `npx cap open android` → Android Studio → run on emulator/device\n\n🖱️ Manual device testing:\n- Touch controls (all layouts), audio unlock on iOS, save/load, safe area on notch devices\n\n🖱️ App Store / Play Store submission (future, when ready):\n- Requires Apple Developer account ($99/yr) and/or Google Play Developer account ($25 one-time)\n- App signing, provisioning profiles, store listings — all manual\n\n---\n\n## Web Deployment Pipeline\n\n### GitHub Actions Workflow ⌨️\n\nFile: `.github/workflows/deploy.yml`  \nTrigger: push to `main`\n\nSteps:\n1. Run `npm run build` (copies assets to `www/`)\n2. Push contents of `www/` to the `main` branch of the `ninjack-web` deploy repo using `DEPLOY_REPO_TOKEN`\n3. GitHub Pages on `ninjack-web` serves the game automatically\n\nThe deploy repo has no source history — just the latest built game. Music files are present (they must be, to play in the browser) but only as part of the deployed game artifact.\n\n> Note: The first deploy requires the manual GitHub steps in Repo Restructuring (token, Pages config) to be completed first.\n\n---\n\n## Development Workflow (ongoing)\n\n```\nEdit source files in private repo\n        │\n        ├── Web testing:    serve repo root locally → test in browser\n        │\n        ├── Web deploy:     git push main → GitHub Actions → ninjack-web → GitHub Pages\n        │\n        └── Native:         npm run build → npx cap sync → Xcode / Android Studio\n```\n\n---\n\n## Summary of All Changes\n\n| Area | Who | Change |\n|---|---|---|\n| Repo visibility | 🖱️ Manual | Make this repo private on GitHub |\n| Deploy repo | 🖱️ Manual | Create `ninjack-web` public repo, enable GitHub Pages |\n| Deploy token | 🖱️ Manual | Create PAT, add as `DEPLOY_REPO_TOKEN` secret |\n| CI/CD workflow | ⌨️ Code | Add `.github/workflows/deploy.yml` |\n| Build step | ⌨️ Code | Add `npm run build` copy script + `www/` output dir |\n| `.gitignore` | ⌨️ Code | Ignore `www/`, `ios/`, `android/`, `node_modules/` |\n| Capacitor config | ⌨️ Code | Add `package.json`, `capacitor.config.json` |\n| Native platforms | ⌨️ Code | Add `ios/` and `android/` via `npx cap add` |\n| CSS | ⌨️ Code | Add `env(safe-area-inset-*)` padding for notch/home-bar |\n| Optional | ⌨️ Code | Bundle audio as base64, add status bar / splash / haptics plugins |\n| NG+ flag | — | Unchanged — re-enable per CLAUDE.md instructions when ready |\n',ce='# Ninjack – Release Configuration\n\n## Fields to bump before every build\n\n| Field | File | Notes |\n|---|---|---|\n| `version` | `package.json` | `major.minor.patch` — also the version shown in-app on the main menu; see CLAUDE.md\'s "Versioning" for when to bump which part |\n| `versionCode` | `android/app/build.gradle` | Integer, increment by 1 each upload |\n| `versionName` | `android/app/build.gradle` | Human-readable, e.g. `"1.1"` |\n| `CURRENT_PROJECT_VERSION` | `ios/App/App.xcodeproj/project.pbxproj` | iOS build number — fastlane `increment_build_number` handles this automatically |\n| `MARKETING_VERSION` | `ios/App/App.xcodeproj/project.pbxproj` | iOS marketing version — set manually |\n\n## One-time setup fields (never change)\n\n| Field | File | Notes |\n|---|---|---|\n| `appId` | `capacitor.config.json` | `com.dropkick.ninjack` — must match stores |\n| `app_identifier` | `fastlane/Appfile` | Same bundle ID |\n| `package_name` | `fastlane/Appfile` | Android package name |\n| `apple_id` | `fastlane/Appfile` | Apple ID email |\n| `app_identifier` | `fastlane/Matchfile` | Match cert sync |\n| `PRODUCT_BUNDLE_IDENTIFIER` | Xcode project | Must match `appId` |\n| `applicationId` | `android/app/build.gradle` | Must match `appId` |\n\n## Secrets (`fastlane/.env` — never commit)\n\nCopy `fastlane/.env.example` → `fastlane/.env` and fill in:\n\n| Field | Required | Notes |\n|---|---|---|\n| `ANDROID_KEYSTORE_PATH` | Yes | Path to `.keystore` file |\n| `ANDROID_KEYSTORE_PASSWORD` | Yes | |\n| `ANDROID_KEY_ALIAS` | Yes | `ninjack` |\n| `ANDROID_KEY_PASSWORD` | Yes | |\n| `APP_STORE_CONNECT_API_KEY_KEY_ID` | Optional | Avoids 2FA; generate at App Store Connect → Users & Access → Integrations |\n| `APP_STORE_CONNECT_API_KEY_ISSUER_ID` | Optional | |\n| `APP_STORE_CONNECT_API_KEY_KEY_FILEPATH` | Optional | Path to `.p8` file |\n\n## App Store Connect fields (iOS)\n\nAll fields live at appstoreconnect.apple.com → Ninjack → Distribution.\n\n### iOS App Version 1.0 (set each release)\n\n| Field | Status | Required | Notes |\n|---|---|---|---|\n| Previews & Screenshots | EMPTY | Yes | At least 1 iPhone 6.5" screenshot required |\n| Description | EMPTY | Yes | Up to 4000 chars |\n| Keywords | EMPTY | Yes | Up to 100 chars, comma-separated |\n| Support URL | EMPTY | Yes | |\n| Copyright | EMPTY | Yes | e.g. `© 2026 Dropkick, LLC` |\n| Promotional Text | EMPTY | No | Up to 170 chars; can change without resubmitting |\n| Marketing URL | EMPTY | No | |\n| Build | NOT UPLOADED | Yes | Run `fastlane ios beta` to upload |\n| App Review — Contact: First/Last name, Phone, Email | EMPTY | Yes | Reviewer contact info |\n| App Review — Notes | EMPTY | No | Any special instructions for reviewer |\n\n### App Information (one-time, survives across versions)\n\n| Field | Status | Required | Notes |\n|---|---|---|---|\n| Name | "Ninjack" | Yes | Done |\n| Subtitle | "Escape the Forest!" | No | Done |\n| Category | Games › Adventure, Puzzle | Yes | Done |\n| Age Ratings | 13+ | Yes | Done (via questionnaire) |\n| Content Rights | Not configured | Yes | Declare whether app contains third-party content |\n| App Encryption Documentation | Not uploaded | Conditional | Required if app uses non-exempt encryption; declare via `NSAllowsArbitraryLoads` in Info.plist or upload docs |\n| Digital Services Act (EU) | Not set up | Yes | Go to Business → set trader status to submit in EU |\n\n### App Privacy (one-time, must publish separately)\n\n| Field | Status | Required | Notes |\n|---|---|---|---|\n| Privacy Policy URL | EMPTY | Yes | Must be a live URL before submission |\n| Data collection questionnaire | Not started | Yes | Click "Get Started" on App Privacy page |\n\n## Incomplete / TODO\n\n- `fastlane/Matchfile` — `git_url` is commented out; Match isn\'t fully configured (`sync_code_signing` is also commented out in Fastfile)\n- `fastlane/Appfile` — `itc_team_id` / `team_id` commented out (needed if Apple account has multiple teams)\n- `fastlane/google-play-key.json` — does not exist yet; required for Android Play Store uploads\n',le=`# Ninjack – App Store Screenshot Sizes

## How to capture

\`\`\`bash
npm run dev          # terminal 1 — keep running (serves on port 5173 by default)
npm run screenshots  # terminal 2 — generates all sizes

# If Vite picks a different port:
PORT=5174 npm run screenshots
\`\`\`

Output lives in \`assets/screenshots/<device>/1.png\` through \`3.png\`.

## Primary capture: iPhone 16/17 Pro Max (6.9")

The script captures at **1320×2868** (CSS: 440×956 at 3× DPR) and derives all other
sizes by scaling to target width and center-cropping/padding height.

iPhone 17 Pro Max is expected to ship with the same 6.9" form factor.

## Required sizes (portrait — game is portrait-only)

| ASC display type      | Folder        | Width  | Height | Device examples                  | Required? |
|-----------------------|---------------|--------|--------|----------------------------------|-----------|
| \`APP_IPHONE_69\`       | \`iphone-69\`   | 1320   | 2868   | iPhone 16/17 Pro Max             | ✅ Yes    |
| \`APP_IPHONE_67\`       | \`iphone-67\`   | 1290   | 2796   | iPhone 14/15/16 Plus             | ✅ Yes    |
| \`APP_IPHONE_65\`       | \`iphone-65\`   | 1242   | 2688   | iPhone XS Max – 14               | ✅ Yes    |
| \`APP_IPHONE_55\`       | \`iphone-55\`   | 1242   | 2208   | iPhone 6s/7/8 Plus               | Optional  |

> App Store Connect only strictly requires **one** size; it reuses screenshots for
> uncovered sizes. Providing all three "Yes" sizes avoids letterboxing on any device.

## iPad (not currently submitted)

| ASC display type            | Width  | Height | Notes                          |
|-----------------------------|--------|--------|--------------------------------|
| \`APP_IPAD_PRO_3GEN_129\`     | 2048   | 2732   | Required if supporting iPad    |
| \`APP_IPAD_PRO_129\`          | 2048   | 2732   | Required if supporting iPad    |

## Scale/crop math (from 1320×2868 source)

| Target         | Width scale | Scaled height | Delta vs target | Action          |
|----------------|-------------|---------------|-----------------|-----------------|
| 1290×2796      | 97.7%       | 2802          | −6 px           | Center-crop     |
| 1242×2688      | 94.1%       | 2698          | −10 px          | Center-crop     |
| 1242×2208      | 94.1%       | 2698          | −490 px         | Center-crop     |

All within acceptable range for portrait game content — the cropped pixels are
near the top/bottom edges where there is typically letterboxing or status bar.

## App Store Connect upload

After running \`npm run screenshots\`, upload from each \`iphone-XX\` folder to the
matching device slot in ASC → Distribution → iOS App Version → Previews & Screenshots.

The \`APP_IPHONE_65\` set at id \`b6420875-1771-4662-a6f7-cd67838c999b\` was created
manually on 2026-06-15 but not yet populated. Re-use it or delete and re-create
via the ASC UI.
`,ue="# Known Bugs\n\n## Missing Key Softlock — Player Cannot Exit Without a Key\n\n**Status: No longer applicable — mitigation and underlying system both removed**\n\n**Description (historical):**\nThe player could end up with no key and no way to unlock the door, on the old single-forest-level generator. Two independent failure modes produced this:\n\n**Mode 1 — Key overwritten by a snake.**\nThe level key (`🔑`) lived in the shuffled loot table and was placed on the grid when its corresponding tree was broken. After placement it was just a tile — a snake could move onto it, overwriting it with the snake tile. The key was silently destroyed. The player could break all remaining trees, find no key on the grid or in inventory, and be unable to exit.\n\n**Mode 2 — Key absent from the loot table.**\n`generateLootTable()` (`scripts/worldGen.ts`) calculated a `remainingCount` for empty-slot padding:\n\n```ts\nconst remainingCount = treeCount - state.snakesCount - swordsCount - coinCount\n                     - goldCount - gemCount - doorCount - keyCount - chuteCount;\n```\n\nIf `state.snakesCount` grew large enough (later levels) or the constants shifted, `remainingCount` could go negative. `Array(negative)` in the V8 engine throws a `RangeError`, crashing the loot table generation entirely so no key slot was ever created.\n\n**Why this is no longer a live bug:**\nThe single-forest-level generator this entire bug was about (`scripts/worldGen.ts`'s `generateWorld`/`generateLootTable`/etc., `scripts/game.ts`'s `setupLevel()`) has been deleted — `startNewGame()` now always opens directly in the chunked dungeon, and neither failure mode has an equivalent there: the dungeon's `KEY` is a composited Item living in a lootbox entry (`dungeonGen.ts`'s `placeContent`), never a literal grid tile, so a snake standing on its cell can't silently overwrite/destroy it the way Mode 1 required; and its placement is a deterministic positional pick, not a loot-table roll that can underflow the way Mode 2 required.\n\nThe mitigation that used to guard against both (`checkForMissingKey()`/`shouldAutoGrantMissingKey()` in `scripts/player.ts`, which silently granted a free key once a level looked \"exhausted\") has been removed along with the generator — it was already fully disabled inside any dungeon chunk, so it had no live effect, and silently granting items is undesirable to keep around as dead code.\n\n---\n\n## Final Boss: Enemies Spawn on Already-Revealed Rock Tiles\n\n**Status: Fixed ✅**\n\n**Description:**\n`handleFinalBoss()` in `game.js` iterates over `state.rocks` and spawns an enemy at every position in that array. However, `state.rocks` is never pruned when a rock is revealed during normal play — `addRock()` populates it at level generation and `clearRocks()` only runs at level setup. As a result, if the player has already dug up one or more rocks before the boss trigger fires, enemies are still spawned at those now-empty (or loot-containing) tile positions, overwriting whatever tile was there.\n\nTriggered by collecting the chute (`interactWithOpenTile` → `handleFinalBoss()`). All remaining rocks burst open as snakes.\n\n**Fix Applied:**\n- Added `state.removeRock(x, y)` to `state.js`\n- `interactWithVegetation()` calls `state.removeRock(newX, newY)` whenever a rock is revealed\n- `handleFinalBoss()` trusts `state.rocks` is current; calls `state.clearRocks()` after burst\n\n**Affected Files:**\n- `scripts/game.js` — `handleFinalBoss()`\n- `scripts/state.js` — `removeRock(x, y)` method added\n- `scripts/player.js` — `interactWithVegetation()` calls `state.removeRock()`\n",de=`# Ninjack – Important Links

## App Stores

| Resource | URL |
|---|---|
| App Store Connect (iOS distribution) | https://appstoreconnect.apple.com/apps/6778587667/distribution/ios/version/inflight |
| App Store Connect (App Information) | https://appstoreconnect.apple.com/apps/6778587667/distribution/info |
| App Store Connect (App Privacy) | https://appstoreconnect.apple.com/apps/6778587667/distribution/privacy |

## Web

| Resource | URL |
|---|---|
| Deployed game (web) | https://dropkickarcade.com/web-ninjack/ |
| Developer / support site | https://dropkickarcade.com |

## Legal

| Resource | URL |
|---|---|
| Privacy Policy (live) | https://github.com/zacharysnewman/privacy-policies/blob/main/ninjack/privacy-policy.md |
| Privacy Policy repo | https://github.com/zacharysnewman/privacy-policies |

## Source

| Resource | URL |
|---|---|
| Ninjack repo | https://github.com/zacharysnewman/ninjack |
| Bundle ID | \`com.dropkick.ninjack\` |
| Apple App ID | \`6778587667\` |
`,fe="# Dynamic Strings: Firestore-Backed Config (Implemented)\n\nThis replaces the earlier Remote Config draft. The implemented design uses a single public-read Firestore document as the runtime source of truth for user-facing strings, deployed via a GitHub Action rather than any manual console step — no Firebase Remote Config SDK is used.\n\n## Why not Remote Config\n\nRemote Config is built around template versions and a client-side `minimumFetchIntervalMillis` that intentionally throttles how often clients see a new value — good for slow-changing feature flags, but it fights against \"publish a string change and see it live in seconds.\" A Firestore document has no such throttle: a write is visible to the next read (or the next `onSnapshot`, in real time) immediately, which better matches \"no deploy/publish step in the way.\"\n\n## Architecture\n\n- **Source of truth (edit this)**: `strings/strings.json` — a flat `{ key: value }` map, committed to the repo.\n- **Live store**: the Firestore document `config/strings` in the `ninjack-96f41` project (the same project already used for analytics — see `scripts/analytics.ts`).\n- **Client loader**: `scripts/strings.ts`. `defaultStrings` is a bundled TS object shipped in every build (so the game never depends on network access to render text). At startup, `loadStrings()` fetches `config/strings` over Firestore's plain REST API (no SDK, just `fetch`), merges known keys over the defaults, and caches the merged result to `localStorage`. If the fetch fails, it falls back to the last cached copy; if there's no cache either, it falls back to the bundled defaults. `getString(key)` reads whatever was last resolved.\n- **Deploy**: `.github/workflows/deploy-strings.yml` runs `scripts/deploy/push-strings.ts` (via `npm run push:strings`), which reads `strings/strings.json` and writes it to `config/strings` using the Firebase Admin SDK. The workflow triggers on `workflow_dispatch` (dispatchable directly, on any branch) and on `push` to `main` touching `strings/strings.json` (so a plain commit also deploys). The Admin SDK credential lives only in the `FIREBASE_SERVICE_ACCOUNT` GitHub Actions secret — it is never checked into the repo and never needs to be present in a local/agent session, since the actual authenticated write happens on GitHub's runner, not locally.\n\n## Firestore security rules\n\nOnly `config/strings` is opened, for reads only; everything else in the project stays denied by default (Firestore's production-mode default):\n\n```\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /config/strings {\n      allow read: if true;\n      allow write: if false;\n    }\n  }\n}\n```\n\nWrites only ever happen via the Admin SDK (the push script above), which bypasses these rules entirely — `allow write: if false` blocks every *client*, not the deploy script.\n\n## One-time manual setup (already done for this project)\n\nThese require Firebase/GCP/GitHub console access and can't be automated from a coding session:\n\n1. Enable Firestore on the `ninjack-96f41` project (Native mode).\n2. Publish the security rules above.\n3. Generate a service account key (Firebase Console → Project Settings → Service Accounts → Generate new private key).\n4. Store that key's JSON contents as the `FIREBASE_SERVICE_ACCOUNT` secret in the repo's GitHub Actions settings.\n\n## Making a string change\n\n1. Edit `strings/strings.json`.\n2. Commit and push to `main` (auto-deploys), or ask for the `Deploy Strings` workflow to be dispatched manually on any branch.\n3. Clients pick up the change on their next `loadStrings()` call (app startup) — there is no fetch-interval throttle to wait out.\n\n## Schema: stays flat, on purpose\n\n`strings/strings.json` is deliberately a one-level `{ \"key.name\": \"string value\" }` map — grouping is expressed through dot-separated key names (`menu.play`, `menu.title`), never through object nesting. This is what makes the schema resistant to breaking changes: adding a string is always just one more sibling key of the identical shape, never a new shape. Two things enforce this in both directions:\n\n- **Deploy time**: `scripts/deploy/validateStrings.ts`'s `validateFlatStringMap()` rejects the push outright if any value in `strings.json` isn't a plain string (nested object, array, number, boolean) — a schema violation never reaches Firestore.\n- **Read time**: `unwrapFirestoreFields()` in `scripts/strings.ts` only ever extracts `stringValue` fields — even if a non-string value somehow existed in Firestore already, the client silently ignores it (falls back to the bundled default for that key) rather than misbehaving.\n\n## Adding a new string key\n\nAdd the key to both `defaultStrings` in `scripts/strings.ts` (so there's always a safe bundled fallback) and `strings/strings.json` (so it has a live value to serve). `mergeStrings()` only ever overlays keys that already exist in `defaultStrings` — an unknown key present only in the remote doc is silently ignored, so a stale/misconfigured remote value can never introduce a key the bundled app doesn't already know how to render.\n\n## Interpolation\n\n`getString(key, ...args)` replaces `{0}`, `{1}`, ... placeholders in the resolved template with positional args, e.g. `getString('modal.death', state.currentLevel)` against `\"modal.death\": \"You died 💀 on Level {0}!\"`. An out-of-range placeholder (more `{n}`s in the template than args passed) is left untouched rather than throwing — see `formatString()` in `scripts/strings.ts`.\n\n## Gotcha: don't bake `getString()` into a frozen top-level value\n\n`loadStrings()` is fire-and-forget from `main.ts` — it starts a `fetch` but nothing awaits it before the rest of the app's modules finish importing and running their own top-level code. A value computed **once**, at module import time (a top-level `const`, or an object built by a function that only ever runs once at startup and is then reused across many future renders), freezes on whatever `getString()` returned *at that instant* — almost always the bundled default, since the network fetch can't resolve synchronously — and will never pick up a live Firestore value for the rest of the session, even after `loadStrings()` resolves moments later.\n\nThis bit two real spots during the initial migration:\n- `constants.ts` used to export `FOREST_TITLE`/`CAVE_TITLE` as plain top-level `string` constants, read by `ui.ts`'s `updateGoldDisplay()` on every turn. Fixed by deleting the constants and calling `getString('scene.forestTitle')`/`getString('scene.caveTitle')` directly inside `updateGoldDisplay()`, which already runs fresh on every turn.\n- `rooms.ts`'s `RoomTheme.title` used to be a plain `string`, set once when `rooms-data.ts`'s `registerRoom({...})` runs at import time. Fixed by changing the type to `title: () => string` and calling `roomDef.theme.title()` at render time (`ui.ts`) instead of reading a frozen field.\n\nThe rule of thumb: anything read **once and reused across many future renders** (a registry entry, a named exported constant, a module-level cache) must call `getString()` lazily, inside a function invoked at render time — never store its return value in a top-level binding. Anything already inside a function that's naturally called fresh each time it's needed (menu re-renders, slot-card refreshes, HUD updates, modal builders, one-shot dev/debug UI) needs no special handling — just call `getString()` inline where the literal used to be.\n\n## Migration status\n\nEvery user-facing string in normal gameplay (`ui.ts`, `menu.ts`, `slots.ts`, `save.ts`, `game.ts`, `rooms-data.ts`, `dialogue.ts`'s static chrome, dev-only debug UI in `main.ts`) now routes through `getString()`. Docs-hub content (`scripts/docs-*.ts`, the standalone prototype pages like `gold.html`/`house-plan.html`) is deliberately excluded — it's developer/design documentation, not in-game text. This is also why the audio-testing soundboard is *not* migrated: it used to be a standalone in-app tool at `?soundboard=true` (`audio.ts`), but has since been retired in favor of the docs hub's existing \"Soundboard\" page (`scripts/docs-soundboard.ts`) — one implementation instead of two near-duplicates, and it's dochub content by nature, so it stays on plain literals like every other doc.\n\n**Excluded, permanently: NPC dialogue** (`ink/*.ink`, compiled at runtime by `inkjs` — see `scripts/npcs-data.ts`). This isn't a temporary gap to close later — a live-edited override could only ever be a flat string, and swapping one in for a line would throw away exactly the ink features (inline variable interpolation, alternatives/cycles/shuffles) that make writing it in ink worthwhile in the first place. That tradeoff only makes sense opted into per line, not applied as a blanket migration, so dialogue stays out of this system entirely. It's still centralized, just separately: each NPC's script lives in its own file under `ink/`, loaded via `?raw` the same way this repo's markdown docs are — see CLAUDE.md's \"NPC Dialogue\" section.\n",pe=`# Snake Inventory & Loot Box UI

## Overview

Snakes now carry an inventory. When killed, they drop a **loot box** tile that
holds all collected items. How the player actually collects a loot box's
contents (or a grave's) is no longer this doc's concern — see
\`docs/ground-pickup.md\`, which owns that flow for every ground/box/grave
source uniformly. This doc only covers how a snake accumulates and holds
that inventory while it's still alive, and the moment it dies and becomes a
loot box.

---

## Behavior

### 1 — Snake builds inventory during play

- Snake starts with its pre-rolled loot table items already in inventory.
- When a snake steps onto a collectable tile (💰 🗡 ❤️ 🔑) the item is
  removed from the board and added to the snake's inventory.
- All gold-type tiles (small/medium/large gold) merge into a single 💰 inventory
  entry whose count equals total gold value collected.
- CHUTE 🪂 and all structural/entity tiles remain blocked as before.

### 2 — Snake dies → loot box appears

- 2+ items: the snake's tile becomes a **loot box** 📦ᵇᵒˣ (\`dropLootBox\` in
  \`scripts/lootBox.ts\` promotes any 2+-item drop to a \`BOX\` tile).
- Exactly 1 item: the tile stays plain, walkable ground — the single item
  composites onto it the same way any other direct floor item does (see
  \`docs/ground-pickup.md\`), not a \`BOX\`. This is the current, corrected
  behavior; an earlier version of this doc said a single item still used
  the loot-box tile "for consistency," which no longer matches
  \`scripts/lootBox.ts\`'s actual \`dropLootBox\`.
- A loot box holds the snake's full accumulated inventory (§1 above).

### 3 — Collecting a loot box

Bumping a 📦 loot box (or a 🪦 grave with contents) is a plain move onto it
— both are \`movable: true\` ground, same as any other item tile — and does
**not** open anything by itself; a small overlay above the player marks
that something's there. The same ground-transfer panel every other ground
source uses (individual or "Take All" transfer, full stat inspection before
anything is collected) only opens on demand, via 🫳 Use or 🎒. This is
\`docs/ground-pickup.md\`'s §4 (superseded from its original "BOX/GRAVE bump
opens the panel directly" design down to this simpler rule) and §7 (the
item-ground overlay); see that doc for the full spec, including the panel's
Ground row, Take-All capacity handling, and the item inspect popover. The
peek-strip preview this section used to describe (a first bump revealing
contents, a second bump auto-collecting everything) no longer exists either
way — \`ground-pickup.md\`'s panel replaces it outright rather than extending
it.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Snake dies with empty inventory | No loot box placed (unchanged) |
| Snake dies with exactly 1 item | Item lands as a direct floor pickup (walkable, no BOX tile) — see \`ground-pickup.md\` |
| Snake dies with 2+ items | Loot box (\`BOX\` tile) placed — collection flow is \`ground-pickup.md\`'s, not this doc's |
| Another snake steps on loot box | Loot box is added to that snake's inventory; box removed from board (unchanged) |

For every edge case about *collecting* a loot box (partial capacity, gold
stacking, what's shown while inspecting an item, etc.), see
\`docs/ground-pickup.md\` — this doc no longer duplicates that spec.

---

## Open Questions

- Should the loot box be passable by snakes (they absorb its contents) or
  treated as a blocked tile?
- 🪙 coin and 💎 gem tiles are gone; all currency is 💰 gold with a numeric
  value, always shown as a badge even at 1 (\`ground-pickup.md\`/
  \`inventory-system.md\` own the current badge/display rules).
`,me="# Data Model Redesign: Tiles, Items, Entities, Mobs\n\n## Overview\n\nThis doc captures a design discussion about what `Tile` actually represents in\nthis codebase, and where the boundaries between **tiles**, **items**, and\n**entities** should be. Some of this has already shipped (the ground/occupant\nsplit, `movable`/`interactable`, locked/unlocked tile pairs); the rest is a\nproposed direction, not yet implemented. See \"Status\" on each section.\n\nThe trigger: while designing `Tile.movable`/`Tile.interactable`, it became\nclear that `Tile` is being asked to serve three different roles that only\npartly overlap, and that the existing `Entity` hierarchy has accumulated\ninconsistencies (an empty `RabbitEntity` subtype, a `MoneyMonsterEntity` that\ndeliberately doesn't share `ActiveEntity`'s shape, enrage state tracked twice\nin two different representations). Individually these were small fixes;\ntogether they pointed at a missing shared vocabulary for \"what kind of thing\nis this.\"\n\n---\n\n## Shipped: ground vs. occupant (`scripts/tileUtils.ts` + `scripts/occupancy.ts`)\n\n**Status: implemented.**\n\n`state.grid` is the ground layer only — terrain, items, hazards, landmarks.\nIt is never written by entity movement. \"Who is standing where\" (player,\nsnakes, rabbit, the enraged cave money monster) is answered separately by\n`getOccupant(x, y)`, which reads each entity's own `x`/`y` directly. This is\nwhat lets an entity rest on or pass over a ground item/hazard/landmark\nwithout destroying it — the ground is simply never overwritten by movement.\n\n## Shipped: `Tile.movable` / `Tile.interactable`\n\n**Status: implemented.**\n\nEvery `Tile` carries two independent booleans: `movable` (a move can end on\nthis tile) and `interactable` (bumping it always triggers a defined handler,\nwhether or not the move completes). All four combinations occur in real\ndata — `EMPTY` is movable-only, `GOLD`/`HOLE`/`DOOR` are both, `TREE`/`FIRE`/\n`OLD_MAN` are interactable-only, `WALL`/`BED`/`CHAIR` are neither.\n\n## Shipped: locked/unlocked tile pairs\n\n**Status: implemented.**\n\n`LOCKED_DOOR`/`DOOR` and `LOCKED_CAVE_GATE`/`CAVE_GATE` are genuinely distinct\ntiles rather than one tile plus a `doorLocked` boolean — the same \"break\nreveals a different tile\" pattern already used for trees and rocks, applied\nto unlocking instead of breaking.\n\n## Shipped: money monster enrage state\n\n**Status: implemented.**\n\n`state.moneyMonster !== null` *is* \"is mad\" — no separate flag. The 25-bump\nenrage counter isn't an entity or a position, so it doesn't live on `state`\nat all; it's per-gate-attempt progress, persisted through\n`loadCaveProgress`/`saveCaveProgress` the same way `bumpAmount` already is.\n\n---\n\n## The problem: `Tile` serves three roles, only one needs everything in it\n\n**Status: identified, not yet fixed.**\n\n| Role | Examples | What it actually needs |\n|---|---|---|\n| **Ground content** | `WALL`, `FIRE`, `GOLD`-on-the-floor, `DOOR` | `movable`, `interactable`, plus display |\n| **Entity display** (`Entity.tile`) | `NINJA`, `SNAKE`, `RABBIT`, `MAD_MONEY_MONSTER` | display only — never appears in `state.grid`, so `movable`/`interactable` are dead data |\n| **Item identity** (`InventoryItem.tile`, rock/tree `loot`) | `GOLD`, `KEY`, `SWORD`, `HEART`, `CHUTE` | display + `value` — `movable`/`interactable` are never read off an inventory stack |\n\nChecking whether the occupant-role `movable`/`interactable` values are ever\nactually consulted: they aren't. Ground-tile dispatch only ever runs on\n`getGridTile()` results, and `SNAKE`/`RABBIT`/`MONEY_MONSTER` can structurally\nnever be a `getGridTile()` result (occupants are checked separately, and the\noccupant-first check in `player.ts` intercepts before ground dispatch is\nreached). So `SNAKE.interactable = true` looks meaningful but is dead weight.\n\nThis isn't just noise — it's a missed compile-time guardrail.\n`setGridTile(x, y, tile: Tile)` currently accepts *any* `Tile`, including\n`SNAKE`/`NINJA`. Nothing stops a future `setGridTile(x, y, SNAKE)` from\nsilently reintroducing the exact \"entity baked into ground\" bug the\nground/occupant split fixed — because `Tile` doesn't distinguish \"can\nlegitimately be ground\" from \"can't.\"\n\n**Proposed fix:** split the base `Tile` (display/animation/glow/contextIcon —\nwhat every role needs) from a `GroundTile extends Tile` that adds\n`movable`/`interactable`. Type `state.grid`, `getGridTile`/`setGridTile`/\n`setGroundTile`, and the ground-restoring half of `tileFromType` around\n`GroundTile`. Type `Entity.tile` and `InventoryItem.tile` as plain `Tile`.\n`WALL`/`GOLD`/`DOOR`/etc. become `GroundTile`; `SNAKE`/`RABBIT`/`NINJA`/\n`MONEY_MONSTER` stay plain `Tile` with no `movable`/`interactable` at all.\n\n---\n\n## The real distinguishing axis: does it move on its own?\n\n**Status: proposed.**\n\nThe cleanest single line to draw: **mobs are AI-driven movers; tiles don't\nwalk around autonomously.** Everything else (is it interactable, does it\ncarry a value, how it renders) is data that varies independently of that\naxis — it's not a reason to invent a new category. Concretely, this means:\n\n- A stationary, dialogue-triggering thing (`OLD_MAN`, `HOUSE`) is a\n  **GroundTile** by this axis, not a fifth \"NPC\" category — it just happens\n  to have a \"talk\" interaction handler instead of \"break\" or \"attack.\" NPCs\n  don't need their own ontological bucket here; they need their own\n  *interaction handler*, which is a different (already-solved) problem.\n- The **player** has `x`/`y` and needs the same occupancy treatment as a mob\n  (`getOccupant`, render compositing) — but its movement is user-driven, not\n  AI-driven. It's an **Entity** but not a **Mob** by this definition, and the\n  codebase already reflects that structurally today: `Entity` is the base\n  both share, and the player is typed as plain `Entity`, never\n  `ActiveEntity`.\n\n### Proposed categories\n\n1. **GroundTile** — indexed by grid position, never moves on its own.\n   `movable`/`interactable` live here. This is everything in `state.grid`\n   today: obstacles, hazards, breakables, doors/gates, containers, and\n   stationary NPCs.\n\n2. **Item** — a pickup resource identity (`GOLD`, `COIN`, `GEM`, `SWORD`,\n   `KEY`, `HEART`, `CHUTE`). Fully separate from GroundTile. This is a\n   smaller change than it sounds: `state.lootBoxes: Map<coord,\n   InventoryItem[]>` already stores \"what's really here\" independently of\n   the ground `TileType` for boxes/graves/direct-drops-with-a-real-count —\n   `interactWithOpenTile` checks that map *before* falling back to the\n   ground tile's own `.value`. The inconsistency is that direct gold/key/\n   sword/heart/chute *also* get baked in as their own distinct GroundTile\n   constants instead of uniformly going through \"ground is `EMPTY` + an item\n   reference.\" Unifying that removes `GOLD`/`KEY`/etc. as ground `TileType`s\n   entirely.\n\n3. **Entity** — has `x`/`y` independent of the ground layer. Splits along\n   the movement axis:\n   - **Mob** (AI-driven): `SNAKE`, `RABBIT`, `MAD_MONEY_MONSTER` — has a\n     `pattern`, moves each turn on its own. One flat `Mob` type covers all\n     three, with no per-species subtype (see \"Mob shape — decided\" below).\n   - **Player**: an Entity, not a Mob — no AI pattern, moves on input.\n\n4. **Display** (the reusable rendering piece) — `display`/`animation`/\n   `glow`/`contextIcon`. Every category above needs this and none of them\n   need it to differ in shape. This is most of what's left of `Tile` once\n   `movable`/`interactable` (GroundTile-only) and `value` (Item-only) move\n   out — a shared component, not reimplemented per category.\n\n### Mapping today's tile constants onto the new categories\n\n| Category | Tiles |\n|---|---|\n| GroundTile — inert | `WALL`, `ROOM_WALL`, `BED`, `CHAIR` |\n| GroundTile — interactable, not movable | `FIRE`, `TREE`, `ROCK`, `GEM_ROCK`, `VASE`, `LOCKED_DOOR`, `LOCKED_CAVE_GATE`, `BOX`, `GRAVE`, `OLD_MAN`, `HOUSE`, `MONEY_MONSTER`/`SICK_MONEY_MONSTER` (pre-enrage statue) |\n| GroundTile — movable + interactable | `HOLE`, `DOOR`, `CAVE_GATE`, `ROOM_DOOR` |\n| Item | `GOLD`, `COIN`, `GEM`, `SWORD`, `KEY`, `HEART`, `CHUTE` |\n| Mob | `SNAKE`, `RABBIT`, `MAD_MONEY_MONSTER` |\n| Entity, not Mob | `NINJA` (player) |\n\n### Where the model doesn't cleanly fit yet — open questions\n\n- **`SNAKE` as rock/tree loot — resolved: a shared `Spawnable` type.**\n  `generateRockLootTable` lists `SNAKE` as valid loot despite it being a\n  Mob, not an Item or GroundTile — \"what a rock reveals when broken\" needs\n  to express either \"place this Item\" or \"spawn this Mob.\" Resolution:\n  introduce a `Spawnable` type that both `Item` and a mob-spawn instruction\n  (e.g. `{ spawnMob: 'SNAKE' }`) satisfy, and have rock/tree/snake loot\n  tables hold `Spawnable[]` uniformly. This\n  replaces `spawnTile`'s `if (tile.type === SNAKE.type) addSnake(...) else\n  setGridTile(...)` type-string special-case with a dispatch on `Spawnable`'s\n  own discriminant.\n\n  This also carries a new boolean, `revealOnAdjacentPlayer` (default\n  `false`), which resolves the rock-simplification discussed separately:\n  today, `checkAdjacentRockReveals` (`player.ts`) auto-reveals a rock's\n  contents while the player stands adjacent to it *without* bumping it, but\n  only when `rock.loot.type === SNAKE.type` — a hardcoded type check, same\n  seam as `spawnTile`'s. Every other rock only reveals on direct bump\n  (`interactWithVegetation`, which doesn't consult `tolerance` at all today).\n  **Decided:** `revealOnAdjacentPlayer` moves onto the `Spawnable` itself\n  (`SNAKE`'s spawn instruction sets it `true`; `Item` spawnables default\n  `false`), and the countdown is dropped — reveal is now instant the moment\n  the player is adjacent to a rock whose `Spawnable` has the flag set, not a\n  multi-turn `tolerance` countdown. Since `tolerance`/`maxTolerance` had no\n  other functional reader (the direct-bump path already ignores them), this\n  removes `tolerance` from `RockEntity` entirely — `RockEntity` becomes just\n  `{ x, y, spawnable: Spawnable }`, the same shape as `lootBoxes`/\n  `treeLootMap`'s entries, closing the \"5th shape\" gap it used to be. It also\n  removes: `worldGen.ts`'s per-rock random `tolerance` generation, `game.ts`'s\n  override forcing snake-rocks to `tolerance = 1`, and whatever purely-visual\n  \"wobble\" `tileUtils.ts`'s `setRockDisplay` drew while counting down — worth\n  being explicit that this is a deliberate loss of the \"rock cracks over a\n  few turns before the snake bursts out\" tension beat, not an accidental\n  side effect of the simplification.\n- **The money monster's GroundTile → Mob transition, and `MoneyMonsterEntity`'s\n  shape — resolved.** `MONEY_MONSTER`/`SICK_MONEY_MONSTER` are GroundTiles\n  (the gold-donation depositor statue) that *become* the `MAD_MONEY_MONSTER`\n  Mob on the 25th bump (`enrageMoneyMonster`) — that transition itself\n  (ground tile → real occupant, ground cell cleared to `EMPTY`) is unchanged\n  and still worth naming as its own pattern, distinct from \"Item pickup\n  removes the GroundTile\" and \"DOOR-style GroundTile swaps to a different\n  GroundTile.\"\n\n  What's now decided is the shape of the mob on the other side of that\n  transition. Money monster (pre-enrage) and mad money monster (post-enrage)\n  are different things: the statue never fights, only ever takes gold\n  donations. The **mad money monster does fight** — it can be attacked, has\n  health, does real (if enormous) damage — it's just effectively unkillable.\n  So `MAD_MONEY_MONSTER` gets a real `Mob` shape with its own `EntityDef`:\n  `canAttack: true`, `attackDamage` set to a deliberately lethal value, and a\n  new `invincible: boolean` field on `EntityDef` (`true` for this one,\n  `false`/absent for `SNAKE_DEF`/`RABBIT_DEF`) — an explicit flag rather than\n  an `Infinity` `maxHealth`, because the UI needs to check it directly to\n  hide the health display for invincible mobs.\n\n  This resolves for (nearly) free: `player.ts`'s occupant-first check\n  (today `if (occupant && isActiveEntity(occupant))`, `player.ts:344` —\n  renamed `isMob()` per the naming decision below) already runs *before* the\n  ground-tile `MONEY_MONSTER` branch (`player.ts:382`). Once\n  `MAD_MONEY_MONSTER` has real `health`/`def`, `isMob()` is true for it, so\n  bumping the enraged monster automatically routes into the normal attack\n  path (today `interactWithActiveEntity`, renamed `interactWithMob`) — no new\n  dispatch code needed in `player.ts`. Three call sites do need updating,\n  though:\n  - `interactWithMob`'s kill check (`player.ts:87`:\n    `const killed = entity.health <= 0`) needs to become invincible-aware\n    (e.g. `const killed = !entity.def.invincible && entity.health <= 0`),\n    since damage should never actually kill it regardless of how low health\n    reads.\n  - `cave.ts`'s current hardcoded retaliation damage\n    (`handleDamage(99, ...)` in `moveMoneyMonster`,\n    `handleDamage(state.currentHealth, ...)` in `handleMoneyMonster`) should\n    be replaced with `monster.def.attackDamage`, the same pattern `snake.ts`\n    already uses (`handleDamage(snake.def.attackDamage, ...)`).\n  - `entityHealth.ts`'s heart-rendering (`syncEntityHealthBar`) needs to skip\n    mobs with `def.invincible` set, per the \"hide health display on\n    invincible\" requirement.\n- **Entity/Mob naming — decided.** This doc's vocabulary is a rename of what\n  already exists, not new concepts — but rather than the two-name swap\n  originally proposed (`Entity`→`Occupant`, `ActiveEntity`→`Entity`), the\n  decision is smaller: **keep today's `Entity` exactly as it is** (`state.ts`:\n  `x`, `y`, `tile` only — no rename), and rename only **`ActiveEntity` →\n  `Mob`** (and `isActiveEntity` → `isMob`). \"Occupant\" is dropped from the\n  vocabulary entirely.\n\n  This is the cheaper rename, and provably so: bare `Entity` is referenced\n  across 10 files (`snake.ts`, `tileUtils.ts`, `debug.ts`, `entityHealth.ts`,\n  `rabbit.ts`, `player.ts`, `occupancy.ts`, `cave.ts`, `state.ts`,\n  `entity.ts`), while `ActiveEntity` appears in only 4\n  (`entityHealth.ts`, `player.ts`, `state.ts`, `entity.ts`, plus\n  `tests/snake-monster-entity-fixes.test.ts`). Renaming only the narrower\n  name means the widely-used base name never has to move, and there's no\n  window mid-refactor where \"Entity\" means two different things.\n\n  **What \"Entity\" means, concretely:** anything with its own `x`/`y` that\n  lives independent of `state.grid` — a thing *standing on* a cell, as\n  opposed to a value baked into the cell itself. Examples:\n  - **Entity:** the player (moves on input, no AI pattern — an Entity, not a\n    Mob), a snake (Entity *and* Mob: AI-driven, attacks), the rabbit (Entity\n    *and* Mob: AI-driven, flees), the mad money monster (Entity *and* Mob:\n    AI-driven, roams). All four show up in `getOccupant(x, y)`'s result and\n    get composited over the ground tile at render time.\n  - **Not an Entity, just a GroundTile:** `WALL`, `GOLD` sitting on the\n    floor, `TREE`, `LOCKED_DOOR`. These have no `x`/`y` of their own — they\n    *are* the value at `state.grid[y][x]` — and never appear from\n    `getOccupant()`.\n\n  Note on `occupancy.ts`: since `Entity` keeps its current name, `getOccupant`/\n  `isOccupied`/`isOccupiedByOther` need no renaming either — \"Occupant\" was\n  only ever a candidate *type* name, never something the file/function names\n  needed to match. `getOccupant()` does still need a mechanical update in\n  phase 4 (its hardcoded `player → snakes → rabbit → moneyMonster` chain\n  becomes a scan over the unified `state.mobs` array, see below), but that's\n  unrelated to naming — and, as corrected from an earlier pass of this doc,\n  not in conflict with the file's existing \"avoids a duplicate representation\n  of position\" comment either (that comment warns against a synced coordinate\n  index, not against scanning one array instead of three).\n- **Mob shape — decided: one flat type, no per-species subtypes.** Today,\n  `SnakeEntity`/`RabbitEntity`/`MoneyMonsterEntity` each extend `ActiveEntity`\n  (or, for `MoneyMonsterEntity`, deliberately don't). Species shape\n  inconsistency has caused real breakage — `MoneyMonsterEntity` not matching\n  `ActiveEntity` is exactly why `isActiveEntity()`'s duck-typed guard had to\n  exist as a workaround in `player.ts`'s dispatch. Decided fix: **one flat\n  `Mob` type, no subtypes**, with species-only fields made optional rather\n  than split into their own interfaces:\n\n  ```ts\n  interface Mob extends Entity {   // Entity = x, y, tile — unchanged\n    pattern: AiPattern;\n    inventory: InventoryItem[];\n    def: EntityDef;\n    health: number;\n    justSpawned?: boolean;   // snake-only; unused by rabbit/mad money monster\n    nextDir?: string | null; // snake-only; unused by rabbit/mad money monster\n  }\n  ```\n\n  No `SnakeMob`/`RabbitMob`/`MoneyMonsterMob`. `state.snakes`, `state.rabbit`,\n  `state.moneyMonster` today, and the unified `state.mobs` (see below) once\n  phase 4 lands, all just hold `Mob`.\n\n  Checking what the subtypes actually add today: `RabbitEntity` — nothing\n  (`export interface RabbitEntity extends ActiveEntity {}`, already flagged\n  above as \"a rename, not a distinct type\"). `MoneyMonsterEntity` — nothing,\n  once it has a real Mob shape (previous bullet). `SnakeEntity` is the one\n  genuine case, adding `justSpawned` (spawn-turn immunity, `snake.ts:184`)\n  and `nextDir` (a pre-computed forced next move, `snake.ts:103-104,\n  153-155, 232-233`) — both read only by `snake.ts` itself. Species\n  *behavior* differences were never carried by the subtypes anyway; they're\n  carried by `def: EntityDef` (`canAttack`, `attackDamage`, `maxHealth`,\n  `invincible`, `blockedTiles`, `dropsLootOnHoleDeath`, `canPickupItems`),\n  which every Mob already has regardless of subtype — so collapsing the\n  subtypes loses no behavioral distinction.\n\n  In type-theory terms: `interface B extends A { extra }` is structurally an\n  intersection type (`A & { extra }`) — requires everything from every\n  member at once, the opposite of a union (`A | B`, satisfies just one).\n  The per-species subtypes were TypeScript's way of expressing \"the shared\n  Mob shape, AND these extra species fields, always.\" Moving those extra\n  fields onto `Mob` as optional keeps the same information but trades away\n  one guarantee: nothing stops a future bug from setting `rabbit.nextDir`\n  (compiles fine, silently unread) the way `RabbitEntity`'s lack of that\n  field used to prevent outright. That's an intentional trade for uniform\n  treatment across mobs, not an oversight.\n\n  Bonus: this also resolves what would otherwise be a union-narrowing\n  problem for `state.mobs: Mob[]` (phase 4). If mobs kept per-species\n  subtypes, a mixed array's element type would have to be\n  `SnakeMob | RabbitMob | MoneyMonsterMob` — a union — and reading `nextDir`\n  would require narrowing by `tile.type` first. With one flat `Mob`,\n  `state.mobs: Mob[]` is homogeneous; consuming code just does\n  `if (mob.nextDir)`, the same runtime pattern `snake.ts` already uses\n  (`snake.nextDir ?? getRandomDirection()`).\n\n  Files touched beyond the `ActiveEntity`→`Mob` rename above: `state.ts`\n  (delete the three subtypes, add their fields to `Mob`), `snake.ts`,\n  `rabbit.ts`, `debug.ts`, and their tests\n  (`tests/rabbit-item-coexistence.test.ts`, `tests/occupancy.test.ts`,\n  `tests/monster-item-coexistence.test.ts`).\n- **`state.snakes`/`state.rabbit`/`state.moneyMonster` as separate fields.**\n  Current storage cardinality (many / 0-or-1 / 0-or-1) reflects what current\n  level content happens to spawn, not a structural rule — nothing except the\n  field shape stops a future level from wanting two rabbits. A unified\n  `state.mobs: Mob[]` would make \"at most one\" a spawn-logic invariant\n  instead of a data-model one.\n- **Test churn beyond \"add new tests.\"** Some existing tests\n  (`tests/player-occupant-dispatch.test.ts` and similar) assert against\n  literal source strings — e.g. that `getOccupant(...)` appears before\n  `const tileValue = ...` in a function body, or that a function body does\n  *not* contain the substring `'SNAKE.type'` — rather than runtime behavior.\n  Phases 3-4 will need to rewrite these tests' assertions to match the new\n  code shape, in addition to writing the new pure-logic tests CLAUDE.md's\n  workflow already calls for; this is real work the phasing estimate below\n  doesn't currently name.\n\n---\n\n## Suggested phasing (all phases done)\n\nThis is a genuine data-model redesign, not a small patch — it touches\n`constants.ts`, `state.ts`, `worldGen.ts`, `tileUtils.ts`, `entityDefs.ts`,\n`occupancy.ts`, `save.ts`, `snake.ts`, `rabbit.ts`, `debug.ts`, and most\ninteraction dispatch in `player.ts`/`cave.ts`. Proposed order, each\nindependently shippable and testable:\n\n1. **`GroundTile` split — done.** `Tile` (display-only) vs. `GroundTile\n   extends Tile` (adds `movable`/`interactable`). One refinement found\n   during implementation: `movable`/`interactable` had to become *required*\n   on `GroundTile`, not optional as originally described above. With them\n   optional, a plain `Tile` (e.g. `SNAKE`) would still structurally satisfy\n   `GroundTile` — TypeScript doesn't require a value to declare a target's\n   optional properties — so `setGridTile(x, y, SNAKE)` would have kept\n   compiling and the guardrail this phase exists to add would've been fake.\n   Required fields make `Entity`-only tiles (`SNAKE`/`RABBIT`/`NINJA`/\n   `MAD_MONEY_MONSTER`, none of which set them at all) genuinely fail to\n   satisfy `GroundTile`. Every `GroundTile` constant now sets both explicitly\n   (`WALL: { movable: false, interactable: false }`, etc.) instead of relying\n   on omission. Also added `groundTileFromType()` next to `tileFromType()` —\n   a narrowing wrapper for the handful of call sites (`player.ts`'s\n   bump-in-place check, `save.ts`'s grid restore) that need `.movable`/\n   `.interactable` off a lookup already known to be ground content.\n   `spawnTile`, `dropLootBox`, and the dev-only `debug.ts` `setTile()` keep\n   one cast each (`tile as GroundTile`) at points that are genuinely\n   ambiguous pre-phase-5 or deliberately bypass the guardrail for debugging —\n   each commented in place with why.\n2. **`Item` extraction — done.** `GOLD`/`COIN`/`GEM`/`SWORD`/`KEY`/`HEART`/\n   `CHUTE` are plain `Tile`, never `GroundTile` — `setGridTile`/\n   `setGroundTile` now reject them at compile time, the same guardrail\n   phase 1 built. This surfaced the real design gap the original phasing\n   didn't call out: these seven were previously *directly visible* ground\n   tiles (💰/🗡/❤️/🔑/🪂 sitting in the open), and \"ground is `EMPTY` + an\n   item reference\" would have made them invisible with no further work.\n   Resolved (user decision) by building a compositing layer, mirroring the\n   existing occupant-over-ground pattern:\n   - `getGroundItem(x, y)` (`tileUtils.ts`) returns the single `InventoryItem`\n     sitting in `state.lootBoxes` at a cell whose ground is `EMPTY` — nothing\n     if there's an occupant, a multi-item stack (that's what `BOX` is for),\n     or no entry at all.\n   - `getEffectiveTile`/`renderTile` composite it: occupant, then a single\n     ground item, then the real ground tile, in that priority order. The\n     badge is now driven by the item's real `count` (`item.tile.type ===\n     GOLD.type || item.count > 1`), not a static per-Tile `.value` — no real\n     `GroundTile` carries `.value` any more, so this is the only source of a\n     badge, replacing `renderTile`'s old generic check outright.\n   - `placeItem(x, y, tile)` (`lootBox.ts`) is the uniform replacement for\n     baking an Item into the grid: reuses `addToInventory`'s canonicalization\n     (`GOLD`/`COIN`/`GEM` all merge into one `GOLD`-typed entry, `.value` as\n     the default count) so a fresh floor item is indistinguishable from one\n     an entity picked up — every existing `.tile.type === GOLD.type`\n     badge/audio/pickup check kept working unmodified, no broadened checks\n     needed. Wired into `spawnTile` (rock/tree/vase reveals), `cave.ts`'s two\n     gate-reward placements, `interactWithGemRock`, and `debug.ts`'s\n     `setTile()`.\n   - `player.ts`'s `interactWithOpenTile` collapsed to a single pickup path\n     (the pre-existing `lootBoxes`-first branch); the old ground-`.value`\n     fallback and its `collectGold`/`collectItem` helpers were deleted as\n     dead code once nothing bakes an Item into the grid anymore.\n   - Two real bugs the merge exposed, both fixed: `applyItemState`\n     (`lootBox.ts`) never had a `CHUTE` case (chutes were previously only\n     ever a direct grid placement with their own now-deleted pickup path) —\n     picking one up via the unified path would have silently done nothing.\n     And in `cave.ts`'s `renderCaveRoom`, placing the paid-gate reward at\n     `(4,4)` makes that cell's *ground* read as `EMPTY` (the reward\n     composites on top) — which would have made it a candidate for the\n     grave-marker placement loop that runs right after, letting a grave's\n     `setLootBox` call silently clobber the reward. Fixed by excluding\n     `(4,4)` from that loop's candidates when the gate is paid.\n   - `SAVE_VERSION` bumped to 6 (same discard-old-saves treatment as v4/v5):\n     a pre-v6 save's `gridState` could have e.g. `'GOLD'` baked in directly,\n     which `restoreWorld` would wrongly place as real ground. Also fixed a\n     load-ordering gap: `restoreWorld()` runs before `lootBoxes` are\n     restored, so any cell that should composite an Item rendered blank on\n     load — `loadGame` now repaints each restored `lootBoxes` cell\n     afterward.\n3. **Mob shape unification, including the rename — done.** Collapsed\n   `SnakeEntity`/`RabbitEntity`/`MoneyMonsterEntity` into one flat `Mob`\n   type (`justSpawned`/`nextDir` are optional on `Mob` itself, set only by\n   `snake.ts`); renamed `ActiveEntity`→`Mob` and `isActiveEntity`→`isMob`.\n   `entityDefs.ts` gained `EntityDef.invincible?: boolean` and a new\n   `MAD_MONEY_MONSTER_DEF` (`canAttack: true`, `attackDamage: 99`,\n   `invincible: true`, reusing the existing `MONEY_MONSTER_BLOCKED` set).\n   `interactWithMob`'s (renamed from `interactWithActiveEntity`) kill check\n   is now `!entity.def.invincible && entity.health <= 0`; `cave.ts`'s\n   `moveMoneyMonster` reads `monster.def.attackDamage` instead of a\n   hardcoded `99`; `entityHealth.ts`'s `syncEntityHealthBar` returns early for\n   `def.invincible` mobs, hiding the heart display entirely. `Entity` itself\n   (the base — player included) was **not** renamed, exactly as scoped.\n\n   Giving the mad money monster a real `Mob` shape meant every place that\n   constructs one (`cave.ts`'s `enrageMoneyMonster`, `save.ts`'s `loadGame`\n   restore) needed `inventory: []`/`def: MAD_MONEY_MONSTER_DEF`/\n   `health: MAD_MONEY_MONSTER_DEF.maxHealth` added — those fields are\n   required on `Mob`, not optional, so the old `{x, y, tile, pattern}`\n   literals stopped compiling the moment `setMoneyMonster` started\n   requiring `Mob`. Health isn't persisted across saves (nothing observable\n   depends on the exact number, since it's invincible and hearts never\n   render for it) — reset to full on load, same as before.\n\n   Because it now legitimately shares `Mob`'s shape, `isMob()`'s existing\n   duck-typed guard routes `player.ts`'s bump dispatch correctly with no\n   explicit `tile.type` check — and this actually let two things collapse\n   as dead code, beyond what was scoped: `handleMoneyMonster`'s\n   `if (state.moneyMonster) { ...retaliate... }` early branch (unreachable\n   now — bumping the enraged monster is intercepted by the occupant-first\n   `isMob()` check before `handleMoneyMonster` is ever called; it's only\n   reached for the pre-enrage ground statue), and the\n   `occupant?.tile.type === MONEY_MONSTER.type` half of the ground-tile\n   `MONEY_MONSTER` dispatch condition (same reason). Both removed.\n\n   This phase touched the 4 files that referenced `ActiveEntity`\n   (`state.ts`, `entity.ts`, `player.ts`, `entityHealth.ts`) plus the 4 that\n   referenced the now-deleted per-species subtypes (`state.ts`, `snake.ts`,\n   `rabbit.ts`, `debug.ts`) and their tests — `occupancy.ts`, `cave.ts`, and\n   `tileUtils.ts` needed no naming changes, since they only ever used bare\n   `Entity`, which stayed as-is (plus `cave.ts`'s edits above, which were\n   about the mad money monster's shape, not the `Entity`/`Mob` rename).\n4. **`state.mobs` unification — done.** `#snakes`/`#rabbit`/`#moneyMonster`\n   collapsed into one private `#mobs: Mob[]`. `state.snakes`/`.rabbit`/\n   `.moneyMonster` stayed as public getters — derived views over `#mobs`\n   (`.filter`/`.find` by `tile.type`) rather than separate storage — so\n   every existing consumer (`snake.ts`, `rabbit.ts`, `cave.ts`, `save.ts`,\n   `debug.ts`, `worldGen.ts`) needed *zero* changes; the full test suite\n   passed with no updates required, which is the strongest confirmation the\n   public API genuinely didn't change shape. `setRabbit`/`setMoneyMonster`\n   now filter out any existing mob of that species before pushing the new\n   one — \"at most one\" is that method's own convention, not a guarantee the\n   field shape forces; `clearSnakes` filters by species instead of\n   reassigning a dedicated array; `removeEntity` is now a single\n   species-agnostic filter (no more per-field `if (this.#rabbit === entity)`\n   checks). `occupancy.ts`'s `getOccupant()` shrank to the player check plus\n   one `state.mobs.find(...)` — as anticipated, this didn't conflict with\n   the file's \"avoids a duplicate representation of position\" comment, since\n   a scan over one array is the same principle as a scan over three.\n   New test coverage added directly against the unification\n   (`tests/state-mobs-unification.test.ts`): mixed-species storage, that the\n   three getters are genuinely derived (not independent state), and that\n   each mutator only ever touches its own species.\n5. **`Spawnable` type + rock simplification — done.** New file\n   `scripts/spawnable.ts` defines the discriminated union: `{ kind: 'mob',\n   mobType, revealOnAdjacentPlayer } | { kind: 'tile', tile,\n   revealOnAdjacentPlayer }`, plus constructors `snakeSpawnable()` (mob,\n   `revealOnAdjacentPlayer: true`) and `tileSpawnable(tile)` (tile,\n   `revealOnAdjacentPlayer: false`) — every call site builds a `Spawnable`\n   through one of these two, never a literal, so the reveal-on-adjacency\n   default lives in exactly one place per kind. `spawn.ts`'s `spawnTile` now\n   takes a `Spawnable` and dispatches on `.kind` first (mob → `addSnake`,\n   tile → the existing `ITEM_TYPES`-vs-`setGridTile` branch from phase 2) —\n   the old type-string special-case for `SNAKE` living inside a `Tile[]` loot\n   table is gone.\n\n   `RockEntity` (`state.ts`) is now `{ x, y, spawnable: Spawnable }` — no\n   more `tolerance`/`maxTolerance`. `checkAdjacentRockReveals` (`player.ts`)\n   collapsed from a countdown (`tolerance` ticking down to 0 across\n   adjacency checks, with rocks that would ever hold a `SNAKE` forced to\n   `tolerance = 1` as a one-hit special case) to an unconditional check:\n   `if (!rock || !rock.spawnable.revealOnAdjacentPlayer) continue;` then\n   immediate reveal. This is the same \"one flag replaces a bespoke countdown\n   override\" shape discussed for gap #1 — snake rocks no longer need\n   different treatment from any other rock; they just carry a `Spawnable`\n   that happens to say reveal-on-adjacency.\n\n   `state.ts`'s `LootDeck` class is now generic (`LootDeck<T>`, taking a\n   `fallback: T` in its constructor) instead of hardcoded to `Tile`;\n   `#loot`/`#rockLoot` are `LootDeck<Spawnable>`, `#snakeLoot` stays\n   `LootDeck<Tile>` (it draws a reward *tile* for a defeated snake, an\n   unrelated concept). `treeLootMap` is `Map<string, Spawnable>`.\n   `worldGen.ts`'s `generateLootTable`/`generateRockLootTable` return\n   `Spawnable[]`, wrapping every fill with `tileSpawnable(...)` or\n   `snakeSpawnable()`; `game.ts`'s rock setup loop now just does\n   `rock.spawnable = state.drawRockLoot()` with no override afterward.\n\n   Persistence: new `SerializedSpawnable` (`{ kind, mobType?, tileType? }`)\n   plus `serializeSpawnable`/`deserializeSpawnable`, mirroring this\n   codebase's existing \"persist a `TileType` string, not a live object\"\n   convention. `save.ts`'s `rocks`/`treeLoot`/`currentLootTable`/\n   `currentRockLootTable` all switched to the serialized shape; no more\n   `tolerance`/`maxTolerance`/`lootType` fields to round-trip.\n   `SAVE_VERSION` bumped to 7 (discard-old-saves, same as v4/v5/v6) since a\n   pre-v7 save's rock/loot-table shape no longer matches what `loadGame`\n   expects.\n\n   Dead code removed once the countdown was gone: `tileUtils.ts`'s\n   `setRockDisplay` (the cosmetic \"wobble as tolerance decreases\" repaint)\n   and its now-orphaned CSS (`span[data-rock-danger]`,\n   `@keyframes rockWobble`, `.rock-wobble` in `styles/styles.css`) — nothing\n   called it once no cell has stateful tolerance to visualize.\n\n   New test coverage: `tests/spawnable.test.ts` (construction — object\n   identity per call, correct `kind`/`revealOnAdjacentPlayer`/payload — and\n   serialize/deserialize round-trips for both kinds plus the common `EMPTY`\n   tile case). `tests/greedy-grotto-fixes.test.ts`'s old \"rock tolerance for\n   snake rocks\" block, which reimplemented the now-deleted countdown logic\n   inline, was rewritten to test the real `revealOnAdjacentPlayer` flag via\n   `snakeSpawnable()`/`tileSpawnable()` instead. `tests/locked-door-gate.test.ts`\n   and `tests/forest-level-content.test.ts` updated their loot-table\n   assertions from `Tile[]` membership checks to filtering `Spawnable[]` by\n   `.kind`/payload type.\n\nEach phase should follow this codebase's existing test-first workflow\n(`CLAUDE.md`'s Testing section) — pure-logic tests for the new type\nboundaries and dispatch predicates, source-contract tests for anything that\nrequires a real DOM to exercise end-to-end. Phases 3-4 also carry test\n*churn*, not just test *addition*: some existing tests (e.g.\n`tests/player-occupant-dispatch.test.ts`) assert on literal source strings\n(dispatch-order-by-`indexOf`, \"this substring must not appear in this\nfunction body\") rather than behavior, and will need their assertions\nrewritten to match the new code shape, on top of whatever new tests the\nphase adds.\n",he="# Chunked Dungeon Generation\n\nReplaces the old linear forest-level system (one 9x9 grid regenerated per numbered level, `scripts/worldGen.ts`'s `generateWorld`/`planDoorPath`) with a persistent Rogue-1980-style dungeon: a 3x3 grid of **chunks** — Rogue's own region-grid size — each chunk itself a 9x9-tile screen (the board size, `worldSize`, is unchanged). The screen-to-screen transition mechanism is ported from the sibling `ninjack-2` repo's island/chunk system (`islandTransition.ts`) — the mechanism only, not its heightmap/biome content generation, which this dungoen has no equivalent of.\n\n## Two layers\n\n- **Topology** (`scripts/dungeonGen.ts`) — pure, deterministic, seeded. Decides which of the 9 chunks are rooms, which are hallways connecting them, and where each chunk's edge doors sit. Never touches a `GroundTile`.\n- **Content** (`scripts/dungeonWorld.ts`) — turns one chunk's topology into real `GroundTile[][]` + per-edge connection flags, the shape `scripts/dungeonTransition.ts` needs to drive the transition.\n\nThis mirrors ninjack-2's own `islandGen.ts` (heightmap) / `islandWorld.ts` (chunk slicing) split.\n\n## Generation algorithm\n\nThis is the original 1980 Rogue level generator at its own native scale: Rogue splits one 80×24 screen into a fixed 3×3 matrix of 9 regions and decides per-region whether it's a room or \"GONE\" (a bare waypoint); here every one of the `gridSize`×`gridSize` **chunks** plays the role of one region — each chunk is already the game's own screen-transition unit, so \"region\" and \"chunk\" are the same 9×9-tile square, and the shipped default `gridSize` (3) matches Rogue's own fixed 3×3 exactly. `gridSize` stays tunable (see \"Tunable parameters\" below) for the docs hub preview, which is the one caller that varies it away from Rogue's own 3×3.\n\n1. **Room Determination Pass** (`placeChunks` in `dungeonGen.ts`). Every chunk, visited in raster order (top-to-bottom, left-to-right — Rogue's own \"regions numbered 0 to 8\" order), independently rolls a `goneChancePercent` chance (35% by default — Rogue's own \"30-40%\") to be marked **GONE**, capped at a running total of `maxGonePercent` of the grid (44% by default — Rogue's own \"max limit of 4 per floor\", `4/9 ≈ 44%`); once the cap is hit, every remaining chunk is forced to be a real room regardless of its own roll. A chunk that isn't GONE gets a real room: random width/height (`minRoomSize`-`maxRoomSize`, 5-7 tiles by default) and a random offset within the chunk so the room doesn't always clip to the top-left corner — Rogue's own Step 2.3. Room count is *emergent* from these two rolls, not a fixed target.\n2. **Graph Connectivity** (`buildLayout`'s spanning-tree loop). A randomized minimum spanning tree (Prim's algorithm) grows over the chunk-adjacency grid graph — orthogonal neighbors only, diagonals forbidden, exactly Rogue's Step 3.1 valid-edges rule. Starting from one random chunk, the tree repeatedly annexes a random not-yet-connected neighbor of any already-connected chunk and digs one corridor for that edge, until every chunk in the grid is connected — Rogue's Step 3.2 verbatim (\"select a random starting region... repeatedly pick a random adjacent neighbor... until all non-isolated regions are connected\"). Because a 4-neighbor grid graph is always fully connected, this spanning tree always reaches every chunk, room or GONE alike — there's no BFS fallback or long-distance routing to worry about, since every edge the tree ever digs connects two chunks that already share a boundary.\n3. **Doors.** Each chunk-to-chunk edge the spanning tree crosses gets exactly one door — a single boundary tile index (0-`worldSize`-1), assigned once per edge and written symmetrically to both chunks so their boundaries line up (a shared `Map<edgeId, index>` prevents the tree from ever needing to reconcile two different indices for the same shared edge). Door indices are always tile positions (`worldSize`, fixed at 9) — never chunk-grid positions (`gridSize`, tunable) — conflating the two was a real bug caught during development once `gridSize` stopped always equaling `worldSize` by coincidence.\n4. **GONE → hallway.** A GONE chunk that picked up at least one door during the spanning tree becomes a `hallway` chunk — Rogue's Case B, where the corridor is dug straight to the region's own center proxy vertex rather than a room wall (see \"Rendering a chunk\" below). Because the spanning tree always reaches every chunk, a chunk staying genuinely `empty` (no doors at all) never happens in practice with the shipped defaults; `empty` is kept in the `ChunkKind` union only as a defensive fallback, not a normal outcome.\n\n## Rendering a chunk (`dungeonWorld.ts`)\n\nEvery dungeon tile is one of exactly three things: `EMPTY` floor, `PATH` corridor, or solid `TREE_WALL` — a dedicated tile (`scripts/constants.ts`), *not* a reuse of the forest's own breakable `TREE`. `TREE_WALL` is `movable: false, interactable: false` — the same \"pure bump-in-place, nothing else happens\" category as `WALL`/`ROOM_WALL` — visually a tree (🌲, since Slitherwood is a forest and an invisible wall reads as a bug, not a wall) but never breakable, so a room's door is genuinely the only way in or out. There is no separate architectural \"wall ring\" tile distinct from the surrounding forest; a room's outer bound and the forest beyond it are the same solid `TREE_WALL`, differing only in the one cell a door punches through.\n\n- **Room chunks**: interior floor (`EMPTY`) surrounded by `TREE_WALL` out to the chunk's own edge, broken only by each door's carved corridor. A door's boundary point connects to the room's own outer bound — not the interior — via a corridor: first a lateral run along the boundary edge itself (which never grazes the room, since the room's margin keeps it off the boundary entirely), then a single perpendicular approach segment that punctures exactly one cell of the bound. That approach segment's target is clamped to the bound's *inner* span, excluding both corner cells — a corner has no interior cell among its 4 neighbors (all of them are themselves solid or outside the room), so a door landing on one is walkable but an isolated dead-end pocket. Getting the lateral/approach axis order right per side is the other subtle part — see the comment on `carveDoorPath` in `dungeonWorld.ts`.\n- **Hallway chunks**: no room; every door corridors straight to the chunk's own center (`dungeonGen.ts`'s `HALLWAY_CENTER`, `(4,4)`), so a 2-door hallway reads as a straight or L corridor and a rarer 3-4-door hallway reads as a junction hub. Everything off that corridor is `TREE_WALL`. `getDungeonChunk` (`dungeonWorld.ts`) — pure, unconditional — always places one of `tile.ts`'s four `PASSTHROUGH_TILES` (`PASSTHROUGH_1`..`PASSTHROUGH_4`) at that center cell, showing that chunk's own door count as a digit (1️⃣-4️⃣, picked from `Object.keys(plan.doors).length` — a fact already fixed by generation, never rerolled per visit; a degree-1 hallway is a dead end, 3-4 is a junction) — but this was only ever meant as a `?dev` diagnostic (see `dungeonSideDebug.ts`), not real content a normal player sees. `dungeonTransition.ts`'s real board-render path (`loadProceduralDungeonChunk`) is where that's actually enforced: outside `?dev` (`tile.ts`'s `isPassthroughType`, `utils.ts`'s `devMode`), the cell falls back to plain `PATH` content instead, the same way a docs-hub preview or the `?dev` debug tool itself still sees the real digit regardless. Either way it renders on dirt `'PATH'` terrain like the rest of the corridor (`tile.ts`'s `isPathTerrainType`, unconditional), the same \"landmark sits on dirt\" treatment the starting town's Old Man/Fountain use.\n- **Empty chunks**: solid `TREE_WALL`, no doors at all — the defensive fallback for a chunk the spanning tree somehow never reached. Doesn't occur with the shipped defaults (see \"GONE → hallway\" above), since a 4-neighbor grid is always fully connected.\n\nEvery zone (see `docs/zones.md`) replaces the plain `TREE_WALL` glyph above with its own `wallTile`, and `getDungeonChunk` optionally takes a second `altWall` config — every solid filler cell (room border/margin, hallway off-corridor) then rolls independently, seeded off the dungeon seed and the cell's own coordinates, to become the zone's `altWallTile` instead. See `docs/zones.md`'s `ZoneDef` section for the per-zone chance/tile data and the full wiring.\n\n### Visualizing off-corridor space (`scripts/dungeonSideDebug.ts`, `?dev` only)\n\nGroundwork for a future \"place a pond/NPC cave entrance in unused hallway space\" pass: every hallway chunk's own `HALLWAY_CENTER` passthrough tile gets 4 tappable handle tiles (one per cardinal side, dashed cyan outline) the moment that chunk loads. Tapping a handle toggles a highlight over every off-corridor wall/tree cell on that side (`dungeonGen.ts`'s `hallwayWallCells`, filtered by `dungeonSideDebug.ts`'s `wallCellsForSide`) — the real unclaimed space on that side. \"Side\" is a plain geometric-quadrant split around `HALLWAY_CENTER` (up/down purely by `y`, left/right purely by `x`), so a cell off the diagonal deliberately counts for two sides at once (e.g. northwest of center highlights under both `up` and `left`) rather than a mutually-exclusive 4-way partition. Applies to every hallway chunk regardless of door count (1-4), not just 3-4-door junctions. Always on under `?dev`, no separate toggle — installed once from `main.ts` (`installDungeonSideDebug`), refreshed on every chunk load from `dungeonTransition.ts`'s `loadDungeonChunk` (`refreshDungeonSideDebug`).\n\nTwo more outlines layer on top of that fill, both sourced from `dungeonGen.ts`'s `findOutpostSpots`/`findTouchingSpots` (see \"Identifying eligible content footprints\" below): a **gold** outline around the north-only NPC Outpost candidate — always shown for a qualifying chunk, no tap needed, since there's only ever one shape/side — and a **blue** outline around that side's own largest pond candidate, shown only while that side's handle is toggled on. Both use the same largest-area-first ordering `findTouchingSpots` already returns, so the outline is always the single biggest footprint available on that side, not an arbitrary one.\n\n### Identifying eligible content footprints (`dungeonGen.ts`'s `findTouchingSpots`/`findOutpostSpots`/`findPondSpots`)\n\nPure, DOM-free logic (no `GroundTile` involved) for locating a rectangular footprint of open (off-corridor) cells that touches `HALLWAY_CENTER` on a given side — the actual space a pond or NPC Outpost could occupy. \"Touches\" means the rectangle includes that side's own handle cell (the one cell adjacent to `HALLWAY_CENTER` — the same cell `dungeonSideDebug.ts` places its tap target on), since no other off-corridor cell on a single side is orthogonally adjacent to center; a door's corridor always runs through exactly that cell when one exists on that side (and sometimes when it doesn't — an off-center door's own path can still cross it, per the geometric-overlap note above), so a side with a door there has zero eligible footprints of any size.\n\n`findTouchingSpots(plan, side, sizes)` builds one `depthReach` array per call (how many open cells extend from the handle cell outward before hitting a corridor cell or the board edge) and checks the requested `sizes` against it largest-area-first — one shared O(9) scan regardless of how many sizes are asked for. `OUTPOST_SIZE` (3x3) and `POND_SIZES` (3x3/3x4/3x5/4x3/5x3) are the two shape sets in play; `findOutpostSpots` wraps the former for the `up` side only, `findPondSpots` wraps the latter across all 4 sides, omitting a side with nothing eligible rather than listing it empty. `HALLWAY_CENTER` sitting at index 4 of a 0-8 board caps the perpendicular-to-the-side depth at 4, so a 3x5 (5 tall) never fits `up`/`down` and a 5x3 (5 wide) never fits `left`/`right` — both orientations are listed in `POND_SIZES` precisely so a caller gets whichever one actually fits a given side.\n\nWithin one requested size, the valid positions are further ordered by how centered they are on `HALLWAY_CENTER` along the parallel axis — a caller that just takes `spots[0]` (dungeonSideDebug.ts's outline does exactly this) gets the best-looking, most-centered placement rather than an arbitrary one hugging the edge of its valid range. An odd-length shape can center exactly (its own middle cell lands on `HALLWAY_CENTER`); an even-length shape has two equally-close positions straddling center, and the smaller-offset one wins the tie. This preference only ranks among positions that actually fit — a shape whose ideal, perfectly-centered spot happens to be blocked by a corridor cell elsewhere in that span still falls back to whichever valid position is closest, not a hard requirement to center at any cost.\n\n#### Empirical footprint availability (design reference)\n\nMeasured by generating 5000 dungeon layouts (`generateDungeonLayout(seed)` for `seed` 1-5000 — the same Rogue-style procedural generator every non-boss floor uses; a boss floor is a wholly separate, hand-authored layout — see `docs/boss-fights.md` — so none of this applies there) and running `findOutpostSpots`/`findPondSpots` over every hallway chunk found. Reproducible from a plain script against these two functions — no game state, no DOM. This is a snapshot against the generator as it exists today; re-run it after any change to `MIN_ROOM_SIZE`/`MAX_ROOM_SIZE`/`GONE_CHANCE_PERCENT`/`MAX_GONE_PERCENT` or the door-placement algorithm, since all of them can shift these numbers.\n\n**Per-hallway-chunk eligibility** (12,594 hallway chunks total, avg 2.52 per level):\n\n| Footprint | Eligible chunks |\n|---|---|\n| North 3x3 (Outpost/Shop) | 37.5% (4,725 / 12,594) |\n| Any pond size, any side (summed) | 100.0% (12,591 / 12,594) — essentially universal |\n\nPond footprints are almost never fully absent from a hallway chunk — only 3 chunks in the entire sample had none. Broken down by side (not mutually exclusive — a chunk can qualify on several sides at once):\n\n| Side | Eligible chunks |\n|---|---|\n| up | 37.5% |\n| down | 28.7% |\n| left | 95.2% |\n| right | 94.9% |\n\nLeft/right offer dramatically more room than up/down — a real asymmetry in the generator (not yet root-caused; the up-only Outpost number matching the up-pond number exactly is expected, since `OUTPOST_SIZE` and `POND_SIZES`' smallest entry are both 3x3, so \"any pond fits on `up`\" and \"the Outpost fits\" are the same condition).\n\n**Per-level (floor) counts** — a \"level\" here is one generated 3x3-chunk layout, i.e. one non-boss floor:\n\n| | avg / level | 0 | 1 | 2 | 3 |\n|---|---|---|---|---|---|\n| Hallway chunks | 2.52 | 2.6% | 9.3% | 21.8% | 66.3% |\n| Outpost-eligible chunks | 0.945 | 34.2% | 41.8% | 19.3% | 4.7% |\n| Pond-eligible chunks | 2.52 | 2.6% | 9.3% | 21.8% | 66.3% (tracks hallway-chunk count almost exactly) |\n\nOf the 65.8% of levels with at least one Outpost-eligible chunk, only 36.5% of *those* (1,200 / 3,288 — 24.0% of all levels) have 2 or more; 63.5% of them have room for exactly one. Worth keeping in mind against any \"1-2 per zone\" target — most floors that can hold a shop at all only offer a single candidate spot, not a choice.\n\n**Zone-level reference math** — a zone is 5 floors, 4 of them non-boss (`docs/zones.md`):\n\n| | opportunities / zone (4 floors) |\n|---|---|\n| Outpost-eligible chunks | 3.78 |\n| Pond-eligible chunks | 10.07 |\n\nTreating each eligible chunk as one independent roll, the per-chunk spawn chance needed to average *N* Outposts/Shops per zone is approximately *N* / 3.78:\n\n| Target avg Shops/zone | Per-eligible-chunk spawn chance |\n|---|---|\n| 1.0 | ~26.5% |\n| 1.5 | ~39.7% |\n| 2.0 | ~52.9% |\n\nThis is a simple expected-value calculation (opportunities × chance = average spawns), not a distribution — actual per-zone/per-seed variance follows from the per-level counts table above (e.g. a zone whose floors all happen to roll 0 or 1 eligible chunks will land well below the average regardless of chance chosen).\n\n## Tunable parameters\n\n`generateDungeonLayout(seed, options?)` takes an optional `{ minRoomSize, maxRoomSize, gridSize, goneChancePercent, maxGonePercent }` — every field defaults to the shipped game's own constant, so every real call site (`game.ts`, `save.ts`, `dungeonTransition.ts`) is unaffected by passing none. The docs hub's \"Chunked Dungeon Generator\" preview (`scripts/docs-dungeon-generator.ts`) is the one caller that varies them, driving this exact function rather than a separate reimplementation — so the preview is guaranteed to match what a real run with the same settings would generate. `DungeonLayout` carries its own `gridSize`, so `getDungeonChunk`'s bounds check and any downstream consumer are self-describing rather than assuming the constant.\n\nTuning notes: `goneChancePercent` (35% default) and `maxGonePercent` (44% default, Rogue's own `4/9`) together control room density — room count is `gridSize² − min(chunks that rolled GONE, floor(gridSize² × maxGonePercent / 100))`, so raising `goneChancePercent` toward `maxGonePercent`'s own value pushes density down toward its floor faster, while raising `maxGonePercent` itself lowers that floor. Setting `goneChancePercent` to 0 fills every chunk with a room (no hallways at all); setting it to 100 with a low `maxGonePercent` produces a sparse dungeon dominated by long hallway chains between a minority of real rooms.\n\n## Transition mechanism (`dungeonTransition.ts`)\n\nPorted near-verbatim from ninjack-2's `islandTransition.ts`. The trigger isn't a door tile the player bumps — it's the player standing on an already-reached boundary cell and pushing *further* outward (`getNewTileInDirection` clamps at the world edge, so the attempted move resolves to the same cell). `computeChunkTransition` is the pure, DOM-free decision function; `attemptChunkTransition` reads live state and is called from `player.ts`'s `executePlayerAction`, gated so it never fires while `state.currentRoomId` is set (a room's content shares the same board but isn't dungeon content). A transition is `disableButtons → fadeToBlack → state.setPlayer(mirrored entry point) → regenerate+render the neighbor chunk → saveGame → fadeFromBlack → enableButtons`, reusing `scripts/fade.ts` exactly like every other scene transition (rooms, cave, menu).\n\n## Minimap (`scripts/minimap.ts`)\n\nA fixed, bottom-right \"Floor N\" header over a `<canvas>` painting the actual tile-by-tile terrain of the whole DUNGEON_GRID_SIZE x DUNGEON_GRID_SIZE chunk grid (currently 3x3), not a flat color per chunk — one minimap pixel (`MINIMAP_CELL_PX`, 2.5px — kept this small on purpose, see its own comment in `minimap.ts`: any bigger and the map's footprint overlaps `#controls`' D-pad on a real phone viewport, verified via Playwright bounding-rect measurement at iPhone-17 dimensions) per real dungeon tile, so a chunk's true room/corridor shape is visible at a glance once explored. Fog-of-war still gates it at chunk granularity, not tile granularity: a chunk the player hasn't yet visited (`state.isChunkExplored` false) is a flat gray block regardless of what's actually inside it; the instant `state.markChunkExplored` fires for that coordinate (`dungeonTransition.ts`'s `loadDungeonChunk`, on every chunk load) it switches to a full render of its real terrain via `getDungeonChunk` (`dungeonWorld.ts`) — the same pure, layout-only function the real board itself renders a chunk from, called again here purely for its return value (it's side-effect-free, so calling it a second time for minimap purposes is always safe).\n\nColors reuse the real game's own rather than an invented abstract wall/floor palette: the actual board renders `TREE_WALL` and `EMPTY` on the exact same `FOREST_THEME_COLOR` (\"forestgreen\") background — a tree tile only reads as different there because of the 🌲 glyph on top, not a different background. A single dungeon tile is too small on the minimap to draw a legible glyph, so both share that same grass-green base, and `TREE_WALL` gets a small `darkgreen` \"canopy\" dot on top instead of a full-tile fill — a forest chunk reads as a green field speckled with trees, not a solid wall block. `PATH` fully overrides the grass with the literal `'peru'` the real dirt-path tile itself uses (matching, not approximating, `styles.css`'s `.tile[data-tile=\"PATH\"]`). `HOLE` gets a small dark dot the same way `TREE_WALL` does. Only real static terrain is ever drawn — no gold, snakes, or other Item/mob content, which `getDungeonChunk` never returns in the first place (see \"Content\" below). `state`'s `#exploredChunks` set (per-floor, cleared on a new seed same as the chunk cache, persisted in saves as the optional `exploredChunks` field) is the source of truth for which chunks have been seen.\n\nThe minimap no longer overlays a big landmark emoji (🪂/🕳️/🪜) for `content.chute`, `content.hole`, or the start room's `SEALED_STAIRS` on an explored chunk — those were removed in favor of just the real terrain render. `state.dungeonChuteCollected`/`markDungeonChuteCollected` and the extra `renderMinimap` call `inventoryScreen.ts`'s `announceCollected` used to make on CHUTE pickup existed solely to keep that emoji in sync and were removed along with it. `CHUTE` gets no minimap marker at all now (it's an Item, never part of `getDungeonChunk`'s returned terrain). `HOLE` and `SEALED_STAIRS` both still get a small dot, but via two different mechanisms: `HOLE` is real terrain (`type === 'HOLE'` falls out of the same tile loop `TREE_WALL`'s canopy dot does), while `SEALED_STAIRS` isn't part of `getDungeonChunk`'s output at all — it's placed live into `state.grid` by `dungeonTransition.ts`'s `placeSealedStairsLandmark`, so `paintMinimap` instead calls that same placement's pure position formula, `computeSealedStairsSpot(layout)`, once per paint, and marks that one cell within `layout.rooms[0]`'s chunk directly (`MINIMAP_STAIRS_COLOR`) rather than reading it off `type`.\n\nThe player's current chunk gets a white outline (not a filled highlight — that would cover the terrain it's meant to show) plus a small red marker dot at their exact `(playerX, playerY)` within it. `renderMinimap` redraws all of this — not just on every chunk load, but after every `player.ts` `move()` too (guarded to `!currentRoomId && !inTown`, same as `attemptChunkTransition`) — so the marker tracks position turn to turn, not just chunk to chunk. The floor number replaces what used to be a separate top-bar title showing \"Slitherwood Lv. N\" — `ui.ts`'s `updateGoldDisplay` now hides that bar entirely while plain dungeon-exploring (it still shows normally for a room, which has no minimap of its own). Tapping the small map expands it (`openMinimapExpanded`); its header additionally shows the current zone's name (`getZoneForFloor(state.currentLevel).name`, `zones-data.ts`) via the `hud.minimapFloorZone` string (e.g. \"Slitherwood - Floor 1\") — the small corner header stays the plain `hud.minimapFloor` (\"Floor N\") string, since there's no room to spare for a zone name at that size (see `MINIMAP_CELL_PX`'s own comment above).\n\n## Content (`DungeonLayout.content`, `dungeonTransition.ts`)\n\nRooms are no longer empty floor. `dungeonGen.ts`'s `placeContent` rolls the room content once per seed, continuing the same rng stream as the topology passes above, using exactly the \"Room-Bound Array Lookup\" pattern this doc used to describe as follow-up work: pick a random real room from `DungeonLayout.rooms`, then a random interior tile of its rect (`room.x+1 .. room.x+w-2`, `room.y+1 .. room.y+h-2`) — an O(1) lookup with no board scan, tracking already-claimed cells so nothing collides. The result, `DungeonLayout.content`, is purely positional (`{chunkX, chunkY, x, y}` spots) — `dungeonGen.ts` still never touches a `GroundTile`:\n\n- **`content.chute`** — one `CHUTE` Item spot. Never placed in the same room chunk as `content.hole` (finding one must never trivially reveal the other's chunk) and never in the starting room (`layout.rooms[0]`, which already guarantees the Sealed Stairs landmark and, on level 1, the Old Man) — each exclusion only applies when another room actually exists to fall back to. Also never placed on a **doorway-entrance cell** — the one interior tile a player's very first step through a door lands on (`pickContentSpot`'s `avoidDoorways` flag, computed from `roomWallTarget`/`ENTRY_POINT`) — since the chute is essential for progression, landing it right where a player first steps into a room risked feeling like a soft-lock if that door was the room's only connection. Falls back to the unfiltered interior if a room is small enough that every interior cell is itself a doorway entrance, rather than ever failing generation.\n- **`content.hole`** — one `HOLE` spot, baked directly into that chunk's static tiles by `dungeonWorld.ts`'s `getDungeonChunk` (it's a real `GroundTile`, unlike the Item/mob content below). Excluded from the chute's own room chunk and the starting room, same two constraints as `content.chute` above, dropped one at a time (chute-chunk exclusion first, then start-room exclusion) only once relaxing one is the sole way to still find a room — so with 3+ real rooms, the ladder/start room, the chute's room, and the hole's room are always three different chunks; with only 2 rooms total, the hole falls back into the start room (unavoidable — there's nowhere else for it to go). `HOLE` has no lock/unlock state and is `movable: true`, so unlike the old `LOCKED_DOOR` it replaced, it can never wall a room off from its own doorway in the connectivity sense — but it gets the same doorway-entrance exclusion as the chute above, since falling straight into a `HOLE` (dead without a chute) as your first step into a room is exactly the kind of surprise that exclusion exists to prevent.\n- **`content.snakes`** — a per-room count (the name predates a second room species, but the placement is now species-neutral — see below), not a flat dungeon-wide total: `getRoomEnemyCount(room)` scales with that room's own `getRoomTileCount(room)` (width × height, `ROOM_TILE_COUNT_PER_ENEMY` tiles per potential enemy, floor of `MIN_ENEMIES_PER_ROOM`) — a big room reliably gets more spots than a small one. `layout.rooms[0]` (the dungeon's own start room) is skipped entirely — a fresh run should never open into an immediate enemy fight.\n- **`content.pathwayEnemies`** — `getPathwayEnemyCount(wallCellCount)` spots per **hallway** chunk on the floor (the GONE-chance regions that pick up a corridor instead of a room), each placed on one of that chunk's own wall (non-corridor) cells rather than the corridor itself — `dungeonGen.ts`'s `hallwayPathCells` (the same function `dungeonWorld.ts`'s `buildHallwayTiles` calls to paint `PATH` vs. the zone's wall tile, so the two can never disagree about which cells are corridor) gives the corridor set; every other cell in the 9×9 chunk is a candidate wall spot. Scaled like `content.snakes` (`getRoomEnemyCount`) but against a hallway chunk's own wall-cell count instead of a room's footprint — `PATHWAY_WALL_TILE_COUNT_PER_ENEMY`/`MIN_PATHWAY_ENEMIES_PER_HALLWAY` (tuned denser than the room formula, since a hallway chunk has no other content of its own) — so a short 2-door hallway (more wall, less corridor) gets more spots than a busy 3-4-door junction hub. Placed in the same `placeContent` pass, purely positional like every other content list — which species (if any — a zone's `pathwayMobs` roster can be empty) actually spawns at each spot is decided later, at load time, by `dungeonTransition.ts` (see below), the same room-vs-hallway split `zones-data.ts`'s `enemies`/`pathwayMobs` rosters describe (see `docs/zones.md`). Since a wall cell is otherwise solid `TREE_WALL`, only a flying species (`entityDefs.ts`'s `EntityDef.flies`, e.g. `BAT`) can actually occupy one — see \"A flying species...\" below.\n- **`content.shop`** — at most one `SHOP` landmark per floor (`placeShopAndPonds`), deterministic-random among however many hallway chunks independently qualify for `OUTPOST_SIZE` (3x3) on their `up` side (`findOutpostSpots` — see \"Identifying eligible content footprints\" above); `null` when none do (roughly a third of floors, per \"Empirical footprint availability\"). A real `GroundTile`, baked directly by `getDungeonChunk` (`dungeonWorld.ts`) the same way `content.hole` is — the chosen footprint is cleared entirely to `EMPTY` (a little plaza) and `SHOP` itself sits in the exact center of that footprint (`shop.landmark` — `OUTPOST_SIZE` is always 3x3, so this is always one cell in from every edge), reachable from any of the 8 surrounding cells rather than only the one side it happens to touch `HALLWAY_CENTER` from. `SHOP` gives a fixed flavor line via `npcs-data.ts`'s `FLAVOR_EXAMINE` (same \"bump for one fixed line\" mechanism as `FOUNTAIN`/`HOUSE`/the town's own boarded-up shops) — a deliberately different, \"open\" tile from those closed town fronts (`gameConfig.ts`'s own comment on `SHOP`), sharing one 🏡 exterior glyph for every future differentiated shop type (apothecary/blacksmith/tanner/carpenter *open* variants — a shuffle-bag \"no repeat until exhausted\" pick among them — are tracked follow-up work, not yet implemented).\n- **`content.ponds`** — one `POND` footprint for every hallway chunk that ISN'T the shop chunk and has at least one eligible side (`findPondSpots`) — a chunk that's neither the shop nor pond-eligible at all (vanishingly rare) simply has no entry. `placeShopAndPonds` rolls a side first, then a size within that side's own candidates, so a chunk eligible on several sides isn't biased toward whichever side happens to offer the most size options. Unlike `SHOP`, a pond fills its *entire* footprint with `POND` — an area feature, not a point landmark — baked the same \"directly into `getDungeonChunk`'s static tiles\" way. Both `content.shop`'s footprint and every `content.ponds` footprint are excluded from `content.pathwayEnemies`' own candidate pool (`placeContent`'s `claimFootprint`) so a pathway enemy can never roll a perch spot that's about to become open shop floor or water.\n- **`content.freeTileDrops`** — one roll per free interior room tile left over once `content.chute`/`content.hole`/`content.snakes` have already claimed theirs (`placeFreeTileDrops`), replacing the old fixed `content.gold`/`content.hearts`/`content.equipment` lists that each independently claimed their own hand-picked spot count. Every free cell gets exactly one roll against `constants.ts`'s `FREE_TILE_NOTHING_CHANCE_PERCENT` (80) / `FREE_TILE_GOLD_CHANCE_PERCENT` (10) / `FREE_TILE_ITEM_CHANCE_PERCENT` (10): a \"nothing\" roll simply isn't added to the list; a \"gold\" roll carries a random amount (`GOLD_DROP_MIN`..`GOLD_DROP_MAX`) as a plain `GOLD` item, replacing the old fixed coin/gold/gem three-tile split; an \"item\" roll carries a `DropCategory` picked from `EQUIPMENT_CATEGORY_WEIGHTS` (`weapon`/`armor`/`shield`/`bow`/`backpack`/`potion` at weight 1 each, `food` at weight 2 — fullness has to be fed from the floor at a real clip, so it needs to turn up noticeably more often than a one-time gear upgrade). `potion` rolls a `HEALING_POTION` (`healingPotion.ts`'s `rollHealingPotion`) with its own rarity-scaled `healPercentPerTurn`/`healDuration`, the same way `weapon`/`armor`/etc. roll their own rarity-scaled stats — `HEALING_POTION` no longer drops from mob kills at all (`entityDefs.ts`'s `SNAKE_DEF`/`RAT_DEF` `startingLoot` tables dropped their old flat-heal entries, folding that percentage into \"nothing\" rather than gold: `SNAKE_DEF` is 70% gold / 30% nothing now, `RAT_DEF` 55% gold / 45% nothing) — a floor's own free-tile rolls are the only source of healing potions now. Because loot density now scales with a floor's own free room space instead of a flat total, a floor with many/large rooms simply has more free tiles to roll against.\n\n`CHUTE` and every `freeTileDrops` entry are Items, and snakes/rats/bats are mobs — neither can be baked into `GroundTile[][]` the way `HOLE` is, so `dungeonTransition.ts` drops them in as a post-render step. `CHUTE`/`freeTileDrops` placement (`applyDungeonChunkItems`) is first-visit-only, same as before — a `'gold'`-kind spot places a plain `GOLD` item at its rolled amount; an `'item'`-kind spot rolls its real item at placement time (`dungeonEquipment.ts`'s `rollEquipmentForSpot`, seeded off `(dungeonSeed, spot, category)`, never off this call's own timing, so it's always identical on every first-visit regardless of which floor's `dungeonSeed` is currently active). Enemies are different: `spawnDungeonChunkEnemies` (room spots) and `spawnDungeonChunkPathwayEnemies` (hallway spots) both run on **every** chunk load, first visit or the tenth — a spot respawns back at its original position, at full health, unless it has actually been killed (or lost to a hole) this floor (`state.isDungeonEnemyKilled`, set by `state.clearDungeonEnemyLoot` at every kill site), in which case it stays empty for the rest of the floor. Which species spawns at a given spot is picked fresh each time from that floor's zone (`zones-data.ts`'s `pickZoneEnemyType`/`pickZonePathwayMobType`, seeded off `(dungeonSeed, spot, index)` via `dropsCore.ts`'s `hashToSeed`/`seededRand` so the same spot always resolves to the same species on a given seed), then handed to one shared `spawnSpeciesAtSpot` helper that dispatches through a `SPECIES_SPAWNERS` table (currently `SNAKE`/`RAT`/`BAT`) rather than a per-species branch — adding a species means one more table entry, not another call site. Pathway spot indices are offset by `content.snakes.length` so a room spot and a hallway spot can never collide on the same per-spot cache index. Each spawn spot's starting loot (`lootChance.ts`'s `rollLootChance`, driven by that spot's own `EntityDef.startingLoot` — species-specific, e.g. `SNAKE_DEF`'s 70%/30% gold/nothing split, `BAT_DEF`'s smaller gold-only roll) is only ever rolled once per floor and then reused on every later respawn (`state.getDungeonEnemyLoot`/`setDungeonEnemyLoot`, keyed by the spot's index, cleared on a new `dungeonSeed`) — leaving and re-entering a room can't be farmed for fresh rolls. `rollLootChance` itself is species-agnostic (it just walks a `LootChanceOption[]` table off any `EntityDef`), not a snake-specific function. `HOLE` is the floor's only progression exit now — no lock/unlock stage, no separate `KEY`/`LOCKED_DOOR` pair. Walking into it (`interactWithHole` in `player.ts`) while holding a `CHUTE` consumes the chute and calls `endGame()` → `advanceLevel()` → `game.ts`'s `advanceToNextFloor()`, which advances straight from this floor to the next one (fade out, roll a fresh `dungeonSeed`, load the new floor's starting chunk, fade in) — a roguelike \"next floor\" loop, with `state.currentLevel` advancing each time. The cave the forest used to route through here is now a plain enter/exit room (`rooms-data.ts`'s `'cave'` entry — see CLAUDE.md's \"Rooms\" section), not part of this loop at all — its old money-monster/gate-payoff mechanic is gone outright, not just unwired.\n\nA flying species (`BAT`, `entityDefs.ts`'s `EntityDef.flies`) can spawn at either a room or hallway spot and is never blocked by ordinary ground solidity (`TREE_WALL`, a room's own interior obstacles) — see `CLAUDE.md`'s \"Chunked Dungeon\" section and `scripts/moverMovement.ts`'s `isMoverBlockedAt` for the passability rule, and `scripts/tileUtils.ts`'s `renderTile` for how it composites on-screen over whatever ground tile it's flying above without hiding it.\n\n## Chunk cache (`state.ts`'s `DungeonChunkSnapshot`) and enemy respawn\n\nA chunk's *ground content* (`CHUTE` and every `freeTileDrops` entry) is only ever generated once per floor. `dungeonTransition.ts` snapshots the chunk being left (ground grid, floor items — deliberately no mobs) into a `Map` keyed by chunk coordinate right before a lateral transition; re-entering that chunk restores the snapshot instead of re-rolling `applyDungeonChunkItems`, so progress made in an already-visited room (items collected) survives leaving and coming back.\n\nEnemies are handled completely differently, on purpose: `spawnDungeonChunkEnemies` (room spots) and `spawnDungeonChunkPathwayEnemies` (hallway spots) both run on **every** `loadDungeonChunk` call, regardless of whether the chunk was restored from a snapshot or generated fresh — a spot respawns back at its original position, at full health, if it's being seen for the first time or simply left behind on a previous visit, but **not** if that spot was actually killed (or fell in a hole) on a previous visit, *and its species is re-rolled fresh each respawn* (zone-weighted, not remembered — only its loot is). Mobs are never part of `DungeonChunkSnapshot`. Only the *loot* each spawn spot rolled is remembered, in a separate per-floor cache (`state.ts`'s `#dungeonEnemyLoot`, keyed by the spot's index — room spots `0..content.snakes.length-1`, hallway spots offset by `content.snakes.length`) — the first time a spot ever produces a live mob this floor, `rollLootChance` rolls its starting inventory (off that mob's own species `EntityDef`) once; every later respawn reuses that same roll instead of rolling again, so leaving and re-entering a room repeatedly can't be farmed for fresh loot. A sibling per-floor set, `state.ts`'s `#killedDungeonEnemies` (same key space, keyed by spawn-spot index), tracks which spots have actually been killed — populated by `state.clearDungeonEnemyLoot`, the same call already made at every real kill site (`player.ts`/`moverMovement.ts`), and checked by both spawn functions before they respawn anything. A spot that's simply never been visited yet, or was visited but its mob left alive, still respawns; only an actual kill sticks.\n\n`state.setDungeonSeed` clears all three caches (loot, killed, and the chunk snapshot cache) — a new floor's chunk coordinates and spawn-spot indices share nothing with the old floor's.\n\n## Edge arrows (`dungeonTransition.ts`'s `updateChunkEdgeArrows`)\n\nEvery boundary tile with a live door gets a small rotated-glyph arrow pointing off the edge (`data-edge-arrow`/`data-edge-arrow-b` — a corner tile can open two directions at once, so it gets a second dataset slot/glyph — see `styles.css`), so the player can see at a glance which directions actually lead somewhere without wandering the whole boundary. Ported from the same mechanism the pre-dungeon forest/island systems used, applied to `DungeonChunk['connections']` instead.\n\n## Save/load\n\nOnly `dungeonSeed`, `dungeonChunkX`, `dungeonChunkY` are persisted — the full 9-chunk layout is a pure function of the seed, cheap to regenerate on demand rather than store. The current chunk's own tile mutations (items picked up, etc.) continue to ride the existing generic `gridState`/`mobs`/`lootBoxes` save/restore, unchanged. Every *other* visited-but-not-current chunk's snapshot (see \"Chunk cache\" above) is persisted too, as `dungeonChunkCache` (`save.ts`) — reusing the same `gridState`/lootBox shapes the current chunk already used, just one entry per cached chunk, with no `mobs` field (enemies always respawn fresh — they're never restored from a snapshot). Each spawn spot's already-rolled starting loot is persisted separately as `dungeonEnemyLoot`, keyed by its index into `content.snakes` (`SAVE_VERSION` 11 — a pre-v11 save's cached chunks still carry the old `mobs` shape and have no `dungeonEnemyLoot` at all, so it's discarded rather than loading with stale/duplicated enemy state). The killed-spot set is persisted too, as `killedDungeonEnemies` — optional/additive rather than `SAVE_VERSION`-gated, since a save from before this field existed simply has none, which reads as \"nothing killed yet\" (worst case a previously-killed spot from before this field existed respawns once more on that one old save). `state.dungeonConnections` (needed for the very next transition check) still isn't stored — it's re-derived from `(dungeonSeed, dungeonChunkX, dungeonChunkY)` on every load, the same \"recompute rather than store\" choice used everywhere else in this system. Edge arrows are DOM-only (`data-edge-arrow`/`-b`), so `restoreWorld()`'s grid repaint doesn't draw them on its own — `save.ts`'s `loadGame()` also calls `updateChunkEdgeArrows()` with those same recomputed connections, guarded to `!currentRoomId` so a save taken mid-room doesn't paint dungeon arrows onto that scene's grid (which reuses the same 9×9 tile elements).\n\n## Old Man landmark (`dungeonTransition.ts`'s `placeOldManLandmark`/`computeOldManSpot`)\n\nThe level-1-only Old Man NPC (see CLAUDE.md's \"Rooms\" section for the old forest-only version of this) now appears in the chunked dungeon's own start room (`layout.rooms[0]`), directly above the player's spawn point, placed once by `loadStartingDungeonChunk` right after the starting chunk loads — gated on `state.currentLevel === 1` so it never re-appears on later floors (every later floor increments `currentLevel` before calling that function). `computeOldManSpot` nudges the landmark one cell sideways if the exact spot happens to coincide with that floor's `CHUTE` or `HOLE` (both load-bearing content that must never be silently overwritten); a coincidental gold spot at the chosen cell is harmless (and a snake spot can't coincide at all — the start room never gets any, see \"Content\" below). Because the landmark is baked directly into `state.grid` the same way `HOLE` is, it persists across chunk revisits for free via the existing grid-snapshot mechanism above — no special-casing needed.\n\n## Sealed Stairs landmark (`dungeonTransition.ts`'s `placeSealedStairsLandmark`/`computeSealedStairsSpot`)\n\nEvery floor's start room (`layout.rooms[0]`) also gets a `SEALED_STAIRS` (🪜) landmark, placed unconditionally by `loadStartingDungeonChunk` right after the starting chunk loads — unlike the Old Man, this one is never gated to level 1, since it represents the ladder back up to the floor just left, magically sealed shut the instant you arrive on a new one. It lands directly *below* the player's spawn point — the mirror image of `computeOldManSpot`'s \"directly above\" — so the two landmarks can never collide with each other even on level 1, when both are placed. `computeSealedStairsSpot` nudges sideways on the same collision rule as the Old Man spot (never allowed to land on that floor's `CHUTE` or `HOLE`) and **also** never on any of the start room's own doorway-entrance cells (`roomDoorwayEntranceKeys`, `dungeonGen.ts` — the same set `pickContentSpot`'s `avoidDoorways` flag already excludes `CHUTE`/`HOLE` from). This second exclusion matters more than it does for `CHUTE`/`HOLE`: `SEALED_STAIRS` is `movable: false`, so landing it on the one interior cell adjacent to the start room's only door permanently walls the player into their own spawn room — a real, reachable soft-lock this used to hit on roughly 2% of seeds (about 40% of those on a single-door start room, i.e. an unrecoverable lock), fixed by falling back to any doorway-free interior cell of the room when the below-spawn candidates all collide (see `tests/dungeonTransition.test.ts`). Bumping it is a flavor-only interaction, not a real exit: it's `movable: false, interactable: true`, wired into the same data-driven `FLAVOR_EXAMINE` table (`npcs-data.ts`) that `HOUSE`/`BED`/`CHAIR` already use, so no new dispatch branch was needed in `player.ts`. Baked directly into `state.grid` the same way `OLD_MAN`/`HOLE` are, so it persists across chunk revisits for free via the existing grid-snapshot mechanism above.\n\n## Scope of this pass\n\nStructure, transition mechanic, minimap, room content (key/locked-door/snakes/gold/hearts), hallway-chunk pathway mobs, chunk-exit edge arrows, cross-chunk persistence, per-spot enemy respawn (species-generalized across room and hallway spots alike), the level-1 Old Man landmark, and the every-floor Sealed Stairs landmark are all in place. Still open: there's no dungeon-wide \"you've explored everything\" objective compass pointing across chunk boundaries (the existing key/locked-door glow only ever lights up while standing in that content's own chunk), no other NPCs beyond the Old Man appear anywhere in a real run, and only Slitherwood (floors 1-5) has a real multi-species roster so far — the other 4 zones are still `[SNAKE.type]`-only pending their own second/third species (see `docs/zones.md`).\n",ge="# Starting Town Area\n\nStatus: **implemented** (`scripts/town.ts`).\n\n## Motivation\n\nBefore this, `startNewGame()` opened directly into the chunked dungeon's\nfirst room (`loadStartingDungeonChunk()`), and the Old Man NPC was baked into\nthat room's ground via `placeOldManLandmark()` (`dungeonTransition.ts`).\nBefore that, the house room was the entry point. Neither ever gave the run a\n\"home base\" — a small, fixed, non-procedural hub the player recognizes on\nsight.\n\nThis doc specifies a **Starting Town**: a fixed 9×9 outdoor square, shown once\nat the top of every run, that replaces the dungeon as the literal entry\npoint. Its one exit — a dungeon gate — leads into the exact same chunked\ndungeon system that exists today. The Old Man moves here permanently; he is\nremoved from the dungeon's first room.\n\n## Layout (source of truth)\n\nExact 9×9 grid, `(x, y)` with `(0,0)` top-left:\n\n```\n🌲🌲🌲🪨🕳️🪨🌲🌲🌲\n🌲🏚️🟩🟩🟫🟩🟩🏚️🌲\n🌲🟫🟩🟩🟫🟩🟩🟫🌲\n🌲🟫🌳🟩🧙🏼‍♂️🟩🌳🟫🌲\n🌲🟫🟫🟫⛲️🟫🟫🟫🌲\n🌲🟫🌳🟩🥷🏽🟩🌳🟫🌲\n🌲🟫🟫🟩🟩🟩🟫🟫🌲\n🌲🏚️🟫🟫🟫🟫🟫🏚️🌲\n🌲🌲🌲🌲🌲🌲🌲🌲🌲\n```\n\n| Cell | Coord(s) | Meaning |\n|---|---|---|\n| 🌲 | full border, minus the three cells below | `TREE_WALL` — impassable, non-breakable (already exists) |\n| 🪨 | (3,0), (5,0) | `WALL` — impassable, non-breakable (already exists), flanks the gate |\n| 🕳️ | (4,0) | the town's own dungeon entrance — a real `HOLE`, the exact same tile (and the same chute-or-die mechanic) as every dungeon floor's own hole, not a separate always-open gate tile |\n| 🏚️ | (1,1) `APOTHECARY`, (7,1) `BLACKSMITH`, (1,7) `TANNER`, (7,7) `CARPENTER` | four distinct boarded-up shops (Potions & Food / Swords & Shields / Armor & Bags / Bows & Fishing Poles), each wired to its own flavor dialogue saying the owner is out — not four copies of the plain `HOUSE` tile |\n| 🟫 | (4,1); (1,2),(4,2),(7,2); (1,3),(7,3); (1,4)-(3,4),(5,4)-(7,4); (1,5),(7,5); (1,6),(2,6),(6,6),(7,6); (2,7)-(6,7) | `PATH` — dirt walking path connecting the gate down the center column to the Old Man, out along both side columns, across the fountain's row, and along the bottom between the two house pairs |\n| 🟩 | every open interior cell not covered above | plain walkable ground — see \"Grass = EMPTY\" below |\n| 🌳 | (2,3), (6,3), (2,5), (6,5) | **new** `GARDEN_TREE` — decorative, impassable, non-breakable |\n| 🧙🏼‍♂️ | (4,3) | `OLD_MAN` — already exists, placed here instead of the dungeon; this cell sits on the dirt path too (same `PATH` background, via the tile's `animation` override — see `scripts/town.ts`'s `OLD_MAN_ON_PATH`) even though it displays the Old Man's own emoji, not 🟫 |\n| ⛲️ | (4,4) | **new** `FOUNTAIN` — decorative flavor-dialogue landmark |\n| 🥷🏽 | (4,5) | player spawn point (not a tile — `state.setPlayer(4, 5)`) |\n\n### Grass = `EMPTY`, not a literal tile\n\nThe 🟩 cells in the art are **not** rendered as a green-square emoji. They map\nto the existing `EMPTY` ground tile (`display: ''`, plain CSS-colored floor),\nidentical to every other open forest/dungeon/room tile. 🟩 in the ASCII art\nabove is shorthand for \"walkable ground,\" matching how the rest of this\ncodebase already draws floor plans (see `docs/dungeon-generation.md`,\n`house-plan.html`) — it is not a new visual style to build.\n\n## New tiles (`scripts/constants.ts`)\n\nTwo new `GroundTile` constants, added next to their nearest existing\nrelatives and registered in the `TileType -> GroundTile` lookup map the same\nway every other tile is:\n\n```ts\n// Decorative flavor-dialogue landmark — same shape as HOUSE/BED/CHAIR\n// (movable:false, interactable:true, contextIcon for the speech-bubble\n// affordance). No gameplay effect beyond a fixed flavor line.\nexport const FOUNTAIN: GroundTile = { type: 'FOUNTAIN', display: '⛲', contextIcon: '💬', movable: false, interactable: true };\n\n// Pure decorative obstacle — same shape as WALL/ROOM_WALL/TREE_WALL\n// (movable:false, interactable:false). Deliberately not reusing TREE: TREE\n// is breakable (interactable:true) and already uses the 🌲 glyph for the\n// border; the town's inner garden trees use the visually distinct 🌳 glyph\n// and are never meant to be chopped down.\nexport const GARDEN_TREE: GroundTile = { type: 'GARDEN_TREE', display: '🌳', movable: false, interactable: false };\n```\n\nThe town's dungeon entrance itself is **not** a new tile — `getTownTile`\nplaces the existing `HOLE` at (4,0). An earlier version of this doc had a\nseparate `DUNGEON_GATE` tile here (same glyph, but always-open, no chute\nrequirement — reasoning: a fresh run starts with zero chutes, so the very\nfirst hole can't require one). That turned out to be a mistake: two tiles\nsharing 🕳️ where one kills you without a parachute and the other never does\nteaches the player the wrong lesson the moment they meet a *real* hole one\nfloor later — it plays like a bug, not a rule. See \"Consistent hole\nmechanic\" below for the actual fix.\n\n### Fountain dialogue wiring\n\n`FOUNTAIN` reuses the existing generic flavor-tile mechanism\n(`scripts/npcs-data.ts`'s `FLAVOR_EXAMINE` map + `examineFlavorTile()`\ndispatch already called from `player.ts`) — exactly the same path `HOUSE`/\n`BED`/`CHAIR` already go through. Adding it is:\n\n1. `ink/fountain.ink` — one fixed flavor line.\n2. One entry in `FLAVOR_EXAMINE`: `[FOUNTAIN.type]: { ink: FOUNTAIN_INK, speaker: 'Fountain', portrait: FOUNTAIN.display }`.\n\nNo changes to `dialogue.ts`, `rooms.ts`, or `player.ts`'s dispatch needed —\n`HOUSE` at all four corners \"just works\" the moment it appears in the\nlayout, since it's already fully wired.\n\n## Follow-up: four distinct shop tiles instead of plain `HOUSE`\n\nA later pass replaced the four corner `HOUSE` placements with four distinct\ntiles — `APOTHECARY`, `BLACKSMITH`, `TANNER`, `CARPENTER` (`scripts/\nconstants.ts`) — so each corner can read as a specific, recognizable shop\nrather than four identical, interchangeable houses. All four share `HOUSE`'s\nown shape (`movable: false`, `interactable: true`, `contextIcon: '💬'`) but\nswap its 🏠 glyph for 🏚️ (boarded up) and each get their own `ink/*.ink` flavor\nline (`apothecary.ink`/`blacksmith.ink`/`tanner.ink`/`carpenter.ink`) saying\nthe owner is out and naming that shop's goods (Potions & Food / Swords &\nShields / Armor & Bags / Bows & Fishing Poles respectively) — wired into\n`FLAVOR_EXAMINE` in `scripts/npcs-data.ts` exactly the way `HOUSE`/`BED`/\n`CHAIR`/`FOUNTAIN` already were, no new dispatch code needed. The plain\n`HOUSE` tile itself is untouched and stays registered (it's not town-specific\n— see its own doc comment in `constants.ts`); the town's `getTownTile` simply\nno longer places it, in favor of one of the four new tiles per corner.\n\n## Architecture: a standalone module, not a `Room`\n\nThe existing generic `Room` engine (`scripts/rooms.ts` + `rooms-data.ts`) was\nconsidered and rejected for this. Rooms are indoor scenes: `applyTheme()`\nswaps in a parchment/blueprint-style palette via `--room-*` CSS custom\nproperties, and the engine hardcodes both the border tile (`ROOM_WALL`) and\nthe exit tile (`ROOM_DOOR`). The town is an *outdoor* scene that should look\nlike a continuation of the forest/dungeon (plain `setThemeColor(FOREST_THEME_COLOR)`,\nno body-class palette swap), has a non-uniform border (rock + a hole breaking\nthrough the tree wall), and exits through a real `HOLE` tile, not a\n`ROOM_DOOR`. Stretching `RoomDef` to parametrize border/door tile just for\nthis one exceptional case isn't worth it when the town is a single fixed\nscene, not a family of interchangeable rooms.\n\nInstead: **`scripts/town.ts`**, a new standalone module mirroring the shape\nof `dungeonTransition.ts`/`rooms.ts` (pure layout function + a thin\nrender/enter/exit trio), reusing the same generic primitives everything else\nalready reuses (`renderGrid` from `worldGen.ts`, `fadeToBlack`/`fadeFromBlack`\nfrom `fade.ts`, `setThemeColor` from `ui.ts`).\n\n```ts\n// Pure, exported for unit testing (same pattern as getRoomTile/computePathCells).\nexport function getTownTile(x: number, y: number): GroundTile { ... }\n\nexport const TOWN_SPAWN = { x: 4, y: 5 };\n\n// Synchronous, no fade — called once from startNewGame(), which is itself\n// synchronous today (loadStartingDungeonChunk() has the same contract).\nexport function enterTown(): void {\n  state.setInTown(true);\n  state.setPlayer(TOWN_SPAWN.x, TOWN_SPAWN.y);\n  setThemeColor(FOREST_THEME_COLOR);\n  renderGrid(getTownTile);\n  updateGoldDisplay();\n}\n\n// Cosmetic-only re-apply on a save loaded mid-town (mirrors syncRoomTheme)\n// — the grid itself is already restored generically from saved gridState.\nexport function syncTownTheme(): void {\n  if (!state.inTown) return;\n  setThemeColor(FOREST_THEME_COLOR);\n}\n\n// Async — fades out, leaves the town, hands off to the real dungeon entry,\n// fades back in. Mirrors exitRoom()'s 'forestLevel1' branch. The town is\n// \"Floor 0\": state.currentLevel is left at its reset default (0) the whole\n// time the player is in town, and only becomes 1 here, the instant they\n// actually leave through the gate — see \"Town = Floor 0\" below.\nexport async function exitTownToDungeon(): Promise<void> {\n  disableButtons();\n  audio.fadeMusicOut(0.4);\n  await fadeToBlack();\n  state.setInTown(false);\n  state.incrementLevel();\n  loadStartingDungeonChunk();\n  await saveGame();\n  audio.fadeMusicIn(0.4);\n  await fadeFromBlack();\n  enableButtons();\n}\n```\n\n`player.ts` gets no new dispatch arm at all — the town's gate is a plain\n`HOLE`, so it already goes through the existing `HOLE` branch of\n`executePlayerAction` → `interactWithHole`. That function's success path\n(player is holding a `CHUTE`) branches once on `state.inTown`:\n\n```ts\nif (state.inTown) {\n  exitTownToDungeon().catch(() => {});\n} else {\n  endGame(); // normal dungeon-floor progression, unchanged\n}\n```\n\nThe death path (no chute) needs no such branch — dying is dying, wherever\nthe hole is. See \"Consistent hole mechanic\" below for why this replaced the\noriginal `DUNGEON_GATE` dispatch arm.\n\n## Game-flow integration\n\n- **`game.ts`'s `startNewGame()`**: replace the `loadStartingDungeonChunk()`\n  call with `enterTown()`. Everything else in `startNewGame()` (reset gold/\n  health/inventory, `forceLeaveRoom()`, `audio.switchToForest()`,\n  `state.setDungeonSeed(...)`, `saveGame()`) is unchanged — the dungeon seed\n  is still rolled up front so the layout behind the gate is ready the moment\n  the player reaches it.\n- **Old Man leaves the dungeon.** `dungeonTransition.ts`'s\n  `placeOldManLandmark()`/`computeOldManSpot()` and the\n  `if (state.currentLevel === 1) placeOldManLandmark(layout);` call in\n  `loadStartingDungeonChunk()` are deleted outright — the Old Man now lives\n  only in the town layout above (a fixed cell, not computed). Their unit\n  test coverage (if any references `computeOldManSpot`) is removed with them.\n- **No return trip to town.** The town is a one-time entry point for the\n  run, not a hub visited between floors — once `exitTownToDungeon()` runs,\n  nothing routes back to it. This matches the existing endless-floors\n  roguelite loop;\n  revisiting town mid-run is explicitly out of scope for this pass.\n- **`registerForestEntryCallback`**'s existing body (`loadStartingDungeonChunk()`,\n  reachable only via the still-registered but no-longer-the-entry-point house\n  room's exit) is unaffected.\n\n## Consistent hole mechanic + Old Man's starting chute\n\nThe first version of this doc gave the town its own `DUNGEON_GATE` tile —\nsame 🕳️ glyph as `HOLE`, but always-open, no chute required. The reasoning\nseemed sound in isolation (a fresh run starts with zero chutes, so the very\nfirst hole can't require one) but was wrong for the game as a whole: a\nplayer's first encounter with a 🕳️ tile taught them \"holes are safe to walk\ninto,\" and their very next encounter — the first real dungeon floor's own\n`HOLE` — kills them for doing exactly that. That reads as a bug, not a rule,\neven though both tiles were working exactly as coded.\n\nThe fix is to make the mechanic identical everywhere a hole appears, not to\nspecial-case the town. `getTownTile`'s (4,0) cell is now a real `HOLE` (see\n\"New tiles\" above), so it needs a `CHUTE` to survive, exactly like every\nfloor's hole. To keep a fresh run from being unwinnable — you can't reach\nthe dungeon at all without a chute, and there's no dungeon floor yet to find\none on — the Old Man now grants a starting `CHUTE` the first time he's\ntalked to. (He previously also granted a starting `WEAPON`; that grant is\ndropped for now, not replaced — see `ink/old-man.ink`.)\n\nThe grant goes through a generic ink `EXTERNAL grantItem(itemType)`\n(`scripts/npcs-data.ts`'s `bindGrantItem`), not a dedicated `giveChute()` —\n`itemType` is a `TileType` string (`\"CHUTE\"`) looked up in a small\n`GRANTABLE_ITEMS` factory table, which still carries a `WEAPON` entry ready\nfor reuse even though nothing calls it right now. This keeps the *binding*\nitself NPC-agnostic: any future NPC's `.ink` script can call\n`~ grantItem(\"CHUTE\")` (or `\"WEAPON\"`, or any other grantable type) and reuse\nthe exact same binding, rather than each NPC growing its own `giveX()`\nexternal. Granting itself reuses `absorbGroundItem` — the same\npool-add/auto-equip/stacking logic a real ground pickup already goes\nthrough — falling back to dropping the item on the ground under the player\nif the pool has no room.\n\n`ink/old-man.ink` is now a single `VAR hasChute` and one conditional block,\nthe same one-line-Zelda-greeting shape it always had, just re-themed around\nthe chute instead of the weapon:\n\n```ink\nEXTERNAL grantItem(itemType)\nVAR hasChute = false\n\n{ hasChute:\n    Take care out there.\n- else:\n    It's dangerous to go alone, take this!\n    ~ grantItem(\"CHUTE\")\n}\n-> END\n```\n\n`talkToOldMan()`'s `setup` sets `hasChute` from `state.currentChutes > 0`.\n\n## Town = Floor 0\n\nThe town isn't just cosmetically \"before\" the dungeon — `state.currentLevel`\nreflects that directly. `startNewGame()`'s `state.resetLevel()` already\ndefaults to `0`; the difference is that `startNewGame()` no longer calls\n`state.incrementLevel()` itself. Instead, `exitTownToDungeon()` is the one\nplace that increments it, right before `loadStartingDungeonChunk()` — so\n`currentLevel` reads `0` for the entire time the player is in town, and\nbecomes `1` the instant they actually step into the dungeon's first real\nfloor. Every later floor still advances the same way it always did\n(`advanceToNextFloor()`'s `state.incrementLevel()`), so this only moves\n*when* the first increment happens, not the overall numbering.\n\nThe one place this number was ever shown to the player is the slot-select\nscreen's location line (`save.ts`'s `getSlotSummary`, `getString('location.level',\nr.currentLevel)` — the top-bar title and the in-dungeon minimap's own \"Floor N\"\nheader don't apply here, see \"Explicitly out of scope\" below). That call site\ngets a new branch, checked before the generic level fallback: `else if\n(r.inTown) location = getString('location.town')` — so a run parked in the\ntown shows \"Town\" on its card, never \"Level 0\".\n\n## Save/load\n\nNew persisted flag, `state.inTown: boolean` (getter/setter mirroring\n`state.currentRoomId` truthiness), alongside the existing `currentRoomId` check:\n\n- `save.ts`'s `SerializedRun` gets `inTown?: boolean`.\n- `serializeState()` writes `state.inTown`.\n- `deserializeState()` calls `state.setInTown(true)` when `d.inTown` is set.\n- The dungeon-only restore branch (`if (!d.currentRoomId) { ...\n  renderMinimap ... }`) becomes `if (!d.currentRoomId &&\n  !d.inTown)` — a save frozen mid-town must not paint dungeon chunk-edge\n  arrows/minimap over the town's own grid.\n- `syncTownTheme()` is called from `slots.ts` (not `save.ts`) after a\n  resumed load, the same way `syncRoomTheme()` already\n  is — this sidesteps a real circular-import problem `save.ts` would\n  otherwise have (`town.ts` needs `saveGame` from `save.ts` for\n  `exitTownToDungeon`, so `save.ts` can't import back from `town.ts`).\n- **No `SAVE_VERSION` bump.** `inTown` is optional/additive like\n  `exploredChunks`, not a hard-gated field like the v13-v15 inventory\n  reshuffles: a save written before the town existed simply has no `inTown`\n  field, which reads as falsy — exactly correct, since that save was always\n  mid-dungeon/mid-room and never mid-town in the first place.\n\n## Debug hook (`scripts/debug.ts`)\n\nAdd `enterTown` to `window.__debug` (mirrors the existing `enterRoom`\npassthrough) so the town can be jumped to directly from the console without\nstarting a fresh run.\n\n## Explicitly out of scope for this pass\n\n- Returning to town between dungeon floors or after death.\n- Any interaction inside the four corner shops beyond the generic\n  flavor-dialogue bump. Each of the four (`APOTHECARY`/`BLACKSMITH`/\n  `TANNER`/`CARPENTER`, see \"New tiles\" above) is boarded up and says its\n  owner is out — no real shop UI, no NPCs living in them, no buying/selling.\n  A future pass could open one of them up for real trading; today they're\n  flavor only, distinguished from each other by which goods their sign\n  mentions.\n- A top-bar title for the town. The `#game-title` bar has been removed\n  entirely (no scene shows one anymore, not just the plain dungeon) — the\n  town needs no special-casing here, it simply has no minimap either, since\n  there's nothing to navigate.\n\n## Testing\n\nPer this repo's testing workflow: unit tests belong in `tests/`, targeting\nthe pure logic, not DOM rendering. `tests/town.test.ts` covers:\n\n- `getTownTile(x, y)` returns the exact expected tile for every one of the\n  81 cells in the layout above (table-driven against the ASCII art, same\n  style as any existing `getRoomTile`/dungeon-layout test), including that\n  (4,0) is the real `HOLE` tile, not a distinct gate.\n- `TOWN_SPAWN` itself is plain walkable ground, not a landmark.\n- `FOUNTAIN`/`GARDEN_TREE`'s tile facts. (`HOLE`'s own tile facts —\n  `movable`/`interactable`, deliberately not `levelExit` — are already\n  covered by `tests/tile-movable-interactable.test.ts`, since it's not a\n  town-specific tile.)\n\n`save.ts`'s DOM-coupled `loadGame()` isn't unit-tested by executing it (see\nCLAUDE.md's testing guidance) — the two existing source-text tests that\nalready verified the dungeon-only restore guard\n(`dungeon-edge-arrows-save-load.test.ts`, `minimap-save-load.test.ts`) were\nupdated in place to also require `&& !d.inTown` in that guard, rather than\nadding a new DOM-driven round-trip test.\n\n`tests/npcs-data.test.ts`'s old-man dialogue suite drives `OLD_MAN_INK`\ndirectly across `hasChute: false/true`, binding the single generic\n`grantItem` external and recording which `itemType` strings it's called\nwith — first encounter grants exactly one `CHUTE`, a repeat encounter grants\nnothing.\n\n## Versioning\n\nLanded as a **minor** bump (`package.json`) — a new player-facing\narea/mechanic, per this repo's \"every commit bumps it\" rule. The follow-up\nfix described in \"Consistent hole mechanic\" above (removing `DUNGEON_GATE`,\nmaking the town's hole lethal-without-a-chute like every other hole, adding\nOld Man's starting chute grant) landed as a **patch** — it corrects the\ntown's mechanic to match the rest of the game rather than adding a new one,\nand doesn't change save compatibility.\n",_e="# Zones\n\nGroups the dungeon's floors into 5-floor bands — the tower gets hotter, darker, and more dead the further down you go. `scripts/zones-data.ts` is the data model: one `ZoneDef` per band (wall tile, scene coloring, enemy roster), plus the pure lookup/weighting functions that turn a floor number into a zone and a zone into an enemy distribution.\n\n## The 5 zones\n\n| Zone | Floors | Wall tile |\n|---|---|---|\n| Slitherwood | 1-5 | 🌲 |\n| Deep Grove | 6-10 | 🌳 |\n| Withering Palms | 11-15 | 🌴 |\n| Dead Branches | 16-20 | 🪾 |\n| Ashen Depths | 21-25 | 🪨 |\n\nSee the \"Tower Cutaway\" interactive doc for a visual: a 3/4 cutaway orthographic view of the whole tower, colored straight from this file's zone data — the same rendering core (`scripts/towerCutaway.ts`) the real in-game floor-descent screen (`scripts/floorDescentTransition.ts`) uses, so the doc is a live preview of the actual transition, not just a mockup.\n\n`getZoneForFloor(level)` clamps below floor 1 to Slitherwood and past floor 25 to Ashen Depths — the dungeon's endless descent past floor 25 keeps playing out in the last zone's look/roster rather than falling off the edge of defined data. `ZONES` covers floors 1-25 with no gaps or overlaps (checked in `tests/zones-data.test.ts`).\n\n## `ZoneDef` shape\n\nEach zone is one plain object: `id`, `name`, `minFloor`/`maxFloor` (inclusive), `wallTile` (a `GroundTile`), `theme` (a `SceneColors`), `enemies` (an ordered `TileType[]`), `pathwayMobs` (a second, independent ordered `TileType[]`). Adding a new zone concept — a pond, an NPC, any other per-floor feature — means adding a field to this one interface and a value per zone, the same \"unify by data, not by call site\" shape `rooms-data.ts`/`dungeonGen.ts`'s content placement already use, not a bespoke per-zone function.\n\n- **`wallTile`** replaces `TREE_WALL` as the zone's solid, non-breakable filler — same `movable: false, interactable: false` contract (see `constants.ts`'s `TREE_WALL` comment for why it's a distinct `TileType` from the breakable `TREE`), only the `display` glyph differs per zone. `zoneWall()` in `zones-data.ts` builds this by spreading `TREE_WALL` with a new `display` — the same \"same `type`, different styling\" pattern `town.ts`'s `OLD_MAN_ON_PATH` already uses for a display-only tile variant.\n- **`altWallChance`**/**`altWallTile`** let a zone's wall filler creep toward the *next* zone's look before the hard floor-band cutover: `altWallChance` is the chance (0-1) a given solid cell rolls `altWallTile` instead of `wallTile` at the zone's own `maxFloor`; `resolveAltWallChance(zone, level)` scales that down to 0 at `minFloor`, climbing linearly across the band. `altWallTile` is deliberately its own literal data, never a reference to `ZONES[i + 1].wallTile` — each zone owns its alt glyph. For zones 1-4 it's `altWall()` (same spread trick as `zoneWall()`, but over a second, independent `ALT_WALL` `TileType` — see `constants.ts`'s `ALT_WALL` comment for why a *second* type is required, not just a second `TREE_WALL`-typed glyph, to let both wall looks coexist on one floor); Ashen Depths' is the real `FIRE` `GroundTile` instead, so its \"next zone\" reads as a genuine damaging hazard, not another cosmetic tree.\n- **`theme`** is the same `SceneColors` shape `theme.ts`'s `applyTheme` already writes as `--scene-*` CSS custom properties for the cave and every themed room — see `CLAUDE.md`'s note that forest/dungeon is currently the *zero-override baseline* those modes override away from. Zone colors trend from cooler forest greens (Slitherwood) through dry olive/brown (Withering Palms) to near-black ash with ember-red undertones (Ashen Depths) — a first pass, easy to retune since it's five plain hex objects, not baked into any rendering code. Every zone also sets `SceneColors`' one optional field, `pathBg` (`--scene-path-bg`), so the dungeon's own dirt `PATH` corridors shift zone to zone too — packed dirt up top, trending toward ash/ember browns by Ashen Depths — instead of staying a flat `peru` everywhere; the cave/every room theme leave it unset since neither ever renders a `PATH` tile, which falls back to plain `peru` in `applyTheme`.\n- **`enemies`** is ordered weakest → nastiest, not an unordered weighted table (see \"Enemy distribution\" below) — spawned into a floor's real *rooms*.\n- **`pathwayMobs`** is the same ordered-weakest-to-nastiest shape as `enemies`, but for **hallway chunks** — the GONE-chance regions that pick up a corridor instead of a room (see `dungeon-generation.md`'s \"Rogue's Room Determination Pass\") rather than rooms. A chunk with no room of its own still isn't necessarily empty of danger. Unlike `enemies`, it's allowed to be an empty array — `getZonePathwayWeights`/`pickZonePathwayMobType` both handle a 0-entry roster by producing nothing to spawn there.\n\n## Enemy distribution\n\nA zone's `enemies`/`pathwayMobs` arrays hold `TileType`s that reference an *existing* entity — a zone never defines its own stats/behavior, only which already-defined species (see `entityDefs.ts`'s `SNAKE_DEF`/`RAT_DEF`/`BAT_DEF`) show up here and in what proportion. `getZoneEnemyWeights(zone, level)`/`getZonePathwayWeights(zone, level)` (both thin wrappers over one shared `computeWeights(roster, zone, level)`) turn floor progress through the zone into a weight per array entry via linear interpolation between adjacent positions: each enemy's weight peaks at its own index in the array and falls linearly to 0 at its neighbors' positions (a \"triangular\" basis function — the same shape as ordinary piecewise-linear interpolation weights, so the weights always sum to 1 and there are never more than 2 non-zero entries at once). Floor 1 of a zone leans entirely toward index 0; the zone's last floor leans entirely toward the last entry; floors in between blend smoothly. `pickZoneEnemyType(zone, level, rng)`/`pickZonePathwayMobType(zone, level, rng)` are the weighted-random pick off that distribution (sharing one `pickFromWeights` helper), taking an optional seeded `rng` (matching `dungeonGen.ts`'s `mulberry32` pattern) for deterministic per-seed rolls. `pickZonePathwayMobType` returns `null` for a zone with an empty `pathwayMobs` roster — \"spawn nothing here\" — while `pickZoneEnemyType` always returns a real `TileType` since every zone's `enemies` array has at least one entry.\n\nThis is deliberately **one ordered array per roster per zone plus one shared formula**, not 25 hand-tuned per-floor tables (`CLAUDE.md`'s \"Unify by data, not by call site\") — a zone with 3 enemies costs one array of 3 `TileType`s, and the exact same `computeWeights` call produces the right mix for every floor in that zone's range with no additional data.\n\n**Slitherwood (floors 1-5) is the first zone with a real multi-species mix**: `enemies: [RAT.type, BAT.type, SNAKE.type]` (room spawns, weighted by floor progress through 1-5 — rat and bat are both 1-HP fodder so they lead the roster, snake is the real 2-HP threat and comes last, meaning floor 1 leans toward the two weaker species and floor 5 leans toward snake) plus `pathwayMobs: [BAT.type]` (hallway-chunk spawns, on top of its `enemies` entry, so a bat can turn up in either a room or a bare corridor — see \"Chunked Dungeon\" in `CLAUDE.md` for `flies`, the `EntityDef` flag that lets it move over any ground tile). Every other zone (Deep Grove, Withering Palms, Dead Branches, Ashen Depths) is still `enemies: [SNAKE.type]` alone with an empty `pathwayMobs: []`, pending their own roster. The mechanism is fully general: appending a `TileType` to any zone's `enemies` or `pathwayMobs` array (once a new species has a real `EntityDef`) starts producing a genuine floor-by-floor mix immediately, with no changes needed to `computeWeights`, `pickZoneEnemyType`/`pickZonePathwayMobType`, or any other zone. 15 total species across the 5 zones (roughly 3 per zone) is the target shape this was designed for.\n\n## Scope of this pass\n\nThe data model (`ZoneDef`, `ZONES`, `getZoneForFloor`, `getZoneEnemyWeights`/`getZonePathwayWeights`, `pickZoneEnemyType`/`pickZonePathwayMobType`) is in place and unit-tested (`tests/zones-data.test.ts`), including a synthetic multi-enemy zone exercising the actual triangular interpolation math, plus Slitherwood's own real three-species roster.\n\n**Now wired into live rendering and spawning:**\n- `dungeonWorld.ts`'s `buildRoomTiles`/`buildHallwayTiles`/`getDungeonChunk` take an optional `wallTile` parameter (defaulting to `TREE_WALL`, so every non-production call site — docs-hub previews, tests, `save.ts`'s connections-only read — is unaffected); `dungeonTransition.ts`'s `loadDungeonChunk` is the one production call site, passing `getZoneForFloor(state.currentLevel).wallTile`.\n- `dungeonTransition.ts`'s `loadDungeonChunk` also adds a `body.dungeon-mode` class and calls `theme.ts`'s `applyTheme` with the current floor's zone `theme`, mirroring `rooms.ts`/`town.ts`'s own scene-mode toggling — see `styles/styles.css`'s `body.dungeon-mode` block. The class is removed at every other scene's entry point (`rooms.ts`, `town.ts`, and `game.ts`'s `handleDeath` cleanup) so it never leaks across a scene change, and `loadDungeonChunk`'s own `syncDungeonTheme()` export handles the save-resume case (`slots.ts`), matching `syncRoomTheme`/`syncTownTheme`.\n- `dungeonTransition.ts`'s `spawnDungeonChunkEnemies` calls `pickZoneEnemyType` (seeded deterministically off `(dungeonSeed, spot, index)` via `dropsCore.ts`'s `hashToSeed`/`seededRand`, the same pattern `dungeonEquipment.ts`'s `rollEquipmentForSpot` already uses) to decide each room spot's species; the new `spawnDungeonChunkPathwayEnemies` does the same for hallway spots from `dungeonGen.ts`'s `placeContent`-rolled `pathwayEnemies` list, via `pickZonePathwayMobType`. Both share one `SPECIES_SPAWNERS` dispatch table and `spawnSpeciesAtSpot` helper (keyed by `TileType`, currently `SNAKE`/`RAT`/`BAT`) rather than a per-species `if`/`switch` — adding a species means one more table entry, not another call site (`CLAUDE.md`'s \"Unify by data, not by call site\"). Pathway spot indices are offset by `content.snakes.length` before touching the per-spot dungeon-enemy-loot cache (`state.ts`), so a room spot and a hallway spot on the same floor can never collide on the same cache index.\n- `save.ts`'s `MOB_SPECIES` table generalizes `serializeMob`/`deserializeMob`/`restoreMobs` the same way — a saved mob's `species` field dispatches to the right `EntityDef`/tile/spawn shape regardless of whether it's a snake, rat, or bat, so no `SAVE_VERSION` bump was needed to add the two new species.\n- `dungeonWorld.ts`'s `buildRoomTiles`/`buildHallwayTiles`/`getDungeonChunk` also take an optional `altWall` config (`{ tile, chance, dungeonSeed }`, omitted everywhere except the one production call site, same \"additive param, zero-impact default\" shape `wallTile` itself uses) — each solid filler cell rolls independently (seeded off `dungeonSeed` + the cell's own chunk/board coordinates via `dropsCore.ts`'s `hashToSeed`/`seededRand`, so a chunk always rolls the same cells on a given seed) against `chance` to become `tile` instead of the zone's normal `wallTile`. `dungeonTransition.ts`'s `loadDungeonChunk` resolves this every load from `resolveAltWallChance(zone, state.currentLevel)` and `zone.altWallTile`. `ALT_WALL`'s glyph is just as live/global as `TREE_WALL`'s (`constants.ts`) — `setAltWallDisplay` is called alongside `setTreeWallDisplay` everywhere the latter already is (`loadDungeonChunk`, `syncDungeonTheme`, and `save.ts`'s `loadGame`, the last one *before* `restoreWorld()` repaints the grid, for the same reason `tests/dungeon-zone-tree-save-load.test.ts` covers for `TREE_WALL` — see the sibling describe block covering `ALT_WALL` in that same file).\n",ve="# Boss Fights (Zone Bosses)\n\nEvery 5th floor — **5, 10, 15, 20, 25** — is a boss floor: the last floor of each zone (see `docs/zones.md`) culminates in a fixed, predesigned 3-room encounter against that zone's boss, instead of a normal procedurally-generated floor. This doc specs the first one — **the Broodmother**, Slitherwood's floor-5 boss — in full, and the general shape every future zone boss reuses.\n\nThis is a genuinely new system, not an extension of an existing one: **there is no live boss mechanic in the game today.** (`player.ts`'s `handleFinalBoss`/`state.rocks` and the old cave \"Money Monster\" are both vestigial — see `CLAUDE.md`'s Rooms section. `state.addRock` is never called anywhere in the current chunked-dungeon generation path.) Multi-tile enemies are also new: every entity today (`Entity`/`Mob` in `state.ts`) carries exactly one `x`/`y`, and `getOccupant(x, y)` (`occupancy.ts`) is an exact-coordinate match. A 2x2 boss means teaching that one function about footprints — see \"Multi-cell occupancy\" below.\n\n**Scope of this pass:** only the Slitherwood boss (floor 5) is being designed and built now. The data shapes below (`EntityDef` extensions, `BossAttackDef`, `BossEncounterDef`) are written generically enough that floors 10/15/20/25 are future \"author a new def with its own numbers\" work, not engine changes — but no shared abstraction beyond what this one boss demands is being built preemptively. Revisit the shared shape once a second boss exists to generalize from, not before (`CLAUDE.md`'s \"Unify by data, not by call site\" — the mechanism is proven with two real examples, not guessed with one).\n\n## The Broodmother (Slitherwood, floor 5)\n\nAn oversized garden snake, 2x2 tiles, guarding the exit to her own lair. Reuses the existing 🐍 glyph — no new art — just rendered at 2x the size across her whole footprint (see \"Rendering\" below). `Broodmother` is a placeholder name, easy to change in one place (`BROODMOTHER_DEF`'s flavor text / any UI string) if you want something else.\n\n- **Max health:** 400, shown via a full-width health-bar overlay scaled to her whole 2x2 body — see \"Health bar\" below.\n- **Enrage threshold:** 200 (50%). Below this she's \"enraged\": dash is weighted much more heavily, and her sprite gets a red tint — on top of the health bar itself, an extra visible cue that she's getting more aggressive.\n- **Attack damage:** 15 per landed hit on either attack, matching every existing mob's `attackDamage` convention (`SNAKE_DEF`/`RAT_DEF`/`BAT_DEF` are all `attackDamage: 15`).\n- **Movement:** never chases. She starts pinned to the boss room's left edge and only ever repositions via her Dash attack — a full end-to-end sweep of the room, alternating left/right each time, never vertical. See \"Dash (Slither Charge)\" below.\n\n## Floor structure — the whole floor is the encounter\n\nA boss floor is **3 real chunks on the ordinary dungeon chunk grid**, not a separate scene system — `dungeonGen.ts`'s `buildBossFloorLayout()` produces a fixed, seedless `DungeonLayout` (no Rogue algorithm) with 3 fixed rooms stacked in one column, `BOSS_FLOOR_COLUMN`: **Entry → Fight → Loot/Exit**, going up (Entry at the bottom, nearest the player's own spawn). Every other chunk on the 3x3 grid stays unvisited/unconnected, so the minimap still renders the whole grid correctly — just with only that one column ever reachable. Walking between the 3 rooms is an ordinary chunk-edge crossing, exactly like walking between any two chunks on a normal floor (`dungeonTransition.ts`'s `attemptChunkTransition`/`doChunkTransition`), not a `ROOM_DOOR` bump.\n\nThis replaced an earlier design where the 3 rooms were their own bespoke scene state (`state.currentBossRoom`, `ROOM_DOOR` bumps dispatched through a `handleBossDoor`) — that flag was set on room entry but had no exit path that ever cleared it, so it silently disabled ordinary chunk-edge crossing forever after, on every later, unrelated floor, the instant a run ever touched a boss floor. The fix is architectural: there is no separate \"am I in a boss room\" flag anywhere now. Whether the fight room's own doorways can be crossed is answered fresh, every time, by `bossFloor.ts`'s `isBossFightLocked()` — true only while the player is standing in that one chunk *and* a live Broodmother-tagged mob exists (`bossAlive()`) — never a value stored across turns.\n\n`isBossFloor(level)` (`level % 5 === 0 && level > 0`) is checked by `dungeonTransition.ts`'s `currentDungeonLayout()`/`loadDungeonChunk()`/`loadStartingDungeonChunk()`, which each branch to `bossFloor.ts`'s own fixed layout/`loadBossFloorChunk` instead of the Rogue-generated one. `game.ts`'s `advanceToNextFloor()` and `debugSkipToLevel()` don't need a branch of their own at all anymore — they just call `loadStartingDungeonChunk()` uniformly. The floor immediately after a boss floor (6, 11, 16, 21, 26) resumes normal procedural generation via that zone's own roster, unaffected.\n\nAll three rooms below use the actual in-game tile glyphs (`tile.ts`) rather than abstract letters, so the layout reads as real content, not a schematic:\n\n| Glyph | Tile | Role here |\n|---|---|---|\n| 🌲 | `TREE_WALL` | Solid border — same non-breakable filler every dungeon room/chunk already uses, matching the Slitherwood zone's own wall glyph (`zones-data.ts`) rather than the indoor-only blank `ROOM_WALL` |\n| *(shown as plain floor)* | `EMPTY` (+ `PATH` terrain) | Every doorway cell, on all 3 rooms, before the fight starts — an ordinary walkable chunk-edge tile, same as any other floor's corridor door |\n| 🔒 | `BOSS_GATE` (new tile) | The Fight room's own 2 doorway cells only, and only for the duration of the fight — a real, solid ground tile (`movable: false`, `interactable: false`, same contract as `WALL`/`TREE_WALL`) swapped in when the trap fires and cleared back to `EMPTY` the instant she dies; see the Fight room section below |\n| 🥷 | `NINJA` | Player spawn point |\n| 🐍 | `SNAKE`-family (Broodmother) | Each of her 4 occupied cells — in-game she renders as one oversized sprite across all 4 (see \"Rendering\" below), but the spec marks all 4 cells so the footprint itself is unambiguous. She does not exist on the grid until the trap tile below is triggered |\n| 🌳 | `GARDEN_TREE` | Permanent, non-breakable decorative obstacle — same tile `town.ts` already uses for its own never-choppable trees. Blocks movement, dash, and ranged lines exactly like any solid tile, and can't be attrited away mid-fight the way a breakable `ROCK` could |\n| 🪂 | `CHUTE` | Guaranteed pickup |\n| ⚠️ | `TRAP` (new tile) | One tile in from the Fight room's entry-side edge — landing on it fires the lock-in intro (see below), then converts itself to plain floor for good |\n| 🪎 | Boss chest (new tile) | Guaranteed reward container, distinct from the ordinary loot-pile `BOX` (📦) so it reads as special |\n| 🕳️ | `HOLE` | Exit to floor N+1 |\n| 🌀 | `PIT` (new tile) | A Dash-hazard hole at each end of the boss room — mechanically HOLE, except a held CHUTE never saves a fall into one (`player.ts`'s `interactWithPit`) |\n\n### Entry room — safe\n\n```\ny=0  🌲 🌲 🌲 🌲  .  🌲 🌲 🌲 🌲   plain open ground — an ordinary chunk-edge doorway\ny=1  🌲  .  .  .  ▓  .  .  . 🌲\ny=2  🌲  . 🌳  .  ▓  .  🌳  . 🌲\ny=3  🌲  .  .  . 🪂  .  .  . 🌲\ny=4  🌲  .  .  .  ▓  .  .  . 🌲\ny=5  🌲  .  .  .  ▓  .  .  . 🌲\ny=6  🌲  .  .  .  ▓  .  .  . 🌲\ny=7  🌲  .  .  . 🥷  .  .  . 🌲\ny=8  🌲 🌲 🌲 🌲 🌲 🌲 🌲 🌲 🌲\n      0  1  2  3  4  5  6  7  8\n```\n(`▓` marks the dirt `PATH` terrain, not ground content — plain floor everywhere else on this diagram.)\n\nPlayer spawn (🥷) arrives here exactly like any other floor transition, via the HOLE on floor N-1, and a dirt path runs straight up the middle column to the north edge. 🪂 is a **guaranteed CHUTE pickup**, sitting on that same path. Walking north off the top edge crosses into the Fight room — an ordinary chunk-edge crossing, always open from this side; nothing here is ever sealed. The two 🌳 (one tile further left than a first pass had them, at `(2,2)`/`(6,2)`) are pure flavor (garden-themed flanking, echoing Broodmother's own \"garden snake\" framing), not obstacles anyone needs to route around. No enemies, nothing else gated. The guaranteed chute means a player who entered floor 5 with zero chutes in reserve is never soft-locked once they beat the boss — the same reasoning the Old Man's own starting-chute grant already uses (`CLAUDE.md`'s Starting Town section).\n\n### Fight room — the intro, then no retreat\n\n```\ny=0  🌲 🌲 🌲 🌲  .  🌲 🌲 🌲 🌲   plain open ground toward Loot — crossable once she's dead\ny=1  🌲  .  .  ▓  ▓  ▓  ▓ 🌀 🌲   Broodmother's 2x2 footprint anchors here (2,1) once spawned — 1 tile clear of the left PIT (she doesn't exist on the grid yet — see the glyph table above)\ny=2  🌲  .  .  .  .  .  . 🌀 🌲   both PIT columns span her home rows, y=1 and y=2\ny=3  🌲  ▓  .  .  .  .  .  ▓ 🌲\ny=4  🌲  ▓  .  .  .  .  .  ▓ 🌲\ny=5  🌲  ▓ 🌳  .  .  . 🌳  ▓ 🌲   cover pillars at (2,5) and (6,5)\ny=6  🌲  ▓  .  .  .  .  .  ▓ 🌲\ny=7  🌲  ▓  ▓  ▓ ⚠️  ▓  ▓  ▓ 🌲   trap tile, one step in from the south edge\ny=8  🌲 🌲 🌲 🌲  .  🌲 🌲 🌲 🌲   plain open ground toward Entry — crossable until the trap fires\n      0  1  2  3  4  5  6  7  8\n```\n(`▓` marks the dirt `PATH` terrain ringing the room one tile in from the walls; `🌀` is `PIT` — see below. Both are independent of, and compatible with, whatever ground content/occupant sits on the same cell, same as CHUTE/HOLE sitting on `PATH` terrain elsewhere.)\n\nBefore the fight starts, neither edge of this room is a special \"door\" tile — both are ordinary chunk-edge floor. Once the fight starts, both edges become a real `BOSS_GATE` tile (`movable: false`, `interactable: false` — solid, same as `WALL`/`TREE_WALL`) for the duration of the fight, on top of `bossFloor.ts`'s `isBossFightLocked()` (consulted live by `dungeonTransition.ts`'s `attemptChunkTransition`/`canChunkTransition` at the moment of a transition attempt: true only while the player is standing in this chunk *and* a Broodmother-tagged mob is still alive) already refusing the chunk-edge crossing itself. Before she's spawned, the room is freely walkable in both directions — a player can step in, look around, and step back out.\n\nLanding on ⚠️ (`TRAP`, `BOSS_TRAP_SPOT`), one tile in from the south edge, is what actually starts the fight: `bossFloor.ts`'s `triggerBossEncounter()` disables input, then plays the gate-lock intro — the **north** doorway locks first (a real `BOSS_GATE` tile is written there, its own clank SFX fires, and the 🔒 glyph slides into place), the animation runs to completion (450ms), then after a further 500ms pause the **south** doorway locks the same way, never both at once. Only the glyph itself animates in — it's a small `.boss-gate-icon` overlay span (the same absolutely-positioned \"glyph floating on top of the tile\" technique already used for a flying mover/raised shield — see `tileUtils.ts`'s `renderTile`), not the real `.tile` element, so the doorway's own solid background appears instantly rather than sliding/fading in along with the icon. A full 1000ms after the second lock's own animation finishes, Broodmother drops in at her anchor `(2,1)` with her own entrance SFX. Being a real tile rather than a floating overlay is what makes `BOSS_GATE` safe to leave mid-animation (a death, a debug skip, a save/reload) with no dedicated cleanup call anywhere — it's ordinary ground content, captured/restored by the same chunk snapshot every other tile already goes through. The trap tile converts itself to plain floor the instant the sequence starts, which is also what stops it from ever firing twice: the room can only be *left* again once she's dead, and leaving a chunk always snapshots its current ground state first, so any later revisit restores the already-consumed trap cell, never the original. Her death (`onBossKilled`) reverses the gate: both doorways' `.boss-gate-icon` overlays play a slide-out animation and the real `BOSS_GATE` tiles are cleared back to `EMPTY` once it finishes — genuinely load-bearing this time (not just cosmetic), since a solid tile has to actually be removed for the doorway to become walkable again, on top of `isBossFightLocked()` already being false the instant `bossAlive()` is.\n\nBroodmother's anchor sits at (2,1) once she spawns, pinned near the room's left edge, occupying (2,1)-(3,2) — 1 tile clear of the left `PIT` column so her own body never starts out standing on top of it (`broodmother.ts`'s `computeDashBodyDistance`, see \"Dash (Slither Charge)\" below). The two 🌳 at (2,5) and (6,5) are real cover, not flavor — permanent, non-breakable obstacles that can absorb a Quad Spit ray, giving the player somewhere to actually route toward instead of an empty box where the only counterplay is raw reaction time. Exact placement is tunable (flagged in \"Open implementation questions\" below); the point is that *some* solid terrain exists in the room beyond the border.\n\nThe two 🌀 `PIT` cells at `(1,1)`/`(1,2)` and `(7,1)`/`(7,2)` — the two columns her Dash sweeps end-to-end between — are what make getting caught in her path during a Dash genuinely dangerous: unlike an ordinary `HOLE`, a held `CHUTE` does not save a fall into one (`player.ts`'s `interactWithPit`, mechanically `HOLE`'s own no-chute death branch, unconditionally). See \"Dash (Slither Charge)\" below for how a player standing in her path gets shoved there.\n\n### Loot/exit room — the reward\n\n```\ny=0  🌲 🌲 🌲 🌲 🌲 🌲 🌲 🌲 🌲\ny=1  🌲  .  .  . 🕳️  .  .  . 🌲   HOLE — the top non-wall tile of the room\ny=2  🌲  .  .  .  ▓  .  .  . 🌲\ny=3  🌲  .  .  ▓  ▓  ▓  .  . 🌲\ny=4  🌲  .  . 🌳 🪎 🌳  .  . 🌲   guaranteed chest, dead center of the room\ny=5  🌲  .  .  ▓  ▓  ▓  .  . 🌲\ny=6  🌲  .  .  .  ▓  .  .  . 🌲\ny=7  🌲  .  .  .  ▓  .  .  . 🌲\ny=8  🌲 🌲 🌲 🌲  .  🌲 🌲 🌲 🌲   plain open ground toward the Fight room\n      0  1  2  3  4  5  6  7  8\n```\n(`▓` marks the dirt `PATH` terrain — straight up the middle column, plus a 3x3 patch dead center of the room around the chest.)\n\nThis room is only ever reachable once Broodmother is dead — the Fight room's own lock is what gates getting here at all — so unlike a normal dungeon floor's rooms, nothing on this side needs to check her state again. 🪎 is a guaranteed chest, mechanically just a `BOX` (`movable: true`, items sit in a real `lootBox` at that cell, viewed/transferred through the Ground window exactly like any other loot pile) with a prefilled, non-random-per-visit `lootBox` instead of one rolled from a random drop table — gold, FOOD, one HEALING_POTION (the existing current-HP-restoring item, formerly named HEART — see \"HEALING_POTION off mob loot\" below), and one random roll from the existing rare-or-higher equipment tables (`dungeonEquipment.ts`'s weighted category roll, floored at rare tier), all placed into the cell's `lootBox` once, the first time this room is ever visited (`bossFloor.ts`'s `applyBossChunkFirstVisitContent`). There is no separate \"opened\" state to track — same as any BOX, the chest reads as empty once its `lootBox` array has been emptied out through normal item transfer, so no new persistence concept is needed here (see \"Save/persistence\" below). The two 🌳 flanking it are flavor only, mirroring the entry room's garden motif — a small \"shrine\" framing for the reward, not an obstacle. 🕳️ is a normal HOLE, no CHUTE placed here since the entry room already guaranteed one. Walking in with a chute in hand advances to floor N+1 exactly like any other floor (`interactWithHole` → `endGame()` → `advanceLevel()` → `advanceToNextFloor()`, unchanged).\n\n## Multi-cell occupancy\n\n`EntityDef` gains one new optional field:\n\n```ts\nfootprint?: { w: number; h: number };  // absent = 1x1, every existing species\n```\n\nA footprint mob still has exactly one authoritative `x`/`y` (its anchor — top-left cell), but occupies a `w`×`h` rectangle from there. The payoff of this codebase's existing \"ground vs. occupant layer\" split (`CLAUDE.md`) is that **one change makes almost everything else footprint-aware for free**: `getOccupant(x, y)` (`occupancy.ts`) becomes a rectangle-contains check instead of an exact match —\n\n```ts\nexport function getOccupant(x: number, y: number): Entity | null {\n  if (state.playerX === x && state.playerY === y && state.currentHealth > 0) return state.playerEntity;\n  return state.mobs.find(m => {\n    const w = m.def.footprint?.w ?? 1, h = m.def.footprint?.h ?? 1;\n    return x >= m.x && x < m.x + w && y >= m.y && y < m.y + h;\n  }) ?? null;\n}\n```\n\n— and every caller that already routes through `getOccupant`/`isOccupied`/`isOccupiedByOther` inherits correct multi-cell behavior with **no changes of their own**: `isMoverBlockedAt` (so all 4 of Broodmother's cells correctly block movement/pathing), `resolveRangedLine`'s occupant check (so a Quad Spit ray correctly hits her from any of her 4 cells), and `interactWithMob`'s target resolution (so bump-attacking *any* of her 4 cells resolves to the same `Mob` and calls `resolveMobHit` unchanged — no special-casing needed for \"attack the boss\").\n\nWhat genuinely does need new code:\n- **`renderTile`** — a footprint mob's glyph should paint once, as an oversized overlay spanning its whole footprint (see \"Rendering\" below), not four times. This is a new special case in the same function that already special-cases flying-occupant compositing for `BAT_DEF.flies` — same file, same pattern, new flag.\n- **A shared multi-tile \"mark these tiles\" primitive.** `updateMobArrows()`'s red-indicator wiring (`data-snake-dir`/`data-snake-next`, `moverMovement.ts`) is currently hardcoded to exactly one mob-cell + one destination-cell. Pull the mark/clear/fade logic out into one function that takes a list of `{x, y}` tiles — an ordinary mob's arrow becomes a 1-tile call into it, a boss telegraph becomes an N-tile call into the same function. One primitive, two callers, not a parallel second mechanism.\n- **A boss branch in the two existing per-turn dispatch points, not a separate turn loop.** `moveMobs()` (`moverMovement.ts:297`) unconditionally calls `moveMob(mob)` for every entry in `state.mobs`; `updateMobArrows()` unconditionally computes one predicted next-cell per mob. Both need an `if (mob.def.bossAttacks)` branch: `updateMobArrows()`'s branch calls the picked attack's `telegraph(mob)` through the new shared primitive above instead of `computeNextDir`; `moveMobs()`'s branch calls a new `resolveBossTurn(mob)` instead of `moveMob(mob)`. Broodmother still lives in `state.mobs` as a real `Mob` (occupancy/rendering/save-serialization/health-bar-hiding all reuse existing per-mob machinery) — this is a branch inside the existing loops, not a bespoke turn system running alongside them. (`Mob.pattern` is typed non-optional today — a boss mob needs it to become `pattern?: AiPattern`, since she has none.)\n- **`Mob.pendingBossAttackId?: string`** — the id of the `BossAttackDef` she telegraphed last turn, so `resolveBossTurn` knows what to actually execute this turn before picking (and telegraphing) the next one. Same file/pattern as `Mob.dungeonLootIndex` (`state.ts`).\n- **`Mob.dashDirection?: 'left' | 'right'`** — which way her next Dash sweeps, alternated on every resolve (see \"Dash (Slither Charge)\" below). Same optional/additive shape as `pendingBossAttackId` above, including in `save.ts`'s `SerializedMob` — a reload mid-fight keeps alternating rather than resetting.\n\n### Rendering\n\n`EntityDef.footprint` mobs render as **one oversized emoji, CSS-positioned to span the full footprint** — an absolutely-positioned overlay (same technique `entityHealth.ts` already uses to float its mini HP-bar overlay above a tile, sized to `footprint.w`/`footprint.h` tile-widths instead of 1) rather than four separate quadrant tiles. The other 3 occupied cells render their normal ground content underneath with no glyph of their own painted on top by the mob (the overlay visually covers them). Simplest to build, keeps one visual element in sync per boss.\n\nThe per-hit flash (`animateHit`, fired from `player.ts`'s `playMobHitImpact`) uses the same footprint-scaling idea, via a standalone `bossRender.ts`'s `getFootprintRect(mob)` — the same `rect.width * footprint.w` / `rect.height * footprint.h` math `syncBossFootprintOverlay` already does for her resting sprite, just exposed for a caller outside that module. Without this, a hit landed on any one of her 4 cells flashed only that single tile instead of her whole body; `playMobHitImpact` now sizes the flash (and the death animation) to `getFootprintRect(entity) ?? targetRect` — falling back to the single bumped-tile rect for every ordinary, non-footprint mob.\n\n## Health bar\n\n`syncEntityHealthBar` (`entityHealth.ts`) still early-returns for `entity.def.invincible` (an invincible mob's health is never worth showing at all), and still has the `hideHealthDisplay?: boolean` flag available for a future boss whose own health should stay hidden — but Broodmother herself no longer sets it. Her mini HP-bar overlay renders same as any other mob's, just scaled and centered across her whole body instead of one tile: `syncEntityHealthBar` multiplies the bar's width (and its horizontal centering offset) by `entity.def.footprint.w` when the field is present, the same `rect.width * footprint.w` idea `syncBossFootprintOverlay`/`getFootprintRect` above already use for her sprite and hit-flash. No special-casing by species — any future footprint boss gets the same wide bar for free.\n\nOn top of the bar itself, the enrage transition at 200 HP is still its own visible cue — a red-tinted CSS filter on her oversized overlay (`hue-rotate`/`saturate`) plus the behavioral shift toward Dash.\n\n## Damaging her\n\nAlways damageable, exactly like any other mob — no vulnerability window, no bonus-damage body part. Bump-attack any of her 4 occupied cells with your equipped weapon; `interactWithMob`/`resolveMobHit` (`player.ts`) run completely unchanged once `getOccupant` is footprint-aware (see above). `entity.health -= damage`, `killed = entity.health <= 0` — same as today, since she isn't `invincible`.\n\n## Attacks\n\n`EntityDef` gains two more fields for a boss:\n\n```ts\nbossAttacks?: BossAttackDef[];\nenrageThreshold?: number;  // health at/below which the enraged phase's weights apply\n```\n\n```ts\ninterface BossAttackDef {\n  id: string;\n  weight: number;          // normal-phase pick weight\n  enragedWeight: number;   // enraged-phase pick weight\n  telegraph: (mob: Mob) => Array<{ x: number; y: number }>; // tiles to redden this turn\n  resolve: (mob: Mob) => void;                               // executes next turn\n}\n```\n\nA weighted table keyed by phase, picked the same way `zones-data.ts`'s `computeWeights`/`pickFromWeights` already picks a species by floor progress — reusing that existing weighted-random mechanism rather than inventing a second one. Every attack **telegraphs exactly one turn ahead — the same cadence every ordinary mob already telegraphs its next move at, not a longer or shorter window.** On Broodmother's turn: if `mob.pendingBossAttackId` is set, resolve it now (see below); then pick a new attack (weighted by current phase) and mark its `telegraph()` tiles via the shared multi-tile primitive above, storing its id as the new `pendingBossAttackId`. The player gets exactly one full move between seeing a telegraph and it resolving — identical in timing to how `updateMobArrows`'s `data-snake-next` already previews an ordinary mob's next destination one turn out. This was previously written up as if a boss might telegraph over a different number of turns than a regular mob; it doesn't — same one-turn-ahead contract, just applied to a set of tiles instead of one.\n\n**Resolving against a boss that's no longer there.** If Broodmother dies from player damage during the one-turn gap between telegraph and resolve, her `Mob` is already removed from `state.mobs` by the normal kill path before her next turn would come up — `moveMobs()`'s `resolveBossTurn` branch is simply never called again for her, so a pending attack from a dead boss never resolves. No special-case \"is she still alive\" check needed; this falls out of the existing iterate-`state.mobs` turn loop for free.\n\n**Enrage crossing mid-telegraph.** The enrage threshold only affects which attack gets picked at *pick* time — it never changes how an attack already telegraphed resolves. If she drops from 210 HP to 190 HP during the gap between telegraph and resolve, the already-picked attack still resolves exactly as telegraphed; only the *next* pick (right after that resolve) uses the enraged weights.\n\nProposed weights (tunable): **Normal phase** — Quad Spit 60 / Dash 40. **Enraged phase** (≤200 HP) — Quad Spit 25 / Dash 75.\n\n### Dash (Slither Charge)\n\nPurely horizontal, along whichever row Broodmother currently occupies — she never moves vertically. She starts pinned near the room's left edge (anchor `(2,1)`) and every Dash sweeps her toward the opposite interior wall, alternating direction each time (`Mob.dashDirection`, flipped on every resolve — right, then left, then right, ...) rather than tracking the player's side. There's no partial hop: the sweep always covers her full available range, end to end, only ever cut short by an actual obstacle.\n\n- **Telegraph:** the path her body is actually about to travel this turn — both rows of her footprint, from her current position to wherever her body comes to rest — marked with the red indicator. This uses the same pulled-back range as Resolve (`computeDashBodyDistance`, below), **not** the raw wall-to-wall `computeDashDistance`: the red indicator means \"this is where she's moving,\" not \"this tile is dangerous,\" so a PIT column her body stops short of is not marked, even though it's still lethal if a shove carries a caught player onto it (see \"The shove\" below) — that hazard is communicated by the `PIT` tile's own glyph, not by the telegraph. This is a bigger danger zone than a single mob's usual one-tile-ahead arrow: getting caught anywhere in either of her two rows means getting caught in the whole sweep, not just the first few tiles.\n- **Resolve:** her whole 2x2 footprint slides toward the far end of the room in that direction (`moveFootprintEntityTo`), stopping short of a wall rather than clipping through it (`computeDashDistance`, unchanged shape from before, just with no fixed tile cap anymore) — and, separately, stopping 1 tile short of a `PIT` rather than parking her body on top of it (`computeDashBodyDistance`, which pulls the resting distance back by 1 whenever the full-distance landing spot is a PIT column). The player shove below still reaches the full, non-pulled-back distance — only her own resting position is short.\n\n**The shove.** A player standing in either of her two rows, anywhere along the swept path, doesn't get run over in place — they get carried from whatever tile they're actually standing on, all the way to her new leading edge (`moveEntityTo(state.playerEntity, ...)`, animated with the same `'slide'` primitive an ordinary mob's own move uses, so the player visibly travels with her rather than just teleporting). This is a full-turn-blocking animation (`AnimConfig`'s `blocking` flag — `finishTurn` awaits it the same way it already awaits a `'lunge'`, keeping the D-pad disabled until it finishes) rather than an ordinary quick mob-move slide, and its duration (`dashResolve`'s own `shoveMs`) scales with how far *this* shove actually travels: a player caught only partway through her sweep travels fewer tiles than her own full `computeDashDistance`, so they move at the same per-tile pace a full-width shove would (`ANIM_MS.broodmotherShove`, the reference duration for a full sweep) rather than always taking that same flat duration regardless of distance. The destination tile's own ground content (typically a `PIT`, at the end of a sweep) stays visible under the animating ninja overlay for the whole shove rather than going blank — worth calling out because blanking it outright was the pre-existing idiom every ordinary mob slide already used, and only became an obvious visible bug once this one shove's duration grew long enough to actually notice it. What happens once the player arrives depends on what's there: the boss room's two `PIT` hazard columns (see the room diagram above) sit exactly at each end of her sweep, so a shoved player normally falls straight in — an unconditional death, chute or not (`player.ts`'s `interactWithPit`/the shove's own PIT check in `dashResolve`, both reusing `HOLE`'s own no-chute-death `handleDamage(..., bypassArmor: true)` call). In a hypothetical future room with no end-of-sweep pits, the shove instead just deals her ordinary `attackDamage` (15) with an ordinary hit-flash once it lands, the same as landing in her path always used to.\n\n### Quad Spit\n\nPurely positional — **not player-tracking at all**, which is what makes it simple: the same 4-ray pattern fires every time regardless of where the player is standing, from Broodmother's two bottom cells (relative to her current anchor):\n\n- Straight down from the bottom-left cell.\n- Straight down from the bottom-right cell.\n- Diagonally down-left from the bottom-left cell.\n- Diagonally down-right from the bottom-right cell.\n\n- **Telegraph:** all 4 rays' full paths (each traced out to the first wall/obstacle) marked with the red indicator.\n- **Resolve:** fires 4 `'shoot'`-kind projectiles simultaneously (the existing ranged-attack animation primitive, `animations.ts`'s `animateShoot` — already explicitly documented as \"usable... later, [for] a ranged-attacking mob shooting at the player,\" just never called by one before now), reusing `resolveRangedLine`'s stop-at-first-obstacle-or-entity walk. This needs one small, already-precedented extension: `resolveRangedLine`'s `Direction` parameter and `getNewTileInDirection` currently only resolve the 4 cardinal directions for a ranged line — the 4 diagonal `getNewTileInDirection` cases already exist (added for `BAT_DEF.diagonalOnly` movement), so this is wiring an existing case, not writing new geometry. Any ray reaching the player deals `attackDamage` (15).\n\n## Music & SFX\n\n- **Music:** a dedicated boss track, \"Halloween Dash\" (HeatleyBros), plays across all 3 boss-floor rooms — `bossFloor.ts`'s `BOSS_MUSIC_TRACK` (`'boss'`, resolving through `GAME_CONFIG.music`/`audio.ts`'s generic multi-track engine), set by `loadBossFloorChunk` on every boss-room load.\n- **SFX:** Dash, Quad Spit, and her death each need their own `soundKey` (same indirection as `EntityDef.attackSoundKey`/`FEEDBACK_CONFIG`'s `soundKey` — see `CLAUDE.md`'s \"Sound-key indirection\") rather than reusing an existing mob's `attackSoundKey`. Prototype real roar-style SFX for these (a low charging roar for Dash's telegraph, a wet hiss/spit for Quad Spit, a bigger roar for her death) instead of placeholder-reusing `SNAKE_DEF`'s existing hiss — she's meant to read as a distinct, heavier threat than a regular snake. The gate-lock intro itself gets 2 more: `bossGateLock` (a heavy metallic clank, played once per doorway as it locks) and `bossSpawn` (a heavy landing thud/roar as she drops in) — both resolved through `soundRegistry.ts`'s `playSound` like every other sound key.\n\n## Rewards\n\n### Heart Container — a new item, boss-exclusive\n\nKilling Broodmother drops one **Heart Container** (`HEART_CONTAINER: Tile = { type: 'HEART_CONTAINER', display: '💖' }` — a distinct glyph from HEALING_POTION's 🧪, and an unrelated item/mechanic from it) directly at her death location. Unlike every other item, it isn't rolled through `dropLootBox`/`LootChanceOption` — it's an unconditional guaranteed drop, and it isn't picked up into inventory at all:\n\n- **Instant on touch**, the classic \"heart container\" idiom: walking onto the tile immediately calls `state.increaseMaxHealth(HEART_CONTAINER_MAX_HEALTH_BONUS)` (`player.ts`'s `tryCollectHeartContainer`) — a **+50** max-health bonus, not the flat +1 `state.increaseMaxHealth()` originally shipped with (the method now takes an optional amount, defaulting to 1 for any other future caller) — then heals the player to the new max, and the tile is consumed. Extends the existing `shouldAutoCollect` auto-pickup pattern (`player.ts`/`lootBox.ts`, currently used for GOLD only — see the healing-potion-drink-mechanic change, which moved ordinary HEALING_POTION pickups off this same pattern since drinking one is now a manual, separate action) with a new branch, rather than adding a \"use\" step through the inventory screen.\n\n### HEALING_POTION off mob loot — already done, independent of boss floors\n\n**Implemented ahead of the rest of this doc**, as its own standalone change (the healing-potion-drink-mechanic / ground-drop change): HEALING_POTION (the existing healing potion, heal-over-time item — `constants.ts`'s `HEALING_POTION`, 🧪, formerly named `HEART`) is removed from normal mob loot entirely — `SNAKE_DEF.startingLoot`'s old `{ chancePercent: 10, tile: HEALING_POTION }` and `RAT_DEF.startingLoot`'s old `{ chancePercent: 5, tile: HEALING_POTION }` (`entityDefs.ts`) are both gone, folded into \"nothing\" rather than gold (`SNAKE_DEF` is 70% gold / 30% nothing, `RAT_DEF` 55% gold / 45% nothing). HEALING_POTION is **not** boss-chest-exclusive, though — it's a plain dungeon-floor ground spawn now, rolled per free room tile alongside gold/equipment as the `'potion'` DropCategory (`dungeonGen.ts`'s `placeFreeTileDrops`/`DungeonContent.freeTileDrops`, `dungeonTransition.ts`'s `applyDungeonChunkItems`), findable on any floor without needing a boss kill first, and its own heal-over-time potency is rarity-rolled per instance (`healingPotion.ts`'s `rollHealingPotion`) rather than a single flat item. A future Broodmother chest can still include a healing potion among its rolled contents (see \"Rewards\" above), it just isn't the *only* source the way this section originally proposed.\n\n## Save/persistence\n\nA boss floor's 3 rooms are fixed data, not seeded RNG, but they're still real chunks — so unlike the original design (which needed a dedicated `state.currentBossRoom` field), which room the player is in is just the ordinary `dungeonChunkX`/`dungeonChunkY` every floor already persists, and the fight room's own chunk-local `DungeonChunkSnapshot` cache (ground tiles, whether the trap tile has already been consumed) is the exact same mechanism a procedural floor's rooms already use — no boss-floor-specific save fields for room identity or lock state at all. What does still need persisting, following the same additive/optional-field pattern already used for `inTown`/`killedDungeonEnemies` (no `SAVE_VERSION` bump required):\n- Broodmother's own remaining health, enraged state, `pendingBossAttackId`, and `dashDirection` — serialized the same way any dungeon-spawned mob already is (`save.ts`'s `MOB_SPECIES` table). Reloading mid-telegraph needs no extra bookkeeping beyond `pendingBossAttackId`: it alone is enough to recompute and redraw the same telegraph tiles on load (`telegraph()` is a pure function of the mob's current state), and `resolveBossTurn` picks the resolve back up on the player's next move exactly as if the save/reload never happened. `dashDirection` just keeps her next Dash's alternation consistent across the reload. Her mere presence in `state.mobs` on reload is also what re-derives `isBossFightLocked()` back to `true` for free — no separate \"was I mid-fight\" flag needed.\n- The chest needs no dedicated persistence of its own — it's a `lootBox` at a fixed coordinate like any other BOX, already covered by the same save/load path every other ground loot pile uses.\n- The `BOSS_GATE` tiles themselves need no dedicated persistence either, for the same reason — they're ordinary ground content, so a save/reload mid-fight restores them (or their absence) exactly like any other tile via the fight room's own `DungeonChunkSnapshot`, no separate \"was the gate locked\" flag needed.\n\n## Open implementation questions (not design questions)\n\nThese are engineering judgment calls that don't change the shape of the fight — resolved as follows during implementation (`scripts/bossFloor.ts` + `scripts/broodmother.ts`):\n- **Chest gold/rare-item bounds**: `50`–`150` gold (`getRandomInRange`), plus one FOOD, one HEALING_POTION, and one equipment roll (weapon/armor/bow/shield, equal weight) forced to Rare/Epic/Legendary tier (equal weight among the three) — all floor-scaled off `state.currentLevel` the same way any other rolled item is. Tunable further from real play, not load-bearing to the fight's shape.\n- **Dash direction**: alternates left/right on every resolve (`Mob.dashDirection`), not weighted toward the player's side — a deliberate revision from the fight's first pass, which had `dashDirectionTowardPlayer` compare `state.playerX` against her footprint's own center column. The full end-to-end sweep plus the shove-into-`PIT` mechanic (see \"Dash (Slither Charge)\" above) made a predictable alternation read better than a player-tracking bias once the stakes of getting caught in her path went up.\n- **Cover-pillar placement**: kept at `(2,5)`/`(6,5)` as specified above, untuned against real play.\n- **PIT hazard placement**: the two Dash-end columns (her home rows only, `(1,1)`/`(1,2)` and `(7,1)`/`(7,2)`), matching where her sweep's full range starts/ends — a shoved player still reaches these columns, even though her own body pulls back 1 tile short of them (`computeDashBodyDistance`); untuned against real play, a wider or narrower hazard zone is a pure balance question, not a shape question.\n- **Debug shortcut**: `__debug.skipToBossFloor(level = 5)` (`game.ts`'s `debugSkipToBossFloor`) — mirrors every other `__debug` shortcut, jumps straight to a boss floor's Entry room for the given boss-floor level (5/10/15/20/25).\n- **Gate-lock animation timing**: `BOSS_GATE_ANIM_MS` (`bossFloor.ts`), 450ms per doorway's own slide animation; `BOSS_GATE_STAGGER_MS`, 500ms between the north doorway finishing and the south one starting; `BOSS_SPAWN_DELAY_MS`, a further 1000ms after the south doorway finishes before Broodmother spawns — untuned against real play.\n- **Trap tile placement**: one tile in from the Fight room's own south (entry-side) edge, `BOSS_TRAP_SPOT` (`dungeonGen.ts`) — chosen to guarantee the player is standing well clear of both PIT columns and her spawn footprint the instant she appears, not tuned for anything beyond that.\n",ye=`# Drops Core — Shared Item Engine

## Overview

This doc defines the engine every new drop category (**weapons**, **armor**,
**shields**, **bows**, **food**, **backpacks**, **healing potions** — see
their own docs) is built on top of,
so each category doc only has to describe its own stat shape and rollable
fields, not re-derive how rolling, floor-scaling, or durability work. Today's
drop system is flat and un-scaled: \`SWORD_DAMAGE\`/\`UNARMED_DAMAGE\` are global
constants (\`scripts/constants.ts\`), a sword is a boolean-ish owned-count
(\`state.swords\`), and \`swordsCount\`/\`smallGoldCount\`/etc. are fixed totals
regardless of dungeon floor. Everything below replaces "one flat number for
everyone" with **per-instance stats, rolled once at generation time from a
continuous rarity roll, that scale together and drift toward higher rarity
on deeper floors** — the actual substance of "item variety."

Superseded design note: an earlier revision of this doc used discrete named
tiers, each with its own hand-picked stat *range* and a fixed inverse
power/durability relationship (the best tier was always both the strongest
and the most fragile). That's gone — see "Why rarity replaces discrete
tiers" below for why, and each category doc's tier table has been replaced
accordingly. Tier **names** (Dagger/Sword/Axe/Greatsword, etc.) survive as
cosmetic *bands* over the new continuous rarity axis, purely for display —
they no longer carry their own stat ranges.

---

## Behavior

### 1 — Every dropped item is a rolled instance, not a shared constant

A dropped weapon/armor/shield/bow/food/backpack/potion carries its own small
stats object, rolled once when it's placed, not read off a shared global the
way \`SWORD_DAMAGE\` is today:

\`\`\`ts
interface DroppedItemStats {
  category: 'weapon' | 'armor' | 'shield' | 'bow' | 'food' | 'backpack' | 'potion';
  rarity: number;           // 1–100, rolled once at generation time — see below
  durability: { current: number; max: number };
  // category-specific fields layered on top — damage (weapon/bow), armorRating
  // (armor), defense (shield), range (bow), capacity (backpack),
  // hungerRestored (food), healPercentPerTurn/healDuration (potion) — each
  // defined in that category's own doc, never here.
}
\`\`\`

An item's display name is composed at render time from its \`rarity\` (via
the shared \`RARITY_TIERS\` lookup below) and its \`category\` — "Rare Weapon,"
"Epic Armor," "Legendary Bow" — there is no separate flavor name
(no more "Dagger"/"Sword"/"Axe"/"Greatsword") stored on the instance itself.
Every category already shares one emoji across its whole stat range (no
per-tier art exists today), so a flavor name wasn't buying any visual
distinction rarity-tier color/glow doesn't already provide more legibly.

Two dropped swords can now genuinely differ — this is the property that
doesn't exist anywhere in the current item system (every \`SWORD\` today is
identical, and there is only one).

### 2 — Rarity tiers: one shared, floor-scaled table

Unlike the old per-category tier tables, **which tier a drop lands in, and
the name/color/glow the player sees for it, is a single lookup shared by
every category** — not something each category doc redefines. This is the
same "unify by data, not by call site" shape the codebase already uses for
rooms (\`rooms.ts\` engine + \`rooms-data.ts\` instances) and NPCs
(\`dialogue.ts\` engine + one \`.ink\` file per NPC): one generic mechanism,
data supplies the variation.

Tier *selection* reuses the exact \`baseWeight\`/\`floorDelta\`/\`tierWeight\`
mechanism the old per-category tier tables used — deliberately, since a
single continuous skewed roll (an earlier draft of this doc) turned out to
make it impossible to independently cap how rare the top tier stays at the
game's deepest floor without also flattening every tier in between into
near-nonexistence at floor 1. Independent per-tier weights don't have that
problem — each tier's floor curve is tuned on its own:

\`\`\`ts
interface RarityTier {
  name: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  minRarity: number;   // inclusive — the sub-roll range once this tier is chosen
  maxRarity: number;   // inclusive
  baseWeight: number;  // weight at floor 1
  floorDelta: number;  // added to weight per floor beyond 1 (negative = fades out, positive = fades in)
  color: string;       // CSS color for name text + glow tint
}

const RARITY_TIERS: RarityTier[] = [
  { name: 'Common',    minRarity: 1,   maxRarity: 20,  baseWeight: 80,   floorDelta: -2.708, color: 'var(--text)' }, // see note below
  { name: 'Uncommon',  minRarity: 21,  maxRarity: 40,  baseWeight: 16,   floorDelta: 0.792,  color: '#22c55e' },
  { name: 'Rare',      minRarity: 41,  maxRarity: 60,  baseWeight: 3.5,  floorDelta: 1.021,  color: '#3b82f6' },
  { name: 'Epic',      minRarity: 61,  maxRarity: 80,  baseWeight: 0.45, floorDelta: 0.398,  color: '#a855f7' },
  { name: 'Legendary', minRarity: 81,  maxRarity: 100, baseWeight: 0.05, floorDelta: 0.0813, color: '#f97316' },
];

function tierWeight(tier: RarityTier, floor: number): number {
  return Math.max(0, tier.baseWeight + (floor - 1) * tier.floorDelta);
}

/** Picks a tier weighted by tierWeight(tier, floor) (same normalize-and-roll
 * shape rollLootChance already uses), then rolls a uniform \`rarity\` value
 * inside that tier's own range — this is the one function every category's
 * drop generation calls. */
function rollRarityTier(floor: number): { tier: RarityTier; rarity: number } {
  const weights = RARITY_TIERS.map(t => tierWeight(t, floor));
  const sum = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * sum;
  for (let i = 0; i < RARITY_TIERS.length; i++) {
    roll -= weights[i];
    if (roll < 0) {
      const tier = RARITY_TIERS[i];
      const rarity = tier.minRarity + Math.floor(Math.random() * (tier.maxRarity - tier.minRarity + 1));
      return { tier, rarity };
    }
  }
  const tier = RARITY_TIERS[RARITY_TIERS.length - 1];
  return { tier, rarity: tier.maxRarity };
}
\`\`\`

With the defaults above, calibrated against **floor 25 as the game's max
floor**: floor 1 is overwhelmingly Common/Uncommon (96% combined) with Rare
a genuine rare event (3.5%) and Epic/Legendary both near-impossible (0.5%/
0.1%). Legendary climbs to ~2.2% by floor 25 — always the rarest tier, never
"common" in the literal sense, satisfying "higher rarity becomes more likely
deeper in, but the top tier never stops being a real event." Rare overtakes
Common as the single most likely tier by the late floors (~31% at floor 25)
while Epic stays clearly behind it (~11%) and Common fades from 80% down to
~17% without ever hitting a hard floor of zero:

| Floor | Common | Uncommon | Rare | Epic | Legendary |
|---|---|---|---|---|---|
| 1 | 80% | 16% | 3.5% | 0.5% | 0.1% |
| 12 | 53% | 26% | 15% | 5.1% | 1.0% |
| 25 (max) | 17% | 39% | 31% | 11% | 2.2% |

Five even 20-point \`minRarity\`/\`maxRarity\` bands (not the old per-category
30/35/25/10-point splits) — this reads instantly to anyone who's played an
ARPG, and it means every category's rarity distribution is directly
comparable ("this floor rolls Epic+ about as often for armor as for
weapons") without having to remember a different threshold per category.
The \`baseWeight\`/\`floorDelta\` numbers above are this doc's proposed
defaults, not fixed forever — tunable live, per tier, in the Drop Tables
Tuner.

**Common's color is \`var(--text)\`, not a literal white**, because these
are theme-aware docs (see CLAUDE.md's "Theming interactive docs") — a
hardcoded white would vanish against the docs hub's light theme. In the
real game (a fixed dark forest backdrop, not a theme-toggling doc) this
resolves to an actual white/neutral color, matching the "white text" a
player expects for the common tier. The other four tiers use fixed,
saturated hex values (not theme variables) since a rarity color is a
semantic signal like a severity color — it needs to read the same way
regardless of light/dark mode, the same reasoning \`docs-page.ts\` already
applies to its own fixed accent colors.

**Glow** follows the existing per-instance glow mechanism from the
Animation Contract Gotchas (\`scripts/animations.ts\`) rather than inventing
a new one: today only a key-carrying tile gets \`data-has-key\` +
\`.tile[data-has-key]\`'s radial-gradient glow, with \`glowKey: true\` on an
\`AnimConfig\` to keep that glow through a slide/lunge overlay. This
generalizes to \`data-rarity="{tier.name.toLowerCase()}"\` on any dropped
item's tile (ground or overlay) driving \`.tile[data-rarity="legendary"]\`
etc. in \`styles.css\`, and a \`glowRarity: RarityTier['name']\` field on
\`AnimConfig\` (parallel to \`glowKey\`) so a rarity item's glow survives being
slid/lunged the same way a key's does. Common's glow is real but
deliberately subtle (a near-invisible version of the same mechanism) since
a common item shouldn't visually compete with an Epic/Legendary one sitting
nearby.

### 3 — From tier to stats: the multiplier roll

Once \`rollRarityTier\` produces a \`rarity\` value, each of the category's
stats is derived from a **base range** (the stat's spread at \`rarity = 1\`,
deliberately set to today's weakest-tier numbers so a rarity-1 drop is
never worse than what the game already ships) and a **multiplier curve**:

\`\`\`ts
interface StatField {
  key: string;               // 'damage', 'armorRating', 'capacity', ...
  baseRange: { min: number; max: number }; // spread at rarity = 1
  direction: 'up' | 'down';  // 'down' fields shrink as rarity rises — no live field uses this today
}

function rarityMultiplier(rarity: number, minMult: number, maxMult: number): number {
  return minMult + (maxMult - minMult) * (rarity - 1) / 99;
}

function rollStat(field: StatField, rarity: number, minMult: number, maxMult: number): number {
  const base = uniform(field.baseRange.min, field.baseRange.max);
  const mult = rarityMultiplier(rarity, minMult, maxMult);
  return field.direction === 'up' ? base * mult : base / mult;
}
\`\`\`

\`durability.max\` is just another \`direction: 'up'\` \`StatField\` — it scales
with the same roll as the category's power stat, not against it. This is
the actual answer to "the very best gear should be high durability, high
power": under discrete tiers that was structurally impossible (a tier's
power and durability ranges were independent hand-picked rows); under a
single rarity roll driving every stat's multiplier together, a rarity-98
item is likely to roll well above average on *every* stat it has, precisely
because they share one multiplier. The scarcity of high rarity **is** the
trade-off — no separate anti-correlation rule is layered on top; tier
*selection* (section 2 above) is where scarcity actually lives.

### 4 — Where a category still varies

Rarity tier is universal, but two things remain genuinely per-category and
stay defined in each category's own doc, never here:

- **Which stats exist and their base ranges/direction/\`minMult\`/\`maxMult\`**
  (weapon's \`damage\`, armor's \`armorRating\`, food's \`hungerRestored\`, ...).
- **Any stat that's fixed-per-tier rather than rolled**, when the consuming
  system needs a small discrete set of values instead of a continuous roll
  — today this is only bow's \`range\` (see \`bow-drops.md\`), keyed off the
  shared \`RarityTier.name\`, not off a category-specific band the way it
  used to be.

\`rollLootChance\` (\`scripts/lootChance.ts\`) is unaffected by any of this — it
still decides *whether* a category drops at all at a given spot (weighted
against the other drop kinds and "nothing"); rarity only decides *how good*
the item is once a drop of that category has already been chosen.

### Why rarity replaces discrete tiers

The discrete-tier design forced "best tier = most fragile" as a hardcoded
rule (Greatsword/Plate/War Bow/Expedition Pack all had the *lowest*
durability range of their category) purely because each tier was one fixed
row — there was no way for a top-tier item to also roll high durability.
That's a deliberate trade-off worth having *somewhere*, but it shouldn't be
forced onto every single high-tier item; it should be possible (rare, but
possible) to find a genuinely great item. A rarity roll gets there directly:
rarity is scarce (the tier weights keep most drops in the low tiers, at
every floor including the deepest), and a high roll lifts every one of that
item's stats together, so the tension moves from "is this slot's item good
at X or Y" to "how rare was this drop at all" — which is the more legible,
more standard roguelite reward loop.

### 5 — Durability: the one rule every gear type shares

- Every weapon, armor, shield, bow, and backpack has a \`durability.current\`
  that decrements by exactly 1 per **use event** — the category doc defines
  what counts as a use (a swing for a melee weapon, a shot for a bow, a hit
  *taken* while armor/shield is worn/raised, an item added-to-or-removed-from
  a specific backpack). Food and healing potions carry no \`durability\` field
  at all — neither has a per-use or per-turn decay rule; see \`food-drops.md\`
  / \`healing-potion-drops.md\`.
- **At \`durability.current === 0\`, the item is destroyed and removed** from
  wherever it's sitting (equip slot or bag slot) — the same rule for every
  category, no exceptions and no "broken but still worn" state. This mirrors
  today's \`state.useSword()\` (a sword already disappears after one swing —
  see \`scripts/player.ts\`'s \`interactWithMob\`), just generalized from a
  boolean-ish single-charge count to a real multi-charge counter.
- The action that brings durability to 0 still fully resolves (the killing
  swing still deals its damage, the blocking hit still gets reduced by the
  armor that broke on it) — destruction happens *after* the triggering
  action, never pre-empts it.

### 6 — Placement hook points (implemented)

This section originally proposed the hook point below as future work; it's
long since implemented, and the dungeon itself has moved past \`key\`/
\`lockedDoor\` entirely (replaced by \`CHUTE\`/\`HOLE\` — see
\`docs/dungeon-generation.md\`). Current shape:

- **Dungeon room content** (\`scripts/dungeonGen.ts\`'s \`placeContent\` /
  \`DungeonContent.freeTileDrops\`) — every weapon/armor/shield/bow/food/
  backpack/potion category rolls through one shared per-free-tile pass
  (\`placeFreeTileDrops\`), alongside gold, replacing the fixed per-category
  spot counts an earlier revision of this hook used. \`DungeonEquipmentSpot\`
  (\`DungeonTileSpot\` + a \`category: DropCategory\`) carries only a position +
  category — never the rolled \`DroppedItemStats\` themselves, since two
  dropped items of the same category/tier can still differ and the actual
  roll is deterministically re-derived at placement time
  (\`scripts/dungeonEquipment.ts\`'s \`rollEquipmentForSpot\`, seeded off
  \`(dungeonSeed, spot, category)\`) rather than stored on the spot. A \`'gold'\`
  -kind free-tile spot carries a plain rolled amount instead of a category.
  Rolling happens at \`placeContent\` time, on the same seeded \`rng\` stream
  every other dungeon content already shares — fully deterministic per
  \`dungeonSeed\`, same as chute/hole/snakes/gold today.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| \`rarity\` rolls exactly 1 | Every stat rolls at \`minMult\` — the weakest possible drop, but never below today's shipped baseline (base ranges are set at today's numbers) |
| \`rarity\` rolls exactly 100 | Every stat rolls at \`maxMult\` — the best possible drop of that category, on every stat at once; no anti-correlation forces one stat down to compensate |
| An item's triggering action reduces durability to exactly 0 | The action still fully resolves; destruction happens immediately after |
| Two items of the same category are rolled back to back | Each gets its own independent \`rarity\` roll and its own independent \`uniform()\` draw per stat within that roll's range — never guaranteed identical, even at the same rarity |
| A rolled \`rarity\` lands exactly on a tier boundary (e.g. 20 vs. 21) | Resolved by \`RarityTier\`'s own \`minRarity\`/\`maxRarity\` inclusivity (\`maxRarity\` inclusive) — display name/color changes, but nothing about the stat roll itself is discontinuous at that boundary, since tiers never feed back into \`rollStat\` |

---

## Open Questions

- Should the existing \`SWORD\` tile/type be folded into the new rarity-rolled
  \`WEAPON\` system (its stats becoming \`WEAPON\`'s \`rarity = 1\` base range), or
  kept as a separate legacy type alongside it? This doc assumes the former
  but leaves the actual migration to the implementation pass.
- \`RARITY_TIERS\`' \`baseWeight\`/\`floorDelta\` per tier is currently proposed as
  one table shared by every category (not tunable per category, unlike each
  category's own \`minMult\`/\`maxMult\`/base stat ranges) — worth revisiting
  once real playtesting shows whether, say, backpacks should trend rarer
  than weapons at the same floor. Floor 25 is assumed as the game's max
  floor for calibration purposes (see section 2's table); if that changes,
  the \`floorDelta\` values need recalibrating against the new max.
`,be=`# 🗡️ Weapon Drops

## Overview

Replaces today's single \`SWORD\` (a flat owned-count, \`SWORD_DAMAGE = 1\` for
everyone — \`scripts/constants.ts\`) with a rarity-rolled \`WEAPON\` category:
one continuous 1–100 rarity roll per drop drives both damage and durability
together, drifting toward higher rarity on deeper dungeon floors. Built
entirely on \`drops-core.md\`'s engine (the rarity roll, the multiplier
formula, the universal Common/Uncommon/Rare/Epic/Legendary tier table, the
"destroyed at 0 durability" rule) — this doc only defines weapon's own base
stat ranges and what counts as a "use."

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base ranges and multiplier

| Stat | Base range (at rarity 1) | Direction |
|---|---|---|
| Damage | 13 – 17 | up |
| Durability | 8 – 15 | up |

Damage rolls on a **'geometric'** curve (\`minMult\`/\`maxMult\`: **1.0 / 35**,
\`dropsCore.ts\`'s \`rarityMultiplier\`) rather than the shared engine's default
additive/\`'linear'\` one — durability still rolls \`'linear'\` (\`minMult\`/
\`maxMult\`: **0.8 / 5.0**, unchanged). A rarity-1 weapon's damage floor is
\`13\`, a rarity-100 weapon's ceiling is \`595\`; durability still spans
\`40–75\` same as before. Unlike the old tier table, durability scales *up*
with rarity alongside damage — there's no forced "the strongest weapon is
also the most fragile" rule; a very high rarity roll is simply better on
both stats. Rarity itself is what's scarce (\`RARITY_TIERS\`' per-tier
\`baseWeight\`/\`floorDelta\`), not a trade-off baked into any one item.

A dropped weapon's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup — a rarity-97 item displays
"Legendary Weapon" 🗡 in orange; there's no weapon-specific flavor name
(no more "Dagger"/"Sword"/"Axe"/"Greatsword") layered on top. Following
\`drops-core.md\`'s \`rollRarityTier\` weighting, Common/Uncommon drops dominate
floor 1 (96% combined) and fade as each tier's own \`floorDelta\` shifts the
weights; Legendary rolls stay the rarest tier at every floor, climbing from
0.1% at floor 1 to ~2% by floor 25 (the game's max floor) — never "common,"
but no longer a floor-1 impossibility either.

A rarity-1 weapon's damage floor (\`13\`) is deliberately just above today's
\`UNARMED_DAMAGE = 10\` — a freshly-rolled weapon **always** beats fighting
bare-handed, never ties or loses to it.

### 1b — Tier separation

Every tier's worst possible roll is higher than every *non-adjacent* tier's
best possible roll — a lucky Common can still edge out an unlucky Uncommon
(that's intended continuity texture, not a bug), but it can never beat a
Rare, Epic, or Legendary roll of any kind. This wasn't true under the
original additive/\`'linear'\` multiplier curve, which couldn't give
Legendary a dramatically higher ceiling than Common without also dragging
Common's own ceiling up by the same absolute amount — and its per-tier
growth was too shallow to stop a low roll of a high tier from landing below
a high roll of a much lower tier (an earlier draft had Rare's best roll (50)
beating Legendary's worst (34)). Switching to a **'geometric'** curve
(multiplicative rather than additive across the rarity 1–100 range) fixed
both problems at once: it stays flat at the low end (keeping Common close to
unarmed) and steepens sharply toward Legendary (which is also what makes a
~600 damage ceiling possible without a linear curve inflating every other
tier along with it).

| Tier | Damage range |
|---|---|
| Common | 13 – 34 |
| Uncommon | 27 – 69 |
| Rare | 55 – 142 |
| Epic | 113 – 291 |
| Legendary | 230 – 595 |

Legendary's best possible roll (595) is calibrated to one-shot even an
eventual top-zone mob: a future zone 2-5 roster is planned to double
enemy \`attackDamage\` per zone off Slitherwood's baseline (\`entityDefs.ts\`'s
\`SNAKE_DEF\` comment), and \`maxHealth\` is meant to scale the same way — by
zone 5 that's a ~544-HP mob, comfortably under 595.

### 2 — What counts as a "use"

One melee swing (\`scripts/player.ts\`'s \`interactWithMob\`, the same call site
that resolves an attack today) decrements the equipped weapon's
\`durability.current\` by 1, whether or not the swing lands a killing blow —
matches today's \`state.useSword()\` timing exactly (a sword is already
consumed the instant it's swung, not only on a kill). At 0, the weapon is
destroyed per \`drops-core.md\`'s universal rule; the player falls back to
unarmed damage (today's \`UNARMED_DAMAGE = 8\`, itself effectively a
"tier 0" weapon with infinite durability) until a new weapon is equipped.

### 3 — Combat damage resolution

Replaces the current binary check in \`interactWithMob\`
(\`usingSword = state.swords > 0\`, flat \`SWORD_DAMAGE\` on true) with:
"is a \`WEAPON\` currently equipped?" → use its rolled \`damage\`; otherwise
fall back to \`UNARMED_DAMAGE\`. No other part of the combat resolution
changes — this still funnels through the same single attack path, just
reading a per-instance stat instead of a global constant.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| No weapon equipped | Unarmed damage (\`UNARMED_DAMAGE\`), unchanged from today |
| Equipped weapon breaks mid-combat (durability hits 0 on the swing that kills) | The killing swing still lands at full rolled damage; the weapon is destroyed immediately after |
| A bag holds a spare weapon while a different one is equipped | The spare's durability does not tick — only the equipped weapon takes wear |
| A floor-1 drop happens to roll Legendary anyway | Possible (0.1% per \`RARITY_TIERS\`' floor-1 weights) but rare — unlike the old per-category \`baseWeight: 0\` rows, Legendary is never fully excluded at any floor, just heavily disfavored |

---

## Open Questions

- Picking up a weapon while the weapon slot is empty now auto-equips it
  directly (the same rule applies to armor/bow/backpack — see
  \`scripts/lootBox.ts\`'s \`absorbGroundItem\`), superseding this doc's earlier
  "no auto-equip" stance. Picking up a *second* weapon while one is already
  equipped still just lands as a loose spare in the pool — there's no
  auto-comparison/auto-swap for a "better" roll; the inventory screen
  (\`inventory-system.md\`) is still the only place a manual swap happens.
- Whether the forest's tree loot table should ever roll a high-rarity item,
  given the forest has no floor-depth concept today (see \`drops-core.md\`'s
  Open Questions) — left for the implementation pass.
`,xe=`# 🥋 Armor Drops

## Overview

A genuinely new equip slot — there is no armor of any kind today. Armor
reduces incoming damage by a flat \`armorRating\` and wears down from the hits
it absorbs, built on \`drops-core.md\`'s shared engine (the rarity roll,
multiplier formula, "destroyed at 0 durability"). The reduction applies
inside \`scripts/damage.ts\`'s \`handleDamage\` — the single funnel every source
of damage to the player already passes through (mob attacks, hazard tiles,
starvation — see \`fullness-system.md\`), so armor protects against all of them
uniformly, not just melee hits.

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base ranges and multiplier

| Stat | Base range (at rarity 1) | Direction |
|---|---|---|
| Armor rating | 2 – 3 | up |
| Durability | 10 – 18 | up |

\`armorRating\` rolls on a **'geometric'** curve (\`minMult\`/\`maxMult\`:
**1.0 / 18**, \`dropsCore.ts\`'s \`rarityMultiplier\`), same reasoning as
\`weapon-drops.md\`'s damage curve — durability still rolls \`'linear'\`
(\`minMult\`/\`maxMult\`: **0.8 / 5.0**, unchanged). A rarity-100 roll reaches
\`armorRating\` up to \`54\` with durability still in \`50–90\`. As with weapon,
durability scales *up* with rarity alongside protection — the best armor
found isn't automatically the most fragile, it's just rare to find.

\`armorRating\`'s base range is deliberately much narrower than
\`weapon-drops.md\`'s own — see §2 below for why a wider range (the original
\`9–17\`, itself the ~33.33x-scaled carryover from the pre-rescale \`0.25–0.5\`)
wastes almost its entire span against \`MIN_HIT_DAMAGE\`'s floor. It's also
narrow enough, combined with the geometric curve's much steeper per-tier
growth, to guarantee every non-adjacent tier pair stays fully separated
(same property weapon/bow damage now have — see weapon-drops.md's "Tier
separation"):

| Tier | Armor rating range |
|---|---|
| Common | 2 – 6 |
| Uncommon | 4 – 10 |
| Rare | 7 – 17 |
| Epic | 12 – 31 |
| Legendary | 21 – 54 |

### Zone scaling

Gear rolls (this field, \`WEAPON_DAMAGE_FIELD\`, \`BOW_DAMAGE_FIELD\`) are
deliberately **floor-independent** — \`rollStat\`'s output depends only on the
rolled \`rarity\` value and \`minMult\`/\`maxMult\`, never on which floor/zone the
item dropped on; floor only shifts which *tier* you're statistically likely
to roll (\`rollRarityTier\`'s floor-weighted \`tierWeight\`). Enemy stats aren't
floor-scaled either — each zone (\`zones-data.md\`'s 5-floor bands) is planned
to introduce its own new, tougher species instead (Deep Grove/Withering
Palms/Dead Branches/Ashen Depths still all fall back to \`SNAKE\` today,
pending those species), doubling the baseline \`attackDamage\` each zone
(Slitherwood 15 → 30 → 60 → 120 → 240). Since armor's own ceiling doesn't grow
with floor, it's expected to fall further behind each zone's enemies by
design — armor is calibrated for Slitherwood (floors 1-5) viability, not
endgame invincibility.

A dropped armor's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup — a rarity-97 item displays
"Legendary Armor" 🥋 in orange; there's no armor-specific flavor name (no
more "Cloth"/"Leather"/"Iron"/"Plate") layered on top. Same shape as
\`weapon-drops.md\`'s curve and the same read: Common/Uncommon rolls dominate
early and fade out, Legendary rolls (rarity 81+) stay rare until floor
scaling shifts the distribution up enough to make them a realistic outcome.

### 2 — Damage reduction

\`\`\`
finalDamage = max(MIN_HIT_DAMAGE, incomingDamage - armorRating)
\`\`\`

\`MIN_HIT_DAMAGE\` is a small floor (\`10\`, matching today's \`UNARMED_DAMAGE\`)
so a high-\`armorRating\` roll can never reduce a hit to literal 0 — armor
mitigates, it doesn't grant immunity. This computation
happens inside \`handleDamage\` (\`scripts/damage.ts\`) right before
\`state.takeDamage(damage)\` is called, reading the equipped \`ARMOR\` item's
\`armorRating\` if one is worn, otherwise passing \`incomingDamage\` through
unchanged exactly as \`handleDamage\` does today.

**Slitherwood's (floors 1-5) enemies deal a flat 15 damage**, so only the first
\`15 - MIN_HIT_DAMAGE = 5\` points of \`armorRating\` ever matter — anything
beyond that is wasted, clamped by the same floor. \`armorRating\`'s \`2–3\` base
range (§1 above) is deliberately sized around that 5-point ceiling instead
of the wider, ~33.33x-scaled range an earlier pass used (\`9–17\`, reaching a
45–85 ceiling by Legendary) — that range reached the floor by the *low end*
of Uncommon, leaving Rare/Epic/Legendary armor no better than a decent
Uncommon roll. At the current range, Common lands below the floor (real,
distinct protection) while Uncommon/Rare/Epic/Legendary converge near it —
rarity still buys durability throughout, and now buys a meaningfully
different reduction percentage at Common too. See the "Combat
Balance" interactive doc (\`scripts/docs-combat-balance.ts\`) for the live,
tunable chart/table this was derived from.

### 3 — What counts as a "use"

Every time \`handleDamage\` actually reduces a hit (i.e. armor is equipped and
the incoming damage was \`> 0\`), the equipped armor's \`durability.current\`
decrements by 1 — one tick per *hit absorbed*, not per turn worn. Standing
around unequipped-of-danger, or dodging entirely (there is no dodge
mechanic today, so this only means "not being hit"), costs no durability.
At 0, the armor is destroyed per \`drops-core.md\`'s universal rule, and the
player is unprotected (equivalent to no \`ARMOR\` equipped) starting with the
very next hit.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| No armor equipped | \`handleDamage\` behaves exactly as it does today — no reduction, no durability bookkeeping |
| Armor's durability hits 0 on the hit that also kills the player | The reduced damage still applies to that hit (armor was worn when it landed); armor destruction and player death are independent outcomes of the same \`handleDamage\` call |
| Starvation damage (\`fullness-system.md\`) while armor is equipped | **Bypasses armor entirely** (\`fullness.ts\`'s \`tickFullness\` passes \`bypassArmor: true\`, same mechanism the hole-fall death path uses) — starvation is the fullness clock, not a hit armor absorbed, so it's neither reduced nor ticks armor durability |
| \`armorRating\` roll would reduce a hit below \`MIN_HIT_DAMAGE\` | Clamped to \`MIN_HIT_DAMAGE\`, never to 0 |

---

## Open Questions

- Should \`MIN_HIT_DAMAGE\` be a new named constant shared with
  \`UNARMED_DAMAGE\`'s existing value, or its own independent tunable? This
  doc assumes reusing the value but flags it as worth a second look once
  balance testing starts.
`,Se=`# 🏹 Bow Drops

## Overview

Bow item stats only — a rarity-rolled \`BOW\` category built on
\`drops-core.md\`'s shared engine, exactly parallel to
\`weapon-drops.md\`/\`armor-drops.md\`. What actually happens when a bow is
fired (aiming, targeting, the projectile) is \`ranged-attacks.md\`'s concern,
not this doc's — this doc only defines what a dropped bow *is*: its damage,
its range, and its durability.

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base ranges and multiplier

| Stat | Base range (at rarity 1) | Direction |
|---|---|---|
| Damage | 11.05 – 14.45 | up |
| Durability | 10 – 16 | up |

Damage rolls on the same **'geometric'** curve weapon-drops.md's damage
does (\`minMult\`/\`maxMult\`: **1.0 / 35**, identical to weapon's own curve) —
durability still rolls \`'linear'\` (\`minMult\`/\`maxMult\`: **0.8 / 4.5**,
unchanged). Bow is a deliberate playstyle *tradeoff* against melee now, not
a strict wash: its base range is scaled to exactly **0.85x** weapon's own
(\`11.05–14.45\` vs weapon's \`13–17\`), so every single roll, at any rarity,
lands 15% below what the identical roll would deal on a weapon — ranged's
advantage is standoff distance, not equal-or-better damage. A rarity-1 bow's
damage floor still clears \`UNARMED_DAMAGE = 10\` despite the cut (worst case
\`11.05 * 1.0 ≈ 12\`).

### 1b — Tier separation

Same property weapon-drops.md's own damage curve has, and for the same
reason (see that doc's "Tier separation"): every tier's worst possible roll
beats every *non-adjacent* tier's best roll. An earlier \`'linear'\`-curve
draft violated this badly for bow specifically — its wider \`8–23\` base
range let a Common's best roll (35) beat a Legendary's worst roll (31), the
exact "trash item outperforms best-in-slot" bug this curve switch fixes.

| Tier | Damage range |
|---|---|
| Common | 12 – 29 |
| Uncommon | 23 – 59 |
| Rare | 47 – 121 |
| Epic | 96 – 247 |
| Legendary | 196 – 506 |

### 2 — Range, fixed per rarity tier

A dropped bow's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup, same as every other
category — a rarity-97 item displays "Legendary Bow" 🏹 in orange, no
bow-specific flavor name. \`range\` is the one exception to "everything scales
continuously": it's **fixed per rarity tier**, not rolled, since
\`ranged-attacks.md\`'s targeting logic needs a small, discrete set of values
to reason about rather than an arbitrary continuous roll — keyed off the
same shared tier names every category now uses, not a bow-specific band:

| Tier | Range (tiles) |
|---|---|
| Common | 2 |
| Uncommon | 3 |
| Rare | 3 |
| Epic | 4 |
| Legendary | 5 |

Damage and durability still roll continuously from the shared base ranges
above regardless of which tier the item landed in, so two Legendary bows
(both fixed at 5-tile range) can still roll noticeably different damage —
this is also why Rare hits harder than Uncommon despite sharing no range
advantage over it: Rare's higher rarity band alone raises its damage roll.

### 3 — What counts as a "use"

Each shot (\`ranged-attacks.md\`'s fire action, whether or not it hits an
enemy) decrements the equipped bow's \`durability.current\` by 1 — same
"once per action, hit or miss" timing weapon durability uses on a swing. At
0, the bow is destroyed per \`drops-core.md\`'s universal rule.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| A bow and a melee weapon are both carried | Both can be equipped at once — \`bow\` is its own equip slot, independent of \`weapon\` (see \`inventory-system.md\`). Bumping an adjacent enemy always uses the equipped melee weapon; firing (see \`ranged-attacks.md\`) always uses the equipped bow |
| Bow fired with no enemy anywhere in range | Still consumes 1 durability — see \`ranged-attacks.md\`'s miss case |
| Bow's durability hits 0 on the shot that kills the target enemy | The shot still resolves at full rolled damage; the bow is destroyed immediately after, same ordering as melee weapons |

---

## Open Questions

- None outstanding — \`bow\` is its own equip slot alongside \`weapon\`/\`armor\`
  (see \`inventory-system.md\`), settled rather than left open.
`,Ce="# 🏹 Ranged Attacks (Bow)\n\n## Overview\n\nEvery other attack in Ninjack is a **bump-attack**: the player moves toward\nan occupied tile, the move doesn't complete, and `interactWithMob`\n(`scripts/player.ts`) resolves damage against whatever's adjacent. Equipping\na bow (`bow-drops.md`) is the game's first attack that doesn't require\nadjacency — aim along one of the 4 cardinal directions and hit the first\nenemy in that line, up to the bow's `range` tiles, without moving.\n\nImplemented now: the player's own Fire-button-and-aim flow below, fully\nwired into the real turn engine. The actual targeting math\n(`scripts/rangedAttack.ts`'s `resolveRangedLine`) is deliberately\nshooter-agnostic — it takes a plain `(originX, originY, dir, range)` rather\nthan reading the equipped bow itself, so a future ranged-attacking mob can\ncall the exact same function with its own numbers instead of a second,\nparallel implementation (see CLAUDE.md's \"Unify by data, not by call\nsite\"). Whether/how a mob actually *decides* to fire (targeting AI, keeping\ndistance from the player, which species gets it) is intentionally out of\nscope for this pass — see Open Questions.\n\n---\n\n## Behavior\n\n### 1 — Entering aim mode\n\n`#bow-button` (🏹, `index.html`/`scripts/ui.ts`) sits in the `#hud-corner`\nstack between `#use-button` and `#inventory-button`, and — like\n`#use-button` — only renders while relevant: a `BOW` must be equipped\n(`state.equipSlots.bow`), same condition `inventory-system.md` uses\nelsewhere. Tapping it toggles **aim mode** (`state.aiming`,\n`player.ts`'s `toggleAiming`):\n\n- The button itself gets a red highlighted outline (`.active`, styles.css)\n  while aiming.\n- All 4 D-pad buttons swap their per-tile context icon (normally the\n  sword-attack hint etc., `scripts/dpad-context.ts`) for a uniform bow icon\n  — direction is the player's own choice while aiming, not contingent on\n  what's adjacent (`ui.ts`'s `updateContextIcons`).\n- A red \"to-hit\" line lights up on every tile each of the 4 directions\n  would actually reach (`ui.ts`'s `updateBowPreview`, driven by the same\n  `resolveRangedLine` a fired shot itself uses — `data-bow-preview`,\n  styles.css).\n- Tapping Fire again while aiming cancels it with no effect and no\n  durability cost — aiming itself is free; only an actual fired shot\n  consumes durability.\n\n### 2 — Firing\n\nTapping a direction button while in aim mode fires along that line\n(`player.ts`'s `executeBowFire`):\n\n1. `resolveRangedLine` walks tiles outward from the player's position in\n   the chosen direction, one at a time, up to the equipped bow's `range`.\n2. The first tile in that walk whose ground tile is **not** `movable`\n   (i.e. would block the player's own movement too — walls, trees,\n   unbroken rock, `TREE_WALL`, etc.; the same test `isMoverBlocked`\n   already encodes for AI movers, reused here as a line-of-sight check for\n   the player's own shot) stops the shot right there — arrow hits the\n   obstacle, no damage, shot does not continue past it.\n3. If no obstacle stopped it first, the first tile holding a live occupant\n   (`getOccupant(x, y)`) takes the bow's rolled `damage`. The shot stops\n   there — it does not pierce through to a second entity further along the\n   line.\n4. If neither an obstacle nor an occupant is found within `range`, the shot\n   simply travels the full `range` and has no effect (a clean miss).\n5. Aim mode exits automatically after any fired shot (obstacle, hit, or\n   miss) — back to normal movement, Fire must be tapped again for another\n   shot.\n\nA hit reuses the *exact* melee hit-resolution core (`resolveMobHit`/\n`playMobHitImpact`/`settleMobHit` in `player.ts`) `interactWithMob` uses for\na sword swing — same health/kill/analytics math, same loot drop, same hit-\nflash/death animation and sound, same hearts sync. Only the windup\nanimation differs: a bow shot queues a `'shoot'` `AnimConfig`\n(`scripts/animations.ts`) instead of a `'lunge'` — the shooter recoils in\nplace while a separate arrow overlay travels the full distance to the\ntarget tile, and the hit/settle callbacks fire the instant the arrow\narrives (there's no \"return stroke\" to wait out the way a lunge has).\n`'shoot'` is itself shooter/target-agnostic for the same forward-\ncompatibility reason as `resolveRangedLine` — a future enemy-fired arrow at\nthe player would reuse the identical animation kind.\n\nIn every one of the four outcomes above, the equipped bow's\n`durability.current` decrements by 1 (`bow.ts`'s `tickEquippedBowOnFire`,\nmirroring `weapon.ts`'s `tickEquippedWeaponOnSwing`) — the shot is spent the\ninstant it's loosed, not only when it lands.\n\n### 3 — Interaction with movement and other actions\n\nThe player never moves during a fired shot — this is deliberately the same\n\"bump without moving\" contract Ninjack already uses for interactable tiles\n(doors, trees, NPCs — see CLAUDE.md's `Tile.movable`/`Tile.interactable`\nsplit), just triggered by a dedicated button instead of a bump. A fired shot\nreuses the same `'full'`/`'partial'`/`'terminal'` turn-resolution dispatch\n`move()` already runs for a melee bump-attack — `executeBowFire` always\nreturns `'full'`, so snake AI moves, the enemy\nanimation phase, and the save/button-state tail all run exactly once,\nunchanged from a normal move.\n\n---\n\n## Edge Cases\n\n| Situation | Behaviour |\n|---|---|\n| Fire tapped with no bow equipped | `#bow-button` isn't rendered at all — not reachable |\n| Aim mode entered, then Fire tapped again (no direction chosen) | Cancels aim mode, no shot fired, no durability cost |\n| Bow unequipped mid-aim (e.g. via the inventory screen, which stays reachable while aiming) | `move()` clears `state.aiming` defensively and falls back to normal movement instead of firing with nothing equipped |\n| Shot's line immediately blocked (adjacent tile is a wall) | Shot resolves at range 1, hits the obstacle, still consumes durability |\n| Enemy standing exactly `range` tiles away | Still hit — `range` is inclusive of the bow's own maximum tile |\n| Enemy standing `range + 1` tiles away | Not reachable — shot misses, travels the full `range` and stops |\n| Bow's durability breaks on this shot | Shot resolves fully first (obstacle/hit/miss all still happen), bow is destroyed immediately after per `drops-core.md`'s universal rule — same ordering as every other gear type |\n| Player fires into a tile occupied by another entity | It takes the hit like any other occupant — `getOccupant` doesn't distinguish hostility, matching how melee bump-attacks already treat any live occupant as a valid target. Ninjack has no hostility/faction concept anywhere, so this is a deliberate, decided behavior, not a gap. |\n\n---\n\n## Open Questions\n\nEverything about *player* aiming/firing above is implemented and settled.\nWhat's deliberately still open — all of it scoped to a future\nranged-attacking mob, not to anything above:\n\n- **Targeting AI**: how does a mob decide to fire vs. chase each turn? This\n  needs new decision logic beyond the existing `wait`/`chase`/`random`/\n  custom move types (`aiPattern.ts`) — checking alignment with the player\n  and an unobstructed `resolveRangedLine` result before choosing to move at\n  all.\n- **Kiting/distance-keeping**: should a ranged mob back away from an\n  adjacent player to stay at range, rather than only firing when already\n  aligned? New AI behavior, not just new attack logic.\n- **Which species gets this**: no ranged `EntityDef` exists today\n  (`entityDefs.ts`) — a new snake variant, a new species, or a retrofit\n  onto an existing mob are all open.\n- **Passability while ranged**: does a ranged-only mob still count as\n  `canAttack: true` for `isMoverBlockedAt`'s \"blocks other movers, not the\n  player\" rule, even though its actual attack never needs adjacency?\n\nNo separate arrow/ammo item exists — the bow's own durability is the only\nconsumed resource (see `drops-core.md`'s Open Questions). Adding ammo later\nwould mean gating firing on an ammo count in addition to durability.\n",we=`# 🍎 Food Drops

## Overview

Food item stats — a rarity-rolled \`FOOD\` category built on
\`drops-core.md\`'s shared engine (\`scripts/food.ts\`'s \`rollFood\`). What the
fullness meter itself does (drain rate, the starving penalty, and eating's
effect on both) is \`fullness-system.md\`'s concern (\`scripts/fullness.ts\`);
this doc defines what a dropped food item *is*: how much fullness it
restores and how it affects fullness's drain rate afterward. Food carries
no durability — once picked up it stays in the bag until eaten, with no
per-turn decay.

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base range and multiplier

| Stat | Base range (at rarity 1) | Direction | Rolled range at rarity 100 |
|---|---|---|---|
| Fullness restored | 30 – 45 | up | 66 – 99 |

\`minMult\` / \`maxMult\`: **0.8 / 2.2** — a narrower spread than gear's
4.0–5.0.

A dropped food's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup — a rarity-97 item displays
"Legendary Food" 🍎 in orange; there's no food-specific flavor name (no more
"Berry"/"Bread"/"Meat"/"Feast") layered on top.

A higher rarity roll is strictly better here, same as any other gear
category: more fullness restored.

Food previously also rolled a \`rateMultiplier\`/\`slowDownDuration\` pair that
temporarily scaled down the fullness meter's drain rate after eating. That
mechanic is gone — it made drain ticks land on fractional fullness values
(e.g. \`99.2\`) for as long as the slow-down window was active, which the HUD
had no way to display faithfully (see \`fullness-system.md\`'s integer-only
note). Food now does exactly one thing: restore fullness.

### 2 — Eating

Eating (the inventory screen's shared Consume button — \`scripts/inventoryScreen.ts\`'s
\`handleConsume\`, its \`CONSUME_HANDLERS.food\` entry, see \`inventory-system.md\`)
adds \`hungerRestored\` to the fullness meter (\`fullness-system.md\`),
immediately, clamped at the meter's ceiling of \`FULLNESS_MAX\` — eating never
overfills past full.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Eating when fullness is already at/near \`FULLNESS_MAX\` | \`hungerRestored\` still adds but the meter clamps at its ceiling — no waste-detection, no partial-refusal to eat |
| Food sitting uneaten in a bag for a long time | No effect at all — food has no durability/spoilage, so it stays exactly as rolled until eaten or dropped |

---

## Open Questions

- Whether cooking, combining, or otherwise transforming food is in scope at
  all — this doc assumes not; every food tier is a distinct drop, never
  crafted from another.
`,Te=`# 🧪 Healing Potion Drops

## Overview

Healing potion item stats — a rarity-rolled \`'potion'\` category built on
\`drops-core.md\`'s shared engine (\`scripts/healingPotion.ts\`'s
\`rollHealingPotion\`). What the heal-over-time mechanic itself does (ticking,
refreshing on a second drink) is \`scripts/heal.ts\`'s concern; this doc
defines what a dropped healing potion *is*: how strong a per-turn heal it
delivers and for how many turns. A healing potion carries no durability —
once picked up it stays in the bag until drunk, with no per-turn decay.

\`HEALING_POTION\` was named \`HEART\` until this doc's own category was added —
save data persists a tile's numeric \`id\` (\`tileIds.ts\`), never its \`type\`
string, specifically so a rename like this one can never orphan an item
already sitting in an existing save.

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base ranges and multiplier

| Stat | Base range (at rarity 1) | Direction | Rolled range at rarity 100 |
|---|---|---|---|
| Heal %/turn | 0.08 – 0.14 | up | 0.20 – 0.35 |
| Duration | 3 – 6 turns | up | 7.5 – 15 turns |

\`minMult\` / \`maxMult\`: **0.8 / 2.5** — every stat scales up together, so a
higher rarity roll is strictly better on both axes: a stronger per-turn heal
sustained for more turns, never a tradeoff between the two. The "at rarity
100" column shows what the underlying \`rollStat\` curve is capable of, for
reference — see the pin below for why a real drop never actually reaches it.

**\`HEALING_POTION\` is pinned to Common rarity via its own \`PotionDef.rarityOverride\`
(\`scripts/potions.ts\`)**, the same treatment \`SPEED_POTION\` gets (see its own
doc). For healing this is less about scaling headroom (Heal %/turn and
Duration are a real two-axis curve, unlike Speed's single stat) and entirely
about the identify-by-use ambiguity (\`inventory-system.md\`): \`HEALING_POTION\`
and \`SPEED_POTION\` share one glyph and read as the same generic "Common
Unidentified Potion" until identified, and a dropped item's rarity
name/color/glow is the one
other signal visible before that — if Healing could roll up to Legendary
while Speed stayed pinned to Common, a Legendary-glowing potion would be a
free tell for which one it was, with no identification needed. Pinning both
closes that leak. Deleting the \`rarityOverride: 'Common'\` line is still the
entire change needed to let it roll normally again, if the ambiguity design
is ever revisited.

A dropped potion's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup — every Healing Potion
displays "Common Healing Potion" 🧪 today, for the reason above; there's no
flavor name (no "Minor"/"Greater"/"Superior") layered on top.

### 2 — Drinking

Drinking (the inventory screen's shared Consume button — \`scripts/inventoryScreen.ts\`'s
\`handleConsume\`, its \`CONSUME_HANDLERS.potion\` entry, see \`inventory-system.md\`)
sets this exact instance's own rolled \`healPercentPerTurn\`/\`healDuration\` as
the player's one active \`HealEffect\` (\`scripts/heal.ts\`, \`state.ts\`'s
\`#healEffect\`) — a heal-over-time effect, not an instant restore. The
first tick fires immediately (drinking should feel immediate, not like it
silently did nothing until the following turn); the remaining
\`healDuration - 1\` ticks land one per turn afterward, each restoring
\`ceil(maxHealth * healPercentPerTurn)\` health (\`constants.ts\`'s
\`percentOfMaxHealth\`, rounded up per CLAUDE.md's "combat numbers are
integers, rounded up"), clamped at \`maxHealth\`.

**Only one \`HealEffect\` can ever be active — drinking a second potion always
fully replaces the first, never stacks alongside it.** There's no summing
and no "the stronger one wins": the new potion's own \`healPercentPerTurn\`/
\`healDuration\` simply overwrite whatever was ticking, even if that means a
weaker, shorter potion cutting a stronger one's remaining duration short.
Because drinking always fires an immediate tick (see above), chain-drinking
several potions with no move in between still delivers one real heal burst
per potion drunk — each tick just sees whichever potion's own values are
currently active at that moment, not a running total of everything drunk so
far. (This replaced an earlier "true multi-effect queue" design where
multiple drunk potions ticked independently and summed their heals every
turn — simplified since a player-facing "which of my several potions is
still active, and for how long" was more bookkeeping than it was worth,
especially with no HUD element ever surfacing the count.)

While the one \`HealEffect\` is active (\`turnsLeft > 0\`), the ❤️‍🩹 status icon
(\`constants.ts\`'s \`HEAL_STATUS_ICON\`) shows stacked at the health bar's own
icon position (\`scripts/statusEffects.ts\`, \`ui.ts\`'s \`updateStatusEffects\`)
— the same shared stacking badge row \`SPEED_POTION\`'s own 💗 status icon
uses (see its own doc), so a heal and a haste both active at once show as
two overlapping hearts next to the plain ❤️, not two separate indicators.

---

## Placement

Unlike weapon/armor/etc., a healing potion is never held by a mob's own
\`startingLoot\` table (\`entityDefs.ts\`'s \`SNAKE_DEF\`/\`RAT_DEF\` dropped their
old flat-heal entries entirely, folding that percentage into "nothing"
rather than gold). The only source is a dungeon floor's own free room tiles:
\`dungeonGen.ts\`'s \`placeFreeTileDrops\` rolls every free interior room tile
(after chute/hole/enemy spots are already placed) as 80% nothing / 10% gold
/ 10% item, and \`'potion'\` is one of the equally-weighted item categories
(\`food\` is weighted double — see \`EQUIPMENT_CATEGORY_WEIGHTS\`) — so a
healing potion turns up noticeably more reliably per floor than any single
piece of equipment, which is diluted across six categories, while still
being rarer than gold.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Drinking a potion while already at \`maxHealth\` | The immediate tick still fires, but \`applyHeal\` clamps at \`maxHealth\` — no waste-detection, no refusal to drink |
| Drinking a second, weaker potion while a stronger one is still ticking | The weaker potion's own values fully replace the stronger one's — its remaining duration/potency is simply gone, not preserved or summed (see "Drinking" above) |
| A potion sitting undrunk in a bag for a long time | No effect at all — a healing potion has no durability/spoilage, so it stays exactly as rolled until drunk or dropped |
| Renamed \`HEART\` → \`HEALING_POTION\` and an old save with a \`HEART\` item | Discarded rather than misloaded — \`SAVE_VERSION\` was bumped alongside the id-based persistence migration, same "discard old saves rather than misinterpret them" treatment every prior version bump uses |

---

## Open Questions

- Whether a "Greater"/flavor-name tier ever gets layered on top of the
  shared rarity-tier name, the way food's old fixed names ("Berry"/"Bread")
  used to before that was dropped in favor of the shared tier lookup — this
  doc assumes not, matching food-drops.md's own precedent.
`,Ee=`# 💗 Speed Potion Drops

## Overview

Speed potion item stats — a rarity-rolled \`'potion'\` category built on
\`drops-core.md\`'s shared engine (\`scripts/speedPotion.ts\`'s
\`rollSpeedPotion\`). What the haste mechanic itself does (ticking, refreshing
on a second drink, granting the extra move) is \`scripts/speed.ts\`'s concern;
this doc defines what a dropped speed potion *is*: how many turns its haste
lasts. A speed potion carries no durability — once picked up it stays in the
bag until drunk, with no per-turn decay.

\`SPEED_POTION\` deliberately reuses \`HEALING_POTION\`'s own display glyph
(\`constants.ts\`) — the two are meant to be indistinguishable on sight or on
the ground; see \`inventory-system.md\`'s "Potion identification" section for
how a potion's real name/stats only reveal once that *type* has actually
been drunk once this run.

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base range and multiplier

| Stat | Base range (at rarity 1) | Direction | Rolled range at rarity 100 |
|---|---|---|---|
| Duration | 3 – 6 turns | up | 7.5 – 15 turns |

\`minMult\` / \`maxMult\`: **0.8 / 2.5** — same shared range as every other
rarity-rolled stat (\`dropsCore.md\`'s \`rollStat\`).

Unlike the healing potion, a speed potion has only this one rolled stat —
the number of moves granted per turn (\`constants.ts\`'s
\`SPEED_POTION_MOVES_PER_TURN\`, currently **2**) is a flat, non-rarity-scaled
constant, since "moves per turn" has no meaningful rarity axis to scale
along (a rarity-100 roll would either need to grant 3+ moves, which is a
much bigger design change than tuning a number, or leave the stat
untouched — neither is "scale it up a bit" the way duration can).

**\`SPEED_POTION\` is pinned to Common rarity via its own \`PotionDef.rarityOverride\`
(\`scripts/potions.ts\`)** — for now it always rolls at exactly Common,
regardless of dungeon floor or any forced tier a caller passes in. Two
independent reasons stack here: first, the identify-by-use ambiguity
(\`inventory-system.md\`) — \`HEALING_POTION\` (pinned alongside it, see its
own doc) shares one glyph and generic "Common Unidentified Potion" label
with this one until identified, and letting either roll a visibly
different rarity tier would
leak which potion it is before identification ever happens; second,
because there is currently only one rolled stat (Duration) and no second
axis to trade against, letting Speed alone roll normal higher-rarity tiers
would just mean "always roll the best possible Duration," which isn't an
interesting scaling curve yet. Deleting the \`rarityOverride: 'Common'\` line
in \`POTION_DEFS\` is the entire change needed to let it roll normally later,
once both of those are revisited together (unpinning just one potion while
the other stays pinned would reintroduce the same rarity-tell leak).

A dropped potion's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup, same as every other
rarity-rolled item — a Speed Potion always displays as "Common Speed
Potion" today, for the reasons above.

### 2 — Drinking

Drinking (the inventory screen's shared Consume button — \`scripts/inventoryScreen.ts\`'s
\`handleConsume\`, its \`CONSUME_HANDLERS.potion\` entry, see \`inventory-system.md\`)
sets this exact instance's own rolled \`speedDuration\` as the player's one
active \`SpeedEffect\` (\`scripts/speed.ts\`, \`state.ts\`'s \`#speedEffect\`) — a
haste-over-time effect, not an instant burst. Unlike a healing potion,
**no tick fires immediately on drink**: the move that already happened
this turn can't retroactively become a bonus move, so an immediate tick
would just silently discard one turn of duration for no benefit. The full
\`speedDuration\` turns are all still ahead of the player from the moment
they drink it.

**Only one \`SpeedEffect\` can ever be active — drinking a second potion
always fully replaces the first with the new potion's own \`speedDuration\`,
never stacks alongside it or extends it.** Drinking a short potion while a
long one is still running simply cuts the remaining haste down to the short
one's own duration; there's no "keep whichever is longer." (This replaced
an earlier "true multi-effect queue" design where multiple drunk potions
each ticked down independently — since haste itself was never additive in
strength anyway (only one "am I hasted" check ever runs), the only thing
multiple effects ever bought was extending total remaining duration, which
a plain refresh-on-drink achieves just as well with far less state to
track.)

While the one \`SpeedEffect\` is active (\`turnsLeft > 0\`,
\`scripts/speed.ts\`'s \`isSpeedActive\`), the player gets
\`SPEED_POTION_MOVES_PER_TURN\` moves per turn instead of one, and the
💗 status icon (\`constants.ts\`'s \`SPEED_STATUS_ICON\`) shows stacked at the
health bar's own icon position (\`scripts/statusEffects.ts\`, \`ui.ts\`'s
\`updateStatusEffects\`) — the same shared stacking badge row
\`HEALING_POTION\`'s own ❤️‍🩹 status icon uses (see its own doc), so a haste
and a heal both active at once show as two overlapping hearts next to the
plain ❤️, not two separate indicators.

**The bonus move is a second, independently-chosen player input, never a
forced repeat of the first direction.** \`player.ts\`'s \`move()\` still consumes
the turn (fullness/heal/speed all tick, \`consumeTurn()\`) on the player's
first action same as any other turn; if that action fully completed
(\`shouldGrantBonusMove\`'s \`'full'\` check — waiting and firing a bow never
earn a bonus) and speed is active, \`move()\` sets a pending-bonus flag,
re-enables the buttons, and returns *without* running the enemy phase yet —
mobs haven't seen this turn at all. The very next button press (any
direction the player chooses, or the center 'wait' button to skip the bonus
outright) is dispatched as that second action instead of starting a new
turn, and only then does the enemy phase run. This is deliberately not "the
same direction twice": a haste effect that could only ever repeat whichever
way you were already moving would be far less useful than one letting you,
say, step diagonally-equivalent (one step right, one step down) or attack
two different adjacent tiles in one turn.

---

## Placement

Unlike weapon/armor/etc., a speed potion is never held by a mob's own
\`startingLoot\` table. The only source is a dungeon floor's own free room
tiles: \`dungeonGen.ts\`'s \`placeFreeTileDrops\` rolls every free interior
room tile (after chute/hole/enemy spots are already placed) as 80% nothing
/ 10% gold / 10% item, and \`'potion'\` is one of the equally-weighted item
categories (\`food\` is weighted double — see \`EQUIPMENT_CATEGORY_WEIGHTS\`).
Which specific potion an \`'item'\` roll that lands on \`'potion'\` actually
becomes is a second, inner weighted pick across \`scripts/potions.ts\`'s
\`POTION_DEFS\` (\`HEALING_POTION\`/\`SPEED_POTION\`, both weight 1 today) — so a
speed potion shows up roughly as often as a healing potion, both sharing
the single \`'potion'\` category's overall drop rate.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Drinking a potion while already hasted | The new potion's own \`speedDuration\` fully replaces the old effect's remaining turns — never summed, never "keep whichever is longer" (see "Drinking" above) |
| A potion sitting undrunk in a bag for a long time | No effect at all — a speed potion has no durability/spoilage, so it stays exactly as rolled until drunk or dropped |
| Waiting (\`data-dir="wait"\`) while hasted | Still counts as a turn for \`tickSpeed()\` — haste ticks down on every real turn, not only on turns where the player actually moved twice |

---

## Open Questions

- Whether \`rarityOverride: 'Common'\` is ever lifted for both potions
  together — a second stat axis (or a deliberately-tuned curve for
  Duration alone) for Speed, plus revisiting the identify-by-use ambiguity
  tradeoff for Healing — see "Base range and multiplier" above.
`,De=`# 🎒 Backpack Drops

## Overview

A rarity-rolled \`BACKPACK\` category built on \`drops-core.md\`'s shared
engine — the item type that actually enables the carrying-capacity system
described in \`inventory-system.md\`. There is no capacity concept anywhere in
the game today (\`state.swords\`/\`gold\`/etc. are unbounded counters);
backpacks are what make "how much can I carry" a real, limited resource for
the first time.

---

## Behavior

*Tune every number below live, with a floor/tier-weight preview and a Copy-as-JSON export, in the [Drop Tables Tuner](#drop-tables-tuner).*

### 1 — Base ranges and multiplier

| Stat | Base range (at rarity 1) | Direction |
|---|---|---|
| Capacity | 1 – 2 | up |
| Durability | 20 – 30 | up |

\`minMult\` / \`maxMult\`: **0.8 / 4.0** — a rarity-100 backpack rolls capacity
in \`4–8\` (\`round()\`ed to a whole slot count, then clamped to the hard
per-bag ceiling of **8 slots**) with durability in \`80–120\`. Capacity is a
rolled, rarity-scaled stat like every other category's power stat now — not
a fixed per-band value the way bow's \`range\` is — since a whole-number
rounding step already gives it the small discrete feel a UI needs without
sacrificing "best backpacks are also the sturdiest," the same "no forced
trade-off" property \`weapon-drops.md\`/\`armor-drops.md\` establish.

A dropped backpack's display name/color/glow comes entirely from
\`drops-core.md\`'s shared \`RARITY_TIERS\` lookup — a rarity-97 item displays
"Legendary Backpack" 🎒 in orange; there's no backpack-specific flavor name
(no more "Pouch"/"Satchel"/"Rucksack"/"Expedition Pack") layered on top.

**Starting equipment**: a new run begins with a backpack already equipped
into Bag 1 — capacity is set directly to 3 (bypassing the usual roll, so
every run starts identically) at a fixed rarity of 38 (Uncommon), with
durability rolled normally from that same rarity, breakable, unequippable,
swappable, exactly like any backpack found later. This replaces the older
permanent-indestructible-"pockets"-slot design (\`inventory-system.md\`) with
something simpler — only capacity is special-cased for a predictable start;
everything else is just an ordinary roll from the same engine, not a special
exception with its own
rules.

### 2 — What counts as a "use"

Backpacks don't hold or track which items are "in" them (\`inventory-system.md\`
— equipping one just grows a shared capacity pool), so there's no
"item added to/removed from this bag" event left to tick durability on.
Instead, an equipped backpack takes wear the same way armor does
(\`armor-drops.md\`'s "every time \`handleDamage\` actually reduces a hit"
trigger): **whenever the player takes a hit** (any \`handleDamage\` call that
applies incoming damage \`> 0\`), \`BACKPACK_HITS_PER_TAKEN_HIT\` (default \`1\`)
randomly-chosen *currently-equipped* backpacks (Bag 1-4, whichever tiles
have one equipped) each lose 1 \`durability.current\` — distinct backpacks
only, never the same one twice in one hit. If fewer than
\`BACKPACK_HITS_PER_TAKEN_HIT\` backpacks are equipped, every equipped one
takes the hit instead; with zero equipped, nothing happens. This runs
alongside armor's own always-ticks-if-equipped rule, not instead of it — a
single hit can tick armor's durability and one or more backpacks'
durability in the same \`handleDamage\` call. A **loose** backpack (rolled but
not yet equipped into a Bag N tile) never takes wear, matching
\`weapon-drops.md\`'s existing "the spare's durability does not tick" rule for
unequipped gear of any category. At 0, the backpack itself is destroyed per
\`drops-core.md\`'s universal rule.

### 3 — Contents on destruction (a pool shrink, not a per-bag spill)

When an equipped backpack's durability reaches 0, it stops contributing its
capacity to the shared pool (\`inventory-system.md\`), and the pool shrinks by
that amount immediately. If the player is currently holding more items than
the new, smaller pool has room for, the excess — however many items no
longer fit — are dropped one at a time on the player's current ground tile;
every item that still fits simply stays exactly where it was, since there's
only one pool and no "which bag do I move it into" step anymore. This is
strictly simpler than the old per-bag spill proposal it replaces, and
resolves that proposal's open question by construction: unequipping
(rather than destroying) a backpack follows the identical rule, so it's
never blocked — the same "drop whatever no longer fits" behavior applies
either way.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Backpack destroyed while the player holds fewer items than the shrunken pool's new size | Nothing drops — the pool is just smaller now, with room to spare |
| Backpack destroyed while the player holds more items than the shrunken pool's new size | The excess items (however many no longer fit) drop to the ground tile the player is currently standing on; everything else stays put |
| Player unequips a backpack (not destroyed, just removed) mid-run | Same pool-shrink rule as destruction applies — never blocked, since there's no "relocate to another bag" step to fail |
| Fewer than \`BACKPACK_HITS_PER_TAKEN_HIT\` backpacks are currently equipped when the player takes a hit | Every currently-equipped backpack takes 1 durability tick instead of a random subset |
| Zero backpacks equipped when the player takes a hit | No backpack durability tick happens (armor, if equipped, still ticks per its own rule) |
| A backpack is rolled but never equipped | Its durability never ticks — same "spares don't wear down" rule \`weapon-drops.md\` already establishes |

---

## Open Questions

- \`BACKPACK_HITS_PER_TAKEN_HIT\` is proposed at \`1\` ("likely 1" per the
  design discussion this section was written from) but isn't yet tuned
  against actual hit frequency/backpack durability ranges — worth revisiting
  once combat pacing is playtested, the same way any other balance constant
  would be.
- Whether the "N random distinct backpacks" pick should weight toward
  lower-durability backpacks (so a nearly-broken bag is more likely to be
  the one that finally breaks) or stay uniform-random across whichever bags
  are currently equipped — left as a balance call, not a correctness one.
`,Oe=`# 🎒 Inventory System

## Overview

The screen that ties every other item-variety doc together. Today,
"inventory" is three flat \`GameState\` counters (\`gold\`, \`swords\`,
\`currentKeys\`/\`currentChutes\`) displayed as read-only HUD text
(\`ui.ts\`'s \`updateGoldDisplay\`, \`#inventory\` div — see CLAUDE.md's Dynamic
Strings section for \`hud.inventory\`). This doc replaces that with a real
inventory screen: an **equip section** (weapon/armor/bow — worn gear
providing passive bonuses — plus 4 backpack-equip tiles, since a backpack is
worn gear too) sitting above **4 equippable bag slots** (general carrying
capacity, 0 to 32 total slots depending on which backpacks are equipped),
opened as a tap-driven box in the D-pad's own screen slot rather than a
full-screen overlay (see "Screen & navigation" below). There is no separate
"pockets" concept — a new run simply starts
with a 3-capacity backpack already equipped into Bag 1, an ordinary
\`BACKPACK\` instance like any other, not a special indestructible slot. Per
the user's explicit decision, gold/keys/chutes fold into this same system as
ordinary inventory items rather than staying separate counters — though for
now, only gold actually stacks (see "Stacking rules" below). There is no
\`WALLET\` equip category — gold was briefly pulled out into its own real
capped counter bounded by one, but that system has been removed; gold is
back to being an ordinary, stacking pool item like any other.

---

## Behavior

*Tune the bag-count/capacity numbers live, with a total-capacity calculator and a Copy-as-JSON export, in the [Inventory Screen Prototype](#inventory-ui).*

### 1 — Equip section

Pinned at the top of the inventory screen, seven fixed slots: \`weapon\`,
\`armor\`, \`bow\` (see \`weapon-drops.md\`/\`armor-drops.md\`/\`bow-drops.md\`), then
four more — one per equippable bag slot (Bag 1-4 below). A backpack is worn
gear exactly like a weapon or a suit of armor, so it equips the same way and
lives in the same row, just visually grouped separately from the
weapon/armor/bow trio. Each of the seven holds at most one item: the
weapon/armor/bow slots provide a passive effect (melee damage, damage
reduction, ranged-fire capability) only while equipped; a Bag N slot
contributes that backpack's capacity to the shared content pool (see below)
only while a \`BACKPACK\` is equipped there. Equip slots are **not** counted
against bag capacity;
equipping an item moves it out of whichever bag slot held it (freeing that
slot) into its equip slot, and unequipping does the reverse (fails if no bag
slot has room — see Edge Cases).

### 2 — Bag slots (a capacity pool, not per-bag storage)

Bags do not hold or track which items are "in" them — there is no per-bag
list of contents anywhere in this design. Instead, the player has **one
flat pool of content slots**, and equipping/unequipping a backpack simply
grows or shrinks that pool's total size. There is no baseline/permanent
slot outside this pool — **4 equippable bag slots** (Bag 1-4, in the equip
section above) are the *only* source of capacity: each contributes 0 slots
to the pool until a \`BACKPACK\` item (\`backpack-drops.md\`) is equipped into
its tile, at which point it contributes whatever capacity (1-8) that
backpack rolled — 8 is a hard per-bag ceiling, not just a typical roll.
Unequipping or destroying it removes that contribution again, same as any
other bag.

Total inventory capacity = the sum of Bag 1-4's equipped backpacks'
capacities, ranging from **0** (nothing equipped — theoretically possible if
every bag has been lost, though a fresh run never starts here) up to **32**
(4×8, all four bags equipped with max-capacity backpacks). A new run starts
with Bag 1 already holding a fixed-capacity-3 starter backpack (not
randomly rolled, so every run begins identically) — an ordinary,
destructible \`BACKPACK\` instance, equipped exactly the way a later-found one
would be.

When the pool shrinks (a backpack is unequipped or destroyed) below the
number of items currently held, the items that no longer fit are dropped on
the player's current ground tile — see \`backpack-drops.md\`'s "Contents on
destruction" for the exact rule. Every item that *does* still fit simply
stays exactly where it was; there is no "which bag do I move it into" step,
since there's only ever one pool.

### 3 — Stacking rules

**For now, only gold stacks — everything else is one instance per slot.**

- **Gold** stacks up to \`GOLD_STACK_LIMIT\` (\`999\`) per slot — picking up
  gold first tops off any existing under-999 gold stack(s) (in slot order),
  and only once every existing stack is full does the remainder start a new
  gold stack in the next open slot. A large enough pickup can create several
  full 999-stacks plus one partial one, exactly the way stacking in any
  slot-based inventory works once a stack has a cap.
- **Keys and chutes do not stack** — each pickup is its own slot, same
  treatment as a Sword or a Berry. This replaces the old capped-at-1
  \`giveKey\`/\`giveChute\` counters with real, individually-slotted inventory
  items rather than a merged count; carrying 3 keys means 3 separate slots,
  not one slot reading "3." A door still only ever needs 1 key to unlock.
- **Weapons, armor, bows, backpacks, and food do not stack** — each rolled
  instance has its own \`durability\`/stats (\`drops-core.md\`), so two Swords
  are two separate slots even if their rolled stats happen to be identical.

Whether keys/chutes (or anything else) should ever stack is left open — see
Open Questions. \`GOLD_STACK_LIMIT\` itself is settled at \`999\`, not open.

**This is the one stacking rule for every path an item can enter the
player's inventory** — not just a direct ground pickup. Loot boxes
(\`docs/snake-inventory-loot-ui.md\`) and gravestones (\`CLAUDE.md\`'s "Save
Slots & Run Persistence Model") both funnel their contents through the same
\`scripts/lootBox.ts\` path (\`absorbGroundItem\`) — there is no separate "box
merge" and "gravestone merge" to reconcile. A gold entry found in either
tops off/starts pool stacks exactly like this rule describes, same as any
other gold pickup; everything else lands one instance per slot, exactly
like a direct pickup.

### 4 — Screen & navigation

Tapping the dedicated \`#inventory-button\` (🎒, bottom-right corner) opens
the real screen, implemented in \`scripts/inventoryScreen.ts\`. This button
lives in \`#hud-corner\` — a shared, self-stacking fixed-position container
(\`index.html\`/\`styles.css\`) that \`scripts/minimap.ts\`'s \`#minimap\` also
appends into once a dungeon chunk is entered, so the button always renders
directly above the minimap without either one needing hardcoded pixel
offsets tuned against the other. The top-bar \`#inventory\` strip (gear/
keys-or-chutes/gold readout, computed off the same pool) stays exactly
where it already was, purely as a passive display — it is not a tap
target.

The strip's gear readout (\`ui.ts\`'s \`buildGearText\`) shows one \`icon+stat\`
chunk per equipped single-slot gear class — 🗡 weapon damage, 🏹 bow damage,
🥋 armor rating, 🛡️ shield defense — plus a 🎒 chunk for total pool capacity
(\`inventory.ts\`'s \`poolCapacity\`, summed across Bag 1-4, not per-slot, since
capacity is one shared pool). Each chunk is driven by one shared
\`GEAR_DISPLAY\` config array keyed by \`EquipSlotKey\` (CLAUDE.md's "Unify by
data, not by call site") rather than a hand-written variable per gear class,
so a future single-slot equip category only needs one more config entry, not
another call site. A gear class that isn't equipped (or a capacity of 0)
shows nothing at all, the same "no permanent \`icon0\`" rule the weapon
readout always had.

The screen itself does **not** use a full-screen overlay or a D-pad cursor
— instead it reuses \`dialogue.ts\`'s exact pattern: a fixed-position box
occupies the D-pad's own screen slot, \`#controls\` is hidden entirely for as
long as the box is open (\`body.inventory-active #controls { display: none;
}\`, mirroring \`body.dialogue-active\`), and every interaction is a plain
tap, since a touchscreen doesn't need a cursor to reach an on-screen
element it can tap directly.

Layout, top to bottom (\`.inventory-box\` in \`styles/styles.css\`):

\`\`\`
┌─ Ground window (see ground-pickup.md §3) ────────────────────┐
│  Ground                                          [Take All]   │
│   [🗡] [ ]                                                     │
└────────────────────────────────────────────────────────────────┘
┌─ Inventory window (.inventory-box) ──────────────────────────┐
│  Equipped                                                      │
│   [🗡 —] [🥋 —] [🏹 —] │ [🎒 Satchel] [🎒 —] [🎒 Rucksack] [🎒 —] │
│    weapon armor bow    │   bag 1        bag 2       bag 3     bag 4
│  Items 6/10                                                     │
│   [💰 42] [🔑] [🔑] [ ] [ ] [ ] [ ] [ ] [ ] [ ]                  │
│                                                                  │
│  Tap an item, then tap where to put it                          │
│         [ Drop ]      [ Close ]                                 │
└────────────────────────────────────────────────────────────────┘
\`\`\`

Weapon/armor/bow are permanently-empty placeholder tiles today — those
categories have no real item shape yet (weapon-drops.md/armor-drops.md/
bow-drops.md's own scope, deliberately not invented here). Only Bag 1-4 are
ever fillable. The pool grid below the equip row is one flat,
top-left-justified grid — no per-bag sections — sized to exactly the sum of
Bag 1-4's equipped backpacks' capacities, growing/shrinking on the spot as
backpacks are equipped/unequipped/destroyed.

A separate **Ground window** opens alongside this Inventory window,
stacked directly above it, whenever the current *ground source* — always
the player's own tile now, including one they've bumped a BOX/GRAVE onto
(see \`ground-pickup.md\` §4) — has anything in it. See
\`ground-pickup.md\` §3, which owns that window's entire existence,
structure, stacking mechanism, and content; this doc only owns the
Inventory window's own layout below (equip row, pool grid, Drop/Close),
which is unchanged by that addition. Holding any item anywhere across
either window opens an inspect popover with its stats and, for
weapon/armor/bow, a compare-to-equipped block — see \`ground-pickup.md\` §5.

**Interaction is tap-to-pick-up, tap-to-drop**, not drag-and-drop and not a
D-pad cursor:
- Tap any occupied slot to "hold" it (it gets a highlighted border and the
  status line reads "Holding 🎒 — tap a slot to place it"). Tap the same
  slot again to cancel.
- With something held, tap a destination slot to complete the move:
  tapping a Bag 1-4 equip tile with a held backpack equips it there
  (swapping if that bag slot already held one, or displacing the old
  backpack back to an open pool slot); tapping an equipped bag tile first
  and then a pool slot unequips it there; tapping one pool slot then
  another swaps their contents. A move that would shrink the pool below
  the very slot being interacted with is rejected outright (a capacity
  pre-check, not a silent drop) — see \`equipBackpackFromPool\`/
  \`unequipBackpackToPool\` in \`scripts/inventory.ts\`.
- Any capacity loss that *does* go through (destroying/unequipping a
  backpack while the pool is otherwise full) relocates displaced items to
  open slots where possible and reports how many didn't fit as "spilled to
  the ground" in the status line — see \`resizePool\`'s \`droppedCount\`.
- **Drop** places the currently-held item on the ground at the player's
  feet (\`lootBox.ts\`'s \`placeItem\`) and clears the pool slot. **Close**
  restores \`#controls\`, saves, and re-enables input.

Opening the screen, tapping around, and browsing cost no game turn — the
world is paused while it's open (\`disableButtons()\`/\`enableButtons()\`,
same as any other modal); only an actual equip/unequip/drop action mutates
state, and even those aren't a "turn" in the move-counter sense.

### 5 — Potion identification ("identify by use")

\`HEALING_POTION\` and \`SPEED_POTION\` share one glyph
(\`constants.ts\`'s \`SPEED_POTION.display\` deliberately reuses
\`HEALING_POTION.display\`) and, until identified, one generic label — both
read as **"Common Unidentified Potion"** everywhere (ground tile, pool
tile, and the inspect popover's header — the "Common" prefix is the same
rarity-tier prefix every rarity-rolled item gets, \`inventoryScreen.ts\`'s
\`itemLabel\`; it's real, not a placeholder, since every registered potion is
pinned to Common rarity — see \`potions.ts\`'s \`rarityOverride\`) with no stat
rows shown at all, so there is no way to tell which one you're holding just
by looking at or tapping it.

Every potion type is one entry in \`scripts/potions.ts\`'s \`POTION_DEFS\`
table (\`PotionDef\`: \`tile\`, \`label\`, \`weight\`, an optional
\`rarityOverride\`, \`roll\`, \`drink\`, and \`stats\`) — this is the *only* place
that differentiates potion types; rolling, identification-gating, label
display, stat display, and drinking all dispatch generically off
\`getPotionDef(item.tile.type)\` rather than branching on a specific
\`TileType\`.

Drinking a potion (\`inventoryScreen.ts\`'s single Consume button —
\`handleConsume\`'s \`'potion'\` entry in its \`CONSUME_HANDLERS\` table, which
also covers FOOD's Eat action the same way; see the note at the end of
this section) looks up its \`PotionDef\`, calls \`potionDef.drink(item)\` to
apply its real effect, and then calls \`state.identifyPotion(item.tile.type)\`
— this identifies that
**TileType**, not just the one item drunk: for the rest of the current
run, every potion of that same type shows its real name and stats from
then on, in the pool, on the ground, anywhere. Identification is per-run
and permanent once set — it persists across saves (\`state.ts\`'s
\`#identifiedPotions\`, an optional/additive save field, same treatment as
\`exploredChunks\`) but resets to nothing at the start of a fresh run
(\`game.ts\`'s \`startNewGame\`/\`debugSkipToLevel\`), same as
\`state.healEffect\`/\`state.speedEffect\`.

Once identified, \`itemLabel\`/\`statsForItem\` (\`inventoryScreen.ts\`) read the
matching \`PotionDef\` directly:

| Potion | Real label | Stats shown |
|---|---|---|
| \`HEALING_POTION\` | Healing Potion | Heal (per-turn amount, \`percentOfMaxHealth(maxHealth, item.healPercentPerTurn)\`), Duration (\`item.healDuration\`) |
| \`SPEED_POTION\` | Speed Potion | Moves (\`SPEED_POTION_MOVES_PER_TURN\`), Duration (\`item.speedDuration\`) |

Each stat's \`get(item)\` reads the *rolled instance's own* fields
(\`healPercentPerTurn\`/\`healDuration\`/\`speedDuration\` — every potion is
rarity-rolled per drop, see \`healingPotion.ts\`/\`speedPotion.ts\`), not a
flat global constant — two drops of the same potion type can show
different numbers once both are identified.

\`statsForItem\` keys these off the item's own **TileType** via
\`getPotionDef\`, not its Category — \`HEALING_POTION\` and \`SPEED_POTION\`
share one \`'potion'\` Category (so they share the same Consume button/UI
path), but that's exactly why their stats can't live in the same
per-Category table (\`CATEGORY_STATS\`) every other item category uses;
each \`PotionDef.stats\` is a separate table, per \`TileType\`, consulted only
once that potion is identified.

A future third potion type follows this same shape: add one more entry to
\`POTION_DEFS\` (its \`tile\`, \`label\`, \`weight\`, \`roll\`, \`drink\`, and
\`stats\`) — nothing about the identify-by-use mechanism itself, or any
other call site that dispatches through \`getPotionDef\`, needs to change.

**Every registered potion is also pinned to Common rarity today** (each
\`PotionDef\`'s own \`rarityOverride: 'Common'\`) — originally only
\`SPEED_POTION\` had no second stat axis to scale (see its own doc), but
\`HEALING_POTION\` is pinned alongside it for a second reason specific to
this section: the two are meant to be indistinguishable before
identification (same glyph, same generic "Unidentified Potion" label), and
a rarity-driven name/color/glow would have broken that the moment one of them
happened to roll Legendary and the other didn't — a dead giveaway with no
identification needed. Deleting a \`rarityOverride\` line is still the
entire change needed to let that potion roll normally again, once this
tradeoff is revisited.

**One shared Consume button, not separate Eat/Drink buttons**: FOOD and
every potion Category are both "consumable" in the same shape (remove
from pool, apply an effect, report a message), so \`inventoryScreen.ts\`
covers both with one \`CONSUME_HANDLERS: Partial<Record<Category, (item)
=> string>>\` table and one \`handleConsume()\` — the button is enabled
whenever the selected pool item's Category has an entry in that table.
Adding a third consumable Category later is one more table entry, not a
third hand-written handler/button pair.

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Equip an item when the target equip slot is already occupied | The two swap — previously-equipped item moves to the bag slot the new item came from |
| Unequip an item when every bag slot is full | Blocked — the item stays equipped until room is freed, rather than silently overflowing or deleting it |
| Pick up an item with 0 bag slots free anywhere | Item stays on the ground/in its loot box, same "can't collect, no room" outcome as any capacity-limited pickup — this is literally what \`ground-pickup.md\`'s **Take All** button hits when the pool can't fit everything |
| Eat food directly from a bag slot | Allowed without first equipping it — food has no equip slot of its own, "Eat" is a bag-slot-only action |
| Gold count grows very large | Spills into additional pool slots as \`GOLD_STACK_LIMIT\` (999) is reached, same as any other stacking overflow — a completely full pool (every slot a maxed gold stack or something else) just can't collect more until room opens up; keys/chutes never stack at all, one slot each |
| Backpack in Bag 1-4 is destroyed (\`backpack-drops.md\`) while the screen is open | The pool immediately shrinks by that backpack's capacity; any items that no longer fit drop per \`backpack-drops.md\`'s rule and the grid re-renders at its new (smaller) size |

---

## Open Questions

- Whether keys, chutes, or any future item category should ever stack —
  deliberately deferred; gold is the only category that stacks today.
`,ke=`# 🫳 Ground Pickup

## Overview

Replaces today's automatic pickup — walking onto a \`GOLD\`/\`KEY\`/
\`HEALING_POTION\`/\`CHUTE\`/\`BACKPACK\` tile currently collects it instantly
(\`interactWithOpenTile\`'s direct-drop branch, \`scripts/player.ts:264-287\`) —
with a manual, player-driven transfer. This matters once dropped items carry
real per-instance stats (\`drops-core.md\`'s \`DroppedItemStats\`): an item
that's about to cost you one of a hard-capped 0-32 bag slots
(\`inventory-system.md\`) needs a moment where you can actually look at it —
tier, damage/armor/range/capacity, durability — before it's already in your
bag. This doc also retires the loot-box **peek strip**
(\`docs/snake-inventory-loot-ui.md\`'s two-bump preview-then-collect-everything
flow, \`scripts/lootBox.ts\`'s \`openLootBoxPeek\`/\`collectLootBox\`) in favor of
one mechanism that handles "items under your feet" and "items in a
\`BOX\`/\`GRAVE\`" identically — walking onto either just completes the move,
and 🫳 Use/🎒 (§2) are the only way to actually open either one. See §4 for
how that section's own original design (bump opens the panel directly) was
itself later superseded down to this simpler rule, and §7 for the passive
overlay that replaced bump-time feedback.

**Implemented** in \`scripts/lootBox.ts\` (\`addItemsToGround\`/\`takeGroundItem\`/
\`absorbGroundItem\`), \`scripts/inventoryScreen.ts\` (the Ground window itself),
\`scripts/player.ts\`, and \`scripts/ui.ts\`. Deliberate deviations from the
design below:

- **HEALING_POTION no longer bypasses \`state.pool\` — reverted.** An earlier version
  of this doc had HEALING_POTION (formerly named \`HEART\`) skip the pool entirely (\`drinkHealingPotion\` firing
  straight from \`absorbGroundItem\`, a single-tap pickup with no destination
  slot), on the reasoning that drinking one always fully succeeds so there
  was no meaningful slot to tap it into. That's gone now (the health-potion-
  drink-mechanic change): a HEALING_POTION must actually be *drunk* to have any
  effect, the same way a FOOD must be *eaten* — so it needs a real pool slot
  to sit in until the player presses the inventory screen's Consume button
  (\`inventoryScreen.ts\`'s \`handleConsume\`, shared with FOOD's Eat action —
  see \`inventory-system.md\`). HEALING_POTION is a
  \`NON_STACKING_ROLLED_TYPES\` member now (\`scripts/lootBox.ts\`) — one pool
  slot per unit, picked up manually via 🫳 Use/🎒 exactly like every other
  non-GOLD category, no more auto-pickup-on-walkover. (The old flat \`SWORD\`
  item used to share the original bypass too — it's gone entirely now, fully
  replaced by the rarity-rolled \`WEAPON\` category, which goes through the
  pool like any other equippable drop.)
- **The Compare-to-Equipped popover (§5) docks above the window stack**
  (\`.item-popover\`, \`styles/styles.css\`) rather than relocating *inside* the
  Ground or Inventory window's own mount point as the held selection moves
  between them — \`inventoryScreen.ts\`'s \`renderPopover()\` inserts/removes it
  as \`.inventory-window-stack\`'s own first child (always directly ahead of
  \`.ground-box\`), reusing the same DOM-order self-stacking idiom the Ground/
  Inventory boxes already share, so it visually sits right on top of
  whichever of the two is currently showing instead of floating at some
  unrelated fixed spot on screen. Otherwise matches the design below: header
  + stat rows + per-stat delta arrows against the equipped weapon/armor/bow,
  plus a compact second block for that equipped item's own stats — laid out
  as two side-by-side columns (\`.item-popover-col\`), not stacked vertically,
  so the held item and the equipped one it's being compared against are both
  visible at a glance.
- **Backpack, weapon, armor, and bow can all be equipped directly off the
  ground**, not just from the pool — tapping a held ground item, then an
  equip slot of the matching category, equips it immediately (displacing
  whatever was equipped there back onto the ground) without an intermediate
  trip through the pool first.
- **A held pool/equip/bag-equip item can be tapped directly onto a ground
  item to swap the two** — the mirror of the point above, so a full pool
  doesn't force a detour through Drop first: \`onSlotClick\`'s \`targetIsGround\`
  branch removes whatever's at that ground index, drops the held item into
  its place (preserving full rolled stats via \`placeRolledItem\`), and puts
  the displaced ground item into the slot the held item just vacated —
  equipping it there directly if it's a category match (weapon/armor/bow/
  backpack), same as a ground item dropped directly onto an equip slot. A
  category mismatch (e.g. holding a weapon, tapping a ground armor) rejects
  the swap instead of forcing an invalid equip. A held GOLD stack merges
  into the ground pile rather than swapping position-for-position — a
  fungible amount has nothing meaningful to swap back, so this one case
  behaves like Drop instead.
- **A held ground item can be tapped onto an occupied pool slot to swap the
  two**, not just an empty one — a ground WEAPON/ARMOR/BOW/FOOD/HEALING_POTION/BACKPACK
  lands in the tapped slot and whatever was already there goes back onto the
  ground, via the same \`swapGroundAndPoolSlot\` primitive the pool→ground
  direction above uses (just called with the two indices swapped — the
  operation is symmetric either way). This direction used to be missing:
  landing on an occupied non-\`GOLD\` pool slot was unconditionally rejected,
  so e.g. a ground sword could never swap for an equipped-in-the-pool sword
  even though the identical swap already worked ground↔equip-slot and
  pool↔ground. GOLD/KEY are unaffected — GOLD still uses the
  absorb-into-whatever-slot-has-room behavior described in §3's "Take All"
  paragraph (\`transferGroundItem\`), since a stackable amount has no single
  "position" to swap; ground-side gold now caps and spills at
  \`GOLD_STACK_LIMIT\` too (\`lootBox.ts\`'s \`insertStackingGroundItem\`), matching
  the pool's own rule, so neither side can ever hold an amount the other has
  no slot shape for. (HEALING_POTION used to be unaffected here too, back when
  it bypassed the pool entirely — see the Overview's deviations list — but now
  that it's a real \`NON_STACKING_ROLLED_TYPES\` pool item it swaps positionally
  like every other rolled category. CHUTE made the same move for a different
  reason: it used to merge into one ground pile with an unbounded \`count\`, the
  same way GOLD does, but the pool never stacked chutes at all —
  \`addSingleItemToPool\` gives every chute its own slot — so a ground pile
  bigger than 1 had no single pool slot it could swap into either. CHUTE is
  \`NON_STACKING_ROLLED_TYPES\` now too: one ground slot per chute, matching the
  pool's own shape, swapping positionally like any other rolled item.)
- **A \`BOX\`/non-empty \`GRAVE\` bump no longer opens the screen at all —
  superseded, see §4.** The original design below (and the first real
  implementation) had a single bump open the panel directly, using the
  bumped tile's own coordinate as the ground source. That's gone: \`BOX\`/
  \`GRAVE\` are ordinary movable ground now, same as any plain item tile —
  bumping one just completes the move onto it, and the screen only opens on
  demand via 🫳 Use or 🎒 (§2), exactly like standing on a single item. The
  ground source is therefore always the player's own current position now;
  §3's "or a bumped BOX/GRAVE's coordinate" case no longer exists.
- **A persistent item-ground overlay replaces bump-time feedback** — see §7
  (new). It's the closest thing left to the old peek strip's "something's
  here" signal, but it's passive (no interaction of its own) and appears on
  simple tile-occupancy, not on bump.
- **Ground container storage is sparse slots internally** (\`state.ts\`'s
  \`#lootBoxes\`), the same \`(InventoryItem | null)[]\` shape \`state.pool\`
  already uses — a hole left by a removal is reused by the next insert
  instead of every later item shifting index (\`lootBox.ts\`'s
  \`insertGroundItem\`/\`takeGroundItem\`, \`state.ts\`'s
  \`normalizeLootBoxSlots\`). This is purely an internal representation
  change: every external consumer — \`getLootBox\`/\`getLootBoxEntries\`, and
  every \`takeGroundItem(x, y, itemIndex)\` caller — still addresses a box by
  "the Nth real item," identical to the old tightly-packed array, via a
  dense compat view (\`state.getLootBoxSlots\` is the raw form, used only by
  \`lootBox.ts\` and nowhere else). Done in preparation for a future container
  kind (e.g. a chest) sharing the same underlying shape as ground/pool
  rather than each container kind inventing its own.

---

## Behavior

### 1 — No more auto-pickup

\`interactWithOpenTile\`'s direct-drop branch (\`player.ts:264-287\`) —
which unconditionally calls \`applyItemState\` + \`deleteLootBox\` the instant a
move lands on an item tile — is removed. Walking onto an item-holding cell
still completes the move (the cell stays \`movable: true\`, unchanged); the
items simply stay in \`state.lootBoxes\` at that cell
(\`state.getLootBox\`/\`setLootBox\`, \`scripts/state.ts:298-299\`) until the
player explicitly transfers them via the screen described below. This is the
one behavior change that makes everything else in this doc necessary — every
other section exists to give the player a way to actually collect what's now
sitting there indefinitely.

**Partially superseded**: \`GOLD\` is now a deliberate exception — walking onto
a lone gold pile auto-collects it again (\`player.ts\`'s \`tryAutoCollect\`,
\`shouldAutoCollect\`), whenever the pool has any room left for it (an
under-limit \`GOLD\` stack to top off, or an open slot to start a new one —
topping off and leaving any unabsorbed remainder on the ground when the pile
is bigger than what fits). Every other category (key/chute/weapon/armor/bow/
backpack/food/heart) still behaves exactly as described in this section.
(\`HEALING_POTION\` briefly had its own health-gated auto-collect exception here too,
back when picking one up meant drinking it instantly — see the Overview's
deviations list — but once drinking became a separate manual action, the
rationale for auto-collecting it disappeared along with the instant heal,
so it dropped back into the ordinary manual-pickup group.)

### 2 — 🫳 Use: a separate contextual button, not an icon-swap

**Superseded.** The original design here had \`#inventory-button\` (🎒) itself
swap glyph to 🫳 while standing on ground items, opening the same screen
either way. The real implementation instead adds a second, independent
button — \`#use-button\` (🫳, \`index.html\`, stacked above \`#inventory-button\`
in \`#hud-corner\`) — that only appears while
\`state.getLootBox(state.playerX, state.playerY)\` is non-empty (\`ui.ts\`'s
\`updateUseButton\`, recomputed every move the same "contextual indicator off
current position" way \`updateContextIcons()\` already does for the D-pad).
\`#inventory-button\` itself no longer changes at all — always 🎒, always opens
the plain screen via \`openInventoryScreen()\`.

Unlike the old icon-swap (which was purely an affordance — tapping always
did the same thing), 🫳 Use is a genuinely different action from 🎒
(\`scripts/inventoryScreen.ts\`'s \`handleUseButton\`):

- **Exactly one item on the ground**: try a quick pickup directly (the same
  ground → pool transfer a tap-transfer in the open screen would do). Fully
  absorbed (there was room) → done, no screen opens at all. Not fully
  absorbed (no room at all, e.g. a full pool with no open slot for a HEALING_POTION)
  → open the same Ground+Inventory screen a 🎒 tap would, showing whatever's
  left.
- **Two or more items** (a \`BOX\`, a \`GRAVE\`, or any other multi-item pile):
  always open the screen — there's no single unambiguous "the" item to
  quick-pick. This is the *only* way a \`BOX\`/\`GRAVE\`'s contents get opened
  now — bumping one no longer does (§4).

**Auto-close on empty**: any time the screen was opened with a non-empty
ground source — via 🫳 Use or 🎒, standing on either a single item or a
\`BOX\`/\`GRAVE\` — emptying that source out (by any combination of transfers,
Take All, or equipping straight off the ground) now closes **both** windows
automatically, rather than leaving the Inventory window open underneath an
empty, hidden Ground window as originally designed in §3 below. Opening 🎒
while standing on plain floor (no ground source to begin with) is
unaffected — there's nothing to "empty," so the screen behaves exactly as
before.

### 3 — A separate Ground window, above the inventory window

Ground is its own **window** — a second, separate fixed-position panel,
stacked directly **above** \`inventoryScreen.ts\`'s existing \`.inventory-box\`
— not a row grafted into that same box. Both windows share one wrapper,
following the exact self-stacking idiom \`#hud-corner\` already establishes
(\`styles/styles.css:245-269\`, where \`#inventory-button\` and \`#minimap\`
share one \`position:fixed; bottom:...; display:flex; flex-direction:column\`
container): the wrapper is bottom-anchored but \`height:auto\`, so its
**last** DOM child's bottom edge sits at the fixed anchor point and
**earlier** DOM children stack upward above it. Applied here, the new
\`.ground-box\` is the **first** child (so it renders above) and the existing
\`.inventory-box\` stays the **last** child (so it keeps sitting exactly
where it already does today) — DOM order alone does the layout work, with
no runtime height measurement of either box needed.

The Ground window is populated from whatever \`InventoryItem[]\` sits at the
current *ground source* coordinate. \`openInventoryScreen()\` still accepts an
explicit \`{x, y}\` source, but every real call site now omits it (§4), so in
practice the ground source is always the player's own current position —
**the window doesn't render at all when that position holds nothing**,
opening the screen while standing on empty ground shows only the Inventory
window below, exactly matching today's "hidden when empty" behavior, just
as a whole absent box instead of a collapsed row.

- Each ground item is its own tap target, rendered with the exact same
  \`tileContent()\` function \`inventoryScreen.ts\` already uses for equip/pool
  tiles (badge for count/capacity, durability bar) — a ground item is the
  same underlying \`Tile\` + \`count\` (+ future \`durability\`) shape as a pool
  item, so this needs no new rendering logic, only a new array to render it
  over.
- **Tap an item, then tap an open bag-pool slot in the Inventory window
  below** to transfer it — reuses the existing tap-to-hold/tap-to-place
  interaction (\`onSlotClick\`), spanning both windows: a ground tile is just
  one more source-id kind (\`ground-{i}\`) alongside today's \`pool-{i}\` /
  \`bagequip-{i}\` / \`equip-*\`, and the click-lookup/wiring that used to be
  scoped to the single box now spans the shared wrapper instead. Tapping a
  *second* ground tile while one is already held simply changes which
  ground item is held — there is no swap-with-another-ground-item, since a
  ground list has no meaningful slot ordering to preserve the way the
  pool/equip grids do.
- **"Take All"**, in the Ground window's own header, moves every ground
  item into the pool in one action, respecting the exact stacking/capacity
  rules \`inventory-system.md\` already defines: \`addGoldToPool\` tops off
  existing under-\`GOLD_STACK_LIMIT\` stacks before starting new ones,
  \`addSingleItemToPool\` needs one open slot per non-stacking item. Whatever
  doesn't fit is left on the ground and reported in the status line ("N
  item(s) left on the ground — no room"), the same \`dropSuffix\`-style
  messaging \`inventoryScreen.ts\` already uses for backpack-resize spill.
- Transferring the last item out of a ground source clears
  \`state.lootBoxes\` at that cell (\`deleteLootBox\`), reverts the tile to
  plain \`EMPTY\` (the same end state auto-pickup used to produce, just
  player-driven now) — and, per §2's "Auto-close on empty," closes both
  windows entirely rather than leaving the (now pointless) Inventory window
  open underneath a hidden Ground window.
- **Drop** stays part of the **Inventory window only** — it always writes
  to the player's own current tile (\`placeItem(state.playerX, state.playerY,
  ...)\`). Since the ground source is always the player's own position now
  (§4), this is no longer even a distinct case to reason about — Drop's
  target and the Ground window's source are always the same cell.
- Both windows open and close together — there is no independent
  open/close per window; closing the screen (via the Inventory window's
  **Close** button) tears down whichever of the two is currently showing.

### 4 — BOX/GRAVE bump — superseded, no longer opens the panel

This section originally read "BOX/GRAVE bump opens the same panel
directly": \`interactWithOpenTile\`'s \`BOX.type\`/\`GRAVE.type\` branch stopped
calling the old \`openLootBoxPeek\` and instead opened the inventory screen
directly on bump, with the ground source set to the bumped tile's own
coordinate. **That design is itself now superseded.** A \`BOX\`/non-empty
\`GRAVE\` bump no longer opens anything — it behaves exactly like bumping any
other open ground tile (§1): the move completes, the items stay put, full
stop. \`interactWithOpenTile\` (\`scripts/player.ts\`) no longer calls
\`openInventoryScreen\` at all; the screen only ever opens on demand now, via
🫳 Use or 🎒 (§2) — the same two openers that already handled a plain
single-item tile.

Two things this changes from the original design:

- **The ground source is no longer ever "a bumped tile's coordinate,
  different from the player's position."** \`BOX\`/\`GRAVE\` are
  \`movable: true\` (they always were — the original design's claim that
  "the player never moves onto the box" reflected an earlier,
  never-shipped \`movable: false\` intent, not the real implementation), so
  bumping one already puts the player on that exact tile; the ground
  source the Use button/🎒 read is simply \`state.playerX\`/\`state.playerY\`,
  same as every other tile. See §3.
- **An empty \`GRAVE\` bump is unaffected** — \`interactWithOpenTile\` still
  handles that case inline (notify, clear the grid/lootBox entry, remove
  the persistent grave marker) the instant it's bumped, since there's
  nothing to transfer and no screen involved either way.

This still fully retires the old peek-strip mechanism (\`openLootBoxPeek\` /
\`dismissLootBoxPeek\` / \`collectLootBox\` and its DOM/CSS) — no preview step
survives, and neither does the "single bump opens the full panel" behavior
that briefly replaced it. What signals "there's something here" now is
purely passive: see §7's item-ground overlay. Closing the screen with 2+
items still left in a \`GRAVE\` leaves the tile as \`GRAVE\`, openable again
later via Use/🎒 exactly as before — it only reverts to \`EMPTY\` once every
item has been transferred out. A \`BOX\` is different: it demotes straight to
a plain single-item composited tile (not a bumpable \`BOX\` anymore) the
instant it's down to exactly one item — a container holding one item has
nothing left worth "containing" — rather than staying \`BOX\` until it's
fully emptied.

### 5 — Item Inspect Popover & Compare-to-Equipped

Holding any item — ground, pool, *or* a bag-equip/weapon/armor/bow equip
tile — opens a small popover anchored to that tile, alongside the existing
status-line prompt. This is the actual answer to "now that items have
stats, I need more info on what I'm picking up": the popover is a real
stat readout, not just the badge + durability bar the tile itself shows.

**Implemented as a floating popup** (\`.item-popover\`, fixed to the top of the
screen) rather than docking inside whichever window currently owns the held
tile — this deviation from the original design (which had it relocate
between the Ground and Inventory windows' own mount points as the held
selection moved) means there's no relocation logic to reason about, and the
popover never has to compete for space with either window's own variable
height. There is still only ever one popover on screen at a time — it
appears the instant an item is held and disappears the instant that hold is
cleared, same as originally designed. Its content is unaffected by not being
docked in a window: a ground item's Compare-to-Equipped block still reads
the equipped item correctly even though "equipped" always visually lives in
the Inventory window below.

- **Header**: item emoji + tier/name (e.g. "🗡 Rare Weapon").
- **Stat rows**: durability as \`current/max\` alongside its existing bar,
  plus whatever category-specific stat that item's category defines —
  \`damage\` (weapon), \`armorRating\` (armor), \`range\` (bow), \`capacity\`
  (backpack). Food/currency/key/chute items show only what applies to them
  (food would show \`hungerRestored\` once \`food-drops.md\` lands; gold/key/
  chute show just their count).
- **Compare to Equipped**: when the held item's category is \`weapon\`,
  \`armor\`, or \`bow\` — the three categories with exactly one equip slot, so
  "the currently equipped one" is unambiguous — and that slot is currently
  occupied by a *different* instance, the popover adds a second stat block
  for the equipped item plus a **per-stat delta indicator** next to each of
  the held item's rows: one rotated-arrow glyph (a single \`▲\` element,
  CSS-\`transform: rotate(180deg)\` for the down case — never two different
  glyphs) colored green pointing up when the held item's value is strictly
  better than the equipped one, red pointing down when strictly worse, and
  omitted entirely on an exact tie. Each stat is compared independently —
  a found weapon can show damage ▲ (green, more damage) and durability ▼
  (red, less durability) against the currently-equipped one at the same
  time; there is no single aggregated "better/worse" verdict.
- Backpacks (up to 4 possible equip slots, so no single "the equipped one")
  and food (no equip slot at all — eaten straight from a bag slot per
  \`inventory-system.md\`) do not get an automatic compare target — see Open
  Questions.
- The popover is a rendering side-effect of the same \`selected\` hold-state
  \`onSlotClick\` already tracks, not a new interaction mode: it appears the
  instant an item is held and disappears the instant that hold is cleared
  (tapping the same tile again, tapping a destination to complete the
  transfer/equip, or tapping any other non-target tile to reselect) — no
  separate open/close gesture to learn.

### 6 — Ground-content merge fix (a latent bug this design surfaces)

\`scripts/lootBox.ts\`'s \`placeItem\` currently *replaces* whatever inventory
already sits at a coordinate (\`state.setLootBox(x, y, [oneNewItem])\` —
\`Map.set\`, not a merge) rather than adding to it. Today that's unreachable
in practice, because auto-pickup means a walkable cell almost never already
holds an item when something new lands on it. Once ground items persist
indefinitely (§1), it becomes a real bug: standing on an existing pile and
using **Drop** would silently delete everything already sitting there.

The fix: \`placeItem\` reads \`state.getLootBox(x, y) ?? []\` first and merges
the new item into that existing array via \`addToInventory\` (which already
handles gold-type merging correctly), instead of always starting from \`[]\`.
Once a cell's merged item count reaches 2+, it should be promoted to a
\`BOX\` tile via the exact rule \`dropLootBox\` already applies elsewhere —
reusing "1 item stays walkable, 2+ items becomes a bumpable BOX" as one
shared code path (\`placeItem\` and \`dropLootBox\` collapsing into a single
\`addItemsToGround\`-style helper) rather than \`placeItem\` keeping its old
"exactly one item" assumption while \`dropLootBox\` alone has the real
promotion logic.

### 7 — Item-ground overlay (added after §4 was superseded)

Once bump stopped opening the panel (§4), there was no more on-bump signal
that a \`BOX\`/\`GRAVE\`/item was even there — walking onto one now looks
identical to walking onto plain floor. \`scripts/ui.ts\`'s
\`updateItemOverlay\` fills that gap: a small persistent badge, positioned
directly above the player's own tile, shown whenever
\`state.getLootBox(state.playerX, state.playerY)\` is non-empty.

- **What it shows** — \`itemOverlayDisplay(groundType, loot)\` (\`ui.ts\`, pure
  and independently unit-tested): a \`BOX\`/\`GRAVE\` renders as itself (📦/🪦),
  never its contents, since there's only ever room to show one glyph and a
  box/grave can hold many distinct items; anything else (a single
  composited item tile) renders as that item's own display.
- **Outline color signals holdability** — \`itemOverlayCanHold(loot)\` (\`ui.ts\`,
  pure, backed by \`lootBox.ts\`'s \`canAbsorbGroundItem\`) decides the badge's
  border: white/default when at least one unit of what's there could
  actually be picked up right now, red (\`.item-ground-overlay-cant-hold\`,
  \`styles/styles.css\`) when nothing on the pile fits anywhere (pool/matching
  equip slot all full). A \`BOX\`/\`GRAVE\` counts as holdable if ANY one of its
  several contents still fits, not just the first (matching what it displays
  as, §"What it shows" above, being cosmetic only — the color still reflects
  the whole pile). Gold specifically stays white for a stack bigger than what
  remains, since some of it can still be taken (an under-limit \`GOLD\` stack to
  top off, or an open slot to start a new one — the pool's own "any room at
  all" auto-pickup rule) — red only once no \`GOLD\` stack has room and no slot
  is open at all.
- **Lifecycle** — re-derived from scratch on every \`updateGoldDisplay()\`
  call (i.e. after every move, pickup, or transfer — the same "no cached
  flag" pattern \`updateUseButton\` already uses), so it appears the instant
  the player steps onto a tile with something on it and disappears the
  instant they step off, or the pile empties out via Use/🎒.
- **Hidden while the Ground+Inventory screen is open**
  (\`body.inventory-active .item-ground-overlay { display: none; }\`,
  \`styles/styles.css\`) — the screen already shows the same content, so the
  overlay would just be redundant clutter behind it.
- This is a spiritual, much-simplified successor to the retired peek
  strip's "something's here" role (see §4) — a static indicator, not an
  interactive reveal, and it never opens anything on its own. Actually
  opening a \`BOX\`/\`GRAVE\`/item pile is still always an explicit action via
  🫳 Use or 🎒 (§2).

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Player walks onto/through/past a tile with ground items | Move completes normally; nothing is collected — items stay put until transferred |
| Player bumps a \`BOX\`/non-empty \`GRAVE\` | Move completes onto it (both are \`movable: true\`), same as any other open tile — the screen does **not** open (§4, superseded); the item-ground overlay (§7) shows it's there, and 🫳 Use/🎒 open the transfer panel on demand |
| Take All when the pool doesn't have room for everything | Whatever fits is transferred; the remainder stays on the ground and is reported in the status line, same as \`inventory-system.md\`'s existing "no room" outcome |
| Last item transferred out of a ground source | \`state.lootBoxes\` entry deleted, tile reverts to \`EMPTY\`, and the whole screen (both windows) closes automatically (§2); a BOX/GRAVE reverting this way behaves exactly as it does today once emptied |
| Player drops a second item onto a tile they're already standing on, which already holds one ground item | Merges via the \`placeItem\` fix (§6); if the result is 2+ items, that tile is promoted to \`BOX\` going forward — still walks onto fine either way (§4), it just no longer auto-opens the panel regardless of item count |
| Held item's category has no single equipped counterpart (backpack, food) | Inspect popover still shows its own stats; no Compare-to-Equipped block is shown |
| Held item's stat exactly ties the equipped item's stat | No arrow shown for that stat — ties are neutral, not "worse" |
| Popover open, player taps a destination slot to complete a transfer/equip | Popover closes as part of the same \`selected\`-clearing that already happens on any completed move |
| Opening the screen while standing on a tile with items, then transferring them all away | Both windows close automatically as soon as the ground source empties out (§2) |
| Opening 🎒 while standing on plain floor (no ground source), with items already in the pool | No auto-close applies — there was nothing to "empty" to begin with; the screen behaves exactly as it always has |

---

## Open Questions

- Should **Take All** ask for confirmation when it's about to leave items
  behind (partial success), or is the status-line message alone sufficient
  feedback? This doc assumes the latter, matching how every other
  capacity-limited outcome in \`inventory-system.md\` is handled today (a
  message, not a confirmation dialog).
- Should an uncollected ground item ever expire/despawn if left too long?
  Nothing does this today, and this doc doesn't propose it — flagged since
  "items can now sit on the ground indefinitely" is a genuinely new
  condition that didn't exist under auto-pickup.
- What should Compare-to-Equipped do for a **backpack**, given up to 4
  possible equip targets? Options: compare against the lowest-capacity
  currently-equipped backpack (the one most likely to be worth replacing),
  compare against all 4 at once, or show no compare block until the player
  has picked a destination bag slot (at which point the transfer is already
  in progress, which may be too late to be useful). Left undecided —
  this doc's default (§5) is "no automatic compare target," the simplest of
  the three.
- Should picking up food ever compare against nothing-currently-being-eaten,
  or is a compare block meaningless for a consumable with no equip slot?
  This doc assumes the latter (no compare block for food), consistent with
  backpacks above.
`,Ae="# 🍗 Fullness System\n\n## Overview\n\nA meter that **starts full and drains over time**, independent of any item\ndrop (food refills it — see `food-drops.md`). Real, implemented gameplay\nnow: the meter/tick/starvation logic lives in `scripts/fullness.ts`, driven\nonce per turn from `scripts/player.ts`'s `move()` (the same unconditional\n`state.incrementMoves()` hook), and the HUD bar (`#fullness-bar`) reuses\n`#health-bar`'s shared heart/icon + width%-fill bar rendering\n(`scripts/healthBar.ts`, driven from `ui.ts`'s `updateGoldDisplay`) rather\nthan inventing a new visual language. Eating is the real inventory screen's\nshared Consume button (`scripts/inventoryScreen.ts`'s `handleConsume`,\nits `CONSUME_HANDLERS.food` entry — see `inventory-system.md`), enabled\nonly for a pool-held FOOD item (or any potion, its other consumable\nCategory).\n\nThis meter used to be framed the opposite way — \"hunger\", starting empty and\nclimbing toward a bad state — before being inverted to \"fullness\", starting\nfull and draining toward a bad state. The mechanics (drain/eat/starvation\nmath) are identical either way; only the framing and the sign of every\ncomparison flipped. See \"Persistence\" below for what that means for saves\nfrom before the inversion.\n\n---\n\n## Behavior\n\n*Tune the meter's constants live, with a working simulation and a Copy-as-JSON export, in the [Fullness Meter Prototype](#fullness-meter-ui).*\n\n### 1 — The meter\n\n- Range `0` (\"starving\") to `FULLNESS_MAX = 100` (full, not hungry at all).\n- Starts at `FULLNESS_MAX` on a new run — a fresh character begins well-fed,\n  same as every other fresh-run stat starting at its best value (full\n  health, zero gold owed, etc.).\n- Drains by a flat `1` every `FULLNESS_TICK_INTERVAL_TURNS = 4` turns (a turn\n  is any player move, bump-attack, fired shot, or a deliberate wait via the\n  D-pad's center button — anything that already advances the game's turn\n  counter today. A *blocked* bump — walking into a solid, non-interactable\n  obstacle with nothing to attack there, e.g. a wall — is explicitly\n  excluded: it does nothing, so it doesn't cost a turn either. See\n  player.ts's `isBlockedBump`/`consumeTurn`.) — a fresh run reaches `0`\n  after roughly 400 turns of never eating, tunable by adjusting either\n  constant the same way `ROOM_TILE_COUNT_PER_ENEMY` is called out as a\n  tunable rate in `docs/dungeon-generation.md`.\n- Eating food (`food-drops.md`) immediately adds a flat amount — that's\n  food's whole effect on this meter; this doc owns the drain/floor/penalty\n  mechanics.\n- **Always a whole number.** The drain tick is a flat `1` and eating only\n  ever adds a whole `hungerRestored`, so `fullness` never lands on a\n  fractional value. This used to not be true — food previously also rolled\n  a `rateMultiplier` that temporarily scaled the drain tick, which could\n  produce values like `99.2`. The HUD label (`scripts/healthBar.ts`) has\n  always rendered with `Math.ceil`, which silently rounded a value like\n  `99.2` up to display \"100\" — indistinguishable from actually being at the\n  ceiling, including for gameplay logic that checks `fullness >=\n  FULLNESS_MAX` (the well-fed heal in §3 below). Removing `rateMultiplier`/\n  `slowDownDuration` from food (see `food-drops.md` §1) removed the only\n  source of fractional fullness, so this class of bug can no longer occur.\n\n### 2 — Starving\n\nOnce the meter reaches `0`, the player is **starving**: every\n`STARVATION_INTERVAL_TURNS = 10` turns spent at `0`, the player takes\n`STARVATION_PERCENT_PER_TICK = 10%` of their own *current* `maxHealth`\n(`constants.ts`'s `percentOfMaxHealth`, rounded up — the same helper\n`heal.ts`'s healing-potion tick uses), funneled through the exact same\n`scripts/damage.ts` `handleDamage(damage, x, y, cause, skipDeathSound)` call\nevery other damage source already uses (mob attacks, hazard tiles) — no\nseparate death/damage path. This is a percentage rather than a flat number\nspecifically so starvation doesn't quietly stop mattering as `maxHealth`\ngrows over a run (`state.ts`'s `increaseMaxHealth`) — a flat amount shrinks\nin relative danger every time the pool grows, a percentage doesn't. At\n`maxHealth = 100`, continuous starvation kills in exactly 100 turns if never\ninterrupted by eating (10 ticks of 10 damage each, `STARVATION_INTERVAL_TURNS`\napart), giving a real but not instant window to find food once the meter\nbottoms out — and that same ~100-turn window holds regardless of how much\n`maxHealth` has grown, since both the damage and the health pool scale\ntogether. Eating any food (even a small restore) that brings the meter back\nabove `0` immediately ends the starving state — the damage tick only fires\nwhile still pinned at the floor, not as a lingering debuff after recovering.\n\n### 3 — Well-fed healing\n\nThe mirror image of §2 at the other end of the meter: every turn fullness is\npinned at `FULLNESS_MAX` (well-fed, not just \"not starving\"), the player\nheals `FULL_FULLNESS_HEAL_PERCENT_PER_TURN = 10%` of their own *current*\n`maxHealth` (`percentOfMaxHealth`, rounded up, same helper and rounding rule\nas the starvation tick and `heal.ts`'s healing-potion tick), clamped so it\nnever overheals past `maxHealth`. Funneled through the same `state.applyHeal`\n`heal.ts`'s `tickHeal` uses, and floats a `'heal'` number the same way — no\nseparate healing path. Unlike starvation there's no interval to accumulate\nagainst — this fires every turn the meter is at the ceiling, not every N\nturns, since staying full is a standing reward rather than a penalty being\nmetered out. Letting the meter drain even one point below `FULLNESS_MAX`\nstops the heal immediately, resuming the instant it's topped back off (e.g.\nby eating).\n\n### 4 — HUD\n\nThe fullness bar reuses the exact same shared component as the health bar\n(`scripts/healthBar.ts`'s `createHealthBar`/`updateHealthBar`): a `🍗` icon\nnext to a width%-fill track with a numeric `current/max` label and a \"ghost\"\nsegment that freezes on a drain tick then drains visually down to the real\nvalue — the same rendering path, not a lookalike reimplementation, per\nCLAUDE.md's \"Unify by data, not by call site\". The only differences from\nthe health bar are the icon (`🍗` vs `❤️`) and the fill color (a distinct\nblue, `FULLNESS_FILL_COLOR` in `ui.ts`, vs health's red) — both plain\nparameters to the shared functions. `#fullness-bar` sits directly below\n`#health-bar` in the HUD and pulses (`.fullness-starving`, mirroring the old\n`.hunger-starving` pulse) while pinned at `0`, the same turns the starvation\ndamage tick can fire.\n\n---\n\n## Edge Cases\n\n| Situation | Behaviour |\n|---|---|\n| Fullness meter reaches exactly `0` | Starving begins on the *next* turn boundary, not retroactively on the turn that emptied it |\n| Player eats while already starving | Meter rises above `0` immediately, ending the starvation damage tick from that point on |\n| Player dies from starvation | Same `handleDamage` → death path every other damage source uses (`_onDeath` handler) — no special \"starved to death\" case beyond whatever `cause` string is passed for messaging |\n| Health already at 0 when a starvation tick would fire | No-op — `handleDamage` already ignores further damage once `state.currentHealth <= 0` (see `scripts/damage.ts`), so starvation can't double-kill |\n| Entering a room/cave/menu while starving | Fullness keeps ticking on any turn-advancing action regardless of scene, same as health — no special pause beyond however the inventory screen already freezes time while open (`inventory-system.md`) |\n| Player already at full health while fullness is also at `FULLNESS_MAX` | No-op — the heal amount clamps to `0` (nothing left to heal), so no floating number appears |\n| Fullness drops below `FULLNESS_MAX` (even by 1) | The well-fed heal stops immediately on that turn — no partial-credit turn once the meter leaves the ceiling |\n\n---\n\n## Open Questions\n\n- Whether `FULLNESS_TICK_INTERVAL_TURNS`/`STARVATION_INTERVAL_TURNS` need to\n  scale with dungeon floor (deeper floors demand more frequent eating) the\n  same way drop tiers scale with floor in `drops-core.md`, or stay flat for\n  the whole run — this doc assumes flat constants for simplicity.\n\n## Persistence\n\nFullness saves/loads with the rest of run state (`save.ts`), the same\noptional/additive pattern `inTown` uses rather than a `SAVE_VERSION` bump —\na pre-fullness-system save simply has none of the `fullness*` fields. Unlike\nevery other optional/additive field in `save.ts`, a missing `fullness`\nvalue does **not** default to `0` on load — it defaults to `FULLNESS_MAX`,\nsince a fresh run (and a save that predates this meter entirely) should\nstart full, not starving. This also covers a save from before \"hunger\" was\ninverted to \"fullness\": its old `hunger*` values are left in place, unread\nby any live code (same precedent as the pre-slots legacy keys in\n`save.ts`), so resuming it simply starts the meter full rather than\nattempting to convert an old hunger scale into the new fullness one. A save\nfrom before food's `rateMultiplier`/`slowDownDuration` were removed may\nstill carry old `fullnessSlowdownTurnsLeft`/`fullnessRateMultiplier` keys —\nsame treatment, left in place and unread, since fullness no longer has a\nslow-down state to restore them into.\n",je=`
<style>
  /* Chrome (headings, section labels, descriptions, demo buttons) follows the
     docs hub's theme variables like a markdown doc would — see CLAUDE.md's
     "Theming interactive docs". The world-stage tiles and the two windows
     below are a genuine mockup of real in-game UI, so those keep fixed
     values lifted verbatim from styles/styles.css (the real #world tile
     grid for the former, the real .inventory-box/.inv-tile dark panel for
     the latter — see scripts/inventoryScreen.ts), regardless of the docs
     hub's light/dark toggle. */
  .gp-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .gp-wrap h1 {
    font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;
  }
  .gp-wrap .gp-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 24px; max-width: 640px; }
  .gp-sec-lbl {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .gp-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 14px; max-width: 640px; }
  .gp-hint { font-size: 0.72rem; color: var(--muted); margin-top: 4px; max-width: 560px; }
  section.gp-section { max-width: 680px; margin: 0 auto 44px; }
  hr.gp-separator { border: none; border-top: 1px solid var(--border); margin: 0; }

  /* ── Real-stage mockup: same forestgreen backdrop + 56px .tile rule every
     other interactive doc's mockup reuses verbatim from styles.css — this
     is the real #world grid, a genuinely different surface from the two
     windows below, so it keeps its own convention. ── */
  .gp-area {
    background: forestgreen; display: inline-block; padding: 10px 12px;
    border-radius: 6px; font-family: Arial, sans-serif;
  }
  .gp-tile {
    width: 56px; height: 56px; background: green; border: 1px solid forestgreen;
    display: inline-flex; align-items: center; justify-content: center; font-size: 30px;
    position: relative; box-sizing: border-box; vertical-align: top; user-select: none;
  }
  .gp-tile + .gp-tile { margin-left: 4px; }
  .gp-tile-badge {
    position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white;
    font-size: 0.32em; font-family: monospace; padding: 0 3px; border-radius: 3px;
    line-height: 1.4; min-width: 1.4em; text-align: center; pointer-events: none;
  }
  /* Loot glow — matches .tile[data-glow="LOOT"] in styles.css */
  @keyframes gpLootPulse {
    0%, 100% { opacity: 0.6; transform: scale(0.85); }
    50%       { opacity: 1.0; transform: scale(1.1); }
  }
  .gp-loot-glow { isolation: isolate; }
  .gp-loot-glow::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle, rgba(255, 200, 0, 0.8) 0%, rgba(255, 180, 0, 0) 70%);
    z-index: -1; pointer-events: none; animation: gpLootPulse 1.2s ease-in-out infinite;
  }

  /* ── The #inventory-button mockup — same 40x40, rgba(0,0,0,.45), 22px
     glyph as the real button in styles.css, just inline instead of fixed. ── */
  .gp-hud-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 8px; background: rgba(0,0,0,0.45);
    font-size: 22px; vertical-align: middle; margin-left: 14px; transition: background 0.15s;
  }
  .gp-hud-icon.gp-hud-icon-active { background: rgba(255,200,0,0.35); }

  /* ── Window stack — mirrors #hud-corner's self-stacking idiom
     (styles.css:245-269): a flex-column wrapper where the LAST DOM child's
     bottom edge sits at the anchor point and EARLIER children stack upward
     above it (#inventory-button, first in DOM, ends up visually topmost
     over #minimap). Here the wrapper renders inline in the docs page's own
     flow rather than position:fixed (same "keep inline, copy every other
     value" precedent docs-npc-dialogue.ts already uses for its own box), so
     DOM order alone — .gp-ground-box first, .gp-inventory-box last — is
     what puts Ground above Inventory: the exact ordering a real
     position:fixed version of this wrapper would also need, with zero
     runtime height math either way. ── */
  .gp-panel-scroll { overflow-x: auto; max-width: 100%; }
  .gp-window-stack { display: flex; flex-direction: column; gap: 8px; font-family: Arial, sans-serif; }

  /* ── Both windows are literal stand-ins for the real .inventory-box
     (styles.css:442-462) — values copied verbatim except position:fixed. ── */
  .gp-ground-box, .gp-inventory-box {
    width: min(94vw, 460px); max-height: 80vh; overflow-y: auto; box-sizing: border-box;
    background: rgba(20,20,20,0.94); border: 3px solid #fff; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5); padding: 12px 14px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .gp-row { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
  .gp-row-label {
    color: #FFD700; font-size: 0.62rem; font-weight: bold; letter-spacing: 0.04em;
    width: 100%; margin-top: 4px;
  }
  .gp-row-label:first-child { margin-top: 0; }
  .gp-divider { width: 1px; align-self: stretch; background: rgba(255,255,255,0.28); margin: 0 2px; }
  .gp-slot {
    width: 40px; height: 40px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px;
    position: relative; box-sizing: border-box; cursor: pointer; user-select: none;
    transition: box-shadow 0.12s, transform 0.12s;
  }
  .gp-slot.gp-equip-slot { background: rgba(255, 215, 0, 0.08); border: 1px dashed rgba(255, 215, 0, 0.5); }
  .gp-slot.gp-empty { opacity: 0.5; }
  .gp-slot.gp-selected { box-shadow: 0 0 0 3px #FFD700 inset; transform: scale(1.08); z-index: 2; }
  .gp-slot.gp-reject { animation: gpReject 0.32s ease-in-out; }
  @keyframes gpReject {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .gp-badge {
    position: absolute; top: 1px; right: 1px; background: rgba(0,0,0,0.75); color: white;
    font-size: 0.3em; font-family: monospace; padding: 0 3px; border-radius: 3px;
    line-height: 1.4; min-width: 1.4em; text-align: center; pointer-events: none;
  }
  .gp-durability {
    position: absolute; left: 2px; right: 2px; bottom: 2px; height: 3px;
    background: rgba(0,0,0,0.5); border-radius: 2px; overflow: hidden;
  }
  .gp-durability-fill { height: 100%; background: #7CFC00; }
  .gp-durability-fill.gp-dur-low { background: #ff6666; }

  .gp-pool-hdr, .gp-ground-hdr {
    color: rgba(255,255,255,0.7); font-size: 0.7rem; display: flex; align-items: center;
    justify-content: space-between; gap: 10px;
  }
  /* Ground's header doubles as the window's own title (there's no outer
     chrome heading for it the way a real fixed-position box wouldn't have
     one either), so it gets the same gold emphasis .gp-row-label uses
     rather than the muted "Items N/M" sub-header treatment. */
  .gp-ground-hdr { color: #FFD700; font-weight: bold; }
  .gp-pool-grid, .gp-ground-grid { display: flex; flex-wrap: wrap; gap: 5px; }
  .gp-source-lbl { color: #FFD700; font-size: 0.68rem; }

  /* Mount point for the one shared popover element — a genuinely floating
     popup (docs/ground-pickup.md's deliberate deviation from a docked-in-
     window design: "fixed to the top of the screen ... rather than
     relocating between the Ground and Inventory windows' own mount points
     as the held selection moves between them"), so it renders as its own
     element ABOVE the window stack instead of inside either box. Collapses
     to nothing when empty so it never reserves blank space. Real values
     (styles.css's .item-popover) are position:fixed to the very top of the
     viewport; kept inline here per this file's usual "same values, no
     position:fixed" convention (see .gp-window-stack above). */
  .gp-popover-mount:empty { display: none; }
  .gp-popover-mount { margin-bottom: 8px; }
  /* The held item and its equipped-item comparison (when there is one) are
     always laid out as two side-by-side columns, never stacked, so both are
     visible and comparable at a glance — see styles.css's real .item-popover. */
  .gp-popover {
    display: flex; flex-direction: row; align-items: flex-start; gap: 10px;
    background: rgba(20,20,20,0.94); border: 2px solid #fff; border-radius: 8px;
    padding: 8px 10px; font-family: Arial, sans-serif; color: rgba(255,255,255,0.92); font-size: 0.76rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  .gp-popover-col { flex: 1 1 0; min-width: 0; }
  .gp-popover-col-sub { padding-left: 10px; border-left: 1px solid rgba(255,255,255,0.18); }
  .gp-popover-hdr { font-size: 0.85rem; font-weight: bold; margin-bottom: 4px; color: #fff; }
  .gp-popover-hdr-sub {
    font-size: 0.72rem; font-weight: normal; color: rgba(255,255,255,0.7);
  }
  .gp-popover-tier { color: rgba(255,255,255,0.55); font-weight: normal; font-size: 0.75rem; }
  .gp-popover-stat { display: flex; justify-content: space-between; gap: 10px; padding: 1px 0; }
  /* Single glyph, rotated for the "worse" direction — never two different icons */
  .gp-arrow { display: inline-block; font-size: 0.7em; }
  .gp-arrow-up { color: #4ade80; }
  .gp-arrow-down { color: #f87171; transform: rotate(180deg); }

  /* Real .inv-btn/.inv-state-lbl values (styles.css:504-512) for the
     buttons/status text that live INSIDE the two windows — distinct from
     the theme-var .gp-btn/.gp-state-lbl chrome below this block, which is
     for the docs-only demo controls outside the windows. */
  .gp-inv-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .gp-inv-btn {
    padding: 6px 12px; background: rgba(255,255,255,0.08); color: #fff;
    border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; font-family: inherit; touch-action: manipulation;
  }
  .gp-inv-btn:hover:not(:disabled) { background: rgba(255,215,0,0.18); border-color: #FFD700; }
  .gp-inv-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .gp-inv-state-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.75); min-height: 1.2em; }

  /* ── Chrome: demo buttons/labels OUTSIDE the two windows (Step onto,
     Bump Box, Reset, ...) — these are docs-only controls, not a mockup of
     any real UI, so they follow the docs hub's theme variables. ── */
  .gp-btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .gp-btn {
    padding: 7px 14px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; transition: background 0.1s, border-color 0.1s;
  }
  .gp-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .gp-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .gp-btn.gp-sec { background: transparent; color: var(--muted); border-color: var(--border); }
  .gp-state-lbl { margin-top: 10px; font-size: 0.75rem; color: var(--muted); min-height: 1.3em; }
</style>

<div class="gp-wrap">
  <h1>🫳 Ground Pickup</h1>
  <p class="gp-intro">
    Mockup of <code>docs/ground-pickup.md</code>. Auto-pickup is gone — walking
    onto an item tile no longer collects it. The <code>#inventory-button</code>
    (🎒) flips to 🫳 only while you're standing on a tile that still has
    something on it, and opening the screen surfaces a separate
    <strong>Ground window</strong>, stacked above the
    <a href="?doc=inventory-ui">Inventory Screen</a>'s own window — not a row
    grafted into it — fed by either your own tile or a bumped box/grave.
    Holding any item anywhere opens a floating inspect popover — pinned
    above both windows rather than docked inside whichever one it came
    from — with its stats and, for weapon/armor/bow, a compare-to-equipped
    block.
  </p>

  <!-- ─────────────── SECTION 1: Standing on items ─────────────── -->
  <section class="gp-section">
    <div class="gp-sec-lbl">1 — Standing On Items: The 🫳 Icon</div>
    <p class="gp-desc">
      Step onto a tile with items on it — the move completes normally and
      nothing is collected. The icon next to the stage mirrors
      <code>#inventory-button</code>: 🫳 only while you're on a tile with
      something on it, 🎒 otherwise — including if you walk away and leave
      items behind.
    </p>
    <div>
      <div class="gp-area">
        <div class="gp-tile" id="gp-self-tile">🥷</div>
      </div><span class="gp-hud-icon" id="gp-self-icon">🎒</span>
    </div>
    <div class="gp-btn-row">
      <button class="gp-btn" id="gp-self-step-items">🚶 Step onto 🗡 Axe + 💰 Gold</button>
      <button class="gp-btn" id="gp-self-step-away">🚶 Walk away (leave items behind)</button>
      <button class="gp-btn" id="gp-self-step-back">🚶 Step back onto that tile</button>
      <button class="gp-btn" id="gp-self-open" disabled>🎒 Open Inventory</button>
    </div>
    <div class="gp-state-lbl" id="gp-self-lbl">Standing on empty ground.</div>
  </section>

  <hr class="gp-separator">

  <!-- ─────────────── SECTION 2: Bumping a box/grave ─────────────── -->
  <section class="gp-section" style="margin-top:40px;">
    <div class="gp-sec-lbl">2 — Bumping a 📦 Box or 🪦 Grave</div>
    <p class="gp-desc">
      A box/grave is never walkable — bumping it opens the exact same panel
      directly, one bump, no preview step, just pointed at the box's own
      coordinate instead of your own tile. This fully replaces the old
      two-bump peek-strip flow.
    </p>
    <div>
      <div class="gp-area">
        <div class="gp-tile">🥷</div><div class="gp-tile gp-loot-glow" id="gp-box-tile">📦</div>
      </div>
    </div>
    <div class="gp-btn-row">
      <button class="gp-btn" id="gp-box-bump">⬆ Bump Box</button>
      <button class="gp-btn gp-sec" id="gp-box-reset">↺ Reset Box</button>
    </div>
    <div class="gp-state-lbl" id="gp-box-lbl">📦 holds: 🔑  💰×3  ❤️</div>
  </section>

  <hr class="gp-separator">

  <!-- ─────────────── SECTION 3: the two windows ─────────────── -->
  <section class="gp-section" style="margin-top:40px; max-width: 100%;">
    <div class="gp-sec-lbl">3 — The Ground Window + Inventory Window</div>
    <p class="gp-desc">
      Opened by either demo above. Ground is its own window, stacked
      directly above the <a href="?doc=inventory-ui">Inventory Screen</a>
      mockup's own window — both open and close together.
      <strong>Tap an item, then tap a destination</strong> to transfer/equip
      it — hold a ground item in the window above and complete the transfer
      into an open pool slot in the window below.
      <strong>Take All</strong> (in the Ground window's own header) moves
      everything that fits into the pool and reports what doesn't; the
      Ground window disappears entirely once its source is empty.
      <strong>Tap any item to inspect it</strong> — a floating stats popover
      appears above both windows, never docked inside either one, plus a
      compare-to-equipped block for weapon/armor/bow.
    </p>
    <div class="gp-panel-scroll">
      <div class="gp-popover-mount" id="gp-popover-mount"></div>
      <div class="gp-window-stack" id="gp-window-stack" style="display:none;">
        <div class="gp-ground-box" id="gp-ground-box">
          <div class="gp-ground-hdr">
            <span id="gp-ground-hdr-txt">Ground</span>
            <button class="gp-inv-btn" id="gp-take-all" style="padding:3px 10px;font-size:0.7rem;">Take All</button>
          </div>
          <div class="gp-source-lbl" id="gp-source-lbl"></div>
          <div class="gp-ground-grid" id="gp-ground-grid"></div>
        </div>
        <div class="gp-inventory-box" id="gp-inventory-box">
          <div class="gp-row">
            <div class="gp-row-label">EQUIPPED</div>
            <div class="gp-slot gp-equip-slot" data-slot="equip-weapon" data-cat="weapon"></div>
            <div class="gp-slot gp-equip-slot" data-slot="equip-armor" data-cat="armor"></div>
            <div class="gp-slot gp-equip-slot" data-slot="equip-bow" data-cat="bow"></div>
            <div class="gp-divider"></div>
            <div class="gp-slot gp-equip-slot" data-slot="bagequip-1" data-cat="backpack"></div>
            <div class="gp-slot gp-equip-slot" data-slot="bagequip-2" data-cat="backpack"></div>
          </div>
          <div class="gp-pool-hdr"><span id="gp-pool-hdr-txt">Items 0/0</span></div>
          <div class="gp-pool-grid" id="gp-pool-grid"></div>
          <div class="gp-inv-state-lbl" id="gp-panel-lbl"></div>
          <div class="gp-inv-btn-row">
            <button class="gp-inv-btn" id="gp-drop-btn">Drop</button>
            <button class="gp-inv-btn" id="gp-close-btn">Close</button>
          </div>
        </div>
      </div>
    </div>
    <p class="gp-hint">
      Bag 2 starts with a Satchel equipped and a couple of pool items already
      in place. Weapon starts equipped with a Sword — pick up the ground
      🪓 Axe (from either demo above) and tap it to see the compare block
      against that equipped Sword: more damage (▲ green) but less durability
      (▼ red), independently.
    </p>
  </section>
</div>
`,Me={weapon:`🗡️`,armor:`🥋`,bow:`🏹`,food:`🍎`,backpack:`🎒`,currency:``},Ne={weapon:{key:`damage`,label:`Damage`},armor:{key:`armorRating`,label:`Armor`},bow:{key:`range`,label:`Range`},backpack:{key:`capacity`,label:`Capacity`},food:{key:`hungerRestored`,label:`Fullness Restored`}},Pe=[`weapon`,`armor`,`bow`];function K(){return Math.random().toString(36).slice(2,9)}function Fe(e,t){if(!e)return t?Me[t]:``;let n=``;e.category===`backpack`&&e.capacity?n=`<span class="gp-badge">${e.capacity}</span>`:e.count&&e.count>1&&(n=`<span class="gp-badge">${e.count}</span>`);let r=``;if(e.durability){let t=Math.max(0,e.durability.current/e.durability.max)*100;r=`<div class="gp-durability"><div class="gp-durability-fill${t<30?` gp-dur-low`:``}" style="width:${t}%"></div></div>`}return`${e.emoji}${n}${r}`}function Ie(e){return e===0?``:e>0?` <span class="gp-arrow gp-arrow-up">▲</span>`:` <span class="gp-arrow gp-arrow-down">▲</span>`}function Le(e){let t=new Map,n=[],r=[],i=[{id:K(),emoji:`🔑`,label:`Key`,category:`currency`},{id:K(),emoji:`💰`,label:`Gold`,category:`currency`,count:3,stackLimit:50},{id:K(),emoji:`❤️`,label:`Heart`,category:`currency`}],a=null,o=null;function s(){return a===`box`?i:r}function c(e){a===`box`?i=e:r=e}function l(){return(t.get(`bagequip-1`)?.capacity??0)+(t.get(`bagequip-2`)?.capacity??0)}function u(){t.clear(),t.set(`equip-weapon`,{id:K(),emoji:`🗡`,label:`Sword`,tier:`Iron`,category:`weapon`,damage:1.6,durability:{current:20,max:20}}),t.set(`equip-armor`,void 0),t.set(`equip-bow`,void 0),t.set(`bagequip-1`,{id:K(),emoji:`🎒`,label:`Satchel`,category:`backpack`,capacity:4,durability:{current:18,max:20}}),t.set(`bagequip-2`,void 0),n.length=0;for(let e=0;e<l();e++)n.push(void 0);n[0]={id:K(),emoji:`💰`,label:`Gold`,category:`currency`,count:12,stackLimit:50},n[1]={id:K(),emoji:`🔑`,label:`Key`,category:`currency`},o=null}u();let d=e.querySelector(`#gp-self-tile`),f=e.querySelector(`#gp-self-icon`),p=e.querySelector(`#gp-self-lbl`),m=e.querySelector(`#gp-self-open`),h=!0;function g(){let e=r.length>0;d.innerHTML=h?`🥷${e?`<span class="gp-tile-badge">${r.length}</span>`:``}`:e?`${r[0].emoji}<span class="gp-tile-badge">${r.length}</span>`:``;let t=h&&e;f.textContent=t?`🫳`:`🎒`,f.classList.toggle(`gp-hud-icon-active`,t),m.disabled=!1}e.querySelector(`#gp-self-step-items`).addEventListener(`click`,()=>{r=[{id:K(),emoji:`🪓`,label:`Axe`,tier:`Steel`,category:`weapon`,damage:2.4,durability:{current:11,max:14}},{id:K(),emoji:`💰`,label:`Gold`,category:`currency`,count:7,stackLimit:50}],h=!0,p.textContent=`Stepped onto the tile — move completed, nothing was collected.`,g()}),e.querySelector(`#gp-self-step-away`).addEventListener(`click`,()=>{h=!1,p.textContent=r.length>0?`Walked away — icon reverts to 🎒 even though the items are still sitting back there.`:`Walked away. Nothing was there anyway.`,g()}),e.querySelector(`#gp-self-step-back`).addEventListener(`click`,()=>{h=!0,p.textContent=r.length>0?`Back on the tile — 🫳 again, exactly what was left is still there.`:`Back on the tile — it’s empty.`,g()}),m.addEventListener(`click`,()=>j(`self`)),g();let _=e.querySelector(`#gp-box-tile`),v=e.querySelector(`#gp-box-lbl`);function y(){i.length===0?(_.classList.remove(`gp-loot-glow`),_.textContent=``,v.textContent=`📦 is empty and gone — bump resolves to nothing now.`):(_.classList.add(`gp-loot-glow`),_.textContent=`📦`,v.textContent=`📦 holds: ${i.map(e=>e.count&&e.count>1?`${e.emoji}×${e.count}`:e.emoji).join(`  `)}`)}e.querySelector(`#gp-box-bump`).addEventListener(`click`,()=>{if(i.length===0){v.textContent=`📦 is already empty — nothing to bump into.`;return}j(`box`)}),e.querySelector(`#gp-box-reset`).addEventListener(`click`,()=>{i=[{id:K(),emoji:`🔑`,label:`Key`,category:`currency`},{id:K(),emoji:`💰`,label:`Gold`,category:`currency`,count:3,stackLimit:50},{id:K(),emoji:`❤️`,label:`Heart`,category:`currency`}],y()}),y();let b=e.querySelector(`#gp-window-stack`),x=e.querySelector(`#gp-ground-box`),S=e.querySelector(`#gp-pool-grid`),C=e.querySelector(`#gp-pool-hdr-txt`),w=e.querySelector(`#gp-ground-grid`),T=e.querySelector(`#gp-ground-hdr-txt`),E=e.querySelector(`#gp-source-lbl`),D=e.querySelector(`#gp-popover-mount`),O=e.querySelector(`#gp-panel-lbl`),k=e.querySelector(`#gp-take-all`),A=document.createElement(`div`);A.className=`gp-popover`;function j(e){a=e,o=null,b.style.display=``,E.textContent=e===`self`?`📍 Ground source: your own tile`:`📍 Ground source: the 📦 box you just bumped (not your own tile)`,O.textContent=`Tap an item to inspect it, then tap a destination to transfer/equip it.`,z(),b.scrollIntoView({behavior:`smooth`,block:`nearest`})}function M(e){return e.startsWith(`pool-`)?n[Number(e.split(`-`)[1])]:e.startsWith(`ground-`)?s()[Number(e.split(`-`)[1])]:t.get(e)}function N(){S.innerHTML=``;for(let e=0;e<n.length;e++){let t=document.createElement(`div`);t.className=`gp-slot`,t.dataset.slot=`pool-${e}`,S.appendChild(t)}C.textContent=`Items ${n.filter(Boolean).length}/${n.length}`}function P(){let e=s();x.style.display=e.length===0?`none`:``,e.length!==0&&(T.textContent=`Ground (${e.length})`,w.innerHTML=``,k.disabled=!1,e.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`gp-slot`,n.dataset.slot=`ground-${t}`,w.appendChild(n)}))}function F(e,t){let n=e[t];return typeof n==`number`?n:void 0}function I(e){return`${e.emoji} ${e.label}${e.tier?` <span class="gp-popover-tier">(${e.tier})</span>`:``}`}function L(e,t){let n=[];e.category===`currency`&&e.count&&n.push(`<div class="gp-popover-stat"><span>Count</span><span>${e.count}</span></div>`);let r=Ne[e.category];if(r){let i=F(e,r.key);if(i!==void 0){let e=t?F(t,r.key):void 0,a=e===void 0?``:Ie(i-e);n.push(`<div class="gp-popover-stat"><span>${r.label}</span><span>${i}${a}</span></div>`)}}if(e.durability){let r=t?.durability,i=r?Ie(e.durability.max-r.max):``;n.push(`<div class="gp-popover-stat"><span>Durability</span><span>${e.durability.current}/${e.durability.max}${i}</span></div>`)}return n.join(``)}function R(){let e=o?M(o):void 0;if(!o||!e){A.remove();return}let n=Pe.includes(e.category)?t.get(`equip-${e.category}`):void 0,r=n&&n.id!==e.id?n:void 0,i=`
      <div class="gp-popover-col">
        <div class="gp-popover-hdr">${I(e)}</div>
        ${L(e,r)||`<div class="gp-popover-stat"><span>No stats yet</span><span></span></div>`}
      </div>
    `;r&&(i+=`
        <div class="gp-popover-col gp-popover-col-sub">
          <div class="gp-popover-hdr gp-popover-hdr-sub">Equipped: ${I(r)}</div>
          ${L(r)}
        </div>
      `),A.innerHTML=i,D.appendChild(A)}function z(){N(),P();let e=[`equip-weapon`,`equip-armor`,`equip-bow`,`bagequip-1`,`bagequip-2`,...n.map((e,t)=>`pool-${t}`),...s().map((e,t)=>`ground-${t}`)];for(let t of e){let e=b.querySelector(`[data-slot="${t}"]`);if(!e)continue;let n=M(t),r=e.dataset.cat;e.innerHTML=Fe(n,r),e.classList.toggle(`gp-empty`,!n),e.classList.toggle(`gp-selected`,t===o),e.title=n?`${n.label}${n.tier?` (${n.tier})`:``}`:``}R(),U(),g(),y()}function B(e,t){e.classList.remove(`gp-reject`),e.offsetWidth,e.classList.add(`gp-reject`),O.textContent=t,o=null,z()}function V(e,r){e.startsWith(`pool-`)?n[Number(e.split(`-`)[1])]=r:t.set(e,r)}function H(e){let t=[...s()],[n]=t.splice(e,1);return c(t),n}function ee(e,r){let i=M(e);if(!o){if(!i)return;o=e,O.textContent=`Holding ${i.emoji} ${i.label} — tap a destination, or the same tile to cancel.`,z();return}if(o===e){o=null,O.textContent=`Cancelled.`,z();return}if(e.startsWith(`ground-`)){if(!i){o=e,z();return}o=e,O.textContent=`Holding ${i.emoji} ${i.label} — tap a destination, or the same tile to cancel.`,z();return}let a=M(o),u=o.startsWith(`ground-`),d=e.startsWith(`equip-`)||e.startsWith(`bagequip-`),f=r.dataset.cat;if(d){if(a.category!==f){B(r,`${a.label} can't go in the ${f} slot.`);return}let i=t.get(e);if(t.set(e,a),u){if(H(Number(o.split(`-`)[1])),i&&c([...s(),i]),O.textContent=i?`Equipped ${a.label}, ${i.label} placed back on the ground.`:`Equipped ${a.label}.`,e.startsWith(`bagequip-`)){let e=l();for(;n.length<e;)n.push(void 0)}}else if(V(o,i),O.textContent=i?`Swapped ${a.label} ⇄ ${i.label}.`:`Equipped ${a.label}.`,e.startsWith(`bagequip-`)){let e=l();for(;n.length<e;)n.push(void 0)}o=null,z();return}if(e.startsWith(`pool-`)){let t=Number(e.split(`-`)[1]),i=n[t];if(u){if(i){B(r,`That slot is full — pick an open one.`);return}H(Number(o.split(`-`)[1])),n[t]=a,O.textContent=`Took ${a.label} into the pool.`}else n[t]=a,V(o,i),O.textContent=i?`Swapped ${a.label} ⇄ ${i.label}.`:`Moved ${a.label}.`;o=null,z();return}o=null,z()}function U(){b.querySelectorAll(`[data-slot]`).forEach(e=>{e.onclick=()=>ee(e.dataset.slot,e)})}k.addEventListener(`click`,()=>{let e=[...s()],t=0,r=[];for(let i of e)if(i.category===`currency`&&i.stackLimit&&i.label===`Gold`){let e=i.count??1;for(let t=0;t<n.length&&e>0;t++){let r=n[t];if(r&&r.label===`Gold`&&(r.count??0)<i.stackLimit){let t=i.stackLimit-(r.count??0),n=Math.min(t,e);r.count=(r.count??0)+n,e-=n}}for(;e>0;){let t=n.findIndex(e=>!e);if(t===-1)break;let r=Math.min(i.stackLimit,e);n[t]={...i,id:K(),count:r},e-=r}e>0?r.push({...i,count:e}):t++}else{let e=n.findIndex(e=>!e);if(e===-1){r.push(i);continue}n[e]=i,t++}c(r),o=null,O.textContent=r.length>0?`Took ${t} item(s) — ${r.length} left on the ground, no room.`:`Took all ${t} item(s).`,z()}),e.querySelector(`#gp-drop-btn`).addEventListener(`click`,()=>{if(!o||!o.startsWith(`pool-`)){O.textContent=`Hold a pool item first to drop it.`;return}let e=Number(o.split(`-`)[1]),t=n[e];t&&(n[e]=void 0,r=[...r,t],o=null,O.textContent=`Dropped ${t.label} at your own feet.`,z())}),e.querySelector(`#gp-close-btn`).addEventListener(`click`,()=>{b.style.display=`none`,A.remove(),a=null,o=null}),z()}var Re=`
<style>
  /* Chrome (headings, section labels, descriptions, demo controls) follows the
     docs hub's theme variables like a markdown doc would — see CLAUDE.md's
     "Theming interactive docs". Only the equip/bag slot grid below is a
     genuine mockup of the real in-game screen, so that part keeps fixed
     values lifted verbatim from styles/styles.css regardless of the docs
     hub's light/dark toggle. */
  .inv-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .inv-wrap h1 {
    font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;
  }
  .inv-wrap .inv-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 24px; max-width: 640px; }
  .inv-sec-lbl {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }

  /* ── Real-game stage — the real .inventory-box dark modal panel
     (styles.css:442-462), values copied verbatim except position:fixed
     (this mockup renders inline in the docs page's own flow, not pinned to
     a real viewport — same precedent docs-npc-dialogue.ts's own box uses). ── */
  .inv-stage-scroll { overflow-x: auto; max-width: 100%; }
  .inv-stage {
    background: rgba(20,20,20,0.94);
    border: 3px solid #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    display: inline-block;
    padding: 12px 14px;
    border-radius: 12px;
    width: min(94vw, 560px);
    max-height: 80vh;
    overflow-y: auto;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }
  .inv-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
  .inv-row-label { color: #FFD700; font-size: 0.72rem; font-weight: bold; letter-spacing: 0.04em; }
  /* Mirrors the real .inv-equip-row (styles/styles.css) — a fixed count of
     equip slots (3 here: weapon/armor/bow, plus 4 bag slots) plus one
     divider, laid out as fr grid columns so they always fill the stage's
     own width exactly, with no wrap, at any width. */
  .inv-equip-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr) auto repeat(4, 1fr);
    align-items: stretch;
    gap: 1.8%;
    width: 100%;
    container-type: inline-size;
  }
  .inv-equip-row .inv-tile { width: 100%; height: auto; aspect-ratio: 1 / 1; font-size: 6.2cqw; }
  .inv-equip-divider { width: 2px; align-self: stretch; background: rgba(255,255,255,0.28); }
  .inv-tile {
    width: 52px; height: 52px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 26px;
    position: relative; box-sizing: border-box; cursor: pointer; user-select: none;
    transition: box-shadow 0.12s, transform 0.12s;
  }
  .inv-tile.inv-equip-slot { background: rgba(255, 215, 0, 0.08); border: 1px dashed rgba(255, 215, 0, 0.5); }
  .inv-tile.inv-empty-slot { opacity: 0.5; }
  .inv-tile.inv-selected { box-shadow: 0 0 0 3px #FFD700 inset; transform: scale(1.08); z-index: 2; }
  .inv-tile.inv-reject { animation: invReject 0.32s ease-in-out; }
  @keyframes invReject {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .inv-tile.inv-break {
    animation: invBreak 0.4s ease-in forwards;
  }
  @keyframes invBreak {
    0%   { transform: scale(1);   opacity: 1; }
    60%  { transform: scale(1.3); opacity: 0.7; }
    100% { transform: scale(0.2); opacity: 0; }
  }
  /* Matches the real .inv-badge count-overlay values (styles.css:493-497). */
  .inv-badge {
    position: absolute; top: 1px; right: 1px; background: rgba(0,0,0,0.75); color: white;
    font-size: 0.32em; font-family: monospace; padding: 0 3px; border-radius: 3px;
    line-height: 1.4; min-width: 1.4em; text-align: center; pointer-events: none;
  }
  .inv-durability {
    position: absolute; left: 2px; right: 2px; bottom: 2px; height: 3px;
    background: rgba(0,0,0,0.5); border-radius: 2px; overflow: hidden;
  }
  .inv-durability-fill { height: 100%; background: #7CFC00; }
  .inv-durability-fill.inv-dur-low { background: #ff6666; }

  /* The single flat pool grid — every equipped backpack's capacity, all one
     top-left-justified grid, no per-bag rows/sections. Real .inv-pool-grid
     (styles.css:471) reflows freely rather than a fixed-column CSS grid. */
  .inv-pool-hdr { color: rgba(255,255,255,0.7); font-size: 0.68rem; margin: 14px 0 6px; }
  .inv-pool-grid {
    display: flex; flex-wrap: wrap; gap: 5px;
  }

  /* Flying spill item — travels from its old cell to its new one when a
     backpack breaks (docs/backpack-drops.md's "Contents on destruction").
     font-size matches the corrected .inv-tile glyph size (20px) it flies out of. */
  .inv-spill {
    position: fixed; pointer-events: none; font-size: 20px; z-index: 30;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Chrome: demo controls, buttons, state label — theme vars, not a mockup ── */
  .inv-btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .inv-btn {
    padding: 7px 14px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; transition: background 0.1s, border-color 0.1s;
  }
  .inv-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .inv-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .inv-btn.inv-sec { background: transparent; color: var(--muted); border-color: var(--border); }
  .inv-state-lbl { margin-top: 10px; font-size: 0.75rem; color: var(--muted); min-height: 1.3em; }
  .inv-hint { font-size: 0.72rem; color: var(--muted); margin-top: 4px; max-width: 560px; }

  /* ── Capacity tuning panel — same paired range+number + Copy-as-JSON
     convention as docs-entity-health-bar.ts, applied to inventory-system.md's
     own structural numbers (bag count / max backpack capacity). This is a
     calculator panel, not a reflow of the fixed 4-bag demo grid above —
     see inventory-system.md's plan addendum. ── */
  .inv-control-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 14px;
    padding: 18px 16px; display: flex; flex-direction: column; gap: 14px; max-width: 520px;
  }
  .inv-control-row { display: flex; align-items: center; gap: 10px; }
  .inv-control-label { font-size: 0.82rem; color: var(--text); min-width: 170px; }
  .inv-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; }
  .inv-wrap input[type=number] {
    width: 64px; padding: 6px 8px; background: var(--search-bg); border: 1px solid var(--search-border);
    border-radius: 8px; color: var(--text); font-size: 0.9rem; text-align: right;
  }
  .inv-total-lbl { font-size: 0.85rem; color: var(--heading); font-weight: bold; }
  .inv-cap-bars { display: flex; flex-direction: column; gap: 6px; }
  .inv-cap-bar-row { display: flex; align-items: center; gap: 8px; }
  .inv-cap-bar-label { font-size: 0.74rem; color: var(--muted); width: 60px; flex-shrink: 0; }
  .inv-cap-bar-track { flex: 1; height: 14px; background: var(--search-bg); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .inv-cap-bar-fill { height: 100%; background: var(--link); }
  .inv-json {
    background: var(--pre-bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace; font-size: 0.78rem; color: var(--pre-color);
    white-space: pre; overflow-x: auto; margin-top: 10px;
  }
</style>

<div class="inv-wrap">
  <h1>🎒 Inventory Screen</h1>
  <p class="inv-intro">
    Mockup of <code>docs/inventory-system.md</code>'s proposed screen: an
    <strong>equip section</strong> (weapon / armor / bow, plus Bag 1-4's own
    backpack slots — a backpack is worn gear too, so it equips the same way,
    just in the same row rather than a separate one per bag) sitting above
    <strong>one flat pool of content slots</strong>, top-left justified.
    Bags don't hold or track which items are "in" them — equipping a
    backpack into one of the 4 tiles above just grows the pool by that
    backpack's capacity (up to a hard 8-slot ceiling per bag), and
    unequipping shrinks it back down (dropping whatever no longer fits).
    There's no separate "pockets" concept — a fresh run just starts with a
    fixed capacity-3 backpack already equipped into Bag 1, an ordinary
    backpack like any other. Click an item to pick it up, then click a
    destination slot to drop it there — standing in for the real
    D-pad-cursor + Select-button flow the design doc describes, since a
    mouse/touch docs-hub page has no D-pad of its own to drive.
  </p>

  <div class="inv-sec-lbl">Equipped &amp; Inventory — Interactive</div>
  <p class="inv-hint">The stage is capped at the real screen's own width (min(94vw, 560px)) — the equip row's slots plus the divider are laid out as fr grid columns, so they always fill the full row width with no wrap and no scroll, exactly like the real .inv-equip-row does.</p>
  <div class="inv-stage-scroll">
    <div class="inv-stage">
      <div class="inv-row">
        <div class="inv-row-label">EQUIPPED</div>
        <div class="inv-equip-row">
          <div class="inv-tile inv-equip-slot" data-slot="equip-weapon" data-cat="weapon"></div>
          <div class="inv-tile inv-equip-slot" data-slot="equip-armor" data-cat="armor"></div>
          <div class="inv-tile inv-equip-slot" data-slot="equip-bow" data-cat="bow"></div>
          <div class="inv-equip-divider"></div>
          <div class="inv-tile inv-equip-slot" data-slot="bagequip-1" data-cat="backpack"></div>
          <div class="inv-tile inv-equip-slot" data-slot="bagequip-2" data-cat="backpack"></div>
          <div class="inv-tile inv-equip-slot" data-slot="bagequip-3" data-cat="backpack"></div>
          <div class="inv-tile inv-equip-slot" data-slot="bagequip-4" data-cat="backpack"></div>
        </div>
      </div>
      <div class="inv-pool-hdr" id="inv-pool-hdr">Inventory — 0 / 0 slots used</div>
      <div class="inv-pool-grid" id="inv-pool-grid"></div>
    </div>
  </div>
  <div class="inv-state-lbl" id="inv-state-lbl">Click any filled slot to pick it up.</div>

  <div class="inv-sec-lbl" style="margin-top:22px;">Demo Controls</div>
  <p class="inv-hint">
    Spawn sample drops into the first open pool slot (data-driven — one
    entry per demo item, same "declare the list, render/wire it
    generically" idiom <code>docs-dungeon-generator.ts</code> uses for its
    tuning sliders). Backpacks spawn as loose cargo, not equipped — drag one
    onto an empty 🎒 tile in the EQUIPPED row (Bag 1/2/3/4's own equip
    slots, right after weapon/armor/bow) to equip it there, growing the
    pool. Dragging an equipped backpack back out — or breaking it — shrinks
    the pool by that backpack's capacity; anything that no longer fits
    drops on the ground, per <code>backpack-drops.md</code>. For now, only
    Gold stacks, capped at 50 per slot — spawn a few Keys to see everything
    else take one slot per pickup with no merging, or keep clicking
    <code>+ Gold</code> to watch it top off the existing stack and spill
    into a new one past 50.
  </p>
  <div class="inv-btn-row" id="inv-spawn-row"></div>
  <div class="inv-btn-row">
    <button class="inv-btn" id="inv-break-bag1">💥 Break Bag 1's backpack (durability → 0)</button>
    <button class="inv-btn" id="inv-reset">↺ Reset Demo</button>
  </div>

  <div class="inv-sec-lbl" style="margin-top:28px;">Tuning — inventory-system.md's Capacity Numbers</div>
  <p class="inv-hint">
    A calculator for the structural numbers behind the fixed 4-equippable-bag
    layout above (which stays fixed at 4 bags in the demo — see
    <code>inventory-system.md</code>) — how bag count and the max backpack
    capacity combine into the total achievable inventory size.
  </p>
  <div class="inv-control-card">
    <div class="inv-control-row">
      <span class="inv-control-label">Equippable Bag Count</span>
      <input type="range" id="inv-t-bags-range" min="1" max="8" step="1">
      <input type="number" id="inv-t-bags-number" min="1" max="8" step="1">
    </div>
    <div class="inv-control-row">
      <span class="inv-control-label">Max Backpack Capacity</span>
      <input type="range" id="inv-t-maxcap-range" min="1" max="8" step="1">
      <input type="number" id="inv-t-maxcap-number" min="1" max="8" step="1">
    </div>
    <div class="inv-total-lbl" id="inv-t-total"></div>
    <div class="inv-cap-bars" id="inv-t-bars"></div>
    <div class="inv-btn-row">
      <button class="inv-btn" id="inv-t-copy-btn">📋 Copy as JSON</button>
      <button class="inv-btn inv-sec" id="inv-t-reset-btn">↺ Reset to Documented Defaults</button>
      <span class="inv-state-lbl" id="inv-t-copy-lbl" style="margin:0;"></span>
    </div>
  </div>
  <div class="inv-json" id="inv-t-json"></div>
</div>
`,ze={bagSlotCount:4,maxBackpackCapacity:8},Be=999,Ve=[{emoji:`🗡`,label:`Sword`,category:`weapon`,durability:{current:20,max:20}},{emoji:`🪓`,label:`Axe`,category:`weapon`,durability:{current:14,max:14}},{emoji:`🧥`,label:`Leather`,category:`armor`,durability:{current:22,max:22}},{emoji:`🏹`,label:`Long Bow`,category:`bow`,durability:{current:18,max:18}},{emoji:`🫐`,label:`Berry`,category:`food`,durability:{current:50,max:50}},{emoji:`🔑`,label:`Key`,category:`currency`},{emoji:`💰`,label:`Gold`,category:`currency`,count:20,stackLimit:Be},{emoji:`👝`,label:`Pouch`,category:`backpack`,durability:{current:25,max:25},capacity:2},{emoji:`🎒`,label:`Satchel`,category:`backpack`,durability:{current:20,max:20},capacity:4},{emoji:`🎒`,label:`Rucksack`,category:`backpack`,durability:{current:13,max:13},capacity:6},{emoji:`🎒`,label:`Expedition Pack`,category:`backpack`,durability:{current:8,max:8},capacity:8}];function He(){return Math.random().toString(36).slice(2,9)}function Ue(e){let t=e.querySelector(`#inv-state-lbl`),n=e.querySelector(`.inv-stage`),r=e.querySelector(`#inv-pool-grid`),i=e.querySelector(`#inv-pool-hdr`),a=new Map,o=[],s=null,c={1:void 0,2:void 0,3:void 0,4:void 0};function l(){let e=0;for(let t of[1,2,3,4])e+=c[t]?.capacity??0;return e}function u(e,t){for(;o.length<e;)o.push(void 0);let n=0;for(;o.length>e;){let e=o.pop();if(e){let r=o.findIndex((e,n)=>!e&&n!==t);r===-1?n++:o[r]=e}}return{droppedCount:n}}function d(e){return e>0?` ${e} item(s) no longer fit and dropped on the ground.`:``}function f(e,t){let n=e.stackLimit,r=t;for(let t=0;t<o.length&&r>0;t++){let i=o[t];if(i&&i.label===e.label&&(i.count??0)<n){let e=n-(i.count??0),t=Math.min(e,r);i.count=(i.count??0)+t,r-=t}}for(;r>0;){let t=o.findIndex(e=>!e);if(t===-1)break;let i=Math.min(n,r);o[t]={...e,id:He(),count:i},r-=i}return r}function p(e){let t=c[e];return t?`Bag ${e} — ${t.label} (+${t.capacity} slots)`:`Bag ${e} — no backpack equipped. Drop a backpack here to equip it.`}function m(){a.clear(),o.length=0,c[1]=void 0,c[2]=void 0,c[3]=void 0,c[4]=void 0,a.set(`equip-weapon`,{id:He(),emoji:`🗡`,label:`Sword`,category:`weapon`,durability:{current:12,max:20}}),a.set(`equip-armor`,void 0),a.set(`equip-bow`,void 0),c[1]={id:He(),emoji:`🎒`,label:`Satchel`,category:`backpack`,durability:{current:20,max:20},capacity:3},u(l()),o[0]={id:He(),emoji:`💰`,label:`Gold`,category:`currency`,count:42,stackLimit:Be},s=null,v()}let h={weapon:`🗡️`,armor:`🥋`,bow:`🏹`,food:`🍎`,backpack:`🎒`,currency:``};function g(e,t){if(!e)return t?h[t]:``;let n=``;e.category===`backpack`&&e.capacity?n=`<span class="inv-badge">${e.capacity}</span>`:e.count&&e.count>1&&(n=`<span class="inv-badge">${e.count}</span>`);let r=``;if(e.durability){let t=Math.max(0,e.durability.current/e.durability.max)*100;r=`<div class="inv-durability"><div class="inv-durability-fill${t<30?` inv-dur-low`:``}" style="width:${t}%"></div></div>`}return`${e.emoji}${n}${r}`}function _(){r.innerHTML=``;for(let e=0;e<o.length;e++){let t=document.createElement(`div`);t.className=`inv-tile`,t.dataset.slot=`pool-${e}`,r.appendChild(t)}i.textContent=`Inventory — ${o.filter(Boolean).length} / ${o.length} slots used`}function v(){_();let e=[...a.entries()];for(let t of[1,2,3,4])e.push([`bagequip-${t}`,c[t]]);for(let t=0;t<o.length;t++)e.push([`pool-${t}`,o[t]]);for(let[t,r]of e){let e=n.querySelector(`[data-slot="${t}"]`);if(!e)continue;let i=e.dataset.cat;e.innerHTML=g(r,i),e.classList.toggle(`inv-empty-slot`,!r),e.classList.toggle(`inv-selected`,t===s),t.startsWith(`bagequip-`)?e.title=p(Number(t.split(`-`)[1])):e.title=r?r.label:``}x()}function y(e,n){e.classList.remove(`inv-reject`),e.offsetWidth,e.classList.add(`inv-reject`),t.textContent=`🚫 ${n}`,s=null,v()}function b(e){return e.startsWith(`pool-`)?o[Number(e.split(`-`)[1])]:e.startsWith(`bagequip-`)?c[Number(e.split(`-`)[1])]:a.get(e)}function x(){n.querySelectorAll(`[data-slot]`).forEach(e=>{e.onclick=()=>S(e.dataset.slot,e)})}function S(e,n){let r=b(e);if(!s){if(!r)return;s=e,t.textContent=`Holding ${r.label} — click a destination slot (or the same slot to cancel).`,v();return}if(s===e){s=null,t.textContent=`Cancelled — click any filled slot to pick it up.`,v();return}let i=b(s),f=s,p=f.startsWith(`bagequip-`);if(e.startsWith(`bagequip-`)){if(i.category!==`backpack`){y(n,`${i.label} isn't a backpack — only a backpack can be equipped into a bag slot.`);return}let r=Number(e.split(`-`)[1]),a=c[r];if(p){let e=Number(f.split(`-`)[1]);c[r]=i,c[e]=a;let n=u(l()),o=a?a.label:`nothing`;t.textContent=`🎒 Swapped Bag ${e}'s ${i.label} ⇄ Bag ${r}'s ${o}.`+d(n.droppedCount)}else{let e=Number(f.split(`-`)[1]),s=l()-(a?.capacity??0)+i.capacity;if(e>=s){y(n,`Can't equip ${i.label} — that would shrink the pool below the slot it's sitting in. Move it to an earlier slot first.`);return}o[e]=void 0,c[r]=i;let p=u(s,e);o[e]=a;let m=a?` (replacing ${a.label}, now loose)`:``;t.textContent=`🎒 Equipped ${i.label} into Bag ${r}${m}.`+d(p.droppedCount)}s=null,v();return}if(p){let a=Number(f.split(`-`)[1]);if(r&&r.category!==`backpack`){y(n,`Can't put ${r.label} where a backpack was equipped — drop the backpack into an empty slot instead.`);return}let p=e.startsWith(`pool-`)?Number(e.split(`-`)[1]):null;if(p===null){y(n,`${i.label} can't go there — drop it into an inventory slot.`);return}let m=l()-i.capacity;if(p>=m){y(n,`Can't unequip ${i.label} there — that slot won't exist once the pool shrinks. Try an earlier slot.`);return}o[p]=void 0,c[a]=r;let h=u(m,p);o[p]=i,t.textContent=`🎒 Unequipped ${i.label} from Bag ${a}.`+d(h.droppedCount),s=null,v();return}let m=e.startsWith(`equip-`),h=n.dataset.cat;if(m&&i.category!==h){y(n,`${i.label} can't go in the ${h} slot — wrong category.`);return}if(m&&i.category===`currency`){y(n,`${i.label} has no equip slot.`);return}if(m){let n=a.get(e);a.set(e,i),C(f,n),t.textContent=n?`Swapped ${i.label} ⇄ ${n.label}.`:`Moved ${i.label}.`}else{let n=Number(e.split(`-`)[1]),r=o[n];o[n]=i,C(f,r),t.textContent=r?`Swapped ${i.label} ⇄ ${r.label}.`:`Moved ${i.label}.`}s=null,v()}function C(e,t){e.startsWith(`pool-`)?o[Number(e.split(`-`)[1])]=t:a.set(e,t)}let w=e.querySelector(`#inv-spawn-row`);for(let e of Ve){let n=document.createElement(`button`);n.className=`inv-btn`,n.textContent=e.stackLimit?`${e.emoji} + ${e.count} ${e.label}`:`${e.emoji} + ${e.label}`,n.addEventListener(`click`,()=>{if(e.stackLimit){let n=f(e,e.count??1);t.textContent=n>0?`Picked up ${(e.count??1)-n} ${e.label} (topping off/starting stacks); ${n} couldn't fit — the pool is fully stacked.`:`Picked up ${e.count} ${e.label} (topping off existing stacks first, capped at ${e.stackLimit} each).`,v();return}let n=o.findIndex(e=>!e);if(n===-1){t.textContent=`🚫 No open inventory slot — the whole pool is full.`;return}o[n]={...e,id:He()},t.textContent=e.category===`backpack`?`Spawned ${e.label} into an open slot — drag it onto an empty 🎒 bag-equip tile to equip it.`:`Spawned ${e.label} into an open slot.`,v()}),w.appendChild(n)}e.querySelector(`#inv-break-bag1`).addEventListener(`click`,()=>{let e=c[1];if(!e){t.textContent=`🚫 Bag 1 has no backpack equipped — nothing to break.`;return}n.querySelector(`[data-slot="bagequip-1"]`).classList.add(`inv-break`),setTimeout(()=>{c[1]=void 0;let n=u(l());t.textContent=`💥 Bag 1's ${e.label} broke.`+d(n.droppedCount),s=null,v()},380)}),e.querySelector(`#inv-reset`).addEventListener(`click`,()=>{m(),t.textContent=`Reset — click any filled slot to pick it up.`});let T={...ze},E=e.querySelector(`#inv-t-bags-range`),D=e.querySelector(`#inv-t-bags-number`),O=e.querySelector(`#inv-t-maxcap-range`),k=e.querySelector(`#inv-t-maxcap-number`),A=e.querySelector(`#inv-t-total`),j=e.querySelector(`#inv-t-bars`),M=e.querySelector(`#inv-t-copy-btn`),N=e.querySelector(`#inv-t-reset-btn`),P=e.querySelector(`#inv-t-copy-lbl`),F=e.querySelector(`#inv-t-json`);function I(){E.value=D.value=String(T.bagSlotCount),O.value=k.value=String(T.maxBackpackCapacity),A.textContent=`Total capacity range: 0 (no bags equipped) – ${T.bagSlotCount*T.maxBackpackCapacity} (${T.bagSlotCount} × ${T.maxBackpackCapacity}, all bags at max)`;let e=[];for(let t=0;t<T.bagSlotCount;t++)e.push(`<div class="inv-cap-bar-row"><span class="inv-cap-bar-label">Bag ${t+1}</span><div class="inv-cap-bar-track"><div class="inv-cap-bar-fill" style="width:100%"></div></div></div>`);j.innerHTML=e.join(``),F.textContent=JSON.stringify(T,null,2)}function L(e,t,n){let r=e=>{let t=Number(e);Number.isNaN(t)||(n(t),I())};e.addEventListener(`input`,()=>r(e.value)),t.addEventListener(`input`,()=>r(t.value))}L(E,D,e=>{T.bagSlotCount=Math.max(1,Math.min(8,Math.round(e)))}),L(O,k,e=>{T.maxBackpackCapacity=Math.max(1,Math.min(8,Math.round(e)))});let R;M.addEventListener(`click`,async()=>{let e=JSON.stringify(T,null,2);try{await navigator.clipboard.writeText(e),P.textContent=`✅ Copied to clipboard!`}catch{P.textContent=`⚠️ Clipboard blocked — copy the JSON below manually`}R&&clearTimeout(R),R=setTimeout(()=>{P.textContent=``},2200)}),N.addEventListener(`click`,()=>{T={...ze},I()}),I(),m()}var We=`
<style>
  /* Chrome (headings, descriptions, demo controls) follows the docs hub's
     theme variables — see CLAUDE.md's "Theming interactive docs". The
     control-pad reproduction and the firing-lane tile row are genuine
     mockups of the real #controls widget and #world tile grid, so those
     keep fixed values lifted verbatim from styles/styles.css. */
  .rng-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .rng-wrap h1 {
    font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;
  }
  .rng-wrap .rng-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 24px; max-width: 640px; }
  .rng-sec-lbl {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .rng-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.55; max-width: 560px; margin: 0 0 14px; }

  /* ── Real control pad — values copied verbatim from styles.css's
     .ctrl-btn/.ctrl-cross/.ctrl-hub/.ctrl-context-icon rules. ── */
  .rng-pad-stage { background: forestgreen; display: inline-block; padding: 18px; border-radius: 6px; }
  .rng-cross {
    display: grid; grid-template-columns: repeat(3, 64px); grid-template-rows: repeat(3, 64px);
    gap: 4px; -webkit-tap-highlight-color: transparent;
  }
  .rng-noop { background: transparent; pointer-events: none; }
  .rng-hub { background: rgba(5,35,5,0.8); border: 2px solid rgba(45,122,45,0.35); border-radius: 50%; }
  .rng-ctrl-btn {
    position: relative; width: 64px; height: 64px; box-sizing: border-box;
    background: rgba(15,70,15,0.92); border: 2px solid #2d7a2d; border-radius: 12px;
    font-size: 22px; display: flex; align-items: center; justify-content: center;
    color: #bbddbb; box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    cursor: pointer; transition: background 0.08s, color 0.08s, border-color 0.15s;
  }
  .rng-ctrl-btn:active { background: rgba(50,150,50,0.95); color: white; transform: scale(0.93); }
  .rng-ctrl-context { position: absolute; top: 2px; right: 3px; font-size: 12px; }
  /* Aim mode: direction buttons restyle with a bow accent border + context icon,
     per ranged-attacks.md's "data-aiming state on #controls restyles them". */
  .rng-cross.rng-aiming .rng-ctrl-btn { border-color: #d99a2b; box-shadow: 0 0 0 2px rgba(217,154,43,0.35), 0 2px 6px rgba(0,0,0,0.4); }
  .rng-fire-btn {
    margin-top: 14px; padding: 10px 20px; background: rgba(15,70,15,0.92); border: 2px solid #2d7a2d;
    border-radius: 10px; color: #bbddbb; font-size: 0.9rem; cursor: pointer; display: block;
  }
  .rng-fire-btn.rng-fire-active { border-color: #d99a2b; color: #ffe4a8; }
  .rng-fire-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Firing lane — real .tile 56px sizing/colors from styles.css ── */
  .rng-stage-scroll { overflow-x: auto; max-width: 100%; }
  .rng-stage { background: forestgreen; display: inline-block; padding: 10px; border-radius: 6px; font-family: Arial, sans-serif; }
  .rng-lane { display: flex; gap: 0; position: relative; }
  .rng-tile {
    width: 56px; height: 56px; background: green; border: 1px solid forestgreen;
    display: flex; align-items: center; justify-content: center; font-size: 32px;
    box-sizing: border-box; position: relative; cursor: pointer; user-select: none;
  }
  .rng-tile.rng-player { cursor: default; }
  .rng-tile.rng-out-of-range { opacity: 0.45; }
  .rng-range-tick {
    position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
    font-size: 8px; color: #cdf5cd; font-family: monospace;
  }
  .rng-arrow {
    position: absolute; top: 50%; left: 0; transform: translateY(-50%); font-size: 30px;
    pointer-events: none; z-index: 5; transition: left linear;
  }
  .rng-hit-flash { animation: rngHitFlash 0.3s ease-out; }
  @keyframes rngHitFlash {
    0% { background: #ff4444; } 100% { background: green; }
  }
  .rng-dmg-pop {
    position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
    color: #ff6666; font-weight: bold; font-size: 0.8rem; pointer-events: none;
    animation: rngDmgFloat 0.6s ease-out forwards;
  }
  @keyframes rngDmgFloat { 0% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, -18px); } }

  .rng-btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .rng-btn {
    padding: 7px 14px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; transition: background 0.1s, border-color 0.1s;
  }
  .rng-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .rng-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .rng-btn.rng-active { border-color: #d99a2b; color: var(--heading); }
  .rng-state-lbl { margin-top: 10px; font-size: 0.75rem; color: var(--muted); min-height: 1.3em; }
  .rng-range-row { font-size: 0.78rem; color: var(--muted); margin-bottom: 10px; }
</style>

<div class="rng-wrap">
  <h1>🏹 Ranged Attacks (Bow)</h1>
  <p class="rng-intro">
    Mockup of <code>docs/ranged-attacks.md</code>'s new mechanic: a bow lets
    the player hit an enemy at range along a straight line, without moving.
    Two things to try below — the proposed <strong>aim-mode control input</strong>
    (a dedicated Fire button repurposing the D-pad), and the
    <strong>line-of-sight resolution</strong> (obstacle blocks, enemy gets
    hit, empty range just misses).
  </p>

  <div class="rng-sec-lbl">1 — Aiming: Control Flow</div>
  <p class="rng-desc">
    Tap Fire to enter aim mode — the 4 direction buttons restyle (per
    <code>ranged-attacks.md</code>'s <code>data-aiming</code> proposal) and a
    🏹 context icon appears on each. Tap Fire again to cancel for free. This
    reproduces <code>controls-render.ts</code>'s real button markup/CSS
    classes, not a reimplementation.
  </p>
  <div class="rng-pad-stage">
    <div class="rng-cross" id="rng-cross">
      <div class="rng-noop"></div>
      <button class="rng-ctrl-btn" data-dir="up">▲<span class="rng-ctrl-context"></span></button>
      <div class="rng-noop"></div>
      <button class="rng-ctrl-btn" data-dir="left">▲<span class="rng-ctrl-context"></span></button>
      <div class="rng-hub"></div>
      <button class="rng-ctrl-btn" data-dir="right">▲<span class="rng-ctrl-context"></span></button>
      <div class="rng-noop"></div>
      <button class="rng-ctrl-btn" data-dir="down">▲<span class="rng-ctrl-context"></span></button>
      <div class="rng-noop"></div>
    </div>
    <button class="rng-fire-btn" id="rng-fire-toggle">🏹 Fire</button>
  </div>
  <div class="rng-state-lbl" id="rng-aim-lbl">Not aiming — direction buttons move the player normally.</div>

  <div class="rng-sec-lbl" style="margin-top:32px;">2 — Firing: Line Resolution</div>
  <p class="rng-desc">
    Click a lane tile to cycle it Empty → 🧱 Wall → 🐍 Enemy → Empty, pick a
    bow tier (sets range), then Fire. The shot stops at the first wall
    (no damage), hits the first enemy within range, or misses if the lane is
    clear the whole way out — see <code>ranged-attacks.md</code>'s Behavior
    section 2.
  </p>
  <div class="rng-range-row">
    Bow: <span id="rng-bow-name">Long Bow</span> — range <span id="rng-bow-range">4</span> tiles
  </div>
  <div class="rng-stage-scroll">
    <div class="rng-stage">
      <div class="rng-lane" id="rng-lane"></div>
    </div>
  </div>
  <div class="rng-btn-row" id="rng-tier-row"></div>
  <div class="rng-btn-row">
    <button class="rng-btn" id="rng-fire-shot" disabled>🏹 Fire →</button>
    <button class="rng-btn" id="rng-lane-reset">↺ Reset Lane</button>
  </div>
  <div class="rng-state-lbl" id="rng-lane-lbl">Click a lane tile to place a wall or enemy, then Fire.</div>
  <div class="rng-state-lbl">Equipped bow's durability: <span id="rng-durability">18/18</span></div>
</div>
`,Ge=[{name:`Short Bow`,range:3,durability:14},{name:`Long Bow`,range:4,durability:18},{name:`Composite Bow`,range:5,durability:16},{name:`War Bow`,range:6,durability:10}],Ke=7;function qe(e){let t=e.querySelector(`#rng-cross`),n=e.querySelector(`#rng-fire-toggle`),r=e.querySelector(`#rng-aim-lbl`),i=!1;function a(e){i=e,t.classList.toggle(`rng-aiming`,i),n.classList.toggle(`rng-fire-active`,i),t.querySelectorAll(`.rng-ctrl-context`).forEach(e=>{e.textContent=i?`🏹`:``}),r.textContent=i?`Aiming — tap a direction to fire that way, or tap Fire again to cancel (free).`:`Not aiming — direction buttons move the player normally.`}n.addEventListener(`click`,()=>a(!i)),t.querySelectorAll(`[data-dir]`).forEach(e=>{e.addEventListener(`click`,()=>{if(!i){r.textContent=`Moved ${e.dataset.dir}. (Not aiming — this is a normal move.)`;return}r.textContent=`Fired ${e.dataset.dir}! Shot resolves, then aim mode exits automatically.`,a(!1)})});let o=e.querySelector(`#rng-lane`),s=e.querySelector(`#rng-tier-row`),c=e.querySelector(`#rng-fire-shot`),l=e.querySelector(`#rng-lane-reset`),u=e.querySelector(`#rng-lane-lbl`),d=e.querySelector(`#rng-bow-name`),f=e.querySelector(`#rng-bow-range`),p=e.querySelector(`#rng-durability`),m=Array(Ke-1).fill(`empty`),h=1,g=Ge[h].durability,_=!1;function v(){return Ge[h]}function y(){s.innerHTML=``,Ge.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`rng-btn`+(t===h?` rng-active`:``),n.textContent=`${e.name} (range ${e.range})`,n.addEventListener(`click`,()=>{h=t,g=v().durability,d.textContent=v().name,f.textContent=String(v().range),p.textContent=`${g}/${v().durability}`,y(),x()}),s.appendChild(n)})}function b(e){return e===`wall`?`🧱`:e===`enemy`?`🐍`:``}function x(){o.innerHTML=``;let e=document.createElement(`div`);e.className=`rng-tile rng-player`,e.textContent=`🥷`,o.appendChild(e),m.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`rng-tile`+(t<v().range?``:` rng-out-of-range`),n.textContent=b(e);let r=document.createElement(`div`);r.className=`rng-range-tick`,r.textContent=String(t+1),n.appendChild(r),n.addEventListener(`click`,()=>{_||(m[t]=e===`empty`?`wall`:e===`wall`?`enemy`:`empty`,x())}),o.appendChild(n)}),c.disabled=_||g<=0}function S(){if(_||g<=0)return;_=!0,c.disabled=!0;let e=v().range,t=[...o.querySelectorAll(`.rng-tile`)],n=o.getBoundingClientRect(),r=-1,i=`miss`;for(let t=0;t<Math.min(e,m.length);t++){if(m[t]===`wall`){r=t,i=`wall`;break}if(m[t]===`enemy`){r=t,i=`enemy`;break}}let a=r>=0?r:Math.min(e,m.length)-1,s=t[a+1],l=s.getBoundingClientRect(),d=l.left-n.left+(r>=0?0:l.width),f=document.createElement(`div`);f.className=`rng-arrow`,f.textContent=`➳`,o.appendChild(f),requestAnimationFrame(()=>{f.style.transitionDuration=`${120+a*40}ms`,f.style.left=`${d}px`}),setTimeout(()=>{if(f.remove(),g--,p.textContent=`${Math.max(0,g)}/${v().durability}`,i===`wall`)s.classList.add(`rng-hit-flash`),u.textContent=`🧱 Shot stopped at tile ${r+1} — hit a wall, no damage.`;else if(i===`enemy`){s.classList.add(`rng-hit-flash`);let e=document.createElement(`div`);e.className=`rng-dmg-pop`,e.textContent=`-2`,s.appendChild(e),setTimeout(()=>e.remove(),650),u.textContent=`🎯 Hit the enemy at tile ${r+1}!`}else u.textContent=`💨 Missed — lane was clear for the full ${e}-tile range.`;setTimeout(()=>s.classList.remove(`rng-hit-flash`),320),_=!1,g<=0&&(u.textContent+=` The bow just broke (0 durability) — destroyed, per drops-core.md.`),x()},120+a*40+30)}c.addEventListener(`click`,S),l.addEventListener(`click`,()=>{m=Array(Ke-1).fill(`empty`),m[2]=`enemy`,g=v().durability,p.textContent=`${g}/${v().durability}`,u.textContent=`Lane reset — click a tile to place a wall or enemy, then Fire.`,x()}),m[2]=`enemy`,y(),x()}var Je=`
<style>
  /* Chrome (headings, descriptions, demo controls) follows the docs hub's
     theme variables — see CLAUDE.md's "Theming interactive docs". The HUD
     strip mockup below reproduces the real #health-bar/#fullness-bar markup
     technique and colors, so it stays fixed regardless of the docs hub's
     light/dark toggle — it's meant to be judged against the real HUD, not
     the docs page around it. */
  .flm-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .flm-wrap h1 {
    font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;
  }
  .flm-wrap .flm-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 24px; max-width: 640px; }
  .flm-sec-lbl {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .flm-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.55; max-width: 560px; margin: 0 0 14px; }

  /* ── Real HUD stage — forest backdrop, same idiom every other in-game
     mockup here uses, since the HUD strip renders directly over the board. ── */
  .flm-stage { background: forestgreen; display: inline-block; padding: 16px 20px; border-radius: 6px; }
  .flm-hud-row { display: flex; flex-direction: column; gap: 10px; font-family: Arial, sans-serif; }

  /* Heart/icon + width%-fill bar, copied from styles.css's .hp-bar shape
     (scripts/healthBar.ts) — the real HUD's health and fullness bars both
     render through this exact structure, just with a different icon/color. */
  .flm-bar { display: inline-flex; align-items: center; gap: 6px; }
  .flm-bar-icon { font-size: 20px; line-height: 1; }
  .flm-bar-track {
    position: relative; width: 140px; height: 16px;
    background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 4px; overflow: hidden;
  }
  .flm-bar-ghost { position: absolute; inset: 0; width: 0%; background: #f2a35c; transition: width 0.6s ease-out 0.4s; }
  .flm-bar-fill { position: absolute; inset: 0; width: 0%; background: #3d84c9; transition: width 0.2s ease-out, filter 0.3s; }
  .flm-bar-fill.flm-starving { animation: flmPulse 0.6s ease-in-out infinite; }
  @keyframes flmPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
  .flm-bar-label {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: #fff; text-shadow: 0 1px 1px rgba(0,0,0,0.85); pointer-events: none; white-space: nowrap;
  }

  /* Health bar uses the same .flm-bar-fill/.flm-bar-ghost shape as the
     fullness bar below it, just with the real HUD's red HP color
     (scripts/healthBar.ts's DEFAULT_FILL_COLOR / styles.css's .hp-bar-fill)
     instead of fullness's blue — the real #health-bar has never rendered
     discrete heart icons, it's always been this same width%-fill bar. */
  .flm-bar-fill--health { background: #cc3333; }
  .flm-dmg-pop {
    display: inline-block; color: #ff5555; font-weight: bold; font-size: 0.85rem;
    margin-left: 8px; animation: flmDmgFloat 0.9s ease-out forwards;
  }
  @keyframes flmDmgFloat { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-10px); } }

  .flm-wellfed-badge {
    display: inline-block; font-size: 0.68rem; color: #ffe4a8; background: rgba(0,0,0,0.35);
    border-radius: 10px; padding: 2px 8px; margin-left: 8px;
  }

  .flm-btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .flm-btn {
    padding: 7px 14px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; transition: background 0.1s, border-color 0.1s;
  }
  .flm-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .flm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .flm-btn.flm-active { border-color: #d99a2b; color: var(--heading); }
  .flm-btn.flm-sec { background: transparent; color: var(--muted); border-color: var(--border); }
  .flm-state-lbl { margin-top: 10px; font-size: 0.75rem; color: var(--muted); min-height: 1.3em; }
  .flm-food-row { font-size: 0.72rem; color: var(--muted); margin-top: 4px; }

  /* ── Tuning panel — same paired range+number + Copy-as-JSON convention as
     docs-entity-health-bar.ts, applied to fullness-system.md's own constants. ── */
  .flm-control-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 14px;
    padding: 18px 16px; display: flex; flex-direction: column; gap: 14px; max-width: 520px;
  }
  .flm-control-row { display: flex; align-items: center; gap: 10px; }
  .flm-control-label { font-size: 0.82rem; color: var(--text); min-width: 150px; }
  .flm-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; }
  .flm-wrap input[type=number] {
    width: 64px; padding: 6px 8px; background: var(--search-bg); border: 1px solid var(--search-border);
    border-radius: 8px; color: var(--text); font-size: 0.9rem; text-align: right;
  }
  .flm-unit { font-size: 0.75rem; color: var(--muted); width: 30px; }
  .flm-json {
    background: var(--pre-bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace; font-size: 0.78rem; color: var(--pre-color);
    white-space: pre; overflow-x: auto; margin-top: 10px;
  }
</style>

<div class="flm-wrap">
  <h1>🍗 Fullness Meter</h1>
  <p class="flm-intro">
    Standalone simulation of <code>docs/fullness-system.md</code> — the real
    implementation lives in <code>scripts/fullness.ts</code> (meter/tick/
    starvation) and <code>scripts/food.ts</code> (rolled food stats), driven
    once per turn from <code>player.ts</code>'s <code>move()</code>, with a real
    Eat button on the inventory screen. This preview mirrors that logic (and
    the real HUD's shared heart/icon + width%-fill bar technique from
    <code>scripts/healthBar.ts</code>) without touching live game state, for
    tuning constants and demoing the feel. Fast-forward turns below to watch
    it drain, try eating different foods (<code>docs/food-drops.md</code>) to
    see the instant refill plus the temporary drain-rate slowdown, and let it
    bottom out to see the starving health-drain penalty.
  </p>

  <div class="flm-sec-lbl">HUD — Interactive</div>
  <div class="flm-stage">
    <div class="flm-hud-row">
      <div class="flm-bar">
        <span class="flm-bar-icon">❤️</span>
        <div class="flm-bar-track">
          <div class="flm-bar-ghost" id="flm-health-bar-ghost"></div>
          <div class="flm-bar-fill flm-bar-fill--health" id="flm-health-bar-fill"></div>
          <span class="flm-bar-label" id="flm-health-bar-label"></span>
        </div>
        <span id="flm-dmg-pop-slot"></span>
      </div>
      <div class="flm-bar">
        <span class="flm-bar-icon">🍗</span>
        <div class="flm-bar-track">
          <div class="flm-bar-ghost" id="flm-bar-ghost"></div>
          <div class="flm-bar-fill" id="flm-bar-fill"></div>
          <span class="flm-bar-label" id="flm-bar-label"></span>
        </div>
        <span id="flm-wellfed-slot"></span>
      </div>
    </div>
  </div>
  <div class="flm-state-lbl" id="flm-state-lbl">Turn 0 — fullness 100/100 (full).</div>

  <div class="flm-sec-lbl" style="margin-top:24px;">Advance Time</div>
  <div class="flm-btn-row">
    <button class="flm-btn" id="flm-tick-1">⏭ +1 tick (4 turns)</button>
    <button class="flm-btn" id="flm-tick-10">⏭⏭ +10 ticks</button>
    <button class="flm-btn" id="flm-autoplay">▶ Auto-advance</button>
    <button class="flm-btn" id="flm-reset">↺ Reset</button>
  </div>

  <div class="flm-sec-lbl" style="margin-top:24px;">Eat Food</div>
  <p class="flm-desc">Each food's restore amount and slow-down effect come straight from <code>food-drops.md</code>'s tier table.</p>
  <div class="flm-btn-row" id="flm-food-row"></div>

  <div class="flm-sec-lbl" style="margin-top:28px;">Tuning — fullness-system.md's Constants</div>
  <p class="flm-desc">
    These sliders replace this doc's hardcoded <code>FULLNESS_MAX</code>/<code>FULLNESS_TICK_INTERVAL_TURNS</code>/
    <code>STARVATION_INTERVAL_TURNS</code>/<code>STARVATION_DAMAGE</code> — dragging one changes how the live
    simulation above actually behaves, not just a label.
  </p>
  <div class="flm-control-card">
    <div class="flm-control-row">
      <span class="flm-control-label">Fullness Max</span>
      <input type="range" id="flm-t-max-range" min="20" max="300" step="1">
      <input type="number" id="flm-t-max-number" min="20" max="300" step="1">
    </div>
    <div class="flm-control-row">
      <span class="flm-control-label">Tick Interval</span>
      <input type="range" id="flm-t-tick-range" min="1" max="30" step="1">
      <input type="number" id="flm-t-tick-number" min="1" max="30" step="1">
      <span class="flm-unit">trn</span>
    </div>
    <div class="flm-control-row">
      <span class="flm-control-label">Starvation Interval</span>
      <input type="range" id="flm-t-starve-int-range" min="1" max="30" step="1">
      <input type="number" id="flm-t-starve-int-number" min="1" max="30" step="1">
      <span class="flm-unit">trn</span>
    </div>
    <div class="flm-control-row">
      <span class="flm-control-label">Starvation Damage</span>
      <input type="range" id="flm-t-starve-dmg-range" min="1" max="50" step="1">
      <input type="number" id="flm-t-starve-dmg-number" min="1" max="50" step="1">
    </div>
    <div class="flm-control-row">
      <span class="flm-control-label">Max Health (ref.)</span>
      <input type="range" id="flm-t-health-range" min="10" max="200" step="1">
      <input type="number" id="flm-t-health-number" min="10" max="200" step="1">
    </div>
    <div class="flm-btn-row">
      <button class="flm-btn" id="flm-t-copy-btn">📋 Copy as JSON</button>
      <button class="flm-btn flm-sec" id="flm-t-reset-btn">↺ Reset to Documented Defaults</button>
      <span class="flm-state-lbl" id="flm-t-copy-lbl" style="margin:0;"></span>
    </div>
  </div>
  <div class="flm-json" id="flm-t-json"></div>
</div>
`,Ye={fullnessMax:100,tickTurns:4,starveIntervalTurns:10,starveDamage:17,maxHealth:100},Xe=[{emoji:`🫐`,label:`Berry`,restore:12},{emoji:`🍞`,label:`Bread`,restore:25},{emoji:`🍖`,label:`Meat`,restore:38},{emoji:`🍱`,label:`Feast`,restore:60}];function Ze(e){let t=e.querySelector(`#flm-bar-fill`),n=e.querySelector(`#flm-bar-ghost`),r=e.querySelector(`#flm-bar-label`),i=e.querySelector(`#flm-state-lbl`),a=e.querySelector(`#flm-health-bar-fill`),o=e.querySelector(`#flm-health-bar-ghost`),s=e.querySelector(`#flm-health-bar-label`),c=e.querySelector(`#flm-wellfed-slot`),l=e.querySelector(`#flm-dmg-pop-slot`),u=e.querySelector(`#flm-autoplay`),d={...Ye},f=d.fullnessMax,p=0,m=0,h=d.maxHealth,g=null,_=100;function v(){let e=Math.max(0,Math.min(100,h/d.maxHealth*100));e<_?(o.style.transition=`none`,o.style.width=`${_}%`,o.offsetWidth,o.style.transition=``,o.style.width=`${e}%`):(o.style.transition=`none`,o.style.width=`${e}%`),_=e,a.style.width=`${e}%`,s.textContent=`${Math.max(0,Math.ceil(h))}/${d.maxHealth}`}let y=100;function b(){let e=Math.max(0,Math.min(100,f/d.fullnessMax*100));e<y?(n.style.transition=`none`,n.style.width=`${y}%`,n.offsetWidth,n.style.transition=``,n.style.width=`${e}%`):(n.style.transition=`none`,n.style.width=`${e}%`),y=e,t.style.width=`${e}%`,t.classList.toggle(`flm-starving`,e<=0),r.textContent=`${f}/${d.fullnessMax}`,c.innerHTML=``,v()}function x(){let e=document.createElement(`span`);e.className=`flm-dmg-pop`,e.textContent=`💔 -${d.starveDamage}`,l.appendChild(e),setTimeout(()=>e.remove(),900)}function S(){p++,f=Math.max(0,f-1);let e=Math.max(1,Math.round(d.starveIntervalTurns/d.tickTurns)),t=p*d.tickTurns;f<=0?(m++,m%e===0&&h>0?(h=Math.max(0,h-d.starveDamage),x(),i.textContent=h>0?`Turn ${t} — STARVING, took ${d.starveDamage} damage (health ${h}/${d.maxHealth}).`:`Turn ${t} — starved to death (handleDamage → death path, same as any other damage source).`,h<=0&&g&&C()):i.textContent=`Turn ${t} — STARVING (fullness ${f}/${d.fullnessMax}). Eat something!`):(m=0,i.textContent=`Turn ${t} — fullness ${f}/${d.fullnessMax}.`),b()}function C(){g&&=(clearInterval(g),null),u.textContent=`▶ Auto-advance`,u.classList.remove(`flm-active`)}e.querySelector(`#flm-tick-1`).addEventListener(`click`,()=>S()),e.querySelector(`#flm-tick-10`).addEventListener(`click`,()=>{for(let e=0;e<10;e++)S()}),u.addEventListener(`click`,()=>{if(g){C();return}u.textContent=`⏸ Pause`,u.classList.add(`flm-active`),g=setInterval(S,140)});function w(){C(),f=d.fullnessMax,p=0,m=0,h=d.maxHealth,y=100,_=100,i.textContent=`Turn 0 — fullness ${d.fullnessMax}/${d.fullnessMax} (full).`,b()}e.querySelector(`#flm-reset`).addEventListener(`click`,w);let T=e.querySelector(`#flm-food-row`);for(let e of Xe){let t=document.createElement(`button`);t.className=`flm-btn`,t.innerHTML=`${e.emoji} Eat ${e.label}`,t.addEventListener(`click`,()=>{f=Math.min(d.fullnessMax,f+e.restore),m=0,i.textContent=`Ate ${e.label} — restored ${e.restore} fullness.`,b()}),T.appendChild(t)}let E=e.querySelector(`#flm-t-max-range`),D=e.querySelector(`#flm-t-max-number`),O=e.querySelector(`#flm-t-tick-range`),k=e.querySelector(`#flm-t-tick-number`),A=e.querySelector(`#flm-t-starve-int-range`),j=e.querySelector(`#flm-t-starve-int-number`),M=e.querySelector(`#flm-t-starve-dmg-range`),N=e.querySelector(`#flm-t-starve-dmg-number`),P=e.querySelector(`#flm-t-health-range`),F=e.querySelector(`#flm-t-health-number`),I=e.querySelector(`#flm-t-copy-btn`),L=e.querySelector(`#flm-t-reset-btn`),R=e.querySelector(`#flm-t-copy-lbl`),z=e.querySelector(`#flm-t-json`);function B(){E.value=D.value=String(d.fullnessMax),O.value=k.value=String(d.tickTurns),A.value=j.value=String(d.starveIntervalTurns),M.value=N.value=String(d.starveDamage),P.value=F.value=String(d.maxHealth),z.textContent=JSON.stringify(d,null,2)}function V(e,t,n){let r=e=>{let t=Number(e);Number.isNaN(t)||(n(t),B())};e.addEventListener(`input`,()=>r(e.value)),t.addEventListener(`input`,()=>r(t.value))}V(E,D,e=>{d.fullnessMax=Math.max(20,Math.min(300,e))}),V(O,k,e=>{d.tickTurns=Math.max(1,Math.min(30,Math.round(e)))}),V(A,j,e=>{d.starveIntervalTurns=Math.max(1,Math.min(30,Math.round(e)))}),V(M,N,e=>{d.starveDamage=Math.max(1,Math.min(50,Math.round(e)))}),V(P,F,e=>{d.maxHealth=Math.max(10,Math.min(200,Math.round(e)))});let H;I.addEventListener(`click`,async()=>{let e=JSON.stringify(d,null,2);try{await navigator.clipboard.writeText(e),R.textContent=`✅ Copied to clipboard!`}catch{R.textContent=`⚠️ Clipboard blocked — copy the JSON below manually`}H&&clearTimeout(H),H=setTimeout(()=>{R.textContent=``},2200)}),L.addEventListener(`click`,()=>{d={...Ye},B(),w()}),B(),b()}var Qe=`
<style>
  /* Chrome (headings, descriptions, demo controls) follows the docs hub's
     theme variables — see CLAUDE.md's "Theming interactive docs". The item
     tiles are a genuine mockup of the real in-game tile, so they keep
     fixed values from styles/styles.css regardless of the docs hub's
     light/dark toggle. */
  .brk-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .brk-wrap h1 {
    font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;
  }
  .brk-wrap .brk-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 24px; max-width: 640px; }
  .brk-sec-lbl {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 14px;
  }

  .brk-stage { background: forestgreen; display: inline-block; padding: 16px; border-radius: 6px; }
  .brk-grid { display: flex; gap: 22px; flex-wrap: wrap; }
  .brk-item { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100px; }
  .brk-tile {
    width: 60px; height: 60px; background: green; border: 1px solid forestgreen;
    display: flex; align-items: center; justify-content: center; font-size: 34px;
    box-sizing: border-box; position: relative; font-family: Arial, sans-serif;
  }
  .brk-tile.brk-shake { animation: brkShake 0.22s ease-in-out; }
  @keyframes brkShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px) rotate(-3deg); }
    75% { transform: translateX(3px) rotate(3deg); }
  }
  .brk-tile.brk-empty { opacity: 0.4; font-size: 22px; }
  .brk-label { color: #cdf5cd; font-size: 0.68rem; text-align: center; }
  .brk-bar-track { width: 90px; height: 6px; background: rgba(0,0,0,0.45); border-radius: 3px; overflow: hidden; }
  .brk-bar-fill { height: 100%; background: #7CFC00; transition: width 0.15s, background 0.2s; }
  .brk-bar-fill.brk-low { background: #ffb400; }
  .brk-bar-fill.brk-crit { background: #ff4444; }

  /* Break/shatter — fragments fly outward and fade, tile empties beneath them */
  .brk-frag {
    position: absolute; top: 50%; left: 50%; font-size: 20px; pointer-events: none;
    transform: translate(-50%, -50%); transition: transform 0.42s ease-out, opacity 0.42s ease-out;
  }

  .brk-use-btn {
    padding: 6px 12px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.76rem; transition: background 0.1s;
  }
  .brk-use-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .brk-use-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .brk-btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px; }
  .brk-btn {
    padding: 7px 14px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; transition: background 0.1s;
  }
  .brk-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .brk-state-lbl { margin-top: 12px; font-size: 0.75rem; color: var(--muted); min-height: 1.3em; }
</style>

<div class="brk-wrap">
  <h1>💥 Durability &amp; Destruction</h1>
  <p class="brk-intro">
    Mockup of <code>docs/drops-core.md</code>'s one rule every gear category
    shares: durability decrements by 1 per use (a swing, a shot, a hit taken,
    a bag add/remove), and at 0 the item is <strong>destroyed and removed</strong>
    — no "broken but still worn" state. Click each item's Use button to wear
    it down and see the break moment.
  </p>

  <div class="brk-sec-lbl">All Five Gear Categories — Same Rule</div>
  <div class="brk-stage">
    <div class="brk-grid" id="brk-grid"></div>
  </div>
  <div class="brk-state-lbl" id="brk-state-lbl">Use each item to wear it down.</div>

  <div class="brk-btn-row">
    <button class="brk-btn" id="brk-reset">↺ Reset All</button>
  </div>
</div>
`,$e=[{id:`weapon`,emoji:`🗡`,label:`Sword (weapon)`,useLabel:`Swing`,max:6},{id:`armor`,emoji:`🥋`,label:`Leather (armor)`,useLabel:`Take a hit`,max:6},{id:`shield`,emoji:`🛡️`,label:`Buckler (shield)`,useLabel:`Block a hit`,max:6},{id:`bow`,emoji:`🏹`,label:`Long Bow`,useLabel:`Fire`,max:6},{id:`backpack`,emoji:`🎒`,label:`Satchel (backpack)`,useLabel:`Add/remove item`,max:6}],et=[`✨`,`💢`,`🔸`,`·`];function tt(e){let t=e.querySelector(`#brk-grid`),n=e.querySelector(`#brk-state-lbl`),r=new Map;function i(e){return e<=20?`brk-bar-fill brk-crit`:e<=50?`brk-bar-fill brk-low`:`brk-bar-fill`}function a(e){let n=r.get(e.id),a=Math.max(0,n/e.max*100),o=t.querySelector(`[data-tile="${e.id}"]`),s=t.querySelector(`[data-bar="${e.id}"]`),c=t.querySelector(`[data-btn="${e.id}"]`),l=t.querySelector(`[data-durlbl="${e.id}"]`);n<=0?(o.textContent=``,o.classList.add(`brk-empty`),c.disabled=!0,c.textContent=`Destroyed`):(o.textContent=e.emoji,o.classList.remove(`brk-empty`),c.disabled=!1,c.textContent=e.useLabel),s.style.width=`${a}%`,s.className=i(a),l.textContent=`${Math.max(0,n)}/${e.max}`}function o(e){let n=t.querySelector(`[data-tile="${e.id}"]`);n.textContent=``;for(let e=0;e<et.length;e++){let t=document.createElement(`div`);t.className=`brk-frag`,t.textContent=et[e],n.appendChild(t);let r=e/et.length*Math.PI*2;requestAnimationFrame(()=>{t.style.transform=`translate(${Math.cos(r)*26-50}%, ${Math.sin(r)*26-50}%)`,t.style.opacity=`0`}),setTimeout(()=>t.remove(),440)}}function s(e){let i=r.get(e.id);if(i<=0)return;let s=t.querySelector(`[data-tile="${e.id}"]`),c=i-1;r.set(e.id,c),c>0?(s.classList.remove(`brk-shake`),s.offsetWidth,s.classList.add(`brk-shake`),n.textContent=`${e.label}: ${e.useLabel.toLowerCase()} — durability ${c}/${e.max}.`,a(e)):(n.textContent=`${e.label} hit 0 durability — the action still resolved fully, then the item was destroyed and removed (drops-core.md's universal rule).`,a(e),o(e))}function c(){for(let e of $e)r.set(e.id,e.max);t.querySelectorAll(`.brk-frag`).forEach(e=>e.remove());for(let e of $e)a(e);n.textContent=`Use each item to wear it down.`}t.innerHTML=$e.map(e=>`
    <div class="brk-item">
      <div class="brk-tile" data-tile="${e.id}"></div>
      <div class="brk-label">${e.label}</div>
      <div class="brk-bar-track"><div class="brk-bar-fill" data-bar="${e.id}"></div></div>
      <div class="brk-label" data-durlbl="${e.id}"></div>
      <button class="brk-use-btn" data-btn="${e.id}"></button>
    </div>
  `).join(``);for(let e of $e)t.querySelector(`[data-btn="${e.id}"]`).addEventListener(`click`,()=>s(e));e.querySelector(`#brk-reset`).addEventListener(`click`,c),c()}var nt=`
<style>
  /* Chrome (headings, tabs, control cards, JSON box) follows the docs hub's
     theme variables — see CLAUDE.md's "Theming interactive docs". This doc
     has no in-game screen to mock up (it's a tuning tool, not a UI
     prototype), so nothing here needs fixed non-theme colors — except the
     rarity tier swatches/text, which reuse each tier's own semantic color
     (fixed hex, or var(--text) for Common) exactly as drops-core.md defines. */
  .dtt-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .dtt-wrap h1 {
    font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;
  }
  .dtt-wrap .dtt-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 20px; max-width: 640px; }

  .dtt-tab-bar { display: flex; gap: 6px; margin-bottom: 20px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  .dtt-tab-btn {
    background: none; border: none; color: var(--muted); font-size: 0.85rem; font-weight: bold;
    padding: 8px 14px 12px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .dtt-tab-btn:hover { color: var(--text); }
  .dtt-tab-btn.dtt-active { color: var(--text); border-bottom-color: var(--link); }
  .dtt-panel { display: none; flex-direction: column; gap: 18px; }
  .dtt-panel.dtt-active { display: flex; }

  .dtt-tier-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border);
    border-radius: 12px; padding: 16px 16px 14px;
  }
  .dtt-tier-title { font-size: 0.85rem; font-weight: bold; color: var(--heading); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .dtt-tier-swatch { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .dtt-tier-sub { font-size: 0.72rem; color: var(--muted); margin: -6px 0 10px; }
  .dtt-field-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .dtt-field-row:last-child { margin-bottom: 0; }
  .dtt-field-label { font-size: 0.76rem; color: var(--text); min-width: 118px; flex-shrink: 0; }
  .dtt-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; min-width: 60px; }
  .dtt-wrap input[type=number] {
    width: 58px; padding: 5px 6px; background: var(--search-bg); border: 1px solid var(--search-border);
    border-radius: 6px; color: var(--text); font-size: 0.82rem; text-align: right; flex-shrink: 0;
  }
  .dtt-wrap input[type=color] { width: 40px; height: 28px; padding: 2px; border: 1px solid var(--search-border); border-radius: 6px; background: var(--search-bg); cursor: pointer; flex-shrink: 0; }
  .dtt-unit { font-size: 0.7rem; color: var(--muted); width: 26px; flex-shrink: 0; }

  .dtt-viz-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 12px; padding: 16px;
  }
  .dtt-viz-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .dtt-viz-title { font-size: 0.72rem; font-weight: bold; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .dtt-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .dtt-bar-label { font-size: 0.76rem; color: var(--text); min-width: 100px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
  .dtt-bar-track { flex: 1; height: 16px; background: var(--search-bg); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .dtt-bar-fill { height: 100%; transition: width 0.15s; }
  .dtt-bar-pct { font-size: 0.74rem; color: var(--muted); width: 44px; text-align: right; flex-shrink: 0; }

  .dtt-btn-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
  .dtt-btn {
    padding: 8px 18px; background: var(--link-card-bg); color: var(--text); border: 1px solid var(--link-card-border);
    border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: background 0.1s;
  }
  .dtt-btn:hover { background: var(--nav-hover); }
  .dtt-btn.dtt-sec { background: transparent; color: var(--muted); border-color: var(--border); }
  .dtt-copy-lbl { font-size: 0.75rem; color: var(--muted); min-height: 1.2em; align-self: center; }
  .dtt-json {
    background: var(--pre-bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace; font-size: 0.74rem; color: var(--pre-color);
    white-space: pre; overflow-x: auto; max-height: 340px; overflow-y: auto;
  }

  /* Map tab. Chrome (controls, legend, stats) follows the theme variables
     like everything else in this doc; only the grid itself is a mockup of
     real in-game tile colors (see the top-of-file comment) and reuses
     styles.css's own floor/corridor/tree colors rather than guessing. */
  .dtt-map-layout { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; }
  .dtt-map-sidebar { flex: 1 1 260px; max-width: 300px; display: flex; flex-direction: column; gap: 16px; }
  .dtt-map-main { flex: 3 1 480px; min-width: 280px; display: flex; flex-direction: column; gap: 16px; }
  .dtt-map-control-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border);
    border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px;
  }
  .dtt-map-seed-input {
    flex: 1; width: auto !important; text-align: left !important;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace; font-size: 0.85rem;
  }
  .dtt-map-grid {
    display: grid; gap: 1px; background: var(--border); border-radius: 6px; overflow: hidden;
    max-width: 100%; aspect-ratio: 1 / 1; margin: 0 auto;
  }
  .dtt-map-tile {
    aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center;
    font-size: clamp(7px, 1.6vw, 15px); line-height: 1; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .dtt-map-tile:active, .dtt-map-tile.dtt-map-tile-selected {
    outline: 2px solid var(--link); outline-offset: -2px; position: relative; z-index: 1;
  }
  .dtt-map-detail {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 10px;
    padding: 10px 14px; font-size: 0.8rem; color: var(--text); min-height: 1.2em;
  }
  .dtt-map-detail .dtt-map-detail-hint { color: var(--muted); }
  .dtt-map-legend { display: flex; flex-wrap: wrap; gap: 8px 14px; font-size: 0.72rem; color: var(--muted); margin-bottom: 12px; }
  .dtt-map-legend span.dtt-map-swatch { display: inline-block; width: 11px; height: 11px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; }
  .dtt-map-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
  .dtt-map-stat-card { background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 10px; padding: 12px 14px; }
  .dtt-map-stat-title { font-size: 0.72rem; font-weight: bold; color: var(--heading); margin-bottom: 8px; }
  .dtt-map-stat-row { display: flex; justify-content: space-between; font-size: 0.76rem; color: var(--text); margin-bottom: 3px; }
  .dtt-map-stat-row span:last-child { color: var(--muted); }
  .dtt-map-hint { font-size: 0.72rem; color: var(--muted); margin-top: 4px; }
</style>

<div class="dtt-wrap">
  <h1>🎛️ Drop Tables Tuner</h1>
  <p class="dtt-intro">
    Every hand-picked number in <code>drops-core.md</code>'s shared rarity engine and
    <code>weapon-drops.md</code> / <code>armor-drops.md</code> / <code>bow-drops.md</code> /
    <code>food-drops.md</code> / <code>backpack-drops.md</code>'s own stat ranges, live and
    editable. <strong>🌈 Rarity Tiers</strong> is the one shared table every category rolls
    against — each tier's <code>baseWeight</code>/<code>floorDelta</code> drives the
    "Tier Probability by Floor" bars using <code>drops-core.md</code>'s own
    <code>tierWeight(tier, floor)</code> formula. Each category tab only owns what's
    genuinely its own: base stat ranges/direction and <code>minMult</code>/<code>maxMult</code>
    (how far a rolled stat can climb from a tier's rarity), plus bow's fixed range-per-tier
    table. One combined <strong>Copy as JSON</strong> at the bottom exports everything at
    once. The <strong>🗺️ Map</strong> tab drops all five categories onto one real, generated
    dungeon floor, alongside the door/key/snakes that already ship, so you can judge
    distribution and counts in context instead of as isolated bars.
  </p>

  <div class="dtt-tab-bar" id="dtt-tabs"></div>
  <div id="dtt-panels"></div>

  <div class="dtt-btn-row" style="margin-top:20px;">
    <button class="dtt-btn" id="dtt-copy-btn">📋 Copy as JSON</button>
    <button class="dtt-btn dtt-sec" id="dtt-reset-btn">↺ Reset to Documented Defaults</button>
    <span class="dtt-copy-lbl" id="dtt-copy-lbl"></span>
  </div>
  <div class="dtt-json" id="dtt-json"></div>
</div>
`,rt=[{name:`Common`,color:`var(--text)`,minRarity:1,maxRarity:20,baseWeight:80,floorDelta:-2.708},{name:`Uncommon`,color:`#22c55e`,minRarity:21,maxRarity:40,baseWeight:16,floorDelta:.792},{name:`Rare`,color:`#3b82f6`,minRarity:41,maxRarity:60,baseWeight:3.5,floorDelta:1.021},{name:`Epic`,color:`#a855f7`,minRarity:61,maxRarity:80,baseWeight:.45,floorDelta:.398},{name:`Legendary`,color:`#f97316`,minRarity:81,maxRarity:100,baseWeight:.05,floorDelta:.0813}],it=[{id:`weapon`,label:`🗡️ Weapon`,minMult:.8,maxMult:5,statFields:[{key:`damage`,label:`Damage`,baseMin:17,baseMax:34,direction:`up`,sliderMin:0,sliderMax:200,sliderStep:1},{key:`durability`,label:`Durability`,baseMin:8,baseMax:15,direction:`up`,sliderMin:0,sliderMax:40,sliderStep:1}]},{id:`armor`,label:`🥋 Armor`,minMult:.8,maxMult:5,statFields:[{key:`armorRating`,label:`Armor Rating`,baseMin:9,baseMax:17,direction:`up`,sliderMin:0,sliderMax:100,sliderStep:1},{key:`durability`,label:`Durability`,baseMin:10,baseMax:18,direction:`up`,sliderMin:0,sliderMax:40,sliderStep:1}]},{id:`shield`,label:`🛡️ Shield`,minMult:.8,maxMult:5,statFields:[{key:`defense`,label:`Defense`,baseMin:9,baseMax:17,direction:`up`,sliderMin:0,sliderMax:100,sliderStep:1},{key:`durability`,label:`Durability`,baseMin:10,baseMax:18,direction:`up`,sliderMin:0,sliderMax:40,sliderStep:1}]},{id:`bow`,label:`🏹 Bow`,minMult:.8,maxMult:4.5,statFields:[{key:`damage`,label:`Damage`,baseMin:17,baseMax:50,direction:`up`,sliderMin:0,sliderMax:200,sliderStep:1},{key:`durability`,label:`Durability`,baseMin:10,baseMax:16,direction:`up`,sliderMin:0,sliderMax:40,sliderStep:1}],rangeByTier:[2,3,3,4,5]},{id:`food`,label:`🍎 Food`,minMult:.8,maxMult:2.2,statFields:[{key:`hungerRestored`,label:`Fullness Restored`,baseMin:30,baseMax:45,direction:`up`,sliderMin:0,sliderMax:100,sliderStep:1}]},{id:`backpack`,label:`🎒 Backpack`,minMult:.8,maxMult:4,statFields:[{key:`capacity`,label:`Capacity`,baseMin:1,baseMax:2,direction:`up`,unit:`slt`,sliderMin:0,sliderMax:20,sliderStep:1},{key:`durability`,label:`Durability`,baseMin:20,baseMax:30,direction:`up`,sliderMin:0,sliderMax:60,sliderStep:1}]},{id:`potion`,label:`🧪 Potion`,minMult:.8,maxMult:2.5,statFields:[{key:`healPercentPerTurn`,label:`Heal %/Turn`,baseMin:.08,baseMax:.14,direction:`up`,unit:`%`,sliderMin:0,sliderMax:1,sliderStep:.01},{key:`healDuration`,label:`Duration`,baseMin:3,baseMax:6,direction:`up`,unit:`trn`,sliderMin:0,sliderMax:20,sliderStep:1}]}],at=17,ot=25;function st(){return it.map(e=>({...e,statFields:e.statFields.map(e=>({...e})),rangeByTier:e.rangeByTier?[...e.rangeByTier]:void 0}))}function ct(){return rt.map(e=>({...e}))}function lt(e,t){return Math.max(0,e.baseWeight+(t-1)*e.floorDelta)}function ut(e,t){let n=e.map(e=>lt(e,t)),r=n.reduce((e,t)=>e+t,0);return r>0?n.map(e=>e/r*100):n.map(()=>0)}function dt(e,t){let n=e.map(e=>lt(e,t)),r=n.reduce((e,t)=>e+t,0),i=Math.random()*r;for(let t=0;t<e.length;t++)if(i-=n[t],i<0){let n=e[t];return{tierIdx:t,rarity:n.minRarity+Math.floor(Math.random()*(n.maxRarity-n.minRarity+1))}}let a=e.length-1;return{tierIdx:a,rarity:e[a].maxRarity}}var ft=`green`,pt=`peru`,mt=`forestgreen`;function ht(e){return r(e.type)?pt:e.type===s.type?mt:ft}function gt(e){return e.label.split(` `)[0]}function _t(e){let t=[];for(let n=0;n<e.gridSize;n++){let r=[];for(let t=0;t<e.gridSize;t++)r.push(T(e,t,n));t.push(r)}return t}function vt(e){let t=e.querySelector(`#dtt-tabs`),r=e.querySelector(`#dtt-panels`),i=e.querySelector(`#dtt-json`),a=e.querySelector(`#dtt-copy-btn`),o=e.querySelector(`#dtt-reset-btn`),c=e.querySelector(`#dtt-copy-lbl`),l=ct(),u=st(),f=at,p=1,m=12345,h=1,g=null,_=null,v=[],y=[];function b(){return`
      <div class="dtt-panel" data-panel="map">
        <div class="dtt-map-layout">
          <div class="dtt-map-sidebar">
            <div class="dtt-map-control-card">
              <div class="dtt-tier-title">Seed</div>
              <div class="dtt-field-row" style="margin-bottom:0;">
                <input type="number" id="dtt-map-seed" step="1" class="dtt-map-seed-input">
                <button class="dtt-btn" id="dtt-map-seed-btn" title="Generate a brand new floor">🎲 New Floor</button>
              </div>
            </div>
            <div class="dtt-map-control-card">
              <div class="dtt-tier-title">Floor</div>
              <div class="dtt-field-row" style="margin-bottom:0;">
                <input type="range" id="dtt-map-floor-range" min="1" max="${ot}" step="1">
                <input type="number" id="dtt-map-floor-number" min="1" max="${ot}" step="1">
              </div>
              <p class="dtt-map-hint">Drives the shared rollRarityTier(floor) — same formula as the Rarity Tiers tab. Every spot's position/category is fixed by the real generator for this seed; only tier/rarity re-rolls.</p>
            </div>
          </div>
          <div class="dtt-map-main">
            <div class="dtt-map-legend">
              <span><span class="dtt-map-swatch" style="background:green;"></span>Floor</span>
              <span><span class="dtt-map-swatch" style="background:peru;"></span>Corridor</span>
              <span><span class="dtt-map-swatch" style="background:forestgreen;"></span>Trees 🌲</span>
              <span>🥷 Spawn</span>
              <span>🔑 Key</span>
              <span>🚪 Locked Door</span>
              <span>🐍 Snake</span>
              <span>💰 Gold</span>
              ${u.map(e=>`<span>${gt(e)} ${e.label.replace(/^\S+\s/,``)}</span>`).join(``)}
            </div>
            <div class="dtt-map-grid" id="dtt-map-grid"></div>
            <div class="dtt-map-detail" id="dtt-map-detail"><span class="dtt-map-detail-hint">Tap a tile to see details.</span></div>
            <p class="dtt-map-hint">
              Tap any tile for details. Room layout, chute, hole, snakes, and every free-tile drop (gold, and
              weapon/armor/shield/bow/food/backpack/potion) come straight from
              <code>generateDungeonLayout</code>/<code>getDungeonChunk</code> — the exact functions the real game
              calls. Only an item spot's rarity tier is re-rolled here, against the live table above, so you can
              preview a tuning change before copying it back into <code>dropsCore.ts</code>.
            </p>
            <div class="dtt-map-stats-grid" id="dtt-map-stats"></div>
          </div>
        </div>
      </div>
    `}function x(){let e=g,t=_;if(!e||!t)return;let i=r.querySelector(`#dtt-map-grid`),a=r.querySelector(`#dtt-map-stats`),o=r.querySelector(`#dtt-map-detail`);if(!i||!a)return;o&&(o.innerHTML=`<span class="dtt-map-detail-hint">Tap a tile to see details.</span>`);let c=e.gridSize*n;i.style.gridTemplateColumns=`repeat(${c}, 1fr)`;let f=new Map,p=(e,t,r)=>{f.set(`${e.chunkX*n+e.x},${e.chunkY*n+e.y}`,{emoji:t,title:r})};p(e.content.chute,`🪂`,`Chute`),p(e.content.hole,`🕳️`,`Hole`);for(let t of e.content.snakes)p(t,`🐍`,`Snake`);for(let{spot:e,amount:t}of y)p(e,`💰`,`Gold (${t}g)`);for(let{spot:e,category:t,tierIdx:n,rarity:r}of v){let i=u.find(e=>e.id===t),a=i?gt(i):`❔`,o=i?i.label.replace(/^\S+\s/,``):t,s=l[n].name;p(e,a,`${o} — ${s} (rarity ${r})`)}let m=null;if(e.rooms.length>0){let t=e.rooms[0],r=e.chunks[t.y][t.x].room;m={x:t.x*n+r.x+Math.floor(r.w/2),y:t.y*n+r.y+Math.floor(r.h/2)}}let h=e=>e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`),b=``;for(let e=0;e<c;e++)for(let r=0;r<c;r++){let i=Math.floor(r/n),a=Math.floor(e/n),o=r%n,c=e%n,l=t[a][i].tiles[c][o],u=m!==null&&m.x===r&&m.y===e,p=f.get(`${r},${e}`),g=u?`🥷`:p?p.emoji:l.display,_=/^PASSTHROUGH_(\d)$/.exec(l.type)?.[1],v=l.type===s.type?`Trees (impassable)`:l.type===d.type?`Corridor`:_?`Passthrough (${_} path${_===`1`?``:`s`})`:`Floor`,y=u?`Ninja spawn`:p?p.title:v,x=`${g?g+` `:``}${y} — (${r}, ${e})`;b+=`<div class="dtt-map-tile" style="background:${ht(l)};" title="${h(x)}" data-title="${h(x)}">${g}</div>`}i.innerHTML=b;let x=`
      <div class="dtt-map-stat-card">
        <div class="dtt-map-stat-title">🗺️ Structure (implemented)</div>
        <div class="dtt-map-stat-row"><span>Rooms</span><span>${e.rooms.length}</span></div>
        <div class="dtt-map-stat-row"><span>🪂 Chute</span><span>1</span></div>
        <div class="dtt-map-stat-row"><span>🕳️ Hole</span><span>1</span></div>
        <div class="dtt-map-stat-row"><span>🐍 Snakes</span><span>${e.content.snakes.length}</span></div>
        <div class="dtt-map-stat-row"><span>💰 Gold spots</span><span>${y.length}</span></div>
        <div class="dtt-map-stat-row"><span>Item spots</span><span>${v.length}</span></div>
      </div>`;for(let e of u){let t=v.filter(t=>t.category===e.id),n=l.map(()=>0);for(let{tierIdx:e}of t)n[e]++;x+=`
        <div class="dtt-map-stat-card">
          <div class="dtt-map-stat-title">${e.label}</div>
          ${l.map((e,t)=>`<div class="dtt-map-stat-row"><span><span class="dtt-tier-swatch" style="background:${e.color};"></span> ${e.name}</span><span>${n[t]}</span></div>`).join(``)}
          <div class="dtt-map-stat-row"><span>Total this floor</span><span>${t.length}</span></div>
        </div>`}a.innerHTML=x}function S(){if(g){for(let e of v){let t=dt(l,h);e.tierIdx=t.tierIdx,e.rarity=t.rarity}x()}}function C(){let e=A(m);g=e,_=_t(e),y=[],v=[];for(let t of e.content.freeTileDrops)if(t.drop.kind===`gold`)y.push({spot:t,amount:t.drop.amount});else{let e=dt(l,h);v.push({spot:t,category:t.drop.category,tierIdx:e.tierIdx,rarity:e.rarity})}x()}function w(){let e=r.querySelector(`#dtt-map-seed`),t=r.querySelector(`#dtt-map-seed-btn`),n=r.querySelector(`#dtt-map-floor-range`),i=r.querySelector(`#dtt-map-floor-number`);e.value=String(m),n.value=i.value=String(h),e.addEventListener(`change`,()=>{let t=Number(e.value);Number.isNaN(t)||(m=Math.trunc(t),C())}),t.addEventListener(`click`,()=>{m=Math.floor(Math.random()*2**31),e.value=String(m),C()});let a=e=>{let t=Number(e);Number.isNaN(t)||(h=Math.round(t),n.value=i.value=String(h),S())};n.addEventListener(`input`,()=>a(n.value)),i.addEventListener(`input`,()=>a(i.value));let o=r.querySelector(`#dtt-map-grid`),s=r.querySelector(`#dtt-map-detail`);o.addEventListener(`click`,e=>{let t=e.target.closest(`.dtt-map-tile`);t&&(o.querySelectorAll(`.dtt-map-tile-selected`).forEach(e=>e.classList.remove(`dtt-map-tile-selected`)),t.classList.add(`dtt-map-tile-selected`),s.textContent=t.dataset.title??``)})}function T(){return`
      <div class="dtt-panel" data-panel="tiers">
        <div>${l.map((e,t)=>`
      <div class="dtt-tier-card" data-tier="${t}">
        <div class="dtt-tier-title"><span class="dtt-tier-swatch" style="background:${e.color};"></span>${e.name}</div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Base Weight</span>
          <input type="range" data-field="tier|${t}|baseWeight|range" min="0" max="100" step="0.5">
          <input type="number" data-field="tier|${t}|baseWeight|number" min="0" max="100" step="0.5">
          <span class="dtt-unit"></span>
        </div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Floor Delta</span>
          <input type="range" data-field="tier|${t}|floorDelta|range" min="-5" max="5" step="0.05">
          <input type="number" data-field="tier|${t}|floorDelta|number" min="-5" max="5" step="0.05">
          <span class="dtt-unit"></span>
        </div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Min Rarity</span>
          <input type="range" data-field="tier|${t}|minRarity|range" min="1" max="100" step="1">
          <input type="number" data-field="tier|${t}|minRarity|number" min="1" max="100" step="1">
          <span class="dtt-unit"></span>
        </div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Max Rarity</span>
          <input type="range" data-field="tier|${t}|maxRarity|range" min="1" max="100" step="1">
          <input type="number" data-field="tier|${t}|maxRarity|number" min="1" max="100" step="1">
          <span class="dtt-unit"></span>
        </div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Color</span>
          <input type="color" data-tier-color="${t}" ${e.color.startsWith(`#`)?``:`disabled title="Common uses var(--text) — not editable as a swatch"`}>
          <span class="dtt-unit" style="width:auto;">${e.color===`var(--text)`?`theme text`:e.color}</span>
        </div>
      </div>
    `).join(``)}</div>
        <div class="dtt-viz-card">
          <div class="dtt-viz-hdr">
            <span class="dtt-viz-title">Tier Probability by Floor</span>
            <span class="dtt-field-label" style="min-width:70px;">Preview Floor</span>
            <input type="range" id="dtt-tier-floor" min="1" max="${ot}" step="1" value="1" style="max-width:160px;">
            <span id="dtt-tier-floor-lbl" style="font-size:0.76rem;color:var(--muted);width:24px;">1</span>
          </div>
          <div id="dtt-tier-viz"></div>
        </div>
      </div>
    `}function E(){let e=r.querySelector(`#dtt-tier-viz`);if(!e)return;let t=ut(l,p);e.innerHTML=l.map((e,n)=>`<div class="dtt-bar-row">
        <span class="dtt-bar-label"><span class="dtt-tier-swatch" style="background:${e.color};"></span>${e.name}</span>
        <div class="dtt-bar-track"><div class="dtt-bar-fill" style="width:${t[n]}%;background:${e.color===`var(--text)`?`var(--muted)`:e.color};"></div></div>
        <span class="dtt-bar-pct">${t[n].toFixed(1)}%</span>
      </div>`).join(``)}function D(e){let t=`
      <div class="dtt-tier-card">
        <div class="dtt-tier-title">Multiplier</div>
        <div class="dtt-tier-sub">Applied on top of a rolled rarity (from the shared Rarity Tiers tab) to scale every stat below.</div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Min Mult</span>
          <input type="range" data-field="${e.id}|cat|minMult|range" min="0" max="3" step="0.05">
          <input type="number" data-field="${e.id}|cat|minMult|number" min="0" max="3" step="0.05">
          <span class="dtt-unit"></span>
        </div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Max Mult</span>
          <input type="range" data-field="${e.id}|cat|maxMult|range" min="0" max="10" step="0.1">
          <input type="number" data-field="${e.id}|cat|maxMult|number" min="0" max="10" step="0.1">
          <span class="dtt-unit"></span>
        </div>
      </div>`,n=e.statFields.map((t,n)=>`
      <div class="dtt-tier-card" data-stat="${e.id}-${n}">
        <div class="dtt-tier-title">${t.label}</div>
        <div class="dtt-tier-sub">Base range at rarity 1, scaled ${t.direction===`up`?`×`:`÷`} the multiplier${t.clampMax===void 0?``:` (clamped ≤ ${t.clampMax})`}.</div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Base Min</span>
          <input type="range" data-field="${e.id}|stat|${n}|baseMin|range" min="${t.sliderMin}" max="${t.sliderMax}" step="${t.sliderStep}">
          <input type="number" data-field="${e.id}|stat|${n}|baseMin|number" min="${t.sliderMin}" max="${t.sliderMax}" step="${t.sliderStep}">
          ${t.unit?`<span class="dtt-unit">${t.unit}</span>`:`<span class="dtt-unit"></span>`}
        </div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Base Max</span>
          <input type="range" data-field="${e.id}|stat|${n}|baseMax|range" min="${t.sliderMin}" max="${t.sliderMax}" step="${t.sliderStep}">
          <input type="number" data-field="${e.id}|stat|${n}|baseMax|number" min="${t.sliderMin}" max="${t.sliderMax}" step="${t.sliderStep}">
          ${t.unit?`<span class="dtt-unit">${t.unit}</span>`:`<span class="dtt-unit"></span>`}
        </div>
      </div>
    `).join(``),r=e.rangeByTier?`
      <div class="dtt-tier-card">
        <div class="dtt-tier-title">Range (tiles) — fixed per tier</div>
        <div class="dtt-tier-sub">bow's one exception: not rolled, keyed off the shared tier names.</div>
        ${l.map((t,n)=>`
          <div class="dtt-field-row">
            <span class="dtt-field-label"><span class="dtt-tier-swatch" style="background:${t.color};"></span>${t.name}</span>
            <input type="range" data-field="${e.id}|range|${n}|_|range" min="1" max="12" step="1">
            <input type="number" data-field="${e.id}|range|${n}|_|number" min="1" max="12" step="1">
            <span class="dtt-unit">tiles</span>
          </div>
        `).join(``)}
      </div>
    `:``,i=e.id===`armor`?`
      <div class="dtt-tier-card">
        <div class="dtt-tier-title">Standalone Constant</div>
        <div class="dtt-field-row">
          <span class="dtt-field-label">Min Hit Damage</span>
          <input type="range" data-field="armor|minhit|_|_|range" min="0" max="2" step="0.05">
          <input type="number" data-field="armor|minhit|_|_|number" min="0" max="2" step="0.05">
          <span class="dtt-unit"></span>
        </div>
      </div>
    `:``;return`
      <div class="dtt-panel" data-panel="${e.id}">
        ${t}${n}${r}${i}
      </div>
    `}function O(){let e={rarityTiers:l.map(e=>({name:e.name,minRarity:e.minRarity,maxRarity:e.maxRarity,baseWeight:e.baseWeight,floorDelta:e.floorDelta,color:e.color}))};for(let t of u){let n={minMult:t.minMult,maxMult:t.maxMult,stats:t.statFields.map(e=>({key:e.key,baseMin:e.baseMin,baseMax:e.baseMax,direction:e.direction,...e.clampMax===void 0?{}:{clampMax:e.clampMax}}))};t.rangeByTier&&(n.rangeByTier=l.map((e,n)=>({tier:e.name,range:t.rangeByTier[n]}))),e[t.id]=n}return e.armor.minHitDamage=f,JSON.stringify(e,null,2)}function k(e,t){let n=r.querySelector(`[data-field="${e}|range"]`),i=r.querySelector(`[data-field="${e}|number"]`);n&&(n.value=String(t)),i&&(i.value=String(t))}function j(){r.innerHTML=T()+u.map(D).join(``)+b(),l.forEach((e,t)=>{k(`tier|${t}|baseWeight`,e.baseWeight),k(`tier|${t}|floorDelta`,e.floorDelta),k(`tier|${t}|minRarity`,e.minRarity),k(`tier|${t}|maxRarity`,e.maxRarity);let n=r.querySelector(`[data-tier-color="${t}"]`);n&&e.color.startsWith(`#`)&&(n.value=e.color)});let e=r.querySelector(`#dtt-tier-floor`);e.value=String(p),r.querySelector(`#dtt-tier-floor-lbl`).textContent=String(p),E();for(let e of u)k(`${e.id}|cat|minMult`,e.minMult),k(`${e.id}|cat|maxMult`,e.maxMult),e.statFields.forEach((t,n)=>{k(`${e.id}|stat|${n}|baseMin`,t.baseMin),k(`${e.id}|stat|${n}|baseMax`,t.baseMax)}),e.rangeByTier&&e.rangeByTier.forEach((t,n)=>k(`${e.id}|range|${n}|_`,t));let t=r.querySelector(`[data-field="armor|minhit|_|_|range"]`),n=r.querySelector(`[data-field="armor|minhit|_|_|number"]`);t&&n&&(t.value=n.value=String(f)),M(),i.textContent=O(),w(),C()}function M(){r.querySelectorAll(`[data-field]`).forEach(e=>{let[t,n,a,o,s]=e.dataset.field.split(`|`);e.addEventListener(`input`,()=>{let c=Number(e.value);if(Number.isNaN(c))return;if(t===`tier`)l[Number(n)][a]=c;else if(t===`armor`&&n===`minhit`)f=c;else{let e=u.find(e=>e.id===t);n===`cat`?e[a]=c:n===`stat`?e.statFields[Number(a)][o]=c:n===`range`&&(e.rangeByTier[Number(a)]=c)}let d=s===`range`?`number`:`range`,p=r.querySelector(`[data-field="${t}|${n}|${a}|${o}|${d}"]`);p&&(p.value=e.value),E(),i.textContent=O(),S()})}),r.querySelectorAll(`[data-tier-color]`).forEach(e=>{e.addEventListener(`input`,()=>{l[Number(e.dataset.tierColor)].color=e.value,j()})});let e=r.querySelector(`#dtt-tier-floor`);e?.addEventListener(`input`,()=>{p=Number(e.value),r.querySelector(`#dtt-tier-floor-lbl`).textContent=e.value,E()})}t.innerHTML=`<button class="dtt-tab-btn dtt-active" data-tab="tiers">🌈 Rarity Tiers</button>`+u.map(e=>`<button class="dtt-tab-btn" data-tab="${e.id}">${e.label}</button>`).join(``)+`<button class="dtt-tab-btn" data-tab="map">🗺️ Map</button>`;function N(e){t.querySelectorAll(`.dtt-tab-btn`).forEach(t=>t.classList.toggle(`dtt-active`,t.dataset.tab===e)),r.querySelectorAll(`.dtt-panel`).forEach(t=>t.classList.toggle(`dtt-active`,t.dataset.panel===e))}t.querySelectorAll(`.dtt-tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>N(e.dataset.tab))});let P;a.addEventListener(`click`,async()=>{let e=O();try{await navigator.clipboard.writeText(e),c.textContent=`✅ Copied to clipboard!`}catch{c.textContent=`⚠️ Clipboard blocked — copy the JSON below manually`}P&&clearTimeout(P),P=setTimeout(()=>{c.textContent=``},2200)}),o.addEventListener(`click`,()=>{l=ct(),u=st(),f=at,p=1,j()}),j(),r.querySelectorAll(`.dtt-panel`).forEach((e,t)=>e.classList.toggle(`dtt-active`,t===0))}var q=25,J=y.attackDamage;(L.attackDamage!==J||k.attackDamage!==J)&&console.warn(`docs-combat-balance: enemy attackDamage is no longer uniform across species — the chart's single reference line needs to become per-species.`);var Y=L.maxHealth;k.maxHealth!==Y&&console.warn(`docs-combat-balance: Rat/Bat maxHealth diverged — the chart's shared "Rat/Bat HP" reference line needs to split in two.`);var yt=`
<style>
  .cb-wrap {
    --cb-weapon:    #2a78d6; --cb-armor:    #eda100;
    --cb-enemy-hp:  #008300; --cb-enemy-atk:#e87ba4;
    --cb-surface: var(--link-card-bg);
  }
  /* This docs hub switches modes via body.dark (docs-page.ts's
     initThemeToggle), not prefers-color-scheme/data-theme — see CLAUDE.md's
     "Theming interactive docs". --text/--muted/--border/etc already flip
     for free through that class; these 4 series colors are this doc's own
     custom properties, so they need their own body.dark step. */
  body.dark .cb-wrap {
    --cb-weapon: #3987e5; --cb-armor: #c98500; --cb-enemy-hp: #008300; --cb-enemy-atk: #d55181;
  }

  .cb-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .cb-wrap h1 { font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px; }
  .cb-wrap .cb-intro { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin: 0 0 20px; max-width: 680px; }
  .cb-wrap .cb-callout {
    font-size: 0.8rem; line-height: 1.55; color: var(--text); max-width: 680px;
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-left: 3px solid var(--cb-enemy-atk);
    border-radius: 10px; padding: 12px 16px; margin: 0 0 22px;
  }
  .cb-wrap .cb-callout strong { color: var(--heading); }

  .cb-controls { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 8px; }
  .cb-control-card {
    flex: 1 1 280px; background: var(--link-card-bg); border: 1px solid var(--link-card-border);
    border-radius: 12px; padding: 14px 16px 12px;
  }
  .cb-control-title { font-size: 0.85rem; font-weight: bold; color: var(--heading); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .cb-control-swatch { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .cb-field-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .cb-field-row:last-child { margin-bottom: 0; }
  .cb-field-label { font-size: 0.76rem; color: var(--text); min-width: 82px; flex-shrink: 0; }
  .cb-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; min-width: 60px; }
  .cb-wrap input[type=number] {
    width: 56px; padding: 5px 6px; background: var(--search-bg); border: 1px solid var(--search-border);
    border-radius: 6px; color: var(--text); font-size: 0.82rem; text-align: right; flex-shrink: 0;
  }
  .cb-btn-row { display: flex; margin: 12px 0 24px; }
  .cb-btn {
    padding: 7px 16px; background: transparent; color: var(--muted); border: 1px solid var(--border);
    border-radius: 8px; cursor: pointer; font-size: 0.8rem;
  }
  .cb-btn:hover { background: var(--nav-hover); color: var(--text); }

  .cb-chart-card { background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 12px; padding: 16px; margin-bottom: 22px; }
  .cb-legend { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-bottom: 10px; }
  .cb-legend-item { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: var(--text); }
  .cb-legend-swatch { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
  .cb-legend-swatch.dash { border-radius: 0; height: 2px; width: 16px; margin: 5px 0; }
  .cb-legend-name { color: var(--muted); }

  .cb-wrap svg { width: 100%; height: auto; display: block; touch-action: pan-y; }
  .cb-wrap .cb-axis-line { stroke: var(--border); stroke-width: 1; }
  .cb-wrap .cb-grid-line { stroke: var(--border); stroke-width: 1; opacity: 0.5; }
  .cb-wrap .cb-axis-label { fill: var(--muted); font-size: 9px; font-family: inherit; }
  .cb-wrap .cb-end-label { font-size: 9px; font-family: inherit; font-weight: bold; }
  .cb-wrap .cb-crosshair { stroke: var(--muted); stroke-width: 1; stroke-dasharray: 2 2; pointer-events: none; }

  .cb-detail { font-size: 0.78rem; color: var(--text); margin-top: 10px; min-height: 1.3em; }
  .cb-detail .hint { color: var(--muted); }
  .cb-detail b { color: var(--heading); }

  .cb-table-card { background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 12px; padding: 16px; overflow-x: auto; }
  .cb-table-title { font-size: 0.85rem; font-weight: bold; color: var(--heading); margin-bottom: 4px; }
  .cb-table-sub { font-size: 0.74rem; color: var(--muted); margin-bottom: 12px; line-height: 1.5; }
  .cb-wrap table { width: 100%; border-collapse: collapse; font-size: 0.78rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .cb-wrap thead th {
    padding: 7px 10px; text-align: right; font-size: 0.66rem; font-weight: bold; letter-spacing: 0.04em;
    text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border);
  }
  .cb-wrap thead th:first-child { text-align: left; }
  .cb-wrap tbody td { padding: 8px 10px; text-align: right; color: var(--text); border-bottom: 1px solid var(--border); }
  .cb-wrap tbody td:first-child { text-align: left; font-weight: bold; }
  .cb-wrap tbody tr:last-child td { border-bottom: none; }
  .cb-wrap tbody td.flat { color: var(--muted); }
</style>

<div class="cb-wrap">
  <h1>⚔️ Combat Balance</h1>
  <p class="cb-intro">
    How far a rolled <strong>Weapon</strong>/<strong>Armor</strong> stat actually climbs across floors 1&ndash;25,
    plotted against the enemy stats it's fighting. Scope is deliberately the player-gear side only &mdash;
    enemy HP/attack damage are flat constants today (no per-floor scaling exists yet), shown here as reference
    lines, imported live from <code>entityDefs.ts</code> so they can never drift out of sync with the real game.
    Drag any control below and both the chart and the outcomes table update immediately.
  </p>
  <div class="cb-callout" id="cb-callout"><!-- filled by setup() once the real numbers are known --></div>

  <div class="cb-controls">
    <div class="cb-control-card" data-cat="weapon">
      <div class="cb-control-title"><span class="cb-control-swatch" style="background:var(--cb-weapon);"></span>🗡️ Weapon Damage</div>
      <div class="cb-field-row">
        <span class="cb-field-label">Base Min</span>
        <input type="range" data-f="weapon|baseMin|range" min="0" max="4" step="0.05">
        <input type="number" data-f="weapon|baseMin|number" min="0" max="4" step="0.05">
      </div>
      <div class="cb-field-row">
        <span class="cb-field-label">Base Max</span>
        <input type="range" data-f="weapon|baseMax|range" min="0" max="4" step="0.05">
        <input type="number" data-f="weapon|baseMax|number" min="0" max="4" step="0.05">
      </div>
      <div class="cb-field-row">
        <span class="cb-field-label">Min Mult</span>
        <input type="range" data-f="weapon|minMult|range" min="0" max="3" step="0.05">
        <input type="number" data-f="weapon|minMult|number" min="0" max="3" step="0.05">
      </div>
      <div class="cb-field-row">
        <span class="cb-field-label">Max Mult</span>
        <input type="range" data-f="weapon|maxMult|range" min="0" max="10" step="0.1">
        <input type="number" data-f="weapon|maxMult|number" min="0" max="10" step="0.1">
      </div>
    </div>
    <div class="cb-control-card" data-cat="armor">
      <div class="cb-control-title"><span class="cb-control-swatch" style="background:var(--cb-armor);"></span>🥋 Armor Rating</div>
      <div class="cb-field-row">
        <span class="cb-field-label">Base Min</span>
        <input type="range" data-f="armor|baseMin|range" min="0" max="4" step="0.05">
        <input type="number" data-f="armor|baseMin|number" min="0" max="4" step="0.05">
      </div>
      <div class="cb-field-row">
        <span class="cb-field-label">Base Max</span>
        <input type="range" data-f="armor|baseMax|range" min="0" max="4" step="0.05">
        <input type="number" data-f="armor|baseMax|number" min="0" max="4" step="0.05">
      </div>
      <div class="cb-field-row">
        <span class="cb-field-label">Min Mult</span>
        <input type="range" data-f="armor|minMult|range" min="0" max="3" step="0.05">
        <input type="number" data-f="armor|minMult|number" min="0" max="3" step="0.05">
      </div>
      <div class="cb-field-row">
        <span class="cb-field-label">Max Mult</span>
        <input type="range" data-f="armor|maxMult|range" min="0" max="10" step="0.1">
        <input type="number" data-f="armor|maxMult|number" min="0" max="10" step="0.1">
      </div>
    </div>
  </div>
  <div class="cb-btn-row"><button class="cb-btn" id="cb-reset">↺ Reset to Documented Defaults</button></div>

  <div class="cb-chart-card">
    <div class="cb-legend">
      <div class="cb-legend-item"><span class="cb-legend-swatch" style="background:var(--cb-weapon);opacity:0.35;"></span><span class="cb-legend-name">Weapon Damage</span> (10th&ndash;90th pct. band)</div>
      <div class="cb-legend-item"><span class="cb-legend-swatch" style="background:var(--cb-armor);opacity:0.35;"></span><span class="cb-legend-name">Armor Rating</span> (10th&ndash;90th pct. band)</div>
      <div class="cb-legend-item"><span class="cb-legend-swatch dash" style="background:var(--cb-enemy-hp);"></span><span class="cb-legend-name">Enemy HP</span> (flat)</div>
      <div class="cb-legend-item"><span class="cb-legend-swatch dash" style="background:var(--cb-enemy-atk);"></span><span class="cb-legend-name">Enemy Attack Damage</span> (flat)</div>
    </div>
    <svg id="cb-chart" viewBox="0 0 740 300" preserveAspectRatio="xMidYMid meet"></svg>
    <div class="cb-detail" id="cb-detail"><span class="hint">Tap or hover the chart to inspect a specific floor.</span></div>
  </div>

  <div class="cb-table-card">
    <div class="cb-table-title">What each rarity tier actually plays like</div>
    <p class="cb-table-sub">
      Tier-conditional (not floor-dependent — once you know the tier, floor no longer matters; see
      <code>rollStat</code>'s signature). "Hits to kill" assumes the median weapon roll for that tier;
      the range in parentheses spans the 10th&ndash;90th percentile roll. "Dmg taken/hit" and "hits to die"
      assume the median armor roll, against the flat enemy attack damage above.
    </p>
    <table>
      <thead>
        <tr>
          <th>Tier</th>
          <th>Weapon Dmg</th>
          <th>Hits to Kill Rat/Bat</th>
          <th>Hits to Kill Snake</th>
          <th>Armor Rating</th>
          <th>Dmg Taken/Hit</th>
          <th>Hits to Die</th>
        </tr>
      </thead>
      <tbody id="cb-tier-tbody"></tbody>
    </table>
  </div>
</div>
`,bt={baseMin:N.baseMin,baseMax:N.baseMax,minMult:F,maxMult:O,curve:`geometric`},xt={baseMin:w.baseMin,baseMax:w.baseMax,minMult:x,maxMult:g,curve:`geometric`},St=4e3,Ct=4e3;function wt(e){return{key:`value`,baseMin:e.baseMin,baseMax:e.baseMax,direction:`up`}}function Tt(e){let t=t=>e[Math.min(e.length-1,Math.floor(t*e.length))];return{p10:t(.1),p50:t(.5),p90:t(.9)}}function Et(e,t=6){let n=e/t,r=10**Math.floor(Math.log10(n)),i=n/r;return(i<1.5?1:i<3?2:i<7?5:10)*r}function Dt(e,t,n){let r=wt(t),i=[];for(let a=0;a<St;a++){let o=C(S(e,n,a)),{rarity:s}=h(n,f,o,o);i.push(b(r,s,t.minMult,t.maxMult,o,t.curve))}return i.sort((e,t)=>e-t),Tt(i)}function Ot(e,t,n){let r=wt(t),i=[];for(let a=0;a<Ct;a++){let o=C(S(e,n.name,a)),s=n.minRarity+Math.floor(o()*(n.maxRarity-n.minRarity+1));i.push(b(r,s,t.minMult,t.maxMult,o,t.curve))}return i.sort((e,t)=>e-t),Tt(i)}function kt(e){return Math.max(m,J-e)}function At(t){let n=t.querySelector(`#cb-chart`),r=t.querySelector(`#cb-detail`),i=t.querySelector(`#cb-callout`),a=t.querySelector(`#cb-tier-tbody`),o=t.querySelector(`#cb-reset`),s={...bt},c={...xt},l={left:30,top:10,right:12,bottom:26},u=740-l.left-l.right,d=300-l.top-l.bottom,p=e=>l.left+(e-1)/(q-1)*u,h=6,g=e=>l.top+d-e/h*d,_=[],v=[];function b(e,t,n){return(n?[...e.keys()].reverse():[...e.keys()]).map((r,i)=>{let a=r+1,o=e[r][t];return`${i===0&&!n?`M`:`L`}${p(a).toFixed(1)},${g(o).toFixed(1)}`}).join(` `)}function x(e,t){return e.map((e,n)=>`${n===0?`M`:`L`}${p(n+1).toFixed(1)},${g(e[t]).toFixed(1)}`).join(` `)}function S(){_=Array.from({length:q},(e,t)=>Dt(`weapon`,s,t+1)),v=Array.from({length:q},(e,t)=>Dt(`armor`,c,t+1));let e=Math.max(..._.map(e=>e.p90),...v.map(e=>e.p90),y.maxHealth,J),t=Math.max(4,Math.ceil(e)+1),r=Et(t);h=Math.ceil(t/r)*r;let i=[];for(let e=0;e<=h;e+=r){let t=g(e);i.push(`<line class="cb-grid-line" x1="${l.left}" x2="${740-l.right}" y1="${t}" y2="${t}"></line>`),i.push(`<text class="cb-axis-label" x="${l.left-6}" y="${t+3}" text-anchor="end">${e}</text>`)}let a=[];for(let e of[1,5,10,15,20,25])a.push(`<text class="cb-axis-label" x="${p(e)}" y="${300-l.bottom+14}" text-anchor="middle">${e}</text>`);a.push(`<text class="cb-axis-label" x="${l.left+u/2}" y="296" text-anchor="middle" style="font-weight:bold;">Floor</text>`);let o=`<path d="${b(_,`p10`,!1)} ${b(_,`p90`,!0)} Z" fill="var(--cb-weapon)" opacity="0.16"></path>`,f=`<path d="${b(v,`p10`,!1)} ${b(v,`p90`,!0)} Z" fill="var(--cb-armor)" opacity="0.16"></path>`,m=`<path d="${x(_,`p50`)}" fill="none" stroke="var(--cb-weapon)" stroke-width="2" stroke-linecap="round"></path>`,S=`<path d="${x(v,`p50`)}" fill="none" stroke="var(--cb-armor)" stroke-width="2" stroke-linecap="round"></path>`,w=[y.maxHealth,Y].map(e=>`<line x1="${l.left}" x2="${740-l.right}" y1="${g(e)}" y2="${g(e)}" stroke="var(--cb-enemy-hp)" stroke-width="2" stroke-dasharray="5 4" opacity="0.85"></line>`).join(``),T=`<line x1="${l.left}" x2="${740-l.right}" y1="${g(J)}" y2="${g(J)}" stroke="var(--cb-enemy-atk)" stroke-width="2" stroke-dasharray="2 3" opacity="0.85"></line>`,E=[{value:_[q-1].p50,color:`var(--cb-weapon)`,text:`Weapon`},{value:v[q-1].p50,color:`var(--cb-armor)`,text:`Armor`},{value:y.maxHealth,color:`var(--cb-enemy-hp)`,text:`Snake HP`},{value:Y,color:`var(--cb-enemy-hp)`,text:`Rat/Bat HP`}].sort((e,t)=>t.value-e.value),D=[];E.forEach((e,t)=>{let n=g(e.value)-3;D.push(t===0?n:Math.max(n,D[t-1]+11))});let O=E.map((e,t)=>`<text class="cb-end-label" x="${740-l.right-4}" y="${D[t]}" text-anchor="end" fill="${e.color}">${e.text}</text>`).join(``);n.innerHTML=`
      <line class="cb-axis-line" x1="${l.left}" x2="${l.left}" y1="${l.top}" y2="${300-l.bottom}"></line>
      <line class="cb-axis-line" x1="${l.left}" x2="${740-l.right}" y1="${300-l.bottom}" y2="${300-l.bottom}"></line>
      ${i.join(``)}${a.join(``)}
      ${o}${f}${w}${T}${m}${S}${O}
      <rect id="cb-hit-rect" x="${l.left}" y="${l.top}" width="${u}" height="${d}" fill="transparent" style="cursor:crosshair;"></rect>
      <line id="cb-crosshair" class="cb-crosshair" x1="0" x2="0" y1="${l.top}" y2="${300-l.bottom}" style="display:none;"></line>
    `,C()}function C(){let e=n.querySelector(`#cb-hit-rect`),t=n.querySelector(`#cb-crosshair`),i=n=>{let i=e.getBoundingClientRect(),a=740/i.width,o=(n-i.left)*a,s=Math.round(1+(o-l.left)/u*(q-1)),c=Math.max(1,Math.min(q,s));t.style.display=``,t.setAttribute(`x1`,String(p(c))),t.setAttribute(`x2`,String(p(c)));let d=_[c-1],f=v[c-1];r.innerHTML=`<b>Floor ${c}</b> &middot; Weapon dmg <b>${d.p10}&ndash;${d.p50}&ndash;${d.p90}</b> (p10-p50-p90) &middot; Armor rating <b>${f.p10}&ndash;${f.p50}&ndash;${f.p90}</b> &middot; Dmg taken/hit at median armor: <b>${kt(f.p50)}</b>`};e.addEventListener(`pointermove`,e=>i(e.clientX)),e.addEventListener(`pointerdown`,e=>i(e.clientX)),e.addEventListener(`pointerleave`,()=>{t.style.display=`none`,r.innerHTML=`<span class="hint">Tap or hover the chart to inspect a specific floor.</span>`})}function w(){let t=[];a.innerHTML=f.map(n=>{let r=Ot(`weapon-tier`,s,n),i=Ot(`armor-tier`,c,n),a=Math.ceil(Y/r.p50),o=Math.ceil(Y/r.p90),l=Math.ceil(Y/r.p10),u=Math.ceil(y.maxHealth/r.p50),d=Math.ceil(y.maxHealth/r.p90),f=Math.ceil(y.maxHealth/r.p10),p=kt(i.p50),h=Math.ceil(e/p);return p===m&&t.push(n.name),`<tr>
        <td style="color:${n.color};">${n.name}</td>
        <td>${r.p50} <span class="flat">(${r.p10}&ndash;${r.p90})</span></td>
        <td>${a} <span class="flat">(${o}&ndash;${l})</span></td>
        <td>${u} <span class="flat">(${d}&ndash;${f})</span></td>
        <td>${i.p50} <span class="flat">(${i.p10}&ndash;${i.p90})</span></td>
        <td class="${p===m?`flat`:``}">${p}</td>
        <td>${h}</td>
      </tr>`}).join(``);let n=J-m;t.length===0?i.innerHTML=`<strong>Armor rating currently makes a real difference at every tier</strong> — "Dmg Taken/Hit" below varies tier to tier rather than sitting flat at the ${m} floor.`:t.length===f.length?i.innerHTML=`<strong>Every tier caps out at the same ${m} dmg/hit.</strong> Every enemy in the game deals a flat ${J} damage, so only the first ${n} points of <code>armorRating</code> ever matter — and even the worst possible roll today already reaches that. A Common and a Legendary armor protect you identically right now; rarity buys durability, not extra protection. See the "Dmg Taken/Hit" column below, flat at ${m} for every tier.`:i.innerHTML=`<strong>${t.join(`, `)} cap out at the same ${m} dmg/hit.</strong> Every enemy deals a flat ${J} damage, so only the first ${n} points of <code>armorRating</code> ever matter — once a tier's typical roll clears that, going up another tier buys durability, not extra protection. See the "Dmg Taken/Hit" column below.`}function T(){[`weapon`,`armor`].forEach(e=>{let n=e===`weapon`?s:c;[`baseMin`,`baseMax`,`minMult`,`maxMult`].forEach(r=>{let i=t.querySelector(`[data-f="${e}|${r}|range"]`),a=t.querySelector(`[data-f="${e}|${r}|number"]`);i.value=a.value=String(n[r])})}),S(),w()}t.querySelectorAll(`[data-f]`).forEach(e=>{let[n,r,i]=e.dataset.f.split(`|`);e.addEventListener(`input`,()=>{let a=Number(e.value);if(Number.isNaN(a))return;let o=n===`weapon`?s:c;o[r]=a;let l=i===`range`?`number`:`range`,u=t.querySelector(`[data-f="${n}|${r}|${l}"]`);u&&(u.value=e.value),S(),w()})}),o.addEventListener(`click`,()=>{s={...bt},c={...xt},T()}),T()}var jt=`
<style>
  /* Chrome (headings, cards, descriptions, controls, timing table) follows
     the docs hub's theme variables like a markdown doc would. Only the
     fire-tile mockups (.anim-preview-tile / .demo-tile, and the stages that
     hold them: .preview-row / .demo-stage) are fixed to the real game's own
     board/tile colors and fire keyframes (styles/styles.css: body's
     forestgreen background, .tile's green background + forestgreen border,
     and the exact fireFlip/fireGlow keyframes) — see CLAUDE.md's "Theming
     interactive docs". */
  .doc-animations-wrap {
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-animations-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  #docs-content .doc-animations-wrap h2 {
    color: var(--heading);
    font-size: 1.05em;
    margin: 28px 0 12px;
  }
  .doc-animations-wrap .content {
    max-width: 540px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .doc-animations-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  /* Real-game stage: reproduces the forest board's forestgreen backdrop
     (styles/styles.css: body { background-color: forestgreen }), fixed
     regardless of the docs-hub theme. */
  .doc-animations-wrap .preview-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    background: forestgreen;
    padding: 10px;
    border-radius: 8px;
  }
  .doc-animations-wrap .anim-preview-tile {
    width: 72px;
    height: 72px;
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: green;
    border: 1px solid forestgreen;
    border-radius: 4px;
  }
  /* Fire flip + glow keyframes copied verbatim from styles.css's
     .tile[data-tile="FIRE"] / .tile[data-glow="FIRE"]::before rules. */
  @keyframes fireFlip {
    0%   { transform: scaleX(1); }
    50%  { transform: scaleX(-1); }
    100% { transform: scaleX(1); }
  }
  @keyframes fireGlow {
    0%, 100% { opacity: 0.55; transform: scale(0.85); }
    50%       { opacity: 1.0;  transform: scale(1.1);  }
  }
  .doc-animations-wrap .anim-preview-tile.fire {
    position: relative;
    isolation: isolate;
    animation: fireFlip calc(var(--fire-flip-ms) * 2ms) steps(1, end) infinite;
  }
  .doc-animations-wrap .anim-preview-tile.fire::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 100, 0, 0.75) 0%, rgba(255, 40, 0, 0) 68%);
    z-index: -1;
    pointer-events: none;
    animation: fireGlow 1.2s ease-in-out infinite;
  }
  .doc-animations-wrap .control-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .doc-animations-wrap .control-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .doc-animations-wrap .control-label {
    font-size: 0.85rem;
    color: var(--text);
    min-width: 80px;
  }
  .doc-animations-wrap input[type=range] {
    flex: 1;
    accent-color: var(--link);
    height: 6px;
    cursor: pointer;
  }
  .doc-animations-wrap input[type=number] {
    width: 72px;
    padding: 6px 8px;
    background: var(--search-bg);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.9rem;
    text-align: right;
  }
  .doc-animations-wrap .unit-label {
    font-size: 0.75rem;
    color: var(--muted);
    width: 20px;
  }
  .doc-animations-wrap .reset-btn {
    align-self: flex-start;
    padding: 6px 16px;
    background: var(--link-card-bg);
    color: var(--text);
    border: 1px solid var(--link-card-border);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .doc-animations-wrap .reset-btn:hover { background: var(--nav-hover); }

  /* ── Move / Combat Animation Previews ── */
  @keyframes docAnimDie {
    0%   { opacity: 1; transform: scale(1); }
    30%  { opacity: 1; transform: scale(1.4); }
    100% { opacity: 0; transform: scale(0.8); }
  }
  @keyframes docAnimHit {
    0%   { filter: none;                 transform: scale(1);    }
    35%  { filter: url(#hit-flash-white); transform: scale(1.15); }
    70%  { filter: url(#hit-flash-white); transform: scale(1.15); }
    100% { filter: none;                 transform: scale(1);    }
  }
  .doc-animations-wrap .anim-demos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .doc-animations-wrap .demo-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 12px;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .doc-animations-wrap .demo-card-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  /* Real-game stage: same forestgreen board backdrop as .preview-row above,
     holding the move/attack/hit/death mockup tiles. */
  .doc-animations-wrap .demo-stage {
    position: relative;
    display: flex;
    gap: 4px;
    overflow: visible;
    background: forestgreen;
    padding: 6px;
    border-radius: 6px;
  }
  .doc-animations-wrap .demo-tile {
    width: 56px;
    height: 56px;
    font-size: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: green;
    border: 1px solid forestgreen;
    border-radius: 4px;
    line-height: 1;
  }
  .doc-animations-wrap .demo-btn {
    padding: 5px 18px;
    background: var(--link-card-bg);
    color: var(--text);
    border: 1px solid var(--link-card-border);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.1s;
  }
  .doc-animations-wrap .demo-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .doc-animations-wrap .demo-btn:disabled { opacity: 0.5; cursor: default; }

  .doc-animations-wrap .timing-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }
  .doc-animations-wrap .timing-table th,
  .doc-animations-wrap .timing-table td {
    padding: 6px 10px;
    text-align: left;
    border-bottom: 1px solid var(--table-border);
  }
  .doc-animations-wrap .timing-table th {
    color: var(--muted);
    font-weight: normal;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .doc-animations-wrap .timing-table td:last-child {
    color: var(--link);
    text-align: right;
  }
</style>
<div class="doc-animations-wrap" style="--fire-flip-ms: 200">
  <h1>🎬 Animations</h1>
  <div class="content">

    <!-- ── Move & Combat Previews ── -->
    <section>
      <div class="section-label">Move &amp; Combat Animations — Interactive Previews</div>
      <div class="anim-demos-grid">

        <div class="demo-card">
          <div class="demo-card-label">Move (Slide)</div>
          <div class="demo-stage" data-demo="slide">
            <div class="demo-tile" data-role="src">🥷</div>
            <div class="demo-tile" data-role="dst"></div>
          </div>
          <button class="demo-btn" data-trigger="slide">▶ Demo</button>
        </div>

        <div class="demo-card">
          <div class="demo-card-label">Attack (Lunge)</div>
          <div class="demo-stage" data-demo="lunge">
            <div class="demo-tile" data-role="src">🥷</div>
            <div class="demo-tile" data-role="dst">🐍</div>
          </div>
          <button class="demo-btn" data-trigger="lunge">▶ Demo</button>
        </div>

        <div class="demo-card">
          <div class="demo-card-label">Hit Flash</div>
          <div class="demo-stage" data-demo="hit">
            <div class="demo-tile" data-role="src">🥷</div>
          </div>
          <button class="demo-btn" data-trigger="hit">▶ Demo</button>
        </div>

        <div class="demo-card">
          <div class="demo-card-label">Enemy Death</div>
          <div class="demo-stage" data-demo="die">
            <div class="demo-tile" data-role="src">🐍</div>
          </div>
          <button class="demo-btn" data-trigger="die">▶ Demo</button>
        </div>

      </div>
    </section>

    <!-- ── Timing Reference ── -->
    <section>
      <div class="section-label">Animation Timing Reference</div>
      <div class="control-card" style="padding: 12px 16px;">
        <table class="timing-table">
          <thead>
            <tr><th>Event</th><th>Entity</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td>Move (slide)</td><td>Player</td><td>90 ms</td></tr>
            <tr><td>Chute-assisted hole drop</td><td>Player</td><td>600 ms</td></tr>
            <tr><td>Attack (lunge)</td><td>Player</td><td>170 ms</td></tr>
            <tr><td>Move (slide)</td><td>Enemy</td><td>110 ms</td></tr>
            <tr><td>Attack (lunge)</td><td>Enemy</td><td>150 ms</td></tr>
            <tr><td>Death dissolve</td><td>Enemy</td><td>160 ms</td></tr>
            <tr><td>Hit flash</td><td>Any</td><td>130 ms</td></tr>
            <tr><td>Attack anticipation pause</td><td>Enemy</td><td>220 ms</td></tr>
          </tbody>
        </table>
        <p style="font-size:0.78rem;color:var(--muted);margin:4px 0 0">
          Turn order: player animation → all enemy animations in parallel → input re-enabled.
          Speed trail plays simultaneously with player slide/lunge. If any enemy is about to
          attack this turn, the enemy phase pauses briefly before playing so the incoming
          attack reads clearly instead of overlapping the player's move.
        </p>
      </div>
    </section>

    <!-- ── Fire Tile ── -->
    <section>
      <div class="section-label">Fire Tile — Preview</div>
      <div class="preview-row">
        <div class="anim-preview-tile fire">🔥</div>
        <div class="anim-preview-tile fire">🔥</div>
        <div class="anim-preview-tile fire">🔥</div>
      </div>
    </section>
    <section>
      <div class="section-label">Flip Timing</div>
      <div class="control-card">
        <div class="control-row">
          <span class="control-label">🔥 Fire flip</span>
          <input type="range" data-anim="slider" min="50" max="1000" step="10">
          <input type="number" data-anim="number" min="50" max="1000" step="10">
          <span class="unit-label">ms</span>
        </div>
        <button class="reset-btn" data-anim="reset">Reset to Default</button>
      </div>
    </section>

  </div>
</div>
`;function Mt(e){let t=`fireFlipMs`,n=1e3,r=e.querySelector(`.doc-animations-wrap`),i=e.querySelector(`[data-anim="slider"]`),a=e.querySelector(`[data-anim="number"]`),o=e.querySelector(`[data-anim="reset"]`);function s(e){let o=Math.min(n,Math.max(50,e));localStorage.setItem(t,String(o)),r.style.setProperty(`--fire-flip-ms`,String(o)),i.value=String(o),a.value=String(o)}let c=localStorage.getItem(t);s(c?Math.min(n,Math.max(50,parseInt(c,10))):200),i.addEventListener(`input`,()=>s(parseInt(i.value,10))),a.addEventListener(`change`,()=>{let e=parseInt(a.value,10);isNaN(e)||s(e)}),o.addEventListener(`click`,()=>s(200));function l(e,t){let n=document.createElement(`div`);n.textContent=e;let r=t.offsetWidth,i=t.offsetHeight;return n.style.cssText=[`position:absolute`,`pointer-events:none`,`left:${t.offsetLeft}px`,`top:${t.offsetTop}px`,`width:${r}px`,`height:${i}px`,`font-size:${i*.8}px`,`line-height:${i}px`,`text-align:center`,`z-index:10`].join(`;`),n}function u(e,t,n,r){let i=t.offsetLeft,a=t.offsetTop,o=n.offsetLeft,s=n.offsetTop,c=t.offsetWidth,l=t.offsetHeight;for(let t of[{t:0,op:.65,dur:500},{t:1/3,op:.45,dur:370},{t:2/3,op:.25,dur:240}]){let n=document.createElement(`div`);n.textContent=r,n.style.cssText=[`position:absolute`,`pointer-events:none`,`left:${i+(o-i)*t.t}px`,`top:${a+(s-a)*t.t}px`,`width:${c}px`,`height:${l}px`,`font-size:${l*.8}px`,`line-height:${l}px`,`text-align:center`,`opacity:${t.op}`,`transition:opacity ${t.dur}ms ease-out, filter ${t.dur}ms ease-out`,`z-index:9`].join(`;`),e.appendChild(n),requestAnimationFrame(()=>{n.style.opacity=`0`,n.style.filter=`blur(5px)`}),setTimeout(()=>n.remove(),t.dur)}}function d(t,n){let r=e.querySelector(`[data-trigger="${t}"]`);r?.addEventListener(`click`,()=>{r.disabled||(r.disabled=!0,n(r))})}d(`slide`,t=>{let n=e.querySelector(`[data-demo="slide"]`),r=n.querySelector(`[data-role="src"]`),i=n.querySelector(`[data-role="dst"]`);i.style.color=`transparent`,u(n,r,i,`🥷`);let a=l(`🥷`,r);n.appendChild(a);let o=i.offsetLeft-r.offsetLeft,s=i.offsetTop-r.offsetTop;requestAnimationFrame(()=>{a.style.transition=`transform 90ms ease-out`,a.style.transform=`translate(${o}px,${s}px)`}),setTimeout(()=>{a.remove(),i.style.color=``,i.textContent=`🥷`,r.textContent=``,setTimeout(()=>{r.textContent=`🥷`,i.textContent=``,t.disabled=!1},700)},90)}),d(`lunge`,t=>{let n=e.querySelector(`[data-demo="lunge"]`),r=n.querySelector(`[data-role="src"]`),i=n.querySelector(`[data-role="dst"]`);u(n,r,r,`🥷`),r.style.color=`transparent`;let a=l(`🥷`,r);n.appendChild(a);let o=(i.offsetLeft-r.offsetLeft)*.45,s=(i.offsetTop-r.offsetTop)*.45;requestAnimationFrame(()=>{a.style.transition=`transform 85ms ease-out`,a.style.transform=`translate(${o}px,${s}px)`}),setTimeout(()=>{let e=l(`🐍`,i);e.style.animationDuration=`160ms`,e.style.animation=`docAnimDie 160ms ease-out forwards`,n.appendChild(e),i.textContent=``,a.style.transition=`transform 85ms ease-in`,a.style.transform=`translate(0,0)`,setTimeout(()=>{a.remove(),r.style.color=``,e.remove(),setTimeout(()=>{i.textContent=`🐍`,t.disabled=!1},600)},85)},85)}),d(`hit`,t=>{let n=e.querySelector(`[data-demo="hit"]`).querySelector(`[data-role="src"]`);n.style.animation=`docAnimHit 130ms ease-out`,setTimeout(()=>{n.style.animation=``,t.disabled=!1},130)}),d(`die`,t=>{let n=e.querySelector(`[data-demo="die"]`),r=n.querySelector(`[data-role="src"]`),i=l(`🐍`,r);i.style.animation=`docAnimDie 160ms ease-out forwards`,n.appendChild(i),r.textContent=``,setTimeout(()=>{i.remove(),setTimeout(()=>{r.textContent=`🐍`,t.disabled=!1},400)},160)})}var Nt=`
<style>
  /* Chrome (heading, concept card, legend, link) follows the docs hub's
     theme variables like a markdown doc would (see CLAUDE.md's "Theming
     interactive docs"). Only .phone-frame keeps a fixed background — it's
     the immediate frame around the embedded house-plan.html iframe below,
     which renders the real #world/.tile CSS from styles/styles.css'
     body.room-mode. #f7f2e7 is not an arbitrary parchment pick: it is the
     exact fallback value of body.room-mode's --scene-bg custom property
     (styles/styles.css ~line 530), so the frame matches the real room's
     background before/around the iframe's own content rather than
     flashing a different color while it loads. */
  .doc-house-wrap {
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-house-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .doc-house-wrap .content {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .doc-house-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .doc-house-wrap .house-wrap {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  /* Phone-sized frame: the iframe below embeds the actual house-plan.html
     page (real #world/.tile CSS from styles/styles.css, body.room-mode),
     so sizing/vmin math matches true in-game scale, not a scaled mockup. */
  .doc-house-wrap .phone-frame {
    width: 390px;
    max-width: 100%;
    height: 500px;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    background: #f7f2e7;
  }
  .doc-house-wrap .phone-frame iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  .doc-house-wrap .open-standalone {
    font-size: 0.78rem;
    color: var(--link);
    text-decoration: none;
  }
  .doc-house-wrap .open-standalone:hover { text-decoration: underline; }

  .doc-house-wrap .house-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  .doc-house-wrap .house-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    color: var(--muted);
  }
  .doc-house-wrap .concept-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .doc-house-wrap .concept-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }
  .doc-house-wrap .concept-icon { font-size: 1.8rem; line-height: 1; flex-shrink: 0; margin-top: 2px; }
  .doc-house-wrap .concept-body { flex: 1; }
  .doc-house-wrap .concept-title { font-size: 0.88rem; font-weight: bold; color: var(--heading); margin-bottom: 4px; }
  .doc-house-wrap .concept-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.55; }
</style>
<div class="doc-house-wrap">
  <h1>🏠 House Interior — Visual Prototype</h1>
  <div class="content">
    <section>
      <div class="section-label">Concept</div>
      <div class="concept-cards">
        <div class="concept-card">
          <div class="concept-icon">🏠</div>
          <div class="concept-body">
            <div class="concept-title">A Map, Not the Starting Room</div>
            <div class="concept-desc">The house used to be the first thing a new game showed. It no longer is — <code>startNewGame()</code> now sets up Slitherwood level 1 directly, and the Old Man NPC who lived here now stands on the forest ground itself, at the cell that used to hold the inert <code>HOUSE</code> landmark tile. The room definition below is untouched and stays registered — still reachable via <code>__debug.enterRoom('house')</code> — it's just no longer the entry point. It's the first entry in a generic, data-driven room system (<code>scripts/rooms.ts</code> + <code>scripts/rooms-data.ts</code>): adding another themed room (title, colors, layout, and where its door leads) is just one more <code>registerRoom(&#123;...&#125;)</code> call, no engine or CSS changes required. Same 9×9 <code>worldSize</code> as every other room in the game — one open room, only the outer edge is wall — with an entrance door and furniture/decorations scattered inside. The preview below is the actual <code>house-plan.html</code> page embedded live, rendering straight from the same room data the real game uses, not a re-implemented mockup.</div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="section-label">Floor Plan — 9 × 9 — Real Game Scale</div>
      <div class="house-wrap">
        <div class="phone-frame">
          <iframe src="house-plan.html" title="House interior floor plan"></iframe>
        </div>
        <a class="open-standalone" href="house-plan.html" target="_blank" rel="noopener">Open standalone page ↗</a>
        <div class="house-legend">
          <span class="house-legend-item">🚪 Entrance door</span>
          <span class="house-legend-item">🛏️ Bed</span>
          <span class="house-legend-item">🪑 Chair</span>
          <span class="house-legend-item">🏺 Decoration</span>
          <span class="house-legend-item">🧙🏼‍♂️ Occupant</span>
        </div>
      </div>
    </section>
  </div>
</div>
`;function Pt(){}var Ft=5,It=5,Lt=2,Rt=1,zt=`
<style>
  /* Pure calculator/dashboard, no game-screen mockup content — follows the
     docs hub's theme variables throughout (see CLAUDE.md's "Theming
     interactive docs"). Money figures keep one dedicated gold accent color
     (readable in both light and dark) since that's a meaningful semantic
     highlight, not decorative theming. */
  .doc-economy-wrap { padding: 24px 16px 40px; min-height: 400px; }
  .doc-economy-wrap h1 {
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .doc-economy-wrap .content {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .doc-economy-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .doc-economy-wrap .gold-accent { color: #ca8a04; }
  .doc-economy-wrap .pickup-cards {
    display: flex;
    gap: 10px;
  }
  .doc-economy-wrap .pickup-card {
    flex: 1;
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .doc-economy-wrap .pickup-card-emoji { font-size: 1.6rem; line-height: 1; }
  .doc-economy-wrap .pickup-card-count { font-size: 0.75rem; color: var(--muted); }
  .doc-economy-wrap .pickup-card-gold { font-size: 1.4rem; font-weight: bold; color: #ca8a04; line-height: 1; }
  .doc-economy-wrap .pickup-card-gold span { font-size: 0.8rem; color: var(--muted); font-weight: normal; }
  .doc-economy-wrap .pickup-card.total {
    border-color: rgba(202,138,4,0.35);
    background: rgba(202,138,4,0.08);
  }
  .doc-economy-wrap .pickup-card.total .pickup-card-gold { font-size: 1.8rem; }
  .doc-economy-wrap .info-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    overflow: hidden;
  }
  .doc-economy-wrap .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 0.82rem;
  }
  .doc-economy-wrap .info-row:last-child { border-bottom: none; }
  .doc-economy-wrap .info-row-label { color: var(--muted); }
  .doc-economy-wrap .info-row-value { color: var(--text); font-weight: bold; font-variant-numeric: tabular-nums; }
  .doc-economy-wrap .info-row-value.gold { color: #ca8a04; }
  .doc-economy-wrap .info-row-value.total { color: #ca8a04; font-size: 1.1em; }
  .doc-economy-wrap .info-row-note { color: var(--muted); font-size: 0.72rem; margin-left: 6px; font-weight: normal; }
  .doc-economy-wrap .info-row.divider { background: rgba(202,138,4,0.06); border-top: 1px solid rgba(202,138,4,0.25); }
  .doc-economy-wrap .table-wrap {
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .doc-economy-wrap table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }
  .doc-economy-wrap thead { background: var(--table-header-bg); }
  .doc-economy-wrap thead th {
    padding: 9px 10px;
    text-align: right;
    white-space: nowrap;
    font-size: 0.67rem;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .doc-economy-wrap thead th:first-child { text-align: center; }
  .doc-economy-wrap tbody tr { border-top: 1px solid var(--border); }
  .doc-economy-wrap tbody tr:hover { background: var(--nav-hover); }
  .doc-economy-wrap tbody td {
    padding: 9px 10px;
    text-align: right;
    color: var(--text);
    white-space: nowrap;
  }
  .doc-economy-wrap tbody td:first-child {
    text-align: center;
    color: var(--muted);
    font-size: 0.75rem;
  }
  .doc-economy-wrap tbody td.em { color: var(--heading); }
  .doc-economy-wrap tbody td.gold { color: #ca8a04; font-weight: bold; }
  .doc-economy-wrap tbody td.dimmed { color: var(--muted); opacity: 0.6; }
  .doc-economy-wrap tbody tr.gate-row { background: rgba(202,138,4,0.1); border-top: 1px solid rgba(202,138,4,0.3); }
  .doc-economy-wrap .note {
    font-size: 0.72rem;
    color: var(--muted);
    line-height: 1.55;
    padding: 0 2px;
  }
  .doc-economy-wrap .note strong { color: var(--text); }
  .doc-economy-wrap .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .doc-economy-wrap .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 12px;
    padding: 10px 14px;
    flex: 1;
    min-width: 100px;
  }
  .doc-economy-wrap .legend-emoji { font-size: 1.5rem; line-height: 1; }
  .doc-economy-wrap .legend-name { font-size: 0.75rem; color: var(--muted); flex: 1; }
  .doc-economy-wrap .legend-value { font-size: 1.05rem; font-weight: bold; color: #ca8a04; }
</style>
<div class="doc-economy-wrap">
  <h1>💰 Economy Dashboard</h1>
  <div class="content">
    <section>
      <div class="section-label">Item Values</div>
      <div class="legend" data-eco="legend"></div>
    </section>
    <section>
      <div class="section-label">Pickups (Trees) — same every level</div>
      <div class="pickup-cards">
        <div class="pickup-card">
          <div class="pickup-card-emoji">💰<sup>1</sup></div>
          <div class="pickup-card-count">5 gold × 1g</div>
          <div class="pickup-card-gold">5 <span>g</span></div>
        </div>
        <div class="pickup-card">
          <div class="pickup-card-emoji">💰<sup>5</sup></div>
          <div class="pickup-card-count">2 gold × 5g</div>
          <div class="pickup-card-gold">10 <span>g</span></div>
        </div>
        <div class="pickup-card">
          <div class="pickup-card-emoji">💰<sup>10</sup></div>
          <div class="pickup-card-count">1 gold × 10g</div>
          <div class="pickup-card-gold">10 <span>g</span></div>
        </div>
        <div class="pickup-card total">
          <div class="pickup-card-emoji">🏆</div>
          <div class="pickup-card-count">pickup total</div>
          <div class="pickup-card-gold">25 <span>g</span></div>
        </div>
      </div>
    </section>
    <section>
      <div class="section-label">Snakes in Rocks + Bonuses — same every level</div>
      <div class="info-card">
        <div class="info-row">
          <span class="info-row-label">🪨 Rocks per level</span>
          <span class="info-row-value">15</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">🐍 Snakes hidden in rocks</span>
          <span class="info-row-value">12 <span class="info-row-note">(15 rocks − 3 ❤️ hearts)</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">🗡 Max swords per level</span>
          <span class="info-row-value">5 <span class="info-row-note">(5 × 🗡 in trees)</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Max sword kills on rock 🐍</span>
          <span class="info-row-value">5 <span class="info-row-note">(swords &lt; 12 snakes)</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">💰 Gold per sword kill (best case)</span>
          <span class="info-row-value gold">5g</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Max gold from rock snakes</span>
          <span class="info-row-value gold">25g <span class="info-row-note">(5 kills × 5g)</span></span>
        </div>
        <div class="info-row divider">
          <span class="info-row-label"><strong>Max per level — pickups + rock snakes</strong></span>
          <span class="info-row-value total">50g</span>
        </div>
      </div>
    </section>
    <section>
      <div class="section-label">Total by Level — with Tree Snakes</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lvl</th>
              <th>Pickups</th>
              <th>Max 🗡</th>
              <th>Rock 🐍</th>
              <th>Tree 🐍</th>
              <th>All 🐍</th>
              <th>Kills</th>
              <th>🐍 Gold</th>
              <th>Total</th>
              <th>Cumulative</th>
            </tr>
          </thead>
          <tbody data-eco="gold-tbody"></tbody>
        </table>
      </div>
      <p class="note" style="margin-top:10px">
        <strong>Sword cap:</strong> max swords (5) &lt; min snakes (12 from rocks alone), so sword kills are always capped at 5.
        Tree snakes grow each level but the snake-gold ceiling stays at <strong>25g</strong> — more snakes, same max.
      </p>
    </section>
  </div>
</div>
`;function Bt(e){let n=e.querySelector(`[data-eco="legend"]`);n&&(n.innerHTML=[[`${a.display}<sup>${u}</sup>`,u,`Small gold`],[`${a.display}<sup>${c}</sup>`,c,`Gold`],[`${a.display}<sup>${i}</sup>`,i,`Large gold`]].map(([e,t,n])=>`<div class="legend-item"><span class="legend-emoji">${e}</span><span class="legend-name">${n}</span><span class="legend-value">${t}g</span></div>`).join(``));let r=It*u+Lt*c+Rt*i,o=e.querySelector(`[data-eco="gold-tbody"]`);if(o){let e=0;for(let n=1;n<=10;n++){let i=n-1,a=t-2,s=i,l=a+s,u=l,d=Math.min(Ft,l),f=Math.min(d,u)*c,p=r+f;e+=p;let m=n===10,h=document.createElement(`tr`);h.innerHTML=`<td>${n}${m?` 🏁`:``}</td><td class="em">${r}g</td><td>${Ft}</td><td>${a}</td><td class="${s>0?`em`:`dimmed`}">${s}</td><td>${l}</td><td>${d}</td><td class="gold">${f}g</td><td class="gold">${p}g</td><td class="gold">${e}g</td>`,o.appendChild(h)}}}var Vt=`
<style>
  /* Dev-tooling checklist, no game-screen mockup content — follows the docs
     hub's theme variables throughout (see CLAUDE.md's "Theming interactive
     docs"). --radius is a spacing token, not a color, so it stays local. */
  .doc-mac-wrap {
    --radius: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    padding: 32px 20px 60px;
  }
  .doc-mac-wrap * { box-sizing: border-box; }
  .doc-mac-wrap .page { max-width: 720px; margin: 0 auto; }
  .doc-mac-wrap .header { margin-bottom: 40px; }
  .doc-mac-wrap .header-eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--link);
    margin-bottom: 8px;
  }
  .doc-mac-wrap .header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    color: var(--heading);
    border-bottom: none;
  }
  .doc-mac-wrap .header p { color: var(--muted); font-size: 0.9rem; }
  .doc-mac-wrap .progress-wrap {
    margin-top: 20px;
    background: var(--border);
    border-radius: 99px;
    height: 6px;
    overflow: hidden;
  }
  .doc-mac-wrap .progress-bar {
    height: 100%;
    background: var(--link);
    border-radius: 99px;
    transition: width 0.3s ease;
    width: 0%;
  }
  .doc-mac-wrap .progress-label { font-size: 0.78rem; color: var(--muted); margin-top: 6px; }
  .doc-mac-wrap .section { margin-bottom: 32px; }
  .doc-mac-wrap .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .doc-mac-wrap .section-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--link);
    color: var(--bg);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .doc-mac-wrap .section-title { font-size: 1rem; font-weight: 700; flex: 1; color: var(--text); }
  .doc-mac-wrap .badge {
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 99px;
    letter-spacing: 0.03em;
  }
  .doc-mac-wrap .badge-once { background: var(--nav-active-bg); color: var(--nav-active-color); }
  .doc-mac-wrap .badge-each { background: var(--table-header-bg); color: var(--muted); }
  .doc-mac-wrap .card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .doc-mac-wrap .step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .doc-mac-wrap .step:last-child { border-bottom: none; }
  .doc-mac-wrap .step:has(input:checked) { background: var(--table-even-bg); }
  .doc-mac-wrap .step-check {
    margin-top: 2px;
    flex-shrink: 0;
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid var(--search-border);
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    transition: all 0.15s;
    background: var(--search-bg);
  }
  .doc-mac-wrap .step-check:checked { background: var(--link); border-color: var(--link); }
  .doc-mac-wrap .step-check:checked::after {
    content: "";
    position: absolute;
    left: 3px;
    top: 0px;
    width: 8px;
    height: 11px;
    border: 2px solid var(--bg);
    border-top: none;
    border-left: none;
    transform: rotate(45deg) scaleY(0.9);
  }
  .doc-mac-wrap .step-body { flex: 1; min-width: 0; }
  .doc-mac-wrap .step-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; color: var(--text); }
  .doc-mac-wrap .step-check:checked ~ .step-body .step-title {
    text-decoration: line-through;
    color: var(--muted);
  }
  .doc-mac-wrap .step-desc { font-size: 0.83rem; color: var(--muted); margin-bottom: 8px; }
  .doc-mac-wrap .step-desc:last-child { margin-bottom: 0; }
  .doc-mac-wrap pre {
    background: var(--pre-bg);
    color: var(--pre-color);
    border-radius: 7px;
    padding: 12px 14px;
    font-size: 0.8rem;
    font-family: "SF Mono", Menlo, "Cascadia Code", monospace;
    line-height: 1.6;
    overflow-x: auto;
    margin: 8px 0 4px;
  }
  .doc-mac-wrap pre:last-child { margin-bottom: 0; }
  .doc-mac-wrap code {
    font-family: "SF Mono", Menlo, "Cascadia Code", monospace;
    font-size: 0.82rem;
    background: var(--code-bg);
    padding: 1px 5px;
    border-radius: 4px;
    color: var(--code-color);
  }
  .doc-mac-wrap pre code { background: none; color: inherit; padding: 0; font-size: inherit; }
  .doc-mac-wrap .note {
    display: flex;
    gap: 8px;
    background: var(--table-header-bg);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 9px 12px;
    font-size: 0.82rem;
    color: var(--text);
    margin: 8px 0 4px;
    line-height: 1.5;
  }
  .doc-mac-wrap .note-icon { flex-shrink: 0; font-size: 0.9rem; }
  .doc-mac-wrap .table-wrap {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .doc-mac-wrap table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .doc-mac-wrap thead { background: var(--table-header-bg); }
  .doc-mac-wrap th {
    text-align: left;
    padding: 10px 16px;
    font-weight: 600;
    color: var(--muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border);
  }
  .doc-mac-wrap td { padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--text); }
  .doc-mac-wrap tr:last-child td { border-bottom: none; }
  .doc-mac-wrap td:first-child code { font-size: 0.8rem; white-space: nowrap; }
  .doc-mac-wrap td:last-child { color: var(--muted); font-size: 0.83rem; }
</style>
<div class="doc-mac-wrap">
  <div class="page">
    <div class="header">
      <div class="header-eyebrow">Ninjack</div>
      <h1>Mac Setup &amp; Deploy Guide</h1>
      <p>One-time setup steps and the regular deploy workflow for iOS &amp; Android.</p>
      <div class="progress-wrap">
        <div class="progress-bar" data-mac="progress-bar"></div>
      </div>
      <div class="progress-label" data-mac="progress-label">0 of 0 steps complete</div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-num">1</div>
        <div class="section-title">Prerequisites</div>
        <span class="badge badge-once">One-time</span>
      </div>
      <div class="card">
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-brew">
          <div class="step-body">
            <div class="step-title">Homebrew</div>
            <div class="step-desc">Check: <code>brew --version</code>. Install if missing:</div>
            <pre><code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-xcode">
          <div class="step-body">
            <div class="step-title">Xcode</div>
            <div class="step-desc">Install from the Mac App Store, then run:</div>
            <pre><code>sudo xcodebuild -license accept
xcode-select --install</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-pods">
          <div class="step-body">
            <div class="step-title">CocoaPods</div>
            <div class="step-desc">Check: <code>pod --version</code>. Install if missing:</div>
            <pre><code>brew install cocoapods</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-node">
          <div class="step-body">
            <div class="step-title">Node.js</div>
            <div class="step-desc">Check: <code>node --version</code>. Install if missing:</div>
            <pre><code>brew install node</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-bundler">
          <div class="step-body">
            <div class="step-title">Bundler (for Fastlane)</div>
            <div class="step-desc">macOS ships with Ruby. Just install Bundler:</div>
            <pre><code>gem install bundler</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-android-studio">
          <div class="step-body">
            <div class="step-title">Android Studio</div>
            <div class="step-desc">Download from <strong>developer.android.com/studio</strong>, install, and open it once to finish SDK setup. Then add to <code>~/.zshrc</code>:</div>
            <pre><code>export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools</code></pre>
            <div class="step-desc">Reload: <code>source ~/.zshrc</code></div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-num">2</div>
        <div class="section-title">Repo &amp; Fastlane</div>
        <span class="badge badge-once">One-time</span>
      </div>
      <div class="card">
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-install">
          <div class="step-body">
            <div class="step-title">Clone &amp; install</div>
            <pre><code>git clone https://github.com/zacharysnewman/ninjack.git
cd ninjack
npm install
bundle install</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-lockfile">
          <div class="step-body">
            <div class="step-title">Commit Gemfile.lock</div>
            <div class="step-desc"><code>bundle install</code> generates a <code>Gemfile.lock</code> on your Mac — commit it so Fastlane stays pinned.</div>
            <pre><code>git add Gemfile.lock &amp;&amp; git commit -m "Add Gemfile.lock" &amp;&amp; git push</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-cap-add">
          <div class="step-body">
            <div class="step-title">Initialize native platforms</div>
            <div class="step-desc">Generates <code>ios/</code> and <code>android/</code> locally (gitignored — run once per machine).</div>
            <pre><code>npx cap add ios
npx cap add android</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-num">3</div>
        <div class="section-title">iOS Signing</div>
        <span class="badge badge-once">One-time</span>
      </div>
      <div class="card">
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-apple-dev">
          <div class="step-body">
            <div class="step-title">Apple Developer Program</div>
            <div class="step-desc">$99/year. Enroll at <strong>developer.apple.com</strong> if not already.</div>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-app-id">
          <div class="step-body">
            <div class="step-title">Register App ID</div>
            <div class="step-desc">developer.apple.com → Certificates, Identifiers &amp; Profiles → Identifiers → +<br>
            Bundle ID: <code>com.ninjack.app</code></div>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-asc">
          <div class="step-body">
            <div class="step-title">Create app in App Store Connect</div>
            <div class="step-desc">appstoreconnect.apple.com → My Apps → + → New App<br>
            Bundle ID: <code>com.ninjack.app</code></div>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-match">
          <div class="step-body">
            <div class="step-title">Set up Fastlane Match (recommended)</div>
            <div class="step-desc">Creates a private GitHub repo to store certs/profiles encrypted. Edit <code>fastlane/Matchfile</code> and uncomment the <code>git_url</code> line first, then:</div>
            <pre><code>bundle exec fastlane match init
bundle exec fastlane match appstore</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-xcode-sign">
          <div class="step-body">
            <div class="step-title">Or: configure Xcode automatic signing</div>
            <div class="step-desc">Skip Match and let Xcode manage certs instead.</div>
            <pre><code>npm run open:ios</code></pre>
            <div class="step-desc">In Xcode → App target → Signing &amp; Capabilities → enable "Automatically manage signing" → select your Team.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-num">4</div>
        <div class="section-title">Android Signing</div>
        <span class="badge badge-once">One-time</span>
      </div>
      <div class="card">
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-play-account">
          <div class="step-body">
            <div class="step-title">Google Play Developer Account</div>
            <div class="step-desc">$25 one-time fee at <strong>play.google.com/console</strong>.</div>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-keystore">
          <div class="step-body">
            <div class="step-title">Generate a release keystore</div>
            <div class="note"><span class="note-icon">⚠️</span> Keep this file backed up forever. If you lose it, you can never update the app on the Play Store.</div>
            <pre><code>keytool -genkey -v \\
  -keystore ~/ninjack-release.keystore \\
  -alias ninjack \\
  -keyalg RSA -keysize 2048 -validity 10000</code></pre>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-env">
          <div class="step-body">
            <div class="step-title">Create fastlane/.env</div>
            <pre><code>cp fastlane/.env.example fastlane/.env</code></pre>
            <div class="step-desc">Fill in your keystore path and passwords.</div>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-play-api">
          <div class="step-body">
            <div class="step-title">Create Play Store API key</div>
            <div class="step-desc">Lets Fastlane upload builds automatically.<br>
            Play Console → Setup → API access → Link Google Cloud project → Create service account → Grant <em>Release Manager</em> role → Download JSON key → save as <code>fastlane/google-play-key.json</code></div>
            <div class="note"><span class="note-icon">⚠️</span> This file is gitignored. Never commit it.</div>
          </div>
        </div>
        <div class="step">
          <input class="step-check" type="checkbox" id="mac-s-play-app">
          <div class="step-body">
            <div class="step-title">Create app in Play Console &amp; do first manual upload</div>
            <div class="step-desc">Play Console requires a manual first upload before the API works. Create the app in the console, complete its setup checklist, then run:</div>
            <pre><code>npm run deploy:android:beta</code></pre>
            <div class="step-desc">If the upload fails, upload the generated <code>.aab</code> from <code>android/app/build/outputs/bundle/release/</code> manually through the console.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-num">5</div>
        <div class="section-title">Deploy Workflow</div>
        <span class="badge badge-each">Each release</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Command</th><th>What it does</th></tr>
          </thead>
          <tbody>
            <tr><td><code>npm run sync</code></td><td>Build web assets + sync to both platforms</td></tr>
            <tr><td><code>npm run run:ios</code></td><td>Build + launch on iOS simulator</td></tr>
            <tr><td><code>npm run run:android</code></td><td>Build + launch on Android emulator</td></tr>
            <tr><td><code>npm run deploy:ios:beta</code></td><td>Build + upload to TestFlight</td></tr>
            <tr><td><code>npm run deploy:android:beta</code></td><td>Build + upload to Play internal track</td></tr>
            <tr><td><code>npm run deploy:ios</code></td><td>Build + submit to App Store for review</td></tr>
            <tr><td><code>npm run deploy:android</code></td><td>Promote internal build → production</td></tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top: 16px;">
        <div class="note"><span class="note-icon">📌</span> Before each release, bump <code>versionCode</code> + <code>versionName</code> in <code>android/app/build.gradle</code>. iOS build numbers are auto-incremented by Fastlane.</div>
      </div>
    </div>
  </div>
</div>
`;function Ht(e){let t=e.querySelectorAll(`.step-check`),n=e.querySelector(`[data-mac="progress-bar"]`),r=e.querySelector(`[data-mac="progress-label"]`);function i(){let e=t.length,i=[...t].filter(e=>e.checked).length;n&&(n.style.width=i/e*100+`%`),r&&(r.textContent=i+` of `+e+` steps complete`)}t.forEach(e=>{let t=`ninjack-setup-`+e.id;e.checked=localStorage.getItem(t)===`true`,e.addEventListener(`change`,()=>{localStorage.setItem(t,String(e.checked)),i()})}),i()}var Ut=`
<style>
  /* Pure dev-tool preview, no game-screen mockup content — follows the docs
     hub's theme variables throughout (see CLAUDE.md's "Theming interactive
     docs"). Monospace stays as a font choice, not a theming issue. */
  .doc-soundboard-wrap {
    background: var(--bg);
    color: var(--text);
    font-family: monospace;
    padding: 32px;
    min-height: 400px;
  }
  #docs-content .doc-soundboard-wrap h1 {
    color: var(--heading);
    font-size: 2rem;
    letter-spacing: 2px;
    border-bottom: none;
    margin-bottom: 8px;
  }
  .doc-soundboard-wrap .sb-sub {
    color: var(--muted);
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  .doc-soundboard-wrap .sb-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .doc-soundboard-wrap .sb-slider-label { white-space: nowrap; }
  .doc-soundboard-wrap input[type=range] { flex: 1; accent-color: var(--link); }
  .doc-soundboard-wrap .sb-slider-value {
    width: 3ch;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .doc-soundboard-wrap .sb-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }
</style>
<div class="doc-soundboard-wrap">
  <h1>🔊 Soundboard</h1>
  <p class="sb-sub">Click any button to hear the sound effect.</p>
  <div class="sb-slider-row">
    <label class="sb-slider-label">Music volume</label>
    <input type="range" data-sb="music-vol" min="0" max="0.2" step="0.01">
    <span class="sb-slider-value" data-sb="music-vol-label"></span>
  </div>
  <div class="sb-slider-row">
    <label class="sb-slider-label">SFX multiplier</label>
    <input type="range" data-sb="sfx-vol" min="1" max="5" step="0.1">
    <span class="sb-slider-value" data-sb="sfx-vol-label"></span>
  </div>
  <div data-sb="music-btn"></div>
  <div class="sb-grid" data-sb="grid"></div>
  <h1 style="margin-top:32px">📳 Haptics</h1>
  <p class="sb-sub">Only fires on a real device (Capacitor native) with the Settings haptics toggle on — silent no-op here in a desktop browser.</p>
  <div class="sb-grid" data-sb="haptics-grid"></div>
</div>
`;function Wt(e){let t=null,n=null,r=null;fetch(`music/woods-of-linzor.mp3`).then(e=>e.arrayBuffer()).then(e=>{t=e}).catch(()=>{});let i=e.querySelector(`[data-sb="music-vol"]`),a=e.querySelector(`[data-sb="music-vol-label"]`);i.value=String(_),a.textContent=_.toFixed(2),i.addEventListener(`input`,()=>{let e=parseFloat(i.value);E.setMusicVolume(e),a.textContent=e.toFixed(2)});let o=e.querySelector(`[data-sb="sfx-vol"]`),s=e.querySelector(`[data-sb="sfx-vol-label"]`);o.value=`2.5`,s.textContent=`2.5`,o.addEventListener(`input`,()=>{let e=parseFloat(o.value);E.setSfxVolume(e),s.textContent=e.toFixed(1)});let c=e.querySelector(`[data-sb="music-btn"]`),l=!1,u=document.createElement(`button`);u.style.cssText=[`display:flex;flex-direction:column;align-items:center;justify-content:center;`,`gap:6px;padding:16px 8px;border:2px solid var(--border);border-radius:10px;`,`background:var(--link-card-bg);color:var(--text);cursor:pointer;font-family:monospace;`,`font-size:0.8rem;transition:background 0.1s,border-color 0.1s;width:100%;margin-bottom:12px;`].join(``),u.innerHTML=`<span style="font-size:2rem;line-height:1">🎵</span><span>Woods of Linzor — Play</span>`,u.addEventListener(`click`,()=>{if(l)r&&=(r.stop(),null),l=!1,u.innerHTML=`<span style="font-size:2rem;line-height:1">🎵</span><span>Woods of Linzor — Play</span>`,u.style.borderColor=`var(--border)`;else{let e=E.getCtx();function i(t){n=t,r=e.createBufferSource(),r.buffer=n,r.loop=!0,E.connectToMusicOutput(r),r.start(),l=!0,u.innerHTML=`<span style="font-size:2rem;line-height:1">🎵</span><span>Woods of Linzor — Stop</span>`,u.style.borderColor=`var(--link)`}n?i(n):t&&e.decodeAudioData(t).then(i)}}),c.appendChild(u);let d=e.querySelector(`[data-sb="grid"]`),f=[{label:`Gold ×1`,emoji:`💰`,fn:()=>E.kaChing(1)},{label:`Gold ×5`,emoji:`💰`,fn:()=>E.kaChing(5)},{label:`Gold ×10`,emoji:`💰`,fn:()=>E.kaChing(10)},{label:`Ring`,emoji:`💍`,fn:()=>E.kaChing(20)},{label:`Sword Pickup`,emoji:`🗡`,fn:()=>E.shing()},{label:`Sword Hit`,emoji:`🗡`,fn:()=>E.swordHit()},{label:`Healing Potion Pickup`,emoji:`🧪`,fn:()=>E.healingPotionPickup()},{label:`Key Pickup`,emoji:`🔑`,fn:()=>E.keyPickup()},{label:`Fire Damage`,emoji:`🔥`,fn:()=>E.fireDamage()},{label:`Snake Attack`,emoji:`🐍`,fn:()=>E.snakeAttack()},{label:`Player Hit`,emoji:`💔`,fn:()=>E.playerHit()},{label:`Enemy Death`,emoji:`💀`,fn:()=>E.enemyDeath()},{label:`Player Death`,emoji:`☠️`,fn:()=>E.playerDeath()},{label:`Secret Found`,emoji:`💎`,fn:()=>E.secretFound()},{label:`Rock Break`,emoji:`🪨`,fn:()=>E.rockBreak()},{label:`Tree Break`,emoji:`🌲`,fn:()=>E.treeBreak()},{label:`Door Unlock`,emoji:`🔐`,fn:()=>E.doorUnlock()},{label:`Door Locked`,emoji:`🔒`,fn:()=>E.doorLocked()},{label:`Level Complete`,emoji:`🚪`,fn:()=>E.levelComplete()},{label:`Win!`,emoji:`🏆`,fn:()=>E.win()},{label:`Final Boss`,emoji:`🪂`,fn:()=>E.finalBoss()},{label:`Chute Fall`,emoji:`🕳️`,fn:()=>E.chute()},{label:`Hole Death`,emoji:`💥`,fn:()=>E.holeDeath()},{label:`Footstep`,emoji:`👢`,fn:()=>E.footstep()},{label:`Text Blip`,emoji:`💬`,fn:()=>E.textBlip()},{label:`Nuh-Uh`,emoji:`💲`,fn:()=>E.nuhUh()},{label:`Rabbit Spawn`,emoji:`🐇`,fn:()=>E.rabbitSpawn()},{label:`Monster Sick`,emoji:`🤢`,fn:()=>E.monsterSick()},{label:`Monster Rage`,emoji:`👹`,fn:()=>E.monsterRage()},{label:`Bump`,emoji:`🧱`,fn:()=>E.bump()},{label:`Weapon Break`,emoji:`💥`,fn:()=>E.weaponBreak()},{label:`Aim Toggle`,emoji:`🎯`,fn:()=>E.aimToggle()},{label:`Chunk Transit`,emoji:`🚪`,fn:()=>E.chunkTransition()},{label:`Item Pickup`,emoji:`🎒`,fn:()=>E.itemPickup()},{label:`Item Drop`,emoji:`⬇️`,fn:()=>E.dropItem()},{label:`Grave Found`,emoji:`⚰️`,fn:()=>E.graveFound()},{label:`Dialogue Start`,emoji:`💬`,fn:()=>E.dialogueStart()},{label:`Dialogue End`,emoji:`💬`,fn:()=>E.dialogueEnd()}];function p(e,t,n){let r=document.createElement(`button`);return r.style.cssText=[`display:flex;flex-direction:column;align-items:center;justify-content:center;`,`gap:6px;padding:16px 8px;border:1px solid var(--border);border-radius:10px;`,`background:var(--link-card-bg);color:var(--text);cursor:pointer;font-family:monospace;`,`font-size:0.8rem;transition:background 0.1s,border-color 0.1s;`].join(``),r.innerHTML=`<span style="font-size:2rem;line-height:1">${t}</span><span>${e}</span>`,r.addEventListener(`click`,()=>{r.style.background=`var(--nav-hover)`,r.style.borderColor=`var(--link)`,n(),setTimeout(()=>{r.style.background=`var(--link-card-bg)`,r.style.borderColor=`var(--border)`},200)}),r}f.forEach(({label:e,emoji:t,fn:n})=>d.appendChild(p(e,t,n)));let m=e.querySelector(`[data-sb="haptics-grid"]`);[{label:`Selection`,emoji:`🔘`,kind:`selection`},{label:`Light`,emoji:`🪶`,kind:`light`},{label:`Medium`,emoji:`🟡`,kind:`medium`},{label:`Heavy`,emoji:`🔴`,kind:`heavy`},{label:`Success`,emoji:`✅`,kind:`success`},{label:`Warning`,emoji:`⚠️`,kind:`warning`},{label:`Error`,emoji:`❌`,kind:`error`}].forEach(({label:e,emoji:t,kind:n})=>m.appendChild(p(e,t,()=>v(n))))}var Gt=`
<style>
  /* Chrome (headings, cards, stat/legend text, comparison controls) follows
     the docs hub's theme variables like a markdown doc would (see CLAUDE.md's
     "Theming interactive docs"). Only the tile grids/tiles, the D-pad used to
     drive them, and the per-demo tile stages are genuine mockups of the real
     game's board and #controls widget, so those keep fixed values copied from
     styles.css (forestgreen/green tile colors, real .ctrl-btn colors, the
     real animHit/animDie keyframe shapes) regardless of the docs hub's
     light/dark toggle. "Good"/"bad" accent colors on stats and the panel
     title are a dedicated semantic highlight (drop-rate comparison result),
     not decorative theming — same treatment as the gold accent in the
     economy doc.
  */
  .doc-ghost-wrap {
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-ghost-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
  .doc-ghost-wrap .ghost-intro {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.55;
    margin-bottom: 20px;
  }
  .doc-ghost-wrap .ghost-intro strong { color: var(--text); }

  /* ── Panels ── */
  .doc-ghost-wrap .ghost-panels {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .doc-ghost-wrap .ghost-panel {
    flex: 1 1 220px;
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 14px 12px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .doc-ghost-wrap .ghost-panel-title {
    font-size: 0.75rem;
    font-weight: bold;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .doc-ghost-wrap .ghost-panel.good .ghost-panel-title { color: #16a34a; }
  .doc-ghost-wrap .ghost-panel-sub {
    font-size: 0.65rem;
    color: var(--muted);
    text-align: center;
    margin-top: -6px;
  }
  .doc-ghost-wrap .ghost-panel.good .ghost-panel-sub { color: var(--muted); }

  /* ── Lock bar ── */
  .doc-ghost-wrap .lock-bar {
    width: 100%;
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }
  .doc-ghost-wrap .lock-bar-fill {
    height: 100%;
    width: 0%;
    border-radius: 2px;
  }
  .doc-ghost-wrap .lock-bar-fill.red   { background: #dc2626; }
  .doc-ghost-wrap .lock-bar-fill.amber { background: #d97706; }

  /* ── Grid ── */
  /* Genuine mockup of the real game board: forestgreen gap/backdrop behind
     green tiles with a forestgreen border, copied from styles.css's
     body { background-color: forestgreen } and .tile { background-color:
     green; border: 1px solid forestgreen }. box-sizing: border-box keeps the
     tile's rendered footprint at exactly 40x40 (TILE) so the JS overlay
     translate math, which is keyed off CELL = TILE + GAP, still lines up. */
  .doc-ghost-wrap .ghost-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 40px);
    gap: 2px;
    background: forestgreen;
    border: 2px solid forestgreen;
    border-radius: 5px;
  }
  .doc-ghost-wrap .ghost-tile {
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    background: green;
    border: 1px solid forestgreen;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    user-select: none;
    border-radius: 1px;
  }

  /* Hit flash overlay — matches the real game's animHit: white silhouette of the
     icon itself (via SVG filter), not a colored shape behind it. */
  @keyframes ghostAnimHit {
    0%   { filter: none;                 transform: scale(1);    }
    35%  { filter: url(#hit-flash-white); transform: scale(1.15); }
    70%  { filter: url(#hit-flash-white); transform: scale(1.15); }
    100% { filter: none;                 transform: scale(1);    }
  }
  .doc-ghost-wrap .ghost-hit-flash-ov {
    position: absolute;
    pointer-events: none;
    z-index: 3;
    animation: ghostAnimHit 150ms ease-out forwards;
  }

  /* ── Stats ── */
  .doc-ghost-wrap .ghost-stats {
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: center;
  }
  .doc-ghost-wrap .ghost-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .doc-ghost-wrap .ghost-stat-n {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--text);
    line-height: 1;
    min-width: 28px;
    text-align: center;
  }
  .doc-ghost-wrap .ghost-stat-n.bad  { color: #dc2626; }
  .doc-ghost-wrap .ghost-stat-n.good { color: #16a34a; }
  .doc-ghost-wrap .ghost-stat-l {
    font-size: 0.6rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    white-space: nowrap;
  }

  /* ── Controls ── */
  .doc-ghost-wrap .ghost-controls {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }
  /* D-pad: genuine mockup of the real #controls widget (same real .ctrl-btn
     colors/box-shadow copied from styles.css), so it keeps its own
     forestgreen stage background and fixed button colors regardless of the
     docs hub theme. */
  .doc-ghost-wrap .ghost-dpad {
    display: grid;
    grid-template-rows: repeat(3, 48px);
    gap: 4px;
    background: forestgreen;
    border-radius: 14px;
    padding: 10px;
  }
  .doc-ghost-wrap .ghost-dpad-row {
    display: grid;
    grid-template-columns: repeat(3, 48px);
    gap: 4px;
  }
  .doc-ghost-wrap .ghost-btn {
    width: 48px; height: 48px;
    box-sizing: border-box;
    background: rgba(15,70,15,0.92);
    border: 2px solid #2d7a2d;
    border-radius: 10px;
    color: #bbddbb; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; touch-action: manipulation; outline: none;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    transition: background 0.08s, color 0.08s;
  }
  .doc-ghost-wrap .ghost-btn:active { background: rgba(50,150,50,0.95); color: #fff; }
  .doc-ghost-wrap .ghost-btn-noop { background: transparent !important; border-color: transparent !important; pointer-events: none; }
  .doc-ghost-wrap .ghost-btn-hub {
    background: rgba(5,35,5,0.8); border: 2px solid rgba(45,122,45,0.35);
    border-radius: 50%; pointer-events: none; font-size: 20px;
    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
  }
  /* Auto-run panel and reset control are ordinary tool chrome (not a mockup
     of any real-game UI), so they follow the docs hub theme like a markdown
     doc's controls would. */
  .doc-ghost-wrap .ghost-auto {
    display: flex; flex-direction: column; gap: 10px; min-width: 200px;
  }
  .doc-ghost-wrap .auto-row {
    display: flex; align-items: center; gap: 8px;
  }
  .doc-ghost-wrap .ghost-auto-btn {
    padding: 8px 14px;
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 8px; color: var(--text);
    font-size: 0.85rem;
    cursor: pointer; white-space: nowrap;
  }
  .doc-ghost-wrap .ghost-auto-btn:hover { background: var(--nav-hover); }
  .doc-ghost-wrap .ghost-auto-btn.active {
    background: rgba(220,38,38,0.15);
    border-color: #dc2626; color: #dc2626;
  }
  .doc-ghost-wrap .auto-ms-input {
    width: 60px; padding: 6px 8px;
    background: var(--bg);
    border: 1px solid var(--border); border-radius: 7px;
    color: var(--text); font-size: 0.88rem; text-align: right;
  }
  .doc-ghost-wrap .auto-unit { font-size: 0.78rem; color: var(--muted); }
  .doc-ghost-wrap .auto-note {
    font-size: 0.72rem; color: var(--muted); line-height: 1.55;
  }
  /* #docs-content em sets color: var(--blockquote-color) at (1,0,1)
     specificity, which beats a plain class selector — the #docs-content
     prefix here matches that and wins via the added class/tag chain. */
  #docs-content .doc-ghost-wrap .auto-note em { color: #d97706; font-style: normal; }
  .doc-ghost-wrap .ghost-reset-btn {
    align-self: flex-start; padding: 6px 14px;
    background: var(--link-card-bg);
    border: 1px solid var(--border);
    border-radius: 8px; color: var(--muted);
    font-size: 0.8rem; cursor: pointer;
  }
  .doc-ghost-wrap .ghost-reset-btn:hover { color: var(--text); }

  /* ── Demo cards ── */
  /* Card chrome (title, button, note) follows the theme; only .ghost-demo-stage
     — the actual tile mockup each card animates — keeps the real forestgreen
     backdrop + green/forestgreen tile colors, same split as the main grid above. */
  .doc-ghost-wrap .ghost-section-hd {
    font-size: 0.7rem; font-weight: bold;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted);
    margin: 28px 0 12px; text-align: center;
  }
  .doc-ghost-wrap .ghost-demo-row {
    display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
  }
  .doc-ghost-wrap .ghost-demo-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 12px; padding: 12px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 9px;
  }
  .doc-ghost-wrap .ghost-demo-card-title {
    font-size: 0.7rem; font-weight: bold;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted);
  }
  .doc-ghost-wrap .ghost-demo-stage {
    position: relative; display: flex; gap: 4px;
    background: forestgreen; border-radius: 8px; padding: 6px;
  }
  .doc-ghost-wrap .ghost-demo-tile {
    width: 54px; height: 54px;
    box-sizing: border-box;
    background: green; border: 1px solid forestgreen;
    border-radius: 1px; font-size: 34px;
    display: flex; align-items: center; justify-content: center;
    line-height: 1; user-select: none;
  }
  .doc-ghost-wrap .ghost-demo-btn {
    padding: 5px 16px;
    background: var(--link-card-bg);
    border: 1px solid var(--border);
    border-radius: 8px; color: var(--text);
    font-size: 0.78rem;
    cursor: pointer; transition: background 0.1s;
  }
  .doc-ghost-wrap .ghost-demo-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .doc-ghost-wrap .ghost-demo-btn:disabled { opacity: 0.4; cursor: default; }
  /* Matches the real game's animDie shape exactly (styles.css @keyframes
     animDie: 30% scale(1.4), 100% opacity 0 / scale(0.8), no rotation) —
     this overlay is emulating a real enemy death, not a decorative flourish. */
  @keyframes ghostDemoAttackDie {
    0%   { opacity: 1; transform: scale(1); }
    30%  { opacity: 1; transform: scale(1.4); }
    100% { opacity: 0; transform: scale(0.8); }
  }
  @keyframes ghostDemoInteractShake {
    0%   { transform: scale(1); }
    20%  { transform: scale(1.3) rotate(-7deg); }
    50%  { transform: scale(1.1) rotate(4deg); }
    78%  { transform: scale(1.04) rotate(-2deg); }
    100% { transform: scale(1); }
  }
  .doc-ghost-wrap .ghost-demo-note {
    font-size: 0.72rem; color: var(--muted);
    text-align: center; margin-top: 6px; line-height: 1.6;
  }
</style>
<div class="doc-ghost-wrap">
  <h1>👻 Movement Prototype</h1>
  <p class="ghost-intro">
    Both panels receive <strong>identical inputs</strong>. Each turn: player moves, then snake chases.
    <strong>Left</strong>: all animations block input — slides and attacks alike.
    <strong>Right</strong>: slides are fire-and-forget (state + tiles update immediately, animation plays independently) — only lunge attacks block.
  </p>

  <div class="ghost-panels">

    <div class="ghost-panel">
      <div class="ghost-panel-title">Current · Full Block</div>
      <div class="ghost-panel-sub">every animation locks input</div>
      <div class="lock-bar"><div class="lock-bar-fill red" id="b-lock-fill"></div></div>
      <div class="ghost-grid" data-grid="blocking"></div>
      <div class="ghost-stats">
        <div class="ghost-stat">
          <span class="ghost-stat-n" data-stat="b-moved">0</span>
          <span class="ghost-stat-l">moved</span>
        </div>
        <div class="ghost-stat">
          <span class="ghost-stat-n bad" data-stat="b-dropped">0</span>
          <span class="ghost-stat-l">dropped</span>
        </div>
        <div class="ghost-stat">
          <span class="ghost-stat-n bad" data-stat="b-rate">—</span>
          <span class="ghost-stat-l">drop %</span>
        </div>
        <div class="ghost-stat">
          <span class="ghost-stat-n" data-stat="b-hits">0</span>
          <span class="ghost-stat-l">hits</span>
        </div>
      </div>
    </div>

    <div class="ghost-panel good">
      <div class="ghost-panel-title">Proposed · Slides Free</div>
      <div class="ghost-panel-sub">slides instant · only attacks block</div>
      <div class="lock-bar"><div class="lock-bar-fill amber" id="g-lock-fill"></div></div>
      <div class="ghost-grid" data-grid="freerun"></div>
      <div class="ghost-stats">
        <div class="ghost-stat">
          <span class="ghost-stat-n good" data-stat="g-moved">0</span>
          <span class="ghost-stat-l">moved</span>
        </div>
        <div class="ghost-stat">
          <span class="ghost-stat-n good" data-stat="g-dropped">0</span>
          <span class="ghost-stat-l">dropped</span>
        </div>
        <div class="ghost-stat">
          <span class="ghost-stat-n good" data-stat="g-rate">—</span>
          <span class="ghost-stat-l">drop %</span>
        </div>
        <div class="ghost-stat">
          <span class="ghost-stat-n" data-stat="g-hits">0</span>
          <span class="ghost-stat-l">hits</span>
        </div>
      </div>
    </div>

  </div>

  <div class="ghost-controls">
    <div class="ghost-dpad">
      <div class="ghost-dpad-row">
        <div class="ghost-btn ghost-btn-noop"></div>
        <button class="ghost-btn" data-dir="up">▲</button>
        <div class="ghost-btn ghost-btn-noop"></div>
      </div>
      <div class="ghost-dpad-row">
        <button class="ghost-btn" data-dir="left">◀</button>
        <div class="ghost-btn-hub">🥷</div>
        <button class="ghost-btn" data-dir="right">▶</button>
      </div>
      <div class="ghost-dpad-row">
        <div class="ghost-btn ghost-btn-noop"></div>
        <button class="ghost-btn" data-dir="down">▼</button>
        <div class="ghost-btn ghost-btn-noop"></div>
      </div>
    </div>

    <div class="ghost-auto">
      <div class="auto-row">
        <button class="ghost-auto-btn" id="ghost-auto-btn">▶ Auto</button>
        <span class="auto-unit">every</span>
        <input class="auto-ms-input" type="number" id="ghost-auto-ms" value="80" min="20" max="1000" step="10">
        <span class="auto-unit">ms</span>
      </div>
      <p class="auto-note">
        Left blocks <em>~200ms</em> per move, <em>~490ms</em> on attack.<br>
        Right only blocks during snake attacks — slides never drop.
      </p>
      <button class="ghost-reset-btn" id="ghost-reset">↺ Reset</button>
    </div>
  </div>

  <div class="ghost-section-hd">Proposed Model — Individual Animation Demos</div>
  <div class="ghost-demo-row">

    <div class="ghost-demo-card">
      <div class="ghost-demo-card-title">Player Slide</div>
      <div class="ghost-demo-stage" data-demo="slide">
        <div class="ghost-demo-tile" data-role="src">🥷</div>
        <div class="ghost-demo-tile" data-role="dst"></div>
      </div>
      <button class="ghost-demo-btn" data-demo-btn="slide">▶ Demo</button>
    </div>

    <div class="ghost-demo-card">
      <div class="ghost-demo-card-title">Snake Slide</div>
      <div class="ghost-demo-stage" data-demo="snake-slide">
        <div class="ghost-demo-tile" data-role="src">🐍</div>
        <div class="ghost-demo-tile" data-role="dst"></div>
      </div>
      <button class="ghost-demo-btn" data-demo-btn="snake-slide">▶ Demo</button>
    </div>

    <div class="ghost-demo-card">
      <div class="ghost-demo-card-title">Player → Snake ✦ blocks</div>
      <div class="ghost-demo-stage" data-demo="attack">
        <div class="ghost-demo-tile" data-role="player">🥷</div>
        <div class="ghost-demo-tile" data-role="enemy">🐍</div>
      </div>
      <button class="ghost-demo-btn" data-demo-btn="attack">▶ Demo</button>
    </div>

    <div class="ghost-demo-card">
      <div class="ghost-demo-card-title">Snake → Player ✦ blocks</div>
      <div class="ghost-demo-stage" data-demo="snake-attack">
        <div class="ghost-demo-tile" data-role="snake">🐍</div>
        <div class="ghost-demo-tile" data-role="player">🥷</div>
      </div>
      <button class="ghost-demo-btn" data-demo-btn="snake-attack">▶ Demo</button>
    </div>

    <div class="ghost-demo-card">
      <div class="ghost-demo-card-title">Interact ✦ blocks</div>
      <div class="ghost-demo-stage" data-demo="interact">
        <div class="ghost-demo-tile" data-role="player">🥷</div>
        <div class="ghost-demo-tile" data-role="target">🌲</div>
      </div>
      <button class="ghost-demo-btn" data-demo-btn="interact">▶ Demo</button>
    </div>

  </div>
  <p class="ghost-demo-note">
    Slides (no ✦): fire-and-forget — state resolves instantly, animation plays alongside next inputs.<br>
    Marked ✦: still block input for the lunge + effect duration.
  </p>

</div>
`;function Kt(e){let t={up:0,down:0,left:-1,right:1},n={up:-1,down:1,left:0,right:0},r=[`up`,`down`,`left`,`right`],i=e.querySelector(`[data-grid="blocking"]`),a=e.querySelector(`[data-grid="freerun"]`),o=e.querySelector(`[data-stat="b-moved"]`),s=e.querySelector(`[data-stat="b-dropped"]`),c=e.querySelector(`[data-stat="b-rate"]`),l=e.querySelector(`[data-stat="b-hits"]`),u=e.querySelector(`[data-stat="g-moved"]`),d=e.querySelector(`[data-stat="g-dropped"]`),f=e.querySelector(`[data-stat="g-rate"]`),p=e.querySelector(`[data-stat="g-hits"]`),m=e.querySelector(`#b-lock-fill`),h=e.querySelector(`#g-lock-fill`),g=[],_=[];for(let e=0;e<25;e++){let e=document.createElement(`div`);e.className=`ghost-tile`;let t=document.createElement(`div`);t.className=`ghost-tile`,g.push(e),i.appendChild(e),_.push(t),a.appendChild(t)}let v=2,y=2,b=4,x=4,S=!1,C=0,w=0,T=0,E=0,D=2,O=2,k=4,A=4,j=!1,M=0,N=0,P=0,F=0,I=new Set;function L(){for(let e of g)e.textContent=``;g[y*5+v].textContent=`🥷`,g[x*5+b].textContent=`🐍`}function R(){for(let e of _)e.textContent=``;let e=O*5+D,t=A*5+k;I.has(e)||(_[e].textContent=`🥷`),I.has(t)||(_[t].textContent=`🐍`)}function z(){o.textContent=String(w),s.textContent=String(C),l.textContent=String(T);let e=w+C;c.textContent=e>=5?`${Math.round(C/e*100)}%`:`—`}function B(){u.textContent=String(N),d.textContent=String(M),p.textContent=String(P);let e=N+M;f.textContent=e>=5?`${Math.round(M/e*100)}%`:`—`}function V(e,t,n,r){let i=n-e,a=r-t,o=e,s=t;return Math.abs(i)>=Math.abs(a)?o=e+Math.sign(i):s=t+Math.sign(a),o=Math.max(0,Math.min(4,o)),s=Math.max(0,Math.min(4,s)),{nx:o,ny:s,attack:o===n&&s===r}}function H(e,t,n,r,i){let a=document.createElement(`div`);return a.className=i,a.textContent=t,Object.assign(a.style,{position:`absolute`,pointerEvents:`none`,zIndex:`2`,left:`${n*42}px`,top:`${r*42}px`,width:`40px`,height:`40px`,fontSize:`26px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(a),a}function ee(e,t){e.style.transition=`none`,e.style.width=`0%`,e.offsetWidth,e.style.transition=`width ${t}ms linear`,e.style.width=`100%`}function U(e){e.style.transition=`none`,e.style.width=`0%`}function te(e,t,n,r,i){let a=r*5+n;t[a].textContent=``;let o=H(e,i,n,r,`ghost-hit-flash-ov`);o.style.zIndex=`3`,setTimeout(()=>{o.remove(),t[a].textContent=i},150)}function ne(e){if(S){C++,z();return}let r=v+t[e],a=y+n[e];if(r<0||r>=5||a<0||a>=5||r===b&&a===x)return;let{nx:o,ny:s,attack:c}=V(b,x,r,a);S=!0,w++,z(),ee(m,c?520:210);let l=v,u=y;g[y*5+v].textContent=``,v=r,y=a,g[y*5+v].textContent=``;let d=H(i,`🥷`,l,u,`b-ov`),f=++E;requestAnimationFrame(()=>{d.style.transition=`transform 90ms ease-out`,d.style.transform=`translate(${(v-l)*42}px,${(y-u)*42}px)`}),setTimeout(()=>{if(E===f)if(d.remove(),g[y*5+v].textContent=`🥷`,c){g[x*5+b].textContent=``;let e=H(i,`🐍`,b,x,`b-ov`),t=(v-b)*42*.45,n=(y-x)*42*.45;requestAnimationFrame(()=>{e.style.transition=`transform 140ms ease-out`,e.style.transform=`translate(${t}px,${n}px)`}),setTimeout(()=>{E===f&&(e.style.transition=`transform 140ms ease-in`,e.style.transform=`translate(0,0)`,setTimeout(()=>{E===f&&(e.remove(),g[x*5+b].textContent=`🐍`,te(i,g,v,y,`🥷`),T++,setTimeout(()=>{E===f&&(S=!1,U(m),z())},150))},140))},140)}else{let e=b,t=x;g[x*5+b].textContent=``,g[s*5+o].textContent=``,b=o,x=s;let n=H(i,`🐍`,e,t,`b-ov`);requestAnimationFrame(()=>{n.style.transition=`transform 120ms ease-out`,n.style.transform=`translate(${(b-e)*42}px,${(x-t)*42}px)`}),setTimeout(()=>{E===f&&(n.remove(),g[x*5+b].textContent=`🐍`,S=!1,U(m),z())},120)}},90)}function re(e,t,n,r,i,a,o){let s=a*5+i;I.add(s),_[s].textContent=``;let c=H(e,t,n,r,`g-ov`);requestAnimationFrame(()=>{c.style.transition=`transform ${o}ms ease-out`,c.style.transform=`translate(${(i-n)*42}px,${(a-r)*42}px)`}),setTimeout(()=>{c.remove(),I.delete(s),R()},o)}function ie(e){if(j){M++,B();return}let r=D+t[e],i=O+n[e];if(r<0||r>=5||i<0||i>=5||r===k&&i===A)return;let{nx:o,ny:s,attack:c}=V(k,A,r,i),l=D,u=O,d=k,f=A;if(D=r,O=i,c||(k=o,A=s),N++,R(),B(),re(a,`🥷`,l,u,D,O,90),c){j=!0,ee(h,430);let e=++F,t=A*5+k;I.add(t),_[t].textContent=``;let n=H(a,`🐍`,k,A,`g-ov`),r=(D-k)*42*.45,i=(O-A)*42*.45;requestAnimationFrame(()=>{n.style.transition=`transform 140ms ease-out`,n.style.transform=`translate(${r}px,${i}px)`}),setTimeout(()=>{F===e&&(n.style.transition=`transform 140ms ease-in`,n.style.transform=`translate(0,0)`,setTimeout(()=>{F===e&&(n.remove(),I.delete(t),R(),te(a,_,D,O,`🥷`),P++,setTimeout(()=>{F===e&&(j=!1,U(h),B())},150))},140))},140)}else re(a,`🐍`,d,f,k,A,120)}L(),z(),R(),B();function W(e){ne(e),ie(e)}e.querySelectorAll(`[data-dir]`).forEach(e=>{e.addEventListener(`click`,()=>W(e.dataset.dir)),e.addEventListener(`touchstart`,t=>{t.preventDefault(),W(e.dataset.dir)},{passive:!1})});let G=e.querySelector(`#ghost-auto-btn`),ae=e.querySelector(`#ghost-auto-ms`),oe=null,se=!1,ce=0,le=[`right`,`right`,`down`,`down`,`left`,`left`,`up`,`up`];function ue(){oe&&=(clearInterval(oe),null),se=!1,G.textContent=`▶ Auto`,G.classList.remove(`active`)}function de(){let e=Math.max(20,parseInt(ae.value,10)||80);se=!0,G.textContent=`⏹ Stop`,G.classList.add(`active`),oe=setInterval(()=>{W(Math.random()<.6?r[Math.floor(Math.random()*4)]:le[ce++%le.length])},e)}G.addEventListener(`click`,()=>{se?ue():de()}),ae.addEventListener(`change`,()=>{se&&(ue(),de())}),e.querySelector(`#ghost-reset`).addEventListener(`click`,()=>{ue(),E++,F++,I.clear(),v=2,y=2,b=4,x=4,S=!1,C=0,w=0,T=0,D=2,O=2,k=4,A=4,j=!1,M=0,N=0,P=0,ce=0,i.querySelectorAll(`.b-ov, .ghost-hit-flash-ov`).forEach(e=>e.remove()),a.querySelectorAll(`.g-ov, .ghost-hit-flash-ov`).forEach(e=>e.remove()),U(m),U(h),L(),z(),R(),B()});let fe={ArrowUp:`up`,ArrowDown:`down`,ArrowLeft:`left`,ArrowRight:`right`};function pe(t){if(!e.isConnected){document.removeEventListener(`keydown`,pe);return}let n=fe[t.key];n&&(t.preventDefault(),W(n))}document.addEventListener(`keydown`,pe);function me(e,t,n,r,i,a){let o=t.offsetLeft,s=t.offsetTop,c=n.offsetLeft-o,l=n.offsetTop-s,u=document.createElement(`div`);u.textContent=r,Object.assign(u.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${o}px`,top:`${s}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(u),requestAnimationFrame(()=>{u.style.transition=`transform ${i}ms ease-out`,u.style.transform=`translate(${c}px,${l}px)`}),setTimeout(()=>{u.remove(),a()},i)}function he(e,t){let n=t.textContent||``;t.textContent=``;let r=document.createElement(`div`);r.className=`ghost-hit-flash-ov`,r.textContent=n,Object.assign(r.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${t.offsetLeft}px`,top:`${t.offsetTop}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(r),setTimeout(()=>{r.remove(),t.textContent=n},150)}function ge(e,t,n,r,i,a){let o=t.offsetLeft,s=t.offsetTop,c=(n.offsetLeft-o)*.45,l=(n.offsetTop-s)*.45,u=document.createElement(`div`);u.textContent=r,Object.assign(u.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${o}px`,top:`${s}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(u),t.textContent=``,requestAnimationFrame(()=>{u.style.transition=`transform 140ms ease-out`,u.style.transform=`translate(${c}px,${l}px)`}),setTimeout(()=>{i(),u.style.transition=`transform 140ms ease-in`,u.style.transform=`translate(0,0)`,setTimeout(()=>{u.remove(),t.textContent=r,a()},140)},140)}{let t=e.querySelector(`[data-demo="slide"]`),n=e.querySelector(`[data-demo-btn="slide"]`),r=t.querySelector(`[data-role="src"]`),i=t.querySelector(`[data-role="dst"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,r.textContent=``,me(t,r,i,`🥷`,90,()=>{i.textContent=`🥷`,setTimeout(()=>{r.textContent=`🥷`,i.textContent=``,n.disabled=!1},500)}))})}{let t=e.querySelector(`[data-demo="snake-slide"]`),n=e.querySelector(`[data-demo-btn="snake-slide"]`),r=t.querySelector(`[data-role="src"]`),i=t.querySelector(`[data-role="dst"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,r.textContent=``,me(t,r,i,`🐍`,120,()=>{i.textContent=`🐍`,setTimeout(()=>{r.textContent=`🐍`,i.textContent=``,n.disabled=!1},500)}))})}{let t=e.querySelector(`[data-demo="attack"]`),n=e.querySelector(`[data-demo-btn="attack"]`),r=t.querySelector(`[data-role="player"]`),i=t.querySelector(`[data-role="enemy"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,ge(t,r,i,`🥷`,()=>{let e=document.createElement(`div`);e.textContent=`🐍`,Object.assign(e.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${i.offsetLeft}px`,top:`${i.offsetTop}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`,animation:`ghostDemoAttackDie 240ms ease-out forwards`}),t.appendChild(e),i.textContent=``,setTimeout(()=>{e.remove(),setTimeout(()=>{i.textContent=`🐍`},300)},240)},()=>{n.disabled=!1}))})}{let t=e.querySelector(`[data-demo="snake-attack"]`),n=e.querySelector(`[data-demo-btn="snake-attack"]`),r=t.querySelector(`[data-role="snake"]`),i=t.querySelector(`[data-role="player"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,ge(t,r,i,`🐍`,()=>{he(t,i)},()=>{setTimeout(()=>{n.disabled=!1},150)}))})}{let t=e.querySelector(`[data-demo="interact"]`),n=e.querySelector(`[data-demo-btn="interact"]`),r=t.querySelector(`[data-role="player"]`),i=t.querySelector(`[data-role="target"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,ge(t,r,i,`🥷`,()=>{let e=document.createElement(`div`);e.textContent=`🌲`,Object.assign(e.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${i.offsetLeft}px`,top:`${i.offsetTop}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`,transformOrigin:`center`,animation:`ghostDemoInteractShake 220ms ease-out forwards`}),i.textContent=``,t.appendChild(e),setTimeout(()=>{e.remove(),i.textContent=`🌲`},220)},()=>{n.disabled=!1}))})}}var qt=`
<style>
  /* Chrome (headings, cards, descriptions, controls) follows the docs hub's
     theme variables like a markdown doc would. Only .ehb-area/.ehb-tile (the
     mini board + snake tile) and .ehb-bar/.ehb-dir-arrow (the real hp-bar
     overlay + snake direction arrow) are fixed, because they reproduce
     actual in-game elements (styles/styles.css's .tile, .hp-bar/.hp-bar--mini,
     and .tile[data-snake-dir]::after rules) — see CLAUDE.md's "Theming
     interactive docs". */
  .ehb-wrap {
    padding: 24px 16px 48px;
    min-height: 400px;
  }
  #docs-content .ehb-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .ehb-wrap .content {
    max-width: 560px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .ehb-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .ehb-wrap p.ehb-desc {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0 0 16px;
  }

  /* ── Preview stage: mini board around the snake tile — reproduces the
     real game's board/tile backdrop (styles/styles.css: body's forestgreen
     background, and .tile's green background + forestgreen border), fixed
     regardless of the docs-hub theme. ── */
  .ehb-area {
    background: forestgreen;
    display: inline-block;
    padding: 3px;
    border-radius: 3px;
  }
  .ehb-grid {
    display: grid;
    grid-template-columns: repeat(3, 56px);
    grid-template-rows: repeat(3, 56px);
    position: relative;
  }
  .ehb-tile {
    width: 56px;
    height: 56px;
    background: green;
    border: 1px solid forestgreen;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    position: relative;
    box-sizing: border-box;
    user-select: none;
  }

  /* ── Health bar, rendered above the entity's tile — mirrors
     styles.css's .hp-bar/.hp-bar--mini shape exactly (icon + width%-fill
     track + label), just with tunable size/offset custom properties instead
     of the real scaleToTile() math. ── */
  .ehb-bar {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(calc(-50% + var(--ehb-offset-x, 0px)), var(--ehb-offset-y, -14px));
    display: inline-flex;
    align-items: center;
    gap: 2px;
    pointer-events: none;
    z-index: 5;
    white-space: nowrap;
  }
  .ehb-bar-icon {
    font-size: var(--ehb-icon-size, 8px);
    line-height: 1;
  }
  .ehb-bar-track {
    position: relative;
    width: var(--ehb-bar-width, 34px);
    height: var(--ehb-bar-height, 6px);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 2px;
    overflow: hidden;
  }
  .ehb-bar-fill {
    position: absolute;
    inset: 0;
    background: #cc3333;
  }

  /* ── Snake direction arrow, copied exactly from styles.css
     .tile[data-snake-dir]::after — for clash reference only ── */
  .ehb-dir-arrow {
    display: none;
    position: absolute;
    font-size: 0.38em;
    line-height: 1;
    color: rgba(255, 220, 50, 0.88);
    pointer-events: none;
    z-index: 1;
  }
  .ehb-dir-arrow.ehb-visible { display: block; }
  .ehb-dir-arrow[data-dir="up"]    { top: -3px;    left: 50%; transform: translateX(-50%) rotate(-90deg); }
  .ehb-dir-arrow[data-dir="down"]  { bottom: -3px; left: 50%; transform: translateX(-50%) rotate(90deg); }
  .ehb-dir-arrow[data-dir="left"]  { left: -3px;   top: 50%;  transform: translateY(-50%) rotate(180deg); }
  .ehb-dir-arrow[data-dir="right"] { right: -3px;  top: 50%;  transform: translateY(-50%); }

  /* ── Controls (tuning UI chrome — theme-following) ── */
  .ehb-control-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .ehb-control-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ehb-control-label {
    font-size: 0.85rem;
    color: var(--text);
    min-width: 110px;
  }
  .ehb-wrap input[type=range] {
    flex: 1;
    accent-color: var(--link);
    height: 6px;
    cursor: pointer;
  }
  .ehb-wrap input[type=number] {
    width: 64px;
    padding: 6px 8px;
    background: var(--search-bg);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.9rem;
    text-align: right;
  }
  .ehb-wrap .ehb-unit {
    font-size: 0.75rem;
    color: var(--muted);
    width: 20px;
  }
  .ehb-wrap select {
    padding: 6px 8px;
    background: var(--search-bg);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.85rem;
  }
  .ehb-btn-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .ehb-btn {
    padding: 8px 18px;
    background: var(--link-card-bg);
    color: var(--text);
    border: 1px solid var(--link-card-border);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.1s;
  }
  .ehb-btn:hover { background: var(--nav-hover); }
  .ehb-btn.ehb-sec {
    background: transparent;
    color: var(--muted);
    border-color: var(--border);
  }
  .ehb-copy-lbl {
    font-size: 0.75rem;
    color: var(--muted);
    min-height: 1.2em;
    align-self: center;
  }
  .ehb-json {
    background: var(--pre-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
    font-size: 0.78rem;
    color: var(--pre-color);
    white-space: pre;
    overflow-x: auto;
  }

  /* ── Gallery of fixed health states ── */
  .ehb-gallery-row {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ehb-gallery-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .ehb-gallery-cap {
    font-size: 0.72rem;
    color: var(--muted);
  }
</style>

<div class="ehb-wrap">
  <h1>❤️ Entity Health Bar</h1>

  <div class="content">

    <!-- ─────────────── Interactive preview ─────────────── -->
    <section>
      <div class="section-label">Live Preview</div>
      <p class="ehb-desc">
        Tweak icon size, bar size, and position below. The center tile shows a snake with the
        "Preview Health" value out of "Preview Max"; neighboring tiles are included so you can
        check for overlap with tiles above/beside it. Toggle the direction arrow and pick a side
        to check for a clash — it's the same ▸ indicator the game shows for a snake's next move,
        positioned and rotated exactly like styles.css does for each of the 4 directions.
      </p>
      <div style="text-align:center;margin-bottom:20px;">
        <div class="ehb-area">
          <div class="ehb-grid" id="ehb-grid">
            <div class="ehb-tile"></div><div class="ehb-tile"></div><div class="ehb-tile"></div>
            <div class="ehb-tile"></div>
            <div class="ehb-tile" id="ehb-snake-tile">
              🐍
              <div class="ehb-bar" id="ehb-bar"></div>
              <div class="ehb-dir-arrow" id="ehb-dir-arrow" data-dir="up">▸</div>
            </div>
            <div class="ehb-tile"></div>
            <div class="ehb-tile"></div><div class="ehb-tile"></div><div class="ehb-tile"></div>
          </div>
        </div>
      </div>

      <div class="ehb-control-card">
        <div class="ehb-control-row">
          <span class="ehb-control-label">Preview Max</span>
          <input type="range" id="ehb-max-range" min="1" max="10" step="1">
          <input type="number" id="ehb-max-number" min="1" max="10" step="1">
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Preview Health</span>
          <input type="range" id="ehb-health-range" min="0" max="10" step="0.5">
          <input type="number" id="ehb-health-number" min="0" max="10" step="0.5">
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Icon Size</span>
          <input type="range" id="ehb-icon-range" min="4" max="24" step="1">
          <input type="number" id="ehb-icon-number" min="4" max="24" step="1">
          <span class="ehb-unit">px</span>
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Bar Width</span>
          <input type="range" id="ehb-width-range" min="10" max="80" step="1">
          <input type="number" id="ehb-width-number" min="10" max="80" step="1">
          <span class="ehb-unit">px</span>
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Bar Height</span>
          <input type="range" id="ehb-height-range" min="2" max="20" step="1">
          <input type="number" id="ehb-height-number" min="2" max="20" step="1">
          <span class="ehb-unit">px</span>
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Offset Y (+down)</span>
          <input type="range" id="ehb-offy-range" min="-40" max="40" step="1">
          <input type="number" id="ehb-offy-number" min="-40" max="40" step="1">
          <span class="ehb-unit">px</span>
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Offset X</span>
          <input type="range" id="ehb-offx-range" min="-20" max="20" step="1">
          <input type="number" id="ehb-offx-number" min="-20" max="20" step="1">
          <span class="ehb-unit">px</span>
        </div>
        <div class="ehb-control-row">
          <span class="ehb-control-label">Dir. Arrow</span>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:var(--text);cursor:pointer;">
            <input type="checkbox" id="ehb-arrow-toggle" checked>
            Show the real ▸ arrow (from styles.css) for clash reference
          </label>
          <select id="ehb-dir-select">
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div class="ehb-btn-row">
          <button class="ehb-btn" id="ehb-copy-btn">📋 Copy Settings as JSON</button>
          <button class="ehb-btn ehb-sec" id="ehb-reset-btn">↺ Reset to Default</button>
          <span class="ehb-copy-lbl" id="ehb-copy-lbl"></span>
        </div>
      </div>

      <div class="ehb-json" id="ehb-json"></div>
    </section>

    <!-- ─────────────── Gallery of fixed states ─────────────── -->
    <section>
      <div class="section-label">Reference — Full / Half / Empty</div>
      <div class="ehb-gallery-row" id="ehb-gallery"></div>
    </section>

  </div>
</div>
`,Jt={iconSize:8,barWidth:34,barHeight:6,offsetX:0,offsetY:-1,previewMax:3,previewHealth:3};function Yt(e,t,n){e.innerHTML=``,e.style.setProperty(`--ehb-icon-size`,`${t.iconSize}px`),e.style.setProperty(`--ehb-bar-width`,`${t.barWidth}px`),e.style.setProperty(`--ehb-bar-height`,`${t.barHeight}px`);let r=document.createElement(`span`);r.className=`ehb-bar-icon`,r.textContent=`❤️`;let i=document.createElement(`div`);i.className=`ehb-bar-track`;let a=document.createElement(`div`);a.className=`ehb-bar-fill`;let o=t.previewMax>0?Math.max(0,Math.min(1,n/t.previewMax))*100:0;a.style.width=`${o}%`,i.appendChild(a),e.appendChild(r),e.appendChild(i)}function Xt(e){let t=e.querySelector(`#ehb-grid`),n=e.querySelector(`#ehb-bar`),r=e.querySelector(`#ehb-dir-arrow`),i=e.querySelector(`#ehb-arrow-toggle`),a=e.querySelector(`#ehb-dir-select`),o=e.querySelector(`#ehb-max-range`),s=e.querySelector(`#ehb-max-number`),c=e.querySelector(`#ehb-health-range`),l=e.querySelector(`#ehb-health-number`),u=e.querySelector(`#ehb-icon-range`),d=e.querySelector(`#ehb-icon-number`),f=e.querySelector(`#ehb-width-range`),p=e.querySelector(`#ehb-width-number`),m=e.querySelector(`#ehb-height-range`),h=e.querySelector(`#ehb-height-number`),g=e.querySelector(`#ehb-offy-range`),_=e.querySelector(`#ehb-offy-number`),v=e.querySelector(`#ehb-offx-range`),y=e.querySelector(`#ehb-offx-number`),b=e.querySelector(`#ehb-copy-btn`),x=e.querySelector(`#ehb-reset-btn`),S=e.querySelector(`#ehb-copy-lbl`),C=e.querySelector(`#ehb-json`),w=e.querySelector(`#ehb-gallery`),T={...Jt};function E(){return JSON.stringify(T,null,2)}function D(){w.innerHTML=``;let e=[{label:`Full`,health:T.previewMax},{label:`Half`,health:T.previewMax/2},{label:`Empty`,health:0}];for(let{label:t,health:n}of e){let e=document.createElement(`div`);e.className=`ehb-gallery-item`;let r=document.createElement(`div`);r.className=`ehb-tile`,r.style.position=`relative`,r.textContent=`🐍`;let i=document.createElement(`div`);i.className=`ehb-bar`,r.appendChild(i),Yt(i,T,n);let a=document.createElement(`div`);a.className=`ehb-gallery-cap`,a.textContent=`${t} (${n})`,e.appendChild(r),e.appendChild(a),w.appendChild(e)}}function O(){t.style.setProperty(`--ehb-offset-y`,`${T.offsetY}px`),t.style.setProperty(`--ehb-offset-x`,`${T.offsetX}px`),Yt(n,T,T.previewHealth),o.value=s.value=String(T.previewMax),c.max=l.max=String(T.previewMax),c.value=l.value=String(T.previewHealth),u.value=d.value=String(T.iconSize),f.value=p.value=String(T.barWidth),m.value=h.value=String(T.barHeight),g.value=_.value=String(T.offsetY),v.value=y.value=String(T.offsetX),C.textContent=E(),D()}function k(e,t,n){let r=e=>{let t=Number(e);Number.isNaN(t)||(n(t),O())};e.addEventListener(`input`,()=>r(e.value)),t.addEventListener(`input`,()=>r(t.value))}k(o,s,e=>{T.previewMax=Math.max(1,Math.min(10,Math.round(e))),T.previewHealth=Math.min(T.previewHealth,T.previewMax)}),k(c,l,e=>{T.previewHealth=Math.max(0,Math.min(T.previewMax,e))}),k(u,d,e=>{T.iconSize=Math.max(4,Math.min(24,e))}),k(f,p,e=>{T.barWidth=Math.max(10,Math.min(80,e))}),k(m,h,e=>{T.barHeight=Math.max(2,Math.min(20,e))}),k(g,_,e=>{T.offsetY=Math.max(-40,Math.min(40,e))}),k(v,y,e=>{T.offsetX=Math.max(-20,Math.min(20,e))});let A;b.addEventListener(`click`,async()=>{let e=E();try{await navigator.clipboard.writeText(e),S.textContent=`✅ Copied to clipboard!`}catch{S.textContent=`⚠️ Clipboard blocked — copy the JSON below manually`}A&&clearTimeout(A),A=setTimeout(()=>{S.textContent=``},2200)}),x.addEventListener(`click`,()=>{T={...Jt},O()}),r.classList.toggle(`ehb-visible`,i.checked),i.addEventListener(`change`,()=>{r.classList.toggle(`ehb-visible`,i.checked)}),r.dataset.dir=a.value,a.addEventListener(`change`,()=>{r.dataset.dir=a.value}),O()}var Zt=P(e,.11),Qt=P(e,l),$t=`
<style>
  /* Chrome (headings, descriptions, control cards) follows the docs hub's
     theme variables like a markdown doc would — see CLAUDE.md's "Theming
     interactive docs". Only .dn-area/.dn-tile (the mini board + tiles) and
     .dn-float (the floating number itself, since it's a mockup of a real
     on-tile game overlay) are fixed, reproducing styles.css's forestgreen
     board / green tile look and ui.ts's notify() overlay regardless of the
     docs hub's light/dark toggle. */
  .dn-wrap {
    padding: 24px 16px 48px;
    min-height: 400px;
  }
  #docs-content .dn-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
  .dn-wrap .content {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .dn-wrap .dn-intro {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0;
  }
  .dn-wrap .dn-intro strong { color: var(--text); }
  .dn-wrap .dn-intro code {
    background: var(--pre-bg);
    color: var(--pre-color);
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 0.92em;
  }
  .dn-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .dn-wrap p.dn-desc {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0 0 16px;
  }
  .dn-wrap ul.dn-list {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.65;
    margin: 0 0 16px;
    padding-left: 1.2em;
  }
  .dn-wrap ul.dn-list li strong { color: var(--text); }

  /* ── Boards: reproduce the real game's board/tile backdrop (forestgreen
     background, green .tile), fixed regardless of the docs-hub theme. ── */
  .dn-boards-row {
    display: flex;
    gap: 28px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .dn-board-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .dn-board-cap {
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--text);
  }
  .dn-board-col.bad .dn-board-cap { color: #dc2626; }
  .dn-board-col.good .dn-board-cap { color: #16a34a; }
  .dn-board-sub {
    font-size: 0.7rem;
    color: var(--muted);
    text-align: center;
    max-width: 190px;
    line-height: 1.4;
  }
  .dn-area {
    background: forestgreen;
    display: inline-block;
    padding: 3px;
    border-radius: 3px;
  }
  .dn-grid {
    display: grid;
    grid-template-columns: repeat(3, 56px);
    grid-template-rows: repeat(3, 56px);
    position: relative;
  }
  .dn-tile {
    width: 56px;
    height: 56px;
    background: green;
    border: 1px solid forestgreen;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    position: relative;
    box-sizing: border-box;
    user-select: none;
    overflow: visible;
  }

  /* Old repeated-heart notification — copied verbatim from ui.ts's notify()
     sizing rules (width/height = target tile rect, font-size = 80% of tile
     height, centered text, no wrap/clip) so the overflow it produces here is
     the same overflow that happens in the real game. */
  .dn-old-float {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
    z-index: 4;
  }

  /* New floating damage number — the actual proposed replacement. Bold with
     a dark outline (via -webkit-text-stroke + text-shadow fallback) so it
     reads over any tile color, sized in px independent of tile size (unlike
     the old notify(), which sizes text off the target tile's own rect). */
  .dn-float {
    position: absolute;
    left: 50%;
    top: 50%;
    font-weight: 800;
    pointer-events: none;
    white-space: nowrap;
    z-index: 4;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    paint-order: stroke fill;
  }

  .dn-btn-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 210px;
  }
  .dn-btn {
    padding: 6px 10px;
    background: var(--link-card-bg);
    color: var(--text);
    border: 1px solid var(--link-card-border);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.76rem;
    transition: background 0.1s;
  }
  .dn-btn:hover { background: var(--nav-hover); }
  .dn-btn.dn-heal { border-color: #16a34a; color: #16a34a; }
  .dn-btn.dn-lethal { border-color: #dc2626; color: #dc2626; }

  /* ── Controls (tuning UI chrome — theme-following) ── */
  .dn-control-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .dn-control-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dn-control-label {
    font-size: 0.85rem;
    color: var(--text);
    min-width: 130px;
  }
  .dn-wrap input[type=range] {
    flex: 1;
    accent-color: var(--link);
    height: 6px;
    cursor: pointer;
  }
  .dn-wrap input[type=number] {
    width: 60px;
    padding: 6px 8px;
    background: var(--search-bg);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.9rem;
    text-align: right;
  }
  .dn-wrap input[type=color] {
    width: 40px;
    height: 30px;
    padding: 2px;
    background: var(--search-bg);
    border: 1px solid var(--search-border);
    border-radius: 6px;
    cursor: pointer;
  }
  .dn-wrap select {
    padding: 6px 8px;
    background: var(--search-bg);
    border: 1px solid var(--search-border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.85rem;
  }
  .dn-wrap .dn-unit {
    font-size: 0.75rem;
    color: var(--muted);
    width: 26px;
  }
  .dn-btn-row.dn-tools {
    max-width: none;
    justify-content: flex-start;
    margin-top: 4px;
  }
  .dn-copy-lbl {
    font-size: 0.75rem;
    color: var(--muted);
    min-height: 1.2em;
    align-self: center;
  }
  .dn-json {
    background: var(--pre-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
    font-size: 0.78rem;
    color: var(--pre-color);
    white-space: pre;
    overflow-x: auto;
  }
</style>

<div class="dn-wrap">
  <h1>💥 Floating Damage Numbers</h1>

  <div class="content">

    <p class="dn-intro">
      <strong>Shipped</strong> — this prototype's design is now the real feature: <code>scripts/floatingNumbers.ts</code>'s
      <code>spawnFloatingNumber(tileEl, value, kind)</code> replaced <code>scripts/damage.ts</code>'s old
      <code>notify(DAMAGE.repeat(Math.ceil(reducedDamage)), ...)</code> (a string of repeated 💔 emoji) on both the
      player-damage/death path and <code>player.ts</code>'s enemy-hit path (<code>playMobHitImpact</code>, which
      previously only refreshed a mob's mini health-bar with no per-hit number of its own) — one shared call for
      both sides, the same way <code>feedback()</code> is one table-driven function for every action's sound/haptic
      (see CLAUDE.md's "Unify by data, not by call site"). A HEALING_POTION floats a heal number too, once per
      turn for as long as its heal-over-time effect is still running (<code>scripts/heal.ts</code>'s
      <code>tickHeal</code>) — not at the moment of pickup, which uses the same generic item-lift notify as everything
      else now. The real feature ships with fixed values (font size, distance, duration, stack offset,
      colors) rather than the tunable controls below — this page stays as the interactive design record; the
      "Tunable Settings" panel is still useful for evaluating a future change to those fixed values, but no longer
      reflects a build-time choice. The panel's earlier "Crit" scale/threshold was dropped entirely rather than
      shipped: there's no real critical-hit mechanic anywhere in <code>weapon.ts</code>/<code>dropsCore.ts</code>
      (no crit chance or multiplier), so a magnitude-based "big hits get bigger/redder" rule would have read as a
      proposal for a gameplay mechanic that doesn't exist.
    </p>

    <!-- ─────────────── The problem ─────────────── -->
    <section>
      <div class="section-label">Why The Heart Notify Is Broken</div>
      <ul class="dn-list">
        <li><strong>Repeated hearts can't represent today's damage scale.</strong> Health/damage was rescaled ~34× so
          combat has room for granular integer numbers instead of half-heart increments (player <code>maxHealth</code>
          3→100, a snake's own attack 1→34) — but <code>notify()</code> still repeats one 💔 per point of damage, so an
          unarmed swing alone needs 17 hearts and a strong weapon hit needs 170+, all crammed into one tile.</li>
        <li><strong>Repeated hearts don't fit in one tile.</strong> <code>notify()</code> sizes the text's container to the
          <em>target tile's own rect</em> (width/height), with font-size at 80% of tile height — fine for one glyph, but 2+
          repeated hearts simply overflow that box with no wrap or clip, spilling across neighboring tiles.</li>
        <li><strong>It's player-only.</strong> There is no equivalent call for a hit landing on an enemy — only the mini
          health-bar's fill percentage changes, so a single attack's exact damage against a mob is never shown anywhere.</li>
      </ul>
      <p class="dn-desc">Click a damage amount below on both boards to see the difference — the neighboring tiles are
        included specifically so the old version's overflow is visible, the same way it would spill onto real
        neighboring tiles in the game.</p>
      <!-- 170 (both boards' last button) approximates a maxed-out legendary
           weapon roll — weapon.ts's WEAPON_DAMAGE_FIELD baseMax (34) ×
           WEAPON_MAX_MULT (5.0), rounded up. Not imported directly since
           that field isn't exported (only WEAPON_MIN_MULT/WEAPON_MAX_MULT
           are) — every other button below pulls its real constant in. -->
      <div class="dn-boards-row">
        <div class="dn-board-col bad">
          <div class="dn-board-cap">Before — repeated 💔</div>
          <div class="dn-area">
            <div class="dn-grid" id="dn-old-grid">
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile" id="dn-old-tile">🐍</div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
            </div>
          </div>
          <div class="dn-btn-row">
            <button class="dn-btn" data-old-dmg="${o}">${o} dmg</button>
            <button class="dn-btn" data-old-dmg="${y.attackDamage}">${y.attackDamage} dmg</button>
            <button class="dn-btn" data-old-dmg="${y.maxHealth}">${y.maxHealth} dmg</button>
            <button class="dn-btn" data-old-dmg="170">170 dmg</button>
          </div>
        </div>
        <div class="dn-board-col good">
          <div class="dn-board-cap">After — floating number</div>
          <div class="dn-area">
            <div class="dn-grid" id="dn-new-grid">
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile" id="dn-new-tile">🐍</div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
            </div>
          </div>
          <div class="dn-btn-row">
            <button class="dn-btn" data-new-dmg="${o}">${o} dmg</button>
            <button class="dn-btn" data-new-dmg="${y.attackDamage}">${y.attackDamage} dmg</button>
            <button class="dn-btn" data-new-dmg="${y.maxHealth}">${y.maxHealth} dmg</button>
            <button class="dn-btn" data-new-dmg="170">170 dmg</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────── Live preview: player + enemy ─────────────── -->
    <section>
      <div class="section-label">Live Preview — Player &amp; Enemy</div>
      <p class="dn-desc">
        Same <code>spawnFloatingNumber()</code> call driving both tiles — a mob's attack, a starvation tick, a big
        hit, and (player-only) a heal. "Kill" drops the
        target to 0 and shows the death 💀, matching <code>damage.ts</code>/<code>player.ts</code>'s existing
        skull-on-death notify.
      </p>
      <div class="dn-boards-row">
        <div class="dn-board-col">
          <div class="dn-board-cap">Player</div>
          <div class="dn-board-sub" id="dn-player-hp">HP: ${e} / ${e}</div>
          <div class="dn-area">
            <div class="dn-grid" id="dn-player-grid">
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile" id="dn-player-tile">🥷</div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
            </div>
          </div>
          <div class="dn-btn-row">
            <button class="dn-btn" data-player-dmg="${y.attackDamage}">Hit -${y.attackDamage}</button>
            <button class="dn-btn" data-player-dmg="${Qt}">Starvation -${Qt}</button>
            <button class="dn-btn dn-lethal" data-player-dmg="${e}">Big Hit -${e}</button>
            <button class="dn-btn dn-heal" data-player-heal="${Zt}">Heal +${Zt}</button>
            <button class="dn-btn" id="dn-player-reset">Reset</button>
          </div>
        </div>
        <div class="dn-board-col">
          <div class="dn-board-cap">Enemy (Snake)</div>
          <div class="dn-board-sub" id="dn-enemy-hp">HP: ${y.maxHealth} / ${y.maxHealth}</div>
          <div class="dn-area">
            <div class="dn-grid" id="dn-enemy-grid">
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile" id="dn-enemy-tile">🐍</div><div class="dn-tile"></div>
              <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
            </div>
          </div>
          <div class="dn-btn-row">
            <button class="dn-btn" data-enemy-dmg="${o}">Hit -${o}</button>
            <button class="dn-btn dn-lethal" data-enemy-dmg="${y.maxHealth}">Big Hit -${y.maxHealth}</button>
            <button class="dn-btn" id="dn-enemy-kill">Kill</button>
            <button class="dn-btn" id="dn-enemy-reset">Reset</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────── Stacking demo ─────────────── -->
    <section>
      <div class="section-label">Rapid-Hit Stacking</div>
      <p class="dn-desc">
        A multi-hit combo landing on the same tile within one animation window would otherwise spawn overlapping
        numbers on top of each other. Each active number on a tile is tracked and staggered upward by
        "Stack Offset" below, so a fast combo reads as a legible list instead of a smear.
      </p>
      <div style="text-align:center;">
        <div class="dn-area">
          <div class="dn-grid" id="dn-stack-grid">
            <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
            <div class="dn-tile"></div><div class="dn-tile" id="dn-stack-tile">🐍</div><div class="dn-tile"></div>
            <div class="dn-tile"></div><div class="dn-tile"></div><div class="dn-tile"></div>
          </div>
        </div>
        <div class="dn-btn-row" style="max-width:none;justify-content:center;margin-top:10px;">
          <button class="dn-btn" id="dn-stack-combo">Fire 3-Hit Combo</button>
        </div>
      </div>
    </section>

    <!-- ─────────────── Tunable settings ─────────────── -->
    <section>
      <div class="section-label">Tunable Settings</div>
      <div class="dn-control-card">
        <div class="dn-control-row">
          <span class="dn-control-label">Font Size</span>
          <input type="range" id="dn-fontsize-range" min="10" max="48" step="1">
          <input type="number" id="dn-fontsize-number" min="10" max="48" step="1">
          <span class="dn-unit">px</span>
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Skull Scale</span>
          <input type="range" id="dn-skullscale-range" min="1" max="2" step="0.05">
          <input type="number" id="dn-skullscale-number" min="1" max="2" step="0.05">
          <span class="dn-unit">×</span>
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Float Distance</span>
          <input type="range" id="dn-distance-range" min="10" max="80" step="1">
          <input type="number" id="dn-distance-number" min="10" max="80" step="1">
          <span class="dn-unit">px</span>
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Duration</span>
          <input type="range" id="dn-duration-range" min="300" max="2000" step="50">
          <input type="number" id="dn-duration-number" min="300" max="2000" step="50">
          <span class="dn-unit">ms</span>
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Stack Offset</span>
          <input type="range" id="dn-stackoffset-range" min="0" max="30" step="1">
          <input type="number" id="dn-stackoffset-number" min="0" max="30" step="1">
          <span class="dn-unit">px</span>
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Stack Cap</span>
          <input type="range" id="dn-stackcap-range" min="1" max="10" step="1">
          <input type="number" id="dn-stackcap-number" min="1" max="10" step="1">
          <span class="dn-unit">#</span>
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Damage Color</span>
          <input type="color" id="dn-color-damage">
        </div>
        <div class="dn-control-row">
          <span class="dn-control-label">Heal Color</span>
          <input type="color" id="dn-color-heal">
        </div>
        <div class="dn-btn-row dn-tools">
          <button class="dn-btn" id="dn-copy-btn">📋 Copy Settings as JSON</button>
          <button class="dn-btn" id="dn-reset-settings-btn">↺ Reset to Default</button>
          <span class="dn-copy-lbl" id="dn-copy-lbl"></span>
        </div>
      </div>
      <div class="dn-json" id="dn-json"></div>
    </section>

  </div>
</div>
`,en={fontSize:32,skullScale:1.4,floatDistance:36,duration:1400,stackOffset:14,stackCap:5,damageColor:`#ff4d4d`,healColor:`#3ddc61`},tn=new WeakMap;function nn(e){return String(Math.ceil(Math.abs(e)))}function X(e,t,n,r){let i=tn.get(e)??0;tn.set(e,i+1);let a=Math.min(i,r.stackCap-1),o=document.createElement(`div`);o.className=`dn-float`,o.textContent=n===`skull`?`💀`:`${n===`heal`?`+`:`-`}${nn(t)}`;let s=n===`skull`?r.fontSize*r.skullScale:r.fontSize,c=n===`heal`?r.healColor:r.damageColor;o.style.fontSize=`${s}px`,o.style.color=c,o.style.webkitTextStroke=`2.5px rgba(0,0,0,0.55)`,o.style.textShadow=`0 1px 3px rgba(0,0,0,0.7)`,e.appendChild(o);let l=-(a*r.stackOffset),u=l-r.floatDistance,d=o.animate([{transform:`translate(-50%, calc(-50% + ${l}px))`,opacity:1},{transform:`translate(-50%, calc(-50% + ${u}px))`,opacity:0}],{duration:r.duration,easing:`ease-out`,fill:`forwards`});d.onfinish=()=>{o.remove(),tn.set(e,Math.max(0,(tn.get(e)??1)-1))}}function rn(e,t){let n=e.getBoundingClientRect(),r=document.createElement(`div`);r.className=`dn-old-float`,r.textContent=`💔`.repeat(Math.ceil(t)),r.style.width=`${n.width}px`,r.style.height=`${n.height}px`,r.style.fontSize=`${n.height*.8}px`,r.style.lineHeight=`${n.height}px`,e.appendChild(r);let i=r.animate([{transform:`translate(-50%, -50%)`,opacity:1},{transform:`translate(-50%, calc(-50% - 100%))`,opacity:0}],{duration:800,easing:`ease-out`,fill:`forwards`});i.onfinish=()=>r.remove()}function an(t){let n={...en},r=t.querySelector(`#dn-fontsize-range`),i=t.querySelector(`#dn-fontsize-number`),a=t.querySelector(`#dn-skullscale-range`),s=t.querySelector(`#dn-skullscale-number`),c=t.querySelector(`#dn-distance-range`),l=t.querySelector(`#dn-distance-number`),u=t.querySelector(`#dn-duration-range`),d=t.querySelector(`#dn-duration-number`),f=t.querySelector(`#dn-stackoffset-range`),p=t.querySelector(`#dn-stackoffset-number`),m=t.querySelector(`#dn-stackcap-range`),h=t.querySelector(`#dn-stackcap-number`),g=t.querySelector(`#dn-color-damage`),_=t.querySelector(`#dn-color-heal`),v=t.querySelector(`#dn-copy-btn`),b=t.querySelector(`#dn-reset-settings-btn`),x=t.querySelector(`#dn-copy-lbl`),S=t.querySelector(`#dn-json`);function C(){r.value=i.value=String(n.fontSize),a.value=s.value=String(n.skullScale),c.value=l.value=String(n.floatDistance),u.value=d.value=String(n.duration),f.value=p.value=String(n.stackOffset),m.value=h.value=String(n.stackCap),g.value=n.damageColor,_.value=n.healColor,S.textContent=JSON.stringify(n,null,2)}function w(e,t,n){let r=e=>{let t=Number(e);Number.isNaN(t)||(n(t),C())};e.addEventListener(`input`,()=>r(e.value)),t.addEventListener(`input`,()=>r(t.value))}w(r,i,e=>{n.fontSize=Math.max(10,Math.min(48,e))}),w(a,s,e=>{n.skullScale=Math.max(1,Math.min(2,e))}),w(c,l,e=>{n.floatDistance=Math.max(10,Math.min(80,e))}),w(u,d,e=>{n.duration=Math.max(300,Math.min(2e3,e))}),w(f,p,e=>{n.stackOffset=Math.max(0,Math.min(30,e))}),w(m,h,e=>{n.stackCap=Math.max(1,Math.min(10,e))}),g.addEventListener(`input`,()=>{n.damageColor=g.value,C()}),_.addEventListener(`input`,()=>{n.healColor=_.value,C()});let T;v.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(JSON.stringify(n,null,2)),x.textContent=`✅ Copied to clipboard!`}catch{x.textContent=`⚠️ Clipboard blocked — copy the JSON below manually`}T&&clearTimeout(T),T=setTimeout(()=>{x.textContent=``},2200)}),b.addEventListener(`click`,()=>{n={...en},C()});let E=t.querySelector(`#dn-old-tile`),D=t.querySelector(`#dn-new-tile`);t.querySelectorAll(`[data-old-dmg]`).forEach(e=>{e.addEventListener(`click`,()=>rn(E,Number(e.dataset.oldDmg)))}),t.querySelectorAll(`[data-new-dmg]`).forEach(e=>{e.addEventListener(`click`,()=>{X(D,Number(e.dataset.newDmg),`damage`,n)})});let O=e,k=O,A=t.querySelector(`#dn-player-tile`),j=t.querySelector(`#dn-player-hp`);function M(){j.textContent=`HP: ${k} / ${O}`}t.querySelectorAll(`[data-player-dmg]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.playerDmg);k=Math.max(0,k-t),M(),X(A,t,k<=0?`skull`:`damage`,n)})}),t.querySelectorAll(`[data-player-heal]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.playerHeal);k=Math.min(O,k+t),M(),X(A,t,`heal`,n)})}),t.querySelector(`#dn-player-reset`).addEventListener(`click`,()=>{k=O,M()}),M();let N=y.maxHealth,P=N,F=t.querySelector(`#dn-enemy-tile`),I=t.querySelector(`#dn-enemy-hp`);function L(){I.textContent=`HP: ${Math.max(0,P)} / ${N}`}t.querySelectorAll(`[data-enemy-dmg]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.enemyDmg);P=Math.max(0,P-t),L(),X(F,t,P<=0?`skull`:`damage`,n)})}),t.querySelector(`#dn-enemy-kill`).addEventListener(`click`,()=>{let e=P;P=0,L(),X(F,e,`skull`,n)}),t.querySelector(`#dn-enemy-reset`).addEventListener(`click`,()=>{P=N,L()}),L();let R=t.querySelector(`#dn-stack-tile`);t.querySelector(`#dn-stack-combo`).addEventListener(`click`,()=>{[o,o,y.attackDamage].forEach((e,t)=>{setTimeout(()=>X(R,e,`damage`,n),t*120)})}),C()}var on=`EXTERNAL giveKey()

VAR gold = 12
VAR hasKey = false

# speaker: Blacksmith
# portrait: 🧔
{ hasKey:
    Back again? That key still treating you well?
- else:
    Welcome to my shop, traveler! Care to see what I've got?
}

* [Ask about the key]
    -> ask_key
* [Just passing through]
    -> bye

=== ask_key ===
{ hasKey:
    # speaker: Blacksmith
    # portrait: 🧔
    You've already got one from me — no charge for seconds!
    -> bye
- else:
    # speaker: Blacksmith
    # portrait: 🧔
    A key, eh? I forged one last week — yours for 5 gold.
    -> shop_key
}

=== shop_key ===
* [Pay 5 gold] -> pay_for_key
* [Never mind] -> bye

=== pay_for_key ===
{ gold >= 5:
    ~ gold = gold - 5
    ~ hasKey = true
    ~ giveKey()
    # speaker: Blacksmith
    # portrait: 🧔
    Pleasure doing business! You now have {gold} gold.
- else:
    # speaker: Blacksmith
    # portrait: 🧔
    You don't have enough gold for that, friend.
}
-> bye

=== bye ===
# speaker: Blacksmith
# portrait: 🧔
Safe travels!
-> END
`,sn=`
<style>
  /* Chrome (headings, intro text, the gold/key state HUD, the reset button,
     the collapsible source view, the closing explanation list) follows the
     docs hub's theme variables exactly like a markdown doc would (see
     CLAUDE.md's "Theming interactive docs"). Only the parts below that
     genuinely emulate real in-game pixels keep fixed, non-theme-following
     colors, and those are sourced from the real values instead of an
     approximation: the 9x9 grid reuses the House room's exact theme colors
     (scripts/rooms-data.ts 'house' entry), the D-pad preview reuses the real
     #controls button CSS (styles/styles.css, mirrored below), and the dialogue box itself reuses the real
     .dialogue-box family of rules (styles/styles.css lines ~210-291) verbatim
     instead of the hand-picked approximation this file used to have. */
  .dlg-wrap { color: var(--text); font-family: Arial, sans-serif; padding:24px 16px 48px; min-height:400px; }
  #docs-content .dlg-wrap h1 { color: var(--heading); font-size:1.4em; border-bottom:1px solid var(--border); padding-bottom:8px; margin-bottom:8px; }
  .dlg-intro { font-size:0.82rem; color: var(--muted); line-height:1.55; margin-bottom:22px; max-width:640px; }

  .dlg-inv { display:flex; gap:14px; justify-content:center; align-items:center; margin-bottom:18px; font-size:0.85rem; }
  .dlg-inv-item { display:flex; align-items:center; gap:6px; background: var(--link-card-bg); border:1px solid var(--link-card-border); border-radius:20px; padding:4px 12px; transition: background 0.25s; color: var(--text); }
  .dlg-inv-item.flash { background: rgba(255,215,0,0.35); }
  .dlg-inv-item .dlg-inv-icon { font-size:1.1rem; opacity:0.35; }
  .dlg-inv-item.have .dlg-inv-icon { opacity:1; }

  /* 9×9 grid at the real world's aspect ratio (scripts/tile.ts worldSize),
     styled with the exact House room theme colors from scripts/rooms-data.ts
     (body.room-mode in styles.css) — not a stylized mockup. */
  .dlg-stage-wrap { width: min(100%, 420px); margin: 0 auto 8px; }
  .dlg-stage {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    /* Width/height set explicitly in JS (not aspect-ratio): combining
       aspect-ratio on a CSS grid container AND its children triggers a
       circular sizing bug in Chromium (rows balloon, columns collapse) —
       explicit pixel sizing sidesteps it entirely. */
    background: #d8c39d;
  }
  .dlg-tile {
    background-color: #ecdfc5;
    border: 1px solid #d8c39d;
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(12px, 4vw, 24px);
    user-select: none;
    position: relative;
    overflow: hidden;
  }
  .dlg-npc { cursor:pointer; transition: transform 0.15s; z-index: 1; }
  .dlg-npc:hover { transform: scale(1.15); }
  .dlg-npc.talking { box-shadow: 0 0 0 2px #FFD700, 0 0 10px 2px rgba(255,215,0,0.6); animation: dlgPulse 1s infinite; }
  @keyframes dlgPulse { 0%,100%{opacity:.7} 50%{opacity:1} }
  /* Sits below the grid's own fixed-color background, on the page's
     theme-following background — so this is chrome. */
  .dlg-stage-caption { text-align:center; font-size:0.68rem; color: var(--muted); line-height:1.5; margin: 0 0 18px; }

  /* Real game's #controls bar (styles.css) sits position:fixed right below
     the grid — meaning a bottom-anchored dialogue box lands in the exact
     same screen real estate as the D-pad. The resolution isn't to squeeze
     both in at once: since movement is already meant to be frozen during
     dialogue, the D-pad disappears completely and the textbox (tap-to-
     continue only, no directional input) takes its place. This slot models
     that: D-pad and box share one spot, never both visible together.
     The slot itself keeps a small fixed "stage" backdrop behind whichever
     of the two is showing, so the dialogue box (and D-pad) can be judged
     in the context of the scene they actually appear over in the real
     game — the House room, so this reuses the exact same parchment
     (scripts/rooms-data.ts 'house' theme.bg, styles.css body.room-mode
     default) as the grid above, not the forest's forestgreen. */
  .dlg-controls-slot {
    width: min(100%, 420px);
    margin: 0 auto 20px;
    min-height: 116px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #f7f2e7;
    border-radius: 14px;
    padding: 14px;
  }
  .dlg-dpad-zone { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .dlg-dpad-zone.hidden { display: none; }
  /* Sits on the parchment stage above, so it uses that House room's own
     real "text on parchment" color (rooms-data.ts theme.barColor) rather
     than a docs-hub theme var that wouldn't read against a backdrop that
     deliberately does not follow the light/dark toggle. */
  /* #docs-content p in docs.html sets color: var(--text) at (1,0,1)
     specificity, which beats a plain .dlg-dpad-caption class rule — the
     #docs-content prefix here matches that and wins on the added class. */
  #docs-content p.dlg-dpad-caption { font-size: 0.68rem; color: #4a4032; text-align: center; }
  .dlg-wrap .ctrl-btn {
    width: 52px;
    height: 52px;
    box-sizing: border-box;
    background: rgba(15, 70, 15, 0.92);
    border: 2px solid #2d7a2d;
    border-radius: 10px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: manipulation;
    outline: none;
    color: #bbddbb;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    transition: background 0.08s, color 0.08s;
  }
  .dlg-wrap .ctrl-arrow-left  { display: inline-block; transform: rotate(-90deg); line-height: 1; }
  .dlg-wrap .ctrl-arrow-right { display: inline-block; transform: rotate(90deg);  line-height: 1; }
  .dlg-wrap .ctrl-noop { background: transparent; pointer-events: none; }
  .dlg-wrap .ctrl-hub  { border-radius: 50%; }
  .dlg-wrap .ctrl-cross {
    display: grid;
    grid-template-columns: repeat(3, 52px);
    grid-template-rows: repeat(3, 52px);
    gap: 4px;
    -webkit-tap-highlight-color: transparent;
  }
  .dlg-wrap .ctrl-btn.ctrl-btn--flash { background: rgba(50, 150, 50, 0.95); color: white; }

  /* The actual mockup content this doc exists to prototype — copied verbatim
     from the real .dialogue-box family (styles/styles.css lines ~210-291),
     not the hand-picked approximation this file used to have (that had a
     different bg color, border-radius, extra ring-shadow, and several
     slightly-off font sizes). position:fixed is dropped since this renders
     inline in the doc's flow rather than pinned to a real viewport, but every
     color/size/shape value below matches styles.css exactly. */
  .dlg-box {
    width: 100%;
    background: rgba(20, 20, 20, 0.94);
    border: 3px solid #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    padding: 14px 16px;
    min-height: 116px;
    display: none;
    flex-direction: column;
    gap: 8px;
  }
  .dlg-box.active { display:flex; }
  .dlg-box-head { display:flex; align-items:center; gap:10px; }
  .dlg-portrait { font-size:1.8rem; width:42px; height:42px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.08); border-radius:50%; border:2px solid #FFD700; flex-shrink:0; }
  .dlg-speaker { color:#FFD700; font-weight:bold; font-size:1rem; letter-spacing:0.02em; }
  .dlg-text { color:#fff; font-size:1rem; line-height:1.5; min-height:2.8em; cursor:pointer; }
  .dlg-continue { align-self:flex-end; font-size:0.9rem; color:#FFD700; animation: dlgBounce 0.8s infinite; cursor:pointer; }
  .dlg-continue.hidden { visibility:hidden; }
  @keyframes dlgBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
  .dlg-choices { display:flex; flex-direction:column; gap:6px; }
  .dlg-choice { text-align:left; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.2); color:#fff; border-radius:6px; padding:8px 12px; font-size:0.95rem; cursor:pointer; font-family: inherit; touch-action: manipulation; }
  .dlg-choice:hover { background: rgba(255,215,0,0.18); border-color:#FFD700; }
  .dlg-choice-arrow { color:#FFD700; margin-right:6px; }

  .dlg-reset { display:block; margin: 4px auto 28px; background:none; border:1px solid var(--border); color: var(--muted); border-radius:6px; padding:6px 14px; font-size:0.76rem; cursor:pointer; font-family: inherit; }
  .dlg-reset:hover { color: var(--text); border-color: var(--link); }

  .dlg-source summary { cursor:pointer; color: var(--link); font-size:0.8rem; margin-bottom:10px; }
  .dlg-source pre { background: var(--pre-bg); border:1px solid var(--border); border-radius:6px; padding:12px; font-size:0.7rem; line-height:1.5; overflow-x:auto; max-width:640px; margin:0 auto; color: var(--pre-color); white-space:pre; }

  .dlg-gap { max-width:640px; margin: 24px auto 0; font-size:0.8rem; color: var(--muted); line-height:1.6; }
  .dlg-gap h2 { color: var(--heading); font-size:1rem; margin: 0 0 8px; }
  .dlg-gap ul { margin:0; padding-left:20px; }
  .dlg-gap li { margin-bottom:6px; }
</style>
<div class="dlg-wrap">
  <h1>💬 NPC Dialogue Prototype (inkjs)</h1>
  <p class="dlg-intro">
    A working, click-to-play prototype of a Zelda-style NPC conversation, compiled and run entirely
    client-side by <strong>inkjs</strong> (<code>npm i inkjs</code>) from the real <code>.ink</code> script
    below — no build step, no C#/.NET toolchain. The scene below is a real <strong>9×9 grid</strong> (this
    game's actual board size) using the exact tile size and theme colors of the House room you already
    start every game in (<code>scripts/rooms-data.ts</code>), so this is a true-to-scale preview, not a
    stylized mockup. Click the blacksmith to start talking. Gold/key state lives in this page (not inkjs)
    and is passed into the story as ink variables each time you approach, demonstrating the two-way
    variable bridge a real integration needs.
  </p>

  <div class="dlg-inv">
    <div class="dlg-inv-item have" data-inv="gold"><span class="dlg-inv-icon">🪙</span><span data-inv-val="gold">12</span> gold</div>
    <div class="dlg-inv-item" data-inv="key"><span class="dlg-inv-icon">🔑</span><span data-inv-val="key">no key</span></div>
  </div>

  <div class="dlg-stage-wrap">
    <div class="dlg-stage" id="dlg-stage"></div>
    <p class="dlg-stage-caption">9×9 · House room theme (<code>scripts/rooms-data.ts</code>) · click the blacksmith to talk</p>
  </div>

  <div class="dlg-controls-slot">
    <div class="dlg-dpad-zone" id="dlg-dpad-zone">
      <div id="dlg-dpad"></div>
      <p class="dlg-dpad-caption">real D-pad position (<code>#controls</code> in styles.css) — hides completely while talking</p>
    </div>

    <div class="dlg-box" id="dlg-box">
      <div class="dlg-box-head">
        <div class="dlg-portrait" id="dlg-portrait">🧔</div>
        <div class="dlg-speaker" id="dlg-speaker">Blacksmith</div>
      </div>
      <div class="dlg-text" id="dlg-text"></div>
      <div class="dlg-choices" id="dlg-choices"></div>
      <div class="dlg-continue hidden" id="dlg-continue">▼ tap to continue</div>
    </div>
  </div>

  <button class="dlg-reset" id="dlg-reset">↻ Reset scene (12 gold, forget key)</button>

  <details class="dlg-source">
    <summary>View the .ink source driving this</summary>
    <pre id="dlg-ink-source"></pre>
  </details>

  <div class="dlg-gap">
    <h2>What's real here vs. what a full integration still needs</h2>
    <ul>
      <li><strong>Real:</strong> inkjs compiling &amp; running actual ink syntax (variables, conditionals, knots, choices) client-side.</li>
      <li><strong>Real:</strong> the <code>speaker:</code> / <code>portrait:</code> tag convention read from <code>currentTags</code> per line.</li>
      <li><strong>Real:</strong> the two-way variable bridge (<code>variablesState</code> + <code>ObserveVariable</code>) and an external function call (<code>giveKey</code>) reaching out to "game" state.</li>
      <li><strong>Design decision, demonstrated below:</strong> the real <code>#controls</code> D-pad (<code>styles.css</code>) is <code>position: fixed</code> right below the grid — the same screen real estate a bottom-anchored textbox wants. Rather than overlaying both, the D-pad disappears entirely the moment a conversation starts (movement is already meant to be frozen during dialogue, so it has nothing to do anyway) and tap-to-continue is the only input until the conversation ends.</li>
      <li><strong>Gotcha found while building this:</strong> <code>story.ResetState()</code> synchronously fires <code>ObserveVariable</code> with ink's <em>declared</em> defaults before you get a chance to reapply carried-forward state — if your observer callback writes into the same JS variable you're about to reapply, it clobbers itself. Fix: capture the current value into a local <em>before</em> calling <code>ResetState()</code>, then reapply from that local, not from the (now-clobbered) outer variable.</li>
      <li><strong>Shipped in the real game:</strong> this design is live — an old man NPC (tile <code>OLD_MAN</code> in <code>scripts/tile.ts</code>) who hands over a sword. He now stands directly above the player's spawn point in the chunked dungeon's own start room (<code>scripts/dungeonTransition.ts</code>'s <code>placeOldManLandmark</code>/<code>computeOldManSpot</code>, level 1 only), rather than inside the House room where he originally lived — the House room decor (<code>scripts/rooms-data.ts</code>) still places one too, it's just no longer on the game's entry path. The reusable engine lives in <code>scripts/dialogue.ts</code> (<code>runDialogue()</code>), NPC-specific ink scripts in <code>scripts/npcs-data.ts</code>, dispatched from <code>player.ts</code>'s existing bump-to-interact pattern (same as walking into a vase/tree) rather than a click — <code>OLD_MAN</code> is deliberately excluded from <code>ROOM_BLOCKED_TYPES</code> and given its own branch that returns <code>'terminal'</code> so buttons stay disabled and enemy turns don't run mid-conversation. The typewriter reveal now plays a real per-character blip sound (<code>audio.textBlip()</code>, randomized pitch, skipped on spaces) instead of being silent.</li>
      <li><strong>Not yet done:</strong> conversation state doesn't use <code>story.state.toJson()</code> — instead, real game state (<code>state.swords &gt; 0</code>) is bridged into an ink <code>VAR</code> fresh on every encounter, which is enough for a stateless single-line NPC but won't scale to a long branching conversation that needs to resume mid-tree across a save/reload. Also still compiling <code>.ink</code> source at runtime via <code>inkjs/full</code> — confirmed via a real build that this adds a shared ~60KB gzipped chunk to the shipped game bundle (not just the docs page); precompiling to JSON and switching to the plain <code>inkjs</code> runtime import would remove that, once there are enough NPCs to justify the build-step complexity.</li>
    </ul>
  </div>
</div>
`,cn=9,ln=[{x:1,y:1,emoji:`🛏️`},{x:7,y:1,emoji:`🪑`},{x:1,y:7,emoji:`🏺`},{x:7,y:7,emoji:`🏺`}],un={x:4,y:8},dn={x:2,y:1},fn={x:6,y:4};function pn(e){let t=e.querySelector(`#dlg-stage`),n=e.querySelector(`#dlg-box`),r=e.querySelector(`#dlg-text`),i=e.querySelector(`#dlg-speaker`),a=e.querySelector(`#dlg-portrait`),o=e.querySelector(`#dlg-choices`),s=e.querySelector(`#dlg-continue`),c=e.querySelector(`#dlg-reset`),l=e.querySelector(`#dlg-ink-source`),u=e.querySelector(`[data-inv-val="gold"]`),d=e.querySelector(`[data-inv-val="key"]`),f=e.querySelector(`[data-inv="key"]`),m=e.querySelector(`[data-inv="gold"]`),h=e.querySelector(`#dlg-dpad-zone`),g=e.querySelector(`#dlg-dpad`);l.textContent=on.trim(),p(g,e=>{let t=g.querySelector(`[data-dir="${e}"]`);t?.classList.add(`ctrl-btn--flash`),setTimeout(()=>t?.classList.remove(`ctrl-btn--flash`),120)}),t.innerHTML=``;for(let e=0;e<cn;e++)for(let n=0;n<cn;n++){let r=document.createElement(`div`);r.className=`dlg-tile`;let i=ln.find(t=>t.x===n&&t.y===e);i?r.textContent=i.emoji:n===fn.x&&e===fn.y?(r.textContent=`🧔`,r.classList.add(`dlg-npc`),r.dataset.npc=`true`):n===dn.x&&e===dn.y?r.textContent=`🥷`:n===un.x&&e===un.y&&(r.textContent=`🚪`),t.appendChild(r)}let _=t.querySelector(`[data-npc]`),v=t.parentElement;function y(){let e=v.clientWidth;e>0&&(t.style.width=`${e}px`,t.style.height=`${e}px`)}y(),new ResizeObserver(y).observe(v);let b=12,x=!1,S=null,C=!1,w=``,T=new re(on).Compile();T.BindExternalFunction(`giveKey`,()=>{}),T.ObserveVariable(`gold`,(e,t)=>{b=t,u.textContent=String(b),E(m)}),T.ObserveVariable(`hasKey`,(e,t)=>{let n=t;n&&!x&&E(f),x=n,d.textContent=x?`have key`:`no key`,f.classList.toggle(`have`,x)});function E(e){e.classList.add(`flash`),setTimeout(()=>e.classList.remove(`flash`),400)}function D(){u.textContent=String(b),d.textContent=x?`have key`:`no key`,f.classList.toggle(`have`,x)}function O(){let e=b,t=x;T.ResetState(),T.variablesState.gold=e,T.variablesState.hasKey=t,_.classList.add(`talking`),h.classList.add(`hidden`),n.classList.add(`active`),N()}function k(){_.classList.remove(`talking`),n.classList.remove(`active`),h.classList.remove(`hidden`),o.innerHTML=``}function A(e){C=!0,w=e,r.textContent=``,s.classList.add(`hidden`),o.innerHTML=``;let t=0;S&&clearInterval(S),S=setInterval(()=>{t++,r.textContent=e.slice(0,t),t>=e.length&&(clearInterval(S),S=null,C=!1,s.classList.remove(`hidden`))},18)}function j(){S&&clearInterval(S),S=null,C=!1,r.textContent=w,s.classList.remove(`hidden`)}function M(e){if(e)for(let t of e){let e=t.match(/^(\w+):\s*(.+)$/);e&&(e[1]===`speaker`&&(i.textContent=e[2]),e[1]===`portrait`&&(a.textContent=e[2]))}}function N(){if(C){j();return}if(T.canContinue){let e=(T.Continue()??``).trim();if(M(T.currentTags),e){A(e);return}N();return}if(T.currentChoices.length>0){s.classList.add(`hidden`),o.innerHTML=``,T.currentChoices.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`dlg-choice`,n.innerHTML=`<span class="dlg-choice-arrow">▶</span>${e.text}`,n.addEventListener(`click`,()=>{T.ChooseChoiceIndex(t),N()}),o.appendChild(n)});return}k()}_.addEventListener(`click`,()=>{if(n.classList.contains(`active`)){N();return}O()}),r.addEventListener(`click`,N),s.addEventListener(`click`,N),c.addEventListener(`click`,()=>{k(),b=12,x=!1,D()}),D()}var mn=`
<style>
  /* No fixed dark palette here on purpose — this doc is pure prose/tables/
     cards, not a mockup of an actual game screen, so it just inherits the
     docs hub's normal theme variables (defined in docs-page.ts) and follows
     the light/dark toggle like a markdown doc would. */
  .doc-slots-wrap { padding: 24px 16px 40px; min-height: 400px; }
  .doc-slots-wrap .content { max-width: 720px; margin: 0 auto; }
  .doc-slots-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  .doc-slots-wrap .tab-bar {
    display: flex;
    gap: 6px;
    margin-bottom: 22px;
    border-bottom: 1px solid var(--border);
  }
  .doc-slots-wrap .tab-btn {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: bold;
    padding: 8px 16px 12px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    font-family: inherit;
  }
  .doc-slots-wrap .tab-btn:hover { color: var(--text); }
  .doc-slots-wrap .tab-btn.active { color: var(--text); border-bottom-color: var(--link); }
  .doc-slots-wrap .tab-panel { display: none; flex-direction: column; gap: 22px; }
  .doc-slots-wrap .tab-panel.active { display: flex; }
  .doc-slots-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .doc-slots-wrap .body-text { font-size: 0.82rem; color: var(--text); line-height: 1.6; margin: 0 0 10px; }
  .doc-slots-wrap .body-text.note { font-size: 0.75rem; color: var(--muted); margin-top: 8px; margin-bottom: 0; }
  .doc-slots-wrap .card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    overflow: hidden;
  }
  .doc-slots-wrap .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 0.82rem;
  }
  .doc-slots-wrap .info-row:last-child { border-bottom: none; }
  .doc-slots-wrap .info-row-label { color: var(--muted); flex-shrink: 0; }
  .doc-slots-wrap .info-row-value { color: var(--text); text-align: right; }
  .doc-slots-wrap ul.plain { margin: 0; padding-left: 18px; }
  .doc-slots-wrap ul.plain li { font-size: 0.82rem; color: var(--text); line-height: 1.6; }
  .doc-slots-wrap .concept-cards { display: flex; flex-direction: column; gap: 10px; }
  .doc-slots-wrap .concept-card {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }
  .doc-slots-wrap .concept-icon { font-size: 1.6rem; line-height: 1; flex-shrink: 0; margin-top: 2px; }
  .doc-slots-wrap .concept-title { font-size: 0.88rem; font-weight: bold; color: var(--heading); margin-bottom: 4px; }
  .doc-slots-wrap .concept-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.55; }
  .doc-slots-wrap .badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  /* Status badges keep their own semantic accent colors (not theme
     variables) — these are meaningful indicators (empty/in-progress/won/
     dead), not decorative theming, so they stay consistent in both modes. */
  .doc-slots-wrap .badge.empty { background: rgba(128,128,128,0.18); color: var(--muted); }
  .doc-slots-wrap .badge.progress { background: rgba(37,99,235,0.16); color: #2563eb; }
  .doc-slots-wrap .badge.won { background: rgba(202,138,4,0.16); color: #ca8a04; }
  .doc-slots-wrap .badge.dead { background: rgba(220,38,38,0.14); color: #dc2626; }
  .doc-slots-wrap .slot-mock-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .doc-slots-wrap .slot-mock {
    background: var(--link-card-bg);
    border: 1px solid var(--link-card-border);
    border-radius: 12px;
    padding: 12px 14px;
  }
  .doc-slots-wrap .slot-mock-title { font-size: 0.8rem; font-weight: bold; color: var(--heading); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
  .doc-slots-wrap .slot-mock-stats { font-size: 0.76rem; color: var(--muted); line-height: 1.6; }
  .doc-slots-wrap .slot-mock-actions { margin-top: 8px; display: flex; gap: 6px; }
  .doc-slots-wrap .slot-mock-actions span {
    font-size: 0.68rem;
    padding: 3px 8px;
    border-radius: 6px;
    background: var(--nav-hover);
    color: var(--text);
  }
  .doc-slots-wrap .file-list { display: flex; flex-direction: column; gap: 8px; }
  .doc-slots-wrap .file-item { display: flex; gap: 10px; align-items: baseline; }
  .doc-slots-wrap .file-item .tag {
    font-size: 0.65rem; font-weight: bold; padding: 2px 7px; border-radius: 5px; flex-shrink: 0; text-transform: uppercase;
  }
  .doc-slots-wrap .tag.new { background: rgba(22,163,74,0.16); color: #16a34a; }
  .doc-slots-wrap .tag.change { background: rgba(202,138,4,0.16); color: #ca8a04; }
  .doc-slots-wrap .file-item .desc { font-size: 0.78rem; color: var(--muted); }
</style>
<div class="doc-slots-wrap">
  <h1>Save Slots — Implementation Plan</h1>
  <div class="content">
    <div class="tab-bar">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="detailed">Detailed</button>
    </div>

    <div class="tab-panel active" data-panel="overview">
      <div>
        <div class="section-label">Goal</div>
        <p class="body-text">
          Replace the single global autosave with 4 independent save slots, and rework the main menu so
          "Continue" / "Start Run" is replaced by a slot-select screen showing each slot's current run,
          inventory, and health at a glance.
        </p>
      </div>

      <div>
        <div class="section-label">Locked Decisions</div>
        <div class="concept-cards">
          <div class="concept-card">
            <div class="concept-icon">🗑️</div>
            <div>
              <div class="concept-title">Legacy save is discarded, not migrated</div>
              <div class="concept-desc">The existing single <code>ninjack_save</code> save is left inert. No migration code — all 4 slots simply start empty after this ships.</div>
            </div>
          </div>
          <div class="concept-card">
            <div class="concept-icon">🧩</div>
            <div>
              <div class="concept-title">Fully independent slots</div>
              <div class="concept-desc">Cave gate progress, gold contributions, grave markers, and the run counter — all currently global — become namespaced per slot. Each slot is a completely separate playthrough.</div>
            </div>
          </div>
          <div class="concept-card">
            <div class="concept-icon">🏆</div>
            <div>
              <div class="concept-title">Finished runs stay visible</div>
              <div class="concept-desc">Winning or dying no longer wipes the slot. The card shows "Run Complete" / "Game Over" with final stats until the player explicitly restarts it.</div>
            </div>
          </div>
          <div class="concept-card">
            <div class="concept-icon">👆</div>
            <div>
              <div class="concept-title">Tap-to-start, explicit delete</div>
              <div class="concept-desc">Tapping an empty slot starts a new run immediately — no extra confirmation screen. Occupied slots get their own explicit Delete action with a confirm step.</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="section-label">New Flow</div>
        <div class="card">
          <div class="info-row"><div class="info-row-label">1. Main Menu</div><div class="info-row-value">Single <code>Play</code> button replaces Continue/Start Run. Controls picker moved to a separate Settings screen; credits and privacy link stay put.</div></div>
          <div class="info-row"><div class="info-row-label">2. Slot Select (new screen)</div><div class="info-row-value">4 cards, one per slot, same full-screen overlay style as the main menu.</div></div>
          <div class="info-row"><div class="info-row-label">3a. Empty slot</div><div class="info-row-value">Tap → New Game screen (ninja skin picker + name field), then Start begins the run in that slot.</div></div>
          <div class="info-row"><div class="info-row-label">3b. In-progress slot</div><div class="info-row-value"><span class="badge progress">Continue</span> resumes; <code>Rename</code> edits the saved name; <span class="badge dead">Delete</span> opens a confirm modal, then wipes it.</div></div>
          <div class="info-row"><div class="info-row-label">3c. Finished slot</div><div class="info-row-value"><span class="badge won">Restart</span> begins a fresh run in that slot (keeping its cave/grave progress and its saved name/skin); <code>Rename</code>/<span class="badge dead">Delete</span> work the same as 3b.</div></div>
        </div>
      </div>

      <div>
        <div class="section-label">Slot Card Mockup</div>
        <div class="slot-mock-grid">
          <div class="slot-mock">
            <div class="slot-mock-title">Slot 1 <span class="badge empty">Empty</span></div>
            <div class="slot-mock-stats">Tap to start a new run</div>
          </div>
          <div class="slot-mock">
            <div class="slot-mock-title">🥷🏽 Zack <span class="badge progress">Level 4</span></div>
            <div class="slot-mock-stats">❤️ 7/10&nbsp;&nbsp;💰 230&nbsp;&nbsp;🗡️ 2&nbsp;&nbsp;🔑</div>
            <div class="slot-mock-actions"><span>Continue</span><span>Rename</span><span>Delete</span></div>
          </div>
          <div class="slot-mock">
            <div class="slot-mock-title">🥷🏻 Slot 3 <span class="badge dead">Game Over</span></div>
            <div class="slot-mock-stats">Died on Level 6 · 💰 410&nbsp;&nbsp;🗡️ 3</div>
            <div class="slot-mock-actions"><span>Restart</span><span>Rename</span><span>Delete</span></div>
          </div>
          <div class="slot-mock">
            <div class="slot-mock-title">🥷 Slot 4 <span class="badge won">Run Complete</span></div>
            <div class="slot-mock-stats">🏆 Beat Level 10 · 💰 980</div>
            <div class="slot-mock-actions"><span>Restart</span><span>Rename</span><span>Delete</span></div>
          </div>
        </div>
      </div>

      <div>
        <div class="section-label">What Doesn't Change</div>
        <ul class="plain">
          <li>Autosave-on-every-action behavior is identical — just scoped to whichever slot is active.</li>
          <li>Within one slot, dying and restarting still keeps that slot's cave gate progress, grave markers, run counter, and now also its saved name/skin, exactly like today's single-save behavior.</li>
          <li>Credits and privacy link stay on the main menu, untouched.</li>
        </ul>
      </div>

      <div>
        <div class="section-label">Non-Goals</div>
        <ul class="plain">
          <li>No cloud sync / account system.</li>
          <li>No save import/export.</li>
        </ul>
      </div>
    </div>

    <div class="tab-panel" data-panel="detailed">
      <div>
        <div class="section-label">One Object Per Slot, Not Namespaced Keys</div>
        <p class="body-text">
          The single global save today is already split across 7 independent top-level localStorage keys
          (<code>ninjack_save</code>, <code>ninjack_save_hash</code>, <code>ninjack_gate</code>,
          <code>ninjack_gates_unlocked</code>, <code>ninjack_contributions</code>, <code>ninjackRunCount</code>,
          <code>ninjack_graves</code>) — that's organic growth from the single-save codebase, not a deliberate design,
          and multiplying it by 4 slots (28 keys) would just carry the fragmentation forward. Since writing any of
          these already means <code>JSON.stringify</code>-ing the whole value, there's no performance reason to keep
          them apart — so instead, <strong>one localStorage key per slot</strong> (<code>ninjack_slot_{slot}</code>)
          holds one nested object:
        </p>
        <div class="table-wrap">
          <table>
            <tr><th>Field</th><th>Purpose</th></tr>
            <tr><td><code>version</code></td><td>Versions <code>run</code> only — same role as today's <code>SAVE_VERSION</code>.</td></tr>
            <tr><td><code>status</code></td><td><code>'active' | 'won' | 'dead'</code> — replaces the separate finished-marker key idea entirely.</td></tr>
            <tr><td><code>run</code></td><td>Today's <code>SaveData</code> shape, unchanged: position, health, level, gold/swords/keys/chutes, world grid, mobs, loot tables.</td></tr>
            <tr><td><code>runHash</code></td><td>Integrity check scoped to <code>run</code> only — a corrupted save resets just the run, not gate progress or graves.</td></tr>
            <tr><td><code>progress</code></td><td>Meta-progression, never touched by a run reset: <code>runCount</code>, <code>graves</code>. (Originally also held a cave-gate gold-contribution economy — <code>gate</code>/<code>contributed</code>/<code>bumpAmount</code>/<code>gatesUnlocked</code>/<code>contributions</code> — removed outright along with the money-monster mechanic it served; see CLAUDE.md's "Rooms" section.)</td></tr>
            <tr><td><code>profile</code></td><td>Added later: <code>{name, ninja}</code>, set on the New Game screen and editable via the slot card's Rename action. Same "survives a run reset" treatment as <code>progress</code> — defaulted (never migrated) for a slot saved before this field existed.</td></tr>
          </table>
        </div>
        <p class="body-text note">
          The legacy flat keys (<code>ninjack_save</code>, etc.) are left in place, untouched and never read again — no migration code, per the "discard it" decision.
        </p>
      </div>

      <div>
        <div class="section-label">Active-Slot Model</div>
        <p class="body-text">
          <code>save.ts</code> gets a module-level <code>activeSlot</code> (default <code>1</code>), set once via
          <code>setActiveSlot(n)</code> when a slot is chosen. The one key constant becomes a function
          (<code>slotKey()</code> instead of <code>SAVE_KEY</code>) that reads <code>activeSlot</code>.
          Because of this, <strong>no call site outside save.ts changes signature</strong> — <code>saveGame()</code>,
          <code>loadGame()</code>, <code>clearSave()</code>, grave-marker helpers, etc.
          all keep their existing no-arg signatures, internally doing a read-modify-write of whichever field(s) of the
          one slot object they own, and simply operate on "whichever slot is active." This means
          <code>player.ts</code>, <code>rooms.ts</code>, and <code>dialogue.ts</code> — which all
          call <code>saveGame()</code> today — need zero changes.
        </p>
      </div>

      <div>
        <div class="section-label">New in <code>save.ts</code></div>
        <div class="card">
          <div class="info-row"><div class="info-row-label"><code>setActiveSlot(n)</code> / <code>getActiveSlot()</code></div><div class="info-row-value">Selects which slot's <code>ninjack_slot_{n}</code> key all subsequent save/load/grave calls read and write.</div></div>
          <div class="info-row"><div class="info-row-label"><code>getSlotSummary(slot)</code></div><div class="info-row-value">Reads that slot's one key (no engine spin-up), derives <code>{status, level, health, maxHealth, gold, swords, hasKey, hasChute, location}</code> straight from <code>run</code>/<code>status</code> for rendering a card.</div></div>
          <div class="info-row"><div class="info-row-label"><code>markSlotFinished(slot, outcome)</code></div><div class="info-row-value">Read-modify-write: sets <code>status</code> to <code>'won'|'dead'</code> within the slot object. Leaves <code>run</code> untouched so final stats stay readable for the card.</div></div>
          <div class="info-row"><div class="info-row-label"><code>deleteSlot(slot)</code></div><div class="info-row-value">One <code>localStorage.removeItem('ninjack_slot_' + slot)</code> — full reset, nothing left to forget.</div></div>
        </div>
      </div>

      <div>
        <div class="section-label">Restart vs. Delete Semantics</div>
        <div class="table-wrap">
          <table>
            <tr><th>Action</th><th><code>run</code> / <code>runHash</code></th><th><code>progress</code> (graves / run #)</th><th><code>status</code></th></tr>
            <tr><td>Restart (finished slot)</td><td>Reset — same as today's <code>startNewGame()</code></td><td>Preserved (matches today's post-death behavior)</td><td>Back to <code>'active'</code></td></tr>
            <tr><td>Delete (any occupied slot)</td><td colspan="3">Whole <code>ninjack_slot_{slot}</code> key removed</td></tr>
          </table>
        </div>
      </div>

      <div>
        <div class="section-label">File Changes</div>
        <div class="file-list">
          <div class="file-item"><span class="tag new">New</span><code>scripts/slots.ts</code><span class="desc">Slot-select screen. Same full-screen overlay + fade pattern as <code>showMainMenu</code>. One <code>renderSlotCard(n, summary)</code> covers all 4 status variants (data-driven, not 4 hand-written branches).</span></div>
          <div class="file-item"><span class="tag change">Change</span><code>scripts/save.ts</code><span class="desc">One <code>ninjack_slot_{n}</code> key per slot holding <code>{version, status, run, runHash, progress}</code>; <code>setActiveSlot</code>/<code>getSlotSummary</code>/<code>markSlotFinished</code>/<code>deleteSlot</code>.</span></div>
          <div class="file-item"><span class="tag change">Change</span><code>scripts/menu.ts</code><span class="desc">Drop the <code>saveLevel</code>/<code>onContinue</code> branch; single always-shown <code>Play</code> button. Skin/controls/credits untouched.</span></div>
          <div class="file-item"><span class="tag change">Change</span><code>scripts/main.ts</code><span class="desc">Remove the flat-<code>SAVE_KEY</code> peek for <code>saveLevel</code>; <code>Play</code> opens <code>showSlotScreen()</code>.</span></div>
          <div class="file-item"><span class="tag change">Change</span><code>scripts/game.ts</code><span class="desc"><code>handleDeath</code>/<code>handleWin</code> call <code>markSlotFinished(...)</code> instead of <code>clearSave()</code>; the death/win modal's "Start Run N" choice becomes "restart this slot"; <code>startNewGame()</code> additionally clears that slot's finished marker.</span></div>
          <div class="file-item"><span class="tag change">Change</span><code>styles/styles.css</code><span class="desc">New <code>#slot-screen</code> overlay reusing <code>#main-menu</code>'s visual language, plus <code>.slot-card</code> grid with status-colored badges.</span></div>
        </div>
      </div>

      <div>
        <div class="section-label">Testing Plan</div>
        <p class="body-text">
          Per the project's testing rule, pure-logic vitest coverage in a new <code>tests/save-slots.test.ts</code>:
        </p>
        <ul class="plain">
          <li>Saving into slot 2 doesn't touch slot 1's <code>ninjack_slot_1</code> key.</li>
          <li><code>getSlotSummary</code> returns <code>'empty'</code> for a slot with no key at all, and correct parsed fields for an occupied one.</li>
          <li><code>markSlotFinished</code> → <code>getSlotSummary</code> round-trips to <code>status: 'won'|'dead'</code> with final stats (from <code>run</code>) preserved.</li>
          <li><code>deleteSlot</code> removes that slot's key entirely, leaving sibling slots' keys untouched.</li>
          <li>Restarting a finished slot resets <code>run</code>/<code>runHash</code> and flips <code>status</code> back to <code>'active'</code>, but leaves <code>progress</code> (cave/graves/run-count) untouched.</li>
          <li>A corrupted <code>run</code>/<code>runHash</code> mismatch resets only <code>run</code>, not the whole slot — <code>progress</code> survives.</li>
        </ul>
      </div>

      <div>
        <div class="section-label">Manual Verification</div>
        <p class="body-text" style="margin-bottom:0;">
          <code>npm test</code> + <code>npm run typecheck</code>, then drive it live (per CLAUDE.md's console/Playwright
          workflow): start a run in slot 1, die, confirm slot 1's card shows "Game Over" with the correct gold/swords,
          restart it, confirm it goes back to in-progress at level 1 while slot 2 remains empty; delete a slot and
          confirm its keys are gone from <code>localStorage</code>.
        </p>
      </div>
    </div>
  </div>
</div>
`;function hn(e){let t=e.querySelectorAll(`.doc-slots-wrap .tab-btn`),n=e.querySelectorAll(`.doc-slots-wrap .tab-panel`);t.forEach(e=>{e.addEventListener(`click`,()=>{t.forEach(t=>t.classList.toggle(`active`,t===e)),n.forEach(t=>t.classList.toggle(`active`,t.dataset.panel===e.dataset.tab))})})}var gn=`green`,_n=`peru`,vn=`forestgreen`,yn=`#ffd700`;function bn(e){return r(e.type)?_n:e.type===s.type?vn:gn}function xn(e){return{x:e.x+Math.floor(e.w/2),y:e.y+Math.floor(e.h/2)}}function Sn(e){return e.gridSize*n}function Cn(e){let t=[];for(let n=0;n<e.gridSize;n++){let r=[];for(let t=0;t<e.gridSize;t++)r.push(T(e,t,n));t.push(r)}return t}function wn(e,t,r){let i=e.getContext(`2d`),a=e.width/Sn(t);i.fillStyle=vn,i.fillRect(0,0,e.width,e.height);for(let e=0;e<t.gridSize;e++)for(let o=0;o<t.gridSize;o++){let t=r[e][o];for(let r=0;r<n;r++)for(let s=0;s<n;s++)i.fillStyle=bn(t.tiles[r][s]),i.fillRect((o*n+s)*a,(e*n+r)*a,a+.5,a+.5)}i.save();let o=(r,o)=>{i.strokeStyle=r,i.lineWidth=o;for(let r=0;r<=t.gridSize;r++){let t=r*n*a;i.beginPath(),i.moveTo(t,0),i.lineTo(t,e.height),i.stroke(),i.beginPath(),i.moveTo(0,t),i.lineTo(e.width,t),i.stroke()}};if(o(`rgba(0,0,0,0.5)`,2),o(`rgba(255,255,255,0.5)`,.5),i.restore(),t.rooms.length>0){let e=t.rooms[0];i.save(),i.strokeStyle=yn,i.lineWidth=3,i.strokeRect(e.x*n*a+1,e.y*n*a+1,n*a-2,n*a-2),i.restore()}}function Tn(e,t,r){if(!r)return;let i=e.getContext(`2d`),a=e.width/Sn(t);i.save(),i.strokeStyle=`#ffffff`,i.lineWidth=2,i.strokeRect(r.x*n*a,r.y*n*a,n*a,n*a),i.restore()}function En(e,t,r,i,a){let o=t.chunks[a][i],s=e.querySelector(`#dng-detail-title`),c=e.querySelector(`#dng-detail-grid`),l=t.rooms.length>0&&t.rooms[0].x===i&&t.rooms[0].y===a;s.textContent=`Chunk (${i}, ${a}) — ${o.kind}${l?` · start room`:``}`;let u=l&&o.room?xn(o.room):null,d=``;for(let e=0;e<n;e++)for(let t=0;t<n;t++){let n=r.tiles[e][t],i=bn(n),a=u&&u.x===t&&u.y===e?`🥷`:n.display;d+=`<div class="dng-detail-tile" style="background:${i};">${a}</div>`}c.innerHTML=d}var Dn=`
<style>
  .dng-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .dng-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .dng-wrap p.dng-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0 0 20px;
    max-width: 760px;
  }
  .dng-layout { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
  .dng-sidebar { flex: 1 1 300px; max-width: 340px; display: flex; flex-direction: column; gap: 20px; }
  .dng-main { flex: 2 1 420px; min-width: 280px; display: flex; flex-direction: column; gap: 20px; }
  .dng-section-label {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .dng-control-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border);
    border-radius: 14px; padding: 18px 16px; display: flex; flex-direction: column; gap: 14px;
  }
  .dng-control-row { display: flex; align-items: center; gap: 10px; }
  .dng-control-label { font-size: 0.82rem; color: var(--text); min-width: 130px; flex-shrink: 0; }
  .dng-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; min-width: 0; }
  .dng-wrap input[type=number] {
    width: 70px; padding: 6px 8px; background: var(--search-bg); border: 1px solid var(--search-border);
    border-radius: 8px; color: var(--text); font-size: 0.85rem; text-align: right;
  }
  .dng-seed-input {
    flex: 1; width: auto !important; text-align: left !important;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace; font-size: 0.85rem;
  }
  .dng-btn {
    padding: 8px 16px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.82rem; transition: background 0.1s;
  }
  .dng-btn:hover { background: var(--nav-hover); }
  .dng-stats { display: flex; flex-direction: column; gap: 6px; font-size: 0.8rem; color: var(--text); }
  .dng-stats .dng-stat-row { display: flex; justify-content: space-between; }
  .dng-stats .dng-stat-label { color: var(--muted); }
  .dng-legend { display: flex; flex-wrap: wrap; gap: 12px 16px; font-size: 0.72rem; color: var(--muted); margin-bottom: 12px; }
  .dng-legend span.dng-swatch { display: inline-block; width: 11px; height: 11px; border-radius: 2px; margin-right: 5px; vertical-align: -1px; }
  .dng-canvas-card { background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-radius: 14px; padding: 16px; }
  #dng-canvas { width: 100%; aspect-ratio: 1 / 1; display: block; border-radius: 8px; cursor: pointer; image-rendering: pixelated; }
  .dng-hint { font-size: 0.72rem; color: var(--muted); margin-top: 8px; }
  .dng-detail-title { font-size: 0.85rem; color: var(--text); font-weight: bold; margin-bottom: 12px; }
  .dng-detail-grid {
    display: grid; grid-template-columns: repeat(9, 1fr); gap: 1px;
    max-width: 320px; margin: 0 auto; background: var(--border); border-radius: 4px; overflow: hidden;
  }
  .dng-detail-tile { aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .dng-empty-detail { font-size: 0.8rem; color: var(--muted); text-align: center; padding: 24px 0; }
</style>

<div class="dng-wrap">
  <h1>🗺️ Chunked Dungeon Generator</h1>
  <p class="dng-desc">
    Live preview of the Rogue-style dungeon generator (scripts/dungeonGen.ts + dungeonWorld.ts — see the
    "Chunked Dungeon Generation" doc for the algorithm writeup). This calls the exact same
    <code>generateDungeonLayout</code>/<code>getDungeonChunk</code> the real game uses, so what renders here
    is guaranteed to match what a real run would generate for the same seed and settings — not a
    reimplementation. The overview below shows the full grid of chunks, tile-for-tile (3×3 by default —
    matches the shipped game, and Rogue's own region grid — tunable below); click any chunk
    to inspect it up close.
  </p>

  <div class="dng-layout">
    <div class="dng-sidebar">
      <div class="dng-control-card">
        <div class="dng-section-label">Seed</div>
        <div class="dng-control-row">
          <input type="number" id="dng-seed-input" step="1" class="dng-seed-input">
          <button class="dng-btn" id="dng-seed-btn" title="Randomize seed">🎲 New</button>
        </div>
      </div>

      <div class="dng-control-card" id="dng-sliders"></div>

      <div class="dng-control-card">
        <div class="dng-section-label">Stats</div>
        <div class="dng-stats" id="dng-stats"></div>
      </div>
    </div>

    <div class="dng-main">
      <div class="dng-canvas-card">
        <div class="dng-legend">
          <span><span class="dng-swatch" style="background:green;"></span>Floor</span>
          <span><span class="dng-swatch" style="background:peru;"></span>Corridor</span>
          <span><span class="dng-swatch" style="background:forestgreen;"></span>Trees 🌲 (solid)</span>
          <span><span class="dng-swatch" style="background:#ffd700;border:1px solid #ffd700;"></span>Start room</span>
        </div>
        <canvas id="dng-canvas" width="810" height="810"></canvas>
        <p class="dng-hint">Every room's own outer bound, and every hallway chunk's non-path filler, is solid
          TREE_WALL (🌲) — dense forest, not a distinct architectural wall. It isn't breakable, so the door's
          carved corridor is genuinely the only way in or out of a room.</p>
      </div>

      <div class="dng-canvas-card">
        <div class="dng-detail-title" id="dng-detail-title">Click a chunk above to inspect it</div>
        <div class="dng-detail-grid" id="dng-detail-grid"></div>
      </div>
    </div>
  </div>
</div>
`;function On(e){let t=e.querySelector(`#dng-canvas`),n=e.querySelector(`#dng-seed-input`),r=e.querySelector(`#dng-seed-btn`),i=e.querySelector(`#dng-sliders`),a=e.querySelector(`#dng-stats`),o=12345,s=R,c=I,l=M,u=j,d=D,f=null,p=null,m=null,h=[{id:`min-room-size`,label:`Min Room Size`,min:3,max:7,step:1,get:()=>s,set:e=>{s=Math.min(e,c)}},{id:`max-room-size`,label:`Max Room Size`,min:3,max:7,step:1,get:()=>c,set:e=>{c=Math.max(e,s)}},{id:`grid-size`,label:`Grid Size (chunks/side)`,min:2,max:15,step:1,get:()=>l,set:e=>{l=e}},{id:`gone-chance-percent`,label:`GONE Chance (%)`,min:0,max:100,step:1,get:()=>u,set:e=>{u=e}},{id:`max-gone-percent`,label:`Max GONE (%)`,min:0,max:100,step:1,get:()=>d,set:e=>{d=e}}];i.innerHTML=`<div class="dng-section-label">Generation Parameters</div>`+h.map(e=>`
    <div class="dng-control-row">
      <span class="dng-control-label">${e.label}</span>
      <input type="range" id="dng-${e.id}-range" min="${e.min}" max="${e.max}" step="${e.step}">
      <input type="number" id="dng-${e.id}-number" min="${e.min}" max="${e.max}" step="${e.step}">
    </div>`).join(``);function g(){n.value=String(o);for(let t of h){let n=e.querySelector(`#dng-${t.id}-range`),r=e.querySelector(`#dng-${t.id}-number`);n.value=r.value=String(t.get())}}function _(e){let t=0,n=0;for(let r of e.chunks)for(let e of r)e.kind===`hallway`?t++:e.kind===`empty`&&n++;a.innerHTML=[[`Seed`,String(o)],[`Grid size`,`${e.gridSize}×${e.gridSize} (${e.gridSize*e.gridSize} chunks)`],[`Rooms placed`,String(e.rooms.length)],[`Hallway chunks`,String(t)],[`Empty chunks`,String(n)]].map(([e,t])=>`<div class="dng-stat-row"><span class="dng-stat-label">${e}</span><span>${t}</span></div>`).join(``)}function v(){!p||!m||(wn(t,p,m),Tn(t,p,f))}function y(){p&&p.gridSize!==l&&(f=null);let t=A(o,{minRoomSize:s,maxRoomSize:c,gridSize:l,goneChancePercent:u,maxGonePercent:d});if(p=t,m=Cn(t),_(t),v(),f){let n=m[f.y][f.x];En(e,t,n,f.x,f.y)}else e.querySelector(`#dng-detail-title`).textContent=`Click a chunk above to inspect it`,e.querySelector(`#dng-detail-grid`).innerHTML=``}function b(){g(),y()}for(let t of h){let n=e.querySelector(`#dng-${t.id}-range`),r=e.querySelector(`#dng-${t.id}-number`),i=e=>{let n=Number(e);Number.isNaN(n)||(t.set(Math.round(n)),b())};n.addEventListener(`input`,()=>i(n.value)),r.addEventListener(`input`,()=>i(r.value))}r.addEventListener(`click`,()=>{o=Math.floor(Math.random()*2**31),b()}),n.addEventListener(`change`,()=>{let e=Number(n.value);Number.isNaN(e)||(o=Math.trunc(e),b())}),t.addEventListener(`click`,n=>{if(!p||!m)return;let r=t.getBoundingClientRect(),i=t.width/r.width,a=t.height/r.height,o=(n.clientX-r.left)*i,s=(n.clientY-r.top)*a,c=Math.floor(o/(t.width/p.gridSize)),l=Math.floor(s/(t.height/p.gridSize));c<0||c>=p.gridSize||l<0||l>=p.gridSize||(f={x:c,y:l},v(),En(e,p,m[l][c],c,l))}),b()}var kn=`
<style>
  ${U()}

  .twr-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .twr-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .twr-wrap p.twr-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0 0 20px;
    max-width: 760px;
  }
  .twr-layout { display: flex; gap: 28px; align-items: flex-start; flex-wrap: wrap; }
  .twr-sidebar { flex: 1 1 260px; max-width: 300px; display: flex; flex-direction: column; gap: 18px; }
  .twr-main { flex: 1 1 340px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .twr-section-label {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .twr-control-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border);
    border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px;
  }
  .twr-control-row { display: flex; align-items: center; gap: 10px; }
  .twr-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; min-width: 0; }
  .twr-current-readout { font-size: 0.9rem; color: var(--text); font-weight: bold; min-width: 64px; text-align: right; }
  .twr-btn-row { display: flex; gap: 8px; }
  .twr-btn {
    flex: 1; padding: 8px 12px; background: var(--link-card-bg); color: var(--text);
    border: 1px solid var(--link-card-border); border-radius: 8px; cursor: pointer;
    font-size: 0.82rem; transition: background 0.1s;
  }
  .twr-btn:hover:not(:disabled) { background: var(--nav-hover); }
  .twr-btn:disabled { opacity: 0.4; cursor: default; }
  .twr-hint { font-size: 0.72rem; color: var(--muted); line-height: 1.5; margin: 0; }
  .twr-legend { display: flex; flex-direction: column; gap: 8px; }
  .twr-legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.76rem; color: var(--text); }
  .twr-legend-swatch { width: 14px; height: 14px; border-radius: 3px; border: 2px solid; flex-shrink: 0; }
  .twr-legend-glyph { font-size: 0.9rem; }
  .twr-legend-range { color: var(--muted); }
</style>

<div class="twr-wrap">
  <h1>🗼 Tower Cutaway — Floor Descent Transition</h1>
  <p class="twr-desc">
    Live preview of the real loading screen shown while descending to the next floor (see
    <code>scripts/floorDescentTransition.ts</code>): a 3/4 cutaway, orthographic (parallel-projection, no
    perspective) view of the whole tower, town at the top down through all 25 floors. Colors and wall glyphs
    come straight from the real zone data (<code>scripts/zones-data.ts</code> — see the "Zones" doc), and the
    tower graphic itself is built by the exact same <code>scripts/towerCutaway.ts</code> module the real
    transition screen uses, not a hand-picked approximation. Only floors you've actually reached are shown
    lit — everything below your current floor is dark with a ❓, since you haven't been there yet.
  </p>

  <div class="twr-layout">
    <div class="twr-sidebar">
      <div class="twr-control-card">
        <div class="twr-section-label">Current Floor</div>
        <div class="twr-control-row">
          <input type="range" id="twr-floor-range" min="0" max="25" step="1" value="0">
          <span class="twr-current-readout" id="twr-current-readout">Town</span>
        </div>
        <div class="twr-btn-row">
          <button class="twr-btn" id="twr-ascend-btn">▲ Ascend</button>
          <button class="twr-btn" id="twr-descend-btn">▼ Descend</button>
        </div>
        <p class="twr-hint">Descend plays the same fade timing as a real floor transition. Click any lit
          floor to jump back to it, or click the ❓ right below your current floor to descend into it.</p>
      </div>
      <div class="twr-control-card">
        <div class="twr-section-label">Zones</div>
        <div class="twr-legend">${ie()}</div>
      </div>
    </div>

    <div class="twr-main">
      ${ne()}
      <div class="twr-continues">▼ continues into the Ashen Depths, endlessly…</div>
    </div>
  </div>
</div>
`;function An(e){let t=e.querySelector(`#twr-rows`),n=e.querySelector(`#twr-floor-range`),r=e.querySelector(`#twr-current-readout`),i=e.querySelector(`#twr-ascend-btn`),a=e.querySelector(`#twr-descend-btn`),o=e.querySelector(`#twr-flash`),s=e.querySelector(`#twr-reveal-flash`),c=e.querySelector(`#twr-here-marker`),l=e.querySelector(`#twr-current-ring`),u=e.querySelector(`#twr-loading-overlay`),d=e.querySelector(`#twr-loading-caption`),f=0,p=!1;function m(){t.innerHTML=V(f),n.value=String(f),r.textContent=f===0?`Town`:`Floor ${f}`,i.disabled=f===0,a.disabled=p;let e=`${H(f)}px`;c.style.top=e,l.style.top=e,t.querySelectorAll(`.twr-row`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.floor);if(t<=f){g(t);return}t===f+1&&v()})})}function h(e){t.innerHTML=V(e),t.querySelectorAll(`.twr-row`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.floor);if(t<=f){g(t);return}t===f+1&&v()})})}function g(e){f=Math.max(0,Math.min(25,e)),m()}let _=e=>new Promise(t=>setTimeout(t,e));async function v(){if(p||f>=25)return;p=!0,a.disabled=!0;let e=f+1;o.classList.add(`twr-flash-on`),await _(900),d.textContent=`Descending…`,u.classList.add(`twr-loading-overlay-on`),await _(ee),f=e;let t=`${H(f)}px`;c.style.top=t,l.style.top=t,await _(900),await _(500),s.style.top=`${H(e)}px`,s.classList.add(`twr-reveal-flash-on`),await _(350),h(e),await _(300),s.classList.remove(`twr-reveal-flash-on`),await _(350),await _(te),u.classList.remove(`twr-loading-overlay-on`),o.classList.remove(`twr-flash-on`),await _(900),p=!1,m()}n.addEventListener(`input`,()=>g(Number(n.value))),i.addEventListener(`click`,()=>g(f-1)),a.addEventListener(`click`,()=>v()),m()}var jn=34,Mn=58,Nn=jn+829,Pn=Math.round(Math.sqrt(2645)),Fn=Math.atan2(-23,46)*180/Math.PI;function In(){return`radial-gradient(1.4px 1.4px at 20% 3%, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(1px 1px at 55% 2%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1.6px 1.6px at 78% 5%, rgba(255, 255, 255, 0.85), transparent),
      radial-gradient(1px 1px at 35% 7%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1.4px 1.4px at 10% 11%, rgba(255, 255, 255, 0.55), transparent),
      radial-gradient(1px 1px at 88% 9%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1.2px 1.2px at 46% 14%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1px 1px at 65% 16%, rgba(255, 255, 255, 0.4), transparent),
      linear-gradient(180deg,
        #030308 0%,
        #070b1e 8%,
        #0d1740 18%,
        #17356e 32%,
        #2c5a9c 46%,
        #4c86c2 58%,
        #7fc0e8 68%,
        #b9dcee 78%,
        #dcebe0 88%,
        #e9edd8 100%)`}function Ln(){return[{top:`48%`,left:`8%`,w:120,h:34,o:.55},{top:`55%`,left:`58%`,w:150,h:40,o:.5},{top:`63%`,left:`20%`,w:100,h:28,o:.6},{top:`70%`,left:`48%`,w:170,h:44,o:.45},{top:`76%`,left:`2%`,w:110,h:30,o:.4},{top:`60%`,left:`82%`,w:90,h:26,o:.5}].map(e=>`<div class="tsg-cloud" style="top:${e.top}; left:${e.left}; width:${e.w}px; height:${e.h}px; opacity:${e.o};"></div>`).join(``)}function Rn(){return`<div class="tsg-ground tsg-ground-flat" id="tsg-ground"></div>`}var zn=`
<style>
  ${U()}

  .tsg-wrap { padding: 24px 16px 48px; min-height: 400px; }
  #docs-content .tsg-wrap h1 {
    color: var(--heading);
    font-size: 1.4em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .tsg-wrap p.tsg-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0 0 20px;
    max-width: 760px;
  }
  .tsg-layout { display: flex; gap: 28px; align-items: flex-start; flex-wrap: wrap; }
  .tsg-sidebar { flex: 1 1 260px; max-width: 300px; display: flex; flex-direction: column; gap: 18px; }
  .tsg-main { flex: 1 1 340px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .tsg-section-label {
    font-size: 0.72rem; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .tsg-control-card {
    background: var(--link-card-bg); border: 1px solid var(--link-card-border);
    border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px;
  }
  .tsg-control-row { display: flex; align-items: center; gap: 10px; }
  .tsg-wrap select {
    width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--link-card-border);
    background: var(--bg); color: var(--text); font-size: 0.82rem;
  }
  .tsg-wrap input[type=range] { flex: 1; accent-color: var(--link); height: 6px; cursor: pointer; min-width: 0; }
  .tsg-current-readout { font-size: 0.9rem; color: var(--text); font-weight: bold; min-width: 64px; text-align: right; }
  .tsg-checkbox-row { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text); }
  .tsg-hint { font-size: 0.72rem; color: var(--muted); line-height: 1.5; margin: 0; }

  /* --- Fixed, non-theme-following styling for the sky/ground prototype
     itself, matching the tower graphic's own fixed look (see CLAUDE.md's
     "Theming interactive docs" rule) --- */
  .twr-stage.tsg-sky { background: ${In()}; padding-bottom: 110px; }
  /* The rocky foundation flare (towerCutaway.ts's .twr-foundation) was a
     stand-in for "the tower's base disappearing into darkness" against the
     original near-black backdrop — with a real ground plane now visible
     below, the ground band itself (see .tsg-ground below) is what reads as
     the tower's base, so the flare is redundant and dropped for the
     sky-gradient variants; the tower's front-face stack simply ends flat at
     its last row, same as every other floor boundary. */
  .twr-stage.tsg-sky .twr-foundation { display: none; }
  .tsg-cloud {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    filter: blur(9px);
    pointer-events: none;
  }
  .tsg-ground {
    position: absolute; left: 0; right: 0; bottom: 0; height: 230px;
    pointer-events: none;
  }
  /* A real grass-over-dirt cross-section, in the same cutaway spirit as the
     tower graphic itself (flat colored bands, no photographic blending):
     a grass layer, a thin darker root/topsoil seam, then a dirt band with
     a crisp (not gradient-blurred) boundary between them — reading as "the
     ground, sliced open" rather than a smooth color fade. The grass portion
     runs long enough (0%-76%) that it clears the tower's own bottom edge
     (removed foundation flare — see .twr-foundation above) with a decent
     gap before the dirt band starts, so the tower visibly stands IN the
     grass layer rather than touching the dirt underneath it. */
  .tsg-ground-flat {
    background: linear-gradient(180deg,
      #7dbb56 0%, #5c9a3d 76%,
      #3f2c17 79%,
      #5a3d20 81%, #3a2712 100%);
  }
  .tsg-ground-persp {
    background:
      repeating-conic-gradient(from -94deg at 50% 340%, rgba(255, 255, 255, 0.07) 0deg 0.55deg, transparent 0.55deg 3.2deg),
      linear-gradient(180deg,
        #79b955 0%, #5c9a3d 14%,
        #7d5c35 16%, #6b4c2a 42%, #543a20 72%, #362613 100%);
    clip-path: ellipse(78% 100% at 50% 100%);
  }
  .tsg-stage-hidden-ground .tsg-ground { display: none; }

  /* Tight contact shadow (ambient occlusion) hugging the tower's own base
     outline. Both strips share the same cross-section — a linear gradient
     perpendicular to the edge, dark at the contact line and fading to
     transparent on either side — kept at UNIFORM intensity along the whole
     length of the edge (no radial/elliptical falloff toward the ends),
     which is what makes this read as "proximity to the tower's edge" AO
     rather than a blob shadow under its center. */
  .tsg-ao-edge {
    position: absolute;
    height: 30px;
    background: linear-gradient(to bottom,
      transparent 0%, rgba(0, 0, 0, 0.5) 42%, rgba(0, 0, 0, 0.5) 58%, transparent 100%);
    filter: blur(4px);
    pointer-events: none;
  }
  /* Front face — straight, no rotation. Extended 10px past the tower's own
     left edge for a soft rounded end instead of a hard cutoff; stops right
     at the seam (FW) where the side strip picks up. */
  .tsg-ao-front {
    left: ${Mn-10}px; top: ${Nn-15}px;
    width: 254px;
  }
  /* Side face — same strip, rotated to lie flush against the side edge's
     own diagonal (SIDE_EDGE_ANGLE_DEG) and anchored at the seam (FW,
     OUTER_H) via transform-origin so it starts exactly where the front
     strip ends, running the strip's own length along that diagonal.
     transform-origin: 0 50% pivots around the strip's own vertical center,
     same as the front strip's -15px (half of the 30px height) top offset
     above — without it the pivot (and the gradient's dark band, also
     centered in the strip) sits 15px below the actual corner instead of on
     it, which is what made this strip read as offset down by half its
     height before rotation was even applied. */
  .tsg-ao-side {
    left: ${Mn+244}px; top: ${Nn-15}px;
    width: ${Pn+8}px;
    transform-origin: 0 50%;
    transform: rotate(${Fn}deg);
  }
</style>

<div class="tsg-wrap">
  <h1>🌌 Tower Backdrop — Sky Gradient Prototype</h1>
  <p class="tsg-desc">
    Prototyping a replacement backdrop for the Tower Cutaway's <code>.twr-stage</code> (see the
    "Tower Cutaway" doc / <code>scripts/towerCutaway.ts</code>): instead of a fixed starfield over a dark radial
    vignette, a real vertical gradient spanning starry space at the very top, down through dark blue, sky blue,
    and a hazy cloud band, to a grass/dirt ground along the bottom — so the tower reads as a real structure
    rooted in the ground and reaching up into space, independent of each floor's own zone coloring inside it.
    A tight blurred ambient-occlusion contact shadow hugs the tower's exact base outline. Not wired into
    production yet — this is a dochub-only prototype for review. Switch backdrops below to compare against
    today's look.
  </p>

  <div class="tsg-layout">
    <div class="tsg-sidebar">
      <div class="tsg-control-card">
        <div class="tsg-section-label">Backdrop</div>
        <select id="tsg-variant-select">
          <option value="original">Original (starfield)</option>
          <option value="flat" selected>Sky Gradient — Flat Ground</option>
          <option value="persp">Sky Gradient — Perspective Ground</option>
        </select>
        <label class="tsg-checkbox-row">
          <input type="checkbox" id="tsg-clouds-check" checked>
          Show clouds
        </label>
        <p class="tsg-hint">"Flat Ground" (chosen direction) is a grass-over-dirt cross-section, cutaway-style
          like the tower itself — a decent gap of pure grass below the tower's base before a crisp dirt band
          starts. The rocky foundation flare is dropped for both sky-gradient variants; the ground band itself
          now reads as the tower's base. "Perspective Ground" is an earlier alternate (curved horizon, converging
          furrow lines) kept only for comparison.</p>
      </div>
      <div class="tsg-control-card">
        <div class="tsg-section-label">Current Floor (context only)</div>
        <div class="tsg-control-row">
          <input type="range" id="tsg-floor-range" min="0" max="25" step="1" value="0">
          <span class="tsg-current-readout" id="tsg-current-readout">Town</span>
        </div>
        <p class="tsg-hint">Scrubs which floors are revealed, same as the real Tower Cutaway doc — the
          backdrop itself doesn't change with floor, this just shows it in context against the full tower.</p>
      </div>
    </div>

    <div class="tsg-main">
      <div class="twr-stage tsg-sky" id="tsg-stage">
        ${Rn()}
        <div id="tsg-clouds">${Ln()}</div>
        <div class="twr-ember-glow"></div>
        <div id="tsg-ao">
          <div class="tsg-ao-edge tsg-ao-front"></div>
          <div class="tsg-ao-edge tsg-ao-side"></div>
        </div>
        ${z(!1)}
      </div>
    </div>
  </div>
</div>
`;function Bn(e){let t=e.querySelector(`#tsg-stage`),n=e.querySelector(`#tsg-ground`),r=e.querySelector(`#tsg-clouds`),i=e.querySelector(`#tsg-ao`),a=e.querySelector(`#tsg-variant-select`),o=e.querySelector(`#tsg-clouds-check`),s=e.querySelector(`#tsg-floor-range`),c=e.querySelector(`#tsg-current-readout`),l=e.querySelector(`#twr-rows`),u=e.querySelector(`#twr-here-marker`),d=e.querySelector(`#twr-current-ring`);function f(){let e=a.value;t.classList.toggle(`tsg-sky`,e!==`original`),n.style.display=e===`original`?`none`:``,n.className=`tsg-ground tsg-ground-${e===`persp`?`persp`:`flat`}`,r.style.display=e!==`original`&&o.checked?``:`none`,i.style.display=e===`original`?`none`:``}function p(){let e=Number(s.value);l.innerHTML=V(e),c.textContent=e===0?`Town`:`Floor ${e}`;let t=`${B(e)}px`;u.style.top=t,d.style.top=t}a.addEventListener(`change`,f),o.addEventListener(`change`,f),s.addEventListener(`input`,p),f(),p()}var Vn=`
<style>
  .doc-cp-wrap {
    /* categorical accent hues — mid-tones legible on white and on #1e1e2e */
    --arc1: #5b8dd6;  /* board game   */
    --arc2: #d99a3a;  /* juice        */
    --arc3: #3fae9f;  /* overscope    */
    --arc4: #d76a5b;  /* rpg rescope  */
    --t-feature: #5a9e57;
    --t-bug:     #d65563;
    --t-pivot:   #9a72c9;
    --t-origin:  #c99a2e;
    padding: 24px 16px 48px;
  }
  .doc-cp-wrap .content { max-width: 760px; margin: 0 auto; }

  /* ---- header ---- */
  .doc-cp-wrap .eyebrow {
    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--t-origin); font-weight: bold; margin: 0 0 12px;
  }
  .doc-cp-wrap h1 {
    color: var(--heading); font-size: 1.7em; line-height: 1.1; margin: 0 0 12px;
    border: none; padding: 0;
  }
  .doc-cp-wrap .lede { color: var(--muted); font-size: 0.92rem; line-height: 1.6; max-width: 62ch; margin: 0 0 22px; }
  .doc-cp-wrap .stats { display: flex; flex-wrap: wrap; gap: 22px; margin-bottom: 22px; }
  .doc-cp-wrap .stat .n { font-size: 1.4rem; font-weight: bold; color: var(--heading); line-height: 1; font-variant-numeric: tabular-nums; }
  .doc-cp-wrap .stat .l { font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-top: 5px; }

  /* ---- filter chips ---- */
  .doc-cp-wrap .filters {
    display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
    padding: 14px 0 6px; border-top: 1px solid var(--border);
  }
  .doc-cp-wrap .filter-label { font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-right: 4px; }
  .doc-cp-wrap .chip {
    font-family: inherit; font-size: 0.72rem; font-weight: bold; letter-spacing: 0.04em;
    padding: 5px 11px; border-radius: 999px; cursor: pointer;
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); color: var(--muted);
  }
  .doc-cp-wrap .chip:hover { background: var(--nav-hover); color: var(--text); }
  .doc-cp-wrap .chip.active { color: var(--heading); border-color: currentColor; }
  .doc-cp-wrap .chip[data-filter="best"].active    { color: var(--t-origin); }
  .doc-cp-wrap .chip[data-filter="feature"].active  { color: var(--t-feature); }
  .doc-cp-wrap .chip[data-filter="bug"].active      { color: var(--t-bug); }
  .doc-cp-wrap .chip[data-filter="pivot"].active    { color: var(--t-pivot); }

  /* ---- tag pill ---- */
  .doc-cp-wrap .tag {
    display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
    font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: bold;
    padding: 3px 9px; border-radius: 4px; border: 1px solid currentColor; line-height: 1.35;
  }
  .doc-cp-wrap .tag::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .doc-cp-wrap .tag.feature { color: var(--t-feature); }
  .doc-cp-wrap .tag.bug     { color: var(--t-bug); }
  .doc-cp-wrap .tag.pivot   { color: var(--t-pivot); }
  .doc-cp-wrap .tag.origin  { color: var(--t-origin); }

  /* ---- arc section ---- */
  .doc-cp-wrap .arc { margin-top: 40px; }
  .doc-cp-wrap .arc-head {
    display: grid; grid-template-columns: auto 1fr; gap: 2px 16px; align-items: baseline;
    padding-bottom: 14px; border-bottom: 2px solid var(--arc);
  }
  .doc-cp-wrap .arc-num { grid-row: span 2; font-size: 2.6rem; font-weight: bold; color: var(--arc); line-height: 0.8; }
  .doc-cp-wrap .arc-title { font-size: 1.15rem; font-weight: bold; color: var(--heading); margin: 0; }
  .doc-cp-wrap .arc-meta { font-size: 0.7rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
  .doc-cp-wrap .arc-thesis { color: var(--muted); font-size: 0.85rem; line-height: 1.6; max-width: 64ch; margin: 12px 0 4px; }

  /* ---- checkpoint row ---- */
  .doc-cp-wrap .cp { display: grid; grid-template-columns: 150px 1fr; border-left: 2px solid var(--arc); margin-left: 4px; }
  .doc-cp-wrap .cp-rail { padding: 18px 16px 18px 18px; position: relative; }
  .doc-cp-wrap .cp-rail::before {
    content: "\\25B6"; position: absolute; left: -8px; top: 20px; font-size: 0.6rem; color: var(--arc);
    background: var(--bg); width: 14px; height: 14px; display: grid; place-items: center; line-height: 1;
  }
  .doc-cp-wrap .cp-date { font-size: 0.72rem; color: var(--text); font-variant-numeric: tabular-nums; }
  .doc-cp-wrap .cp-hash { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.72rem; color: var(--t-origin); margin-top: 5px; }
  .doc-cp-wrap .cp-hash .git { color: var(--muted); }
  .doc-cp-wrap .cp-body { padding: 16px 4px 22px 22px; border-left: 1px solid var(--border); margin-left: -1px; }
  .doc-cp-wrap .cp-titleline { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 7px; }
  .doc-cp-wrap .cp-title { font-size: 0.98rem; font-weight: bold; color: var(--heading); margin: 0; line-height: 1.3; }
  .doc-cp-wrap .cp-desc { margin: 0 0 11px; color: var(--text); font-size: 0.84rem; line-height: 1.6; max-width: 66ch; }
  .doc-cp-wrap .cp-shot {
    font-size: 0.76rem; line-height: 1.55; color: var(--text); background: var(--link-card-bg);
    border: 1px solid var(--link-card-border); border-left: 3px solid var(--t-origin);
    padding: 8px 12px; border-radius: 0 6px 6px 0; max-width: 66ch;
  }
  .doc-cp-wrap .cp-shot b { color: var(--t-origin); letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.62rem; }
  .doc-cp-wrap .star { color: var(--t-origin); }
  .doc-cp-wrap code {
    font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.85em;
    background: var(--code-bg); color: var(--code-color); padding: 1px 5px; border-radius: 4px;
  }

  /* ---- filtering state ---- */
  .doc-cp-wrap.filtering .cp { display: none; }
  .doc-cp-wrap.filter-best    .cp[data-best="1"],
  .doc-cp-wrap.filter-feature .cp[data-tag="feature"],
  .doc-cp-wrap.filter-bug     .cp[data-tag="bug"],
  .doc-cp-wrap.filter-pivot   .cp[data-tag="pivot"] { display: grid; }
  .doc-cp-wrap .arc.arc-empty { display: none; }

  .doc-cp-wrap .note {
    margin: 4px 0 8px; padding: 11px 14px; border-radius: 0 8px 8px 0;
    background: var(--link-card-bg); border: 1px solid var(--link-card-border); border-left: 3px solid var(--muted);
    color: var(--muted); font-size: 0.79rem; line-height: 1.6;
  }
  .doc-cp-wrap .note b { color: var(--text); letter-spacing: 0.04em; text-transform: uppercase; font-size: 0.66rem; }

  .doc-cp-wrap .foot {
    margin-top: 44px; padding-top: 18px; border-top: 1px solid var(--border);
    color: var(--muted); font-size: 0.74rem; line-height: 1.6;
  }

  @media (max-width: 600px) {
    .doc-cp-wrap .cp { grid-template-columns: 1fr; }
    .doc-cp-wrap .cp-rail { display: flex; gap: 14px; align-items: baseline; padding: 16px 16px 2px 18px; }
    .doc-cp-wrap .cp-hash { margin-top: 0; }
    .doc-cp-wrap .cp-body { border-left: none; padding: 6px 4px 22px 18px; margin-left: 0; }
  }
</style>

<div class="doc-cp-wrap">
 <div class="content">
  <p class="eyebrow">Ninjack &middot; git log &rarr; shot list</p>
  <h1>The Checkpoints Worth Filming</h1>
  <p class="lede">Twenty months from a 9&times;9 board-game prototype to a turn-based dungeon RPG, routed through the moments that actually show up on camera. Each entry has the date, the commit to check out, and what to point the lens at.</p>

  <div class="stats">
    <div class="stat"><div class="n">982</div><div class="l">commits</div></div>
    <div class="stat"><div class="n">4</div><div class="l">arcs</div></div>
    <div class="stat"><div class="n">25</div><div class="l">checkpoints</div></div>
    <div class="stat"><div class="n">Nov&nbsp;&rsquo;24&ndash;Jul&nbsp;&rsquo;26</div><div class="l">span</div></div>
  </div>

  <div class="filters">
    <span class="filter-label">Show</span>
    <button class="chip active" data-filter="all">All 25</button>
    <button class="chip" data-filter="best">&starf; Best videos</button>
    <button class="chip" data-filter="feature">Features</button>
    <button class="chip" data-filter="bug">Bug war-stories</button>
    <button class="chip" data-filter="pivot">Pivots</button>
  </div>

  <p class="note"><b>On the dates</b> &middot; Dates come straight from <code>git</code>, and the log has two long quiet stretches: roughly 16 months between the Nov 2024 prototype and the March 2026 restart, and a shorter gap through spring 2026 before the June sprint. Arc 1 straddles both, which is why its span runs so wide.</p>

  <!-- ===================== ARC 1 ===================== -->
  <section class="arc" style="--arc: var(--arc1);">
    <div class="arc-head">
      <div class="arc-num">1</div>
      <h2 class="arc-title">The Board Game</h2>
      <div class="arc-meta">Nov 2024 &ndash; Mar 2026 &middot; tiles, reveals, one linear run to the boss</div>
    </div>
    <p class="arc-thesis">A tile puzzle: a 9&times;9 forest you chop through to reveal what&rsquo;s hidden, dodging snakes, hunting keys, racing the clock to escape Level 10. Speedrun stats at the end. The game in its purest, most board-game form.</p>

    <div class="cp" data-tag="origin" data-best="0">
      <div class="cp-rail"><div class="cp-date">Nov 23&ndash;25, 2024</div><div class="cp-hash"><span class="git">@</span>2e7b9eb</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">First playable prototype</h3><span class="tag origin">Origin</span></div>
        <p class="cp-desc">One <code>app.js</code>. A forest of trees you chop to reveal gold, swords and snakes; locked doors and keys; a Level 10 mini-boss; a win screen with gold / moves / seconds. The header comment literally lists &ldquo;Moving Snakes, Unlocking Doors, Cool Animations, Winning.&rdquo;</p>
        <div class="cp-shot"><b>The shot</b> &middot; Boot the raw 2024 build next to today&rsquo;s. &ldquo;This is day one.&rdquo; The whole series&rsquo; cold open.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Mar 21, 2026</div><div class="cp-hash"><span class="git">@</span>7ceeda2</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">The refresh-to-cheat cat &amp; mouse</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">A save system that turned into a five-round exploit fight in one evening: base64 &rarr; emoji-safe encoding &rarr; clear-on-death &rarr; save-every-tick &rarr; SHA-256 hash validation &rarr; +1 timer on load. Watch me lose to my own refresh button and patch it live.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Screen-record the exploit working, then the fix landing. Classic &ldquo;player found a dupe glitch&rdquo; dev-drama.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Mar 22, 2026</div><div class="cp-hash"><span class="git">@</span>be95283</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Main menu &amp; ninja-skin selector</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">First time the game had a face: a title screen with a tree backdrop and a color picker for your ninja. The moment it stopped being a prototype and started being a product.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Cycle every skin color on the menu. Cheap, satisfying, thumbnail-friendly.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Mar 23, 2026</div><div class="cp-hash"><span class="git">@</span>ecd8a46</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">New Game+ &amp; the scorpion / MOAI boss</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Arc 1&rsquo;s climax: a real endgame. The &#x1F5FF; as an indestructible NG+ boss trigger, an armored scorpion that stays put and echoes its attack, a lockable house. The linear-run-to-a-final-boss design at its most complete.</p>
        <div class="cp-shot"><b>The shot</b> &middot; The Level 10 boss encounter start-to-finish. The peak of the version most people will never see.</div>
      </div>
    </div>
  </section>

  <!-- ===================== ARC 2 ===================== -->
  <section class="arc" style="--arc: var(--arc2);">
    <div class="arc-head">
      <div class="arc-num">2</div>
      <h2 class="arc-title">Adding the Juice</h2>
      <div class="arc-meta">Jun 2026 &middot; &ldquo;it works, but it isn&rsquo;t fun yet&rdquo;</div>
    </div>
    <p class="arc-thesis">The hard question: the game was correct but flat. This arc is all feel &mdash; sound, animation, telegraphing, feedback &mdash; plus the realization that predictability (a snake you can <em>read</em>) is what makes a turn-based game fun instead of random.</p>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 6&ndash;8, 2026</div><div class="cp-hash"><span class="git">@</span>5a4ad56</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">The game finds its voice</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Synthetic sound effects via the Web Audio API, a gravel footstep crunch on every step, and background music with fade transitions. Silence &rarr; soundtrack in one arc.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Same 10 seconds of play, muted then unmuted. Audio reveals kill on social.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 8&ndash;10, 2026</div><div class="cp-hash"><span class="git">@</span>6f95b29</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">It becomes a real app</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Capacitor wraps it into a native iOS/Android build, and the whole codebase ports from raw JS to TypeScript + Vite. From &ldquo;a webpage&rdquo; to &ldquo;an app on my phone.&rdquo;</p>
        <div class="cp-shot"><b>The shot</b> &middot; Launch it from the home screen on a real device. The &ldquo;it&rsquo;s on the App Store trajectory now&rdquo; beat.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 8, 2026</div><div class="cp-hash"><span class="git">@</span>2023d58</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Super-speed ghost trail</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">The first pure-juice effect: a multi-echo ghost trail behind the ninja. No mechanical change &mdash; it just <em>feels</em> fast. The moment &ldquo;juice&rdquo; became an explicit goal.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Slow-mo the trail. A perfect 5-second loop.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 11&ndash;13, 2026</div><div class="cp-hash"><span class="git">@</span>833d5e1</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Hits that feel tactile</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Tree-chopping became a 5-variant axe animation (&ldquo;Glancing Blow&rdquo; and friends), rocks wobble when struck. Every bump now has weight.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Rapid-fire chop the same tree to show the variety. Before/after against a flat instant-swap.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 16&ndash;18, 2026</div><div class="cp-hash"><span class="git">@</span>512acf3</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Reading the snake&rsquo;s mind</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Direction arrows show where each snake will move next; a threat glow marks its danger tile. The &ldquo;determinism is fun&rdquo; thesis made visible &mdash; a turn-based enemy you can outthink instead of gamble against.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Narrate a turn: &ldquo;it&rsquo;s telling me exactly where it&rsquo;ll strike, so I step <em>here</em>.&rdquo; Great for a design-philosophy short.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 28&ndash;29, 2026</div><div class="cp-hash"><span class="git">@</span>a13c011</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Loot boxes &amp; gravestones</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Snakes carry an inventory that drops a peek-strip loot box on death; dying drops a gravestone marker holding your gold. The first taste of the roguelite loot loop.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Kill a snake, reveal the loot-box strip, then die and show the grave left behind. Two mechanics, one clip.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="1">
      <div class="cp-rail"><div class="cp-date">Jun 29, 2026</div><div class="cp-hash"><span class="git">@</span>9b20341</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title"><span class="star">&starf;</span> Turn-based move &amp; attack animations</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">The centerpiece of the whole arc. Player and enemies now <em>slide</em> and <em>lunge</em> &mdash; with anticipation pauses before an attack lands &mdash; instead of teleporting between tiles. The single biggest &ldquo;does it feel like a game now&rdquo; jump.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Hard cut: instant-swap combat vs. animated combat, same encounter. The flagship before/after of the series.</div>
      </div>
    </div>

    <div class="cp" data-tag="bug" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jun 29&ndash;30, 2026</div><div class="cp-hash"><span class="git">@</span>a5abf88</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Debugging hell: the vanishing characters</h3><span class="tag bug">Bug war-story</span></div>
        <p class="cp-desc">Animation&rsquo;s dark side: entities going invisible after a move, snakes vanishing before their lunge played, double-rendered ghosts, an invisible damage flicker. Fixing the flash effect alone took ~17 PRs in a single day (#181&ndash;#197).</p>
        <div class="cp-shot"><b>The shot</b> &middot; Montage the glitches &mdash; invisible ninja, duplicate snakes &mdash; over a fast PR counter. &ldquo;The cost of juice.&rdquo; Bugs are the most watchable content you have.</div>
      </div>
    </div>
  </section>

  <!-- ===================== ARC 3 ===================== -->
  <section class="arc" style="--arc: var(--arc3);">
    <div class="arc-head">
      <div class="arc-num">3</div>
      <h2 class="arc-title">The Overscope</h2>
      <div class="arc-meta">Jul 3 &ndash; Jul 10, 2026 &middot; the full-narrative island dream</div>
    </div>
    <p class="arc-thesis">Ambition outran the scope: rooms, an NPC with real branching dialogue, a procedural <em>island</em>, and seamless walk-off-the-edge chunk streaming. A beautiful direction &mdash; and the one that got moved to a future sequel so this game could ship. Great &ldquo;what could&rsquo;ve been&rdquo; material.</p>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 3, 2026</div><div class="cp-hash"><span class="git">@</span>5dd1369</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Rooms &amp; a house to start in</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">A data-driven room engine; the game now opens inside a themed house interior instead of the bare forest. Scenes beyond a single grid for the first time.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Walk out of the house into the forest &mdash; the first real scene transition.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 3, 2026</div><div class="cp-hash"><span class="git">@</span>8226eb4</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Meet the Old Man</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">The first character with a voice: an <code>ink</code>-scripted NPC with real branching dialogue who hands you a sword. The narrative-game dream, on screen.</p>
        <div class="cp-shot"><b>The shot</b> &middot; The full dialogue exchange + the item grant. The game reaching for &ldquo;story,&rdquo; not just &ldquo;score.&rdquo;</div>
      </div>
    </div>

    <div class="cp" data-tag="pivot" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 8, 2026</div><div class="cp-hash"><span class="git">@</span>8625098</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">The island generator</h3><span class="tag pivot">Pivot</span></div>
        <p class="cp-desc">A full interactive procedural-island prototype &mdash; coastlines, lakes, paths guaranteed to every point of interest, a 9&times;9 screen overlay. The high-water mark of the overscope, and the seed of the planned sequel.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Drag the generator sliders and watch islands roll. Then the honest line: &ldquo;this was too big &mdash; it&rsquo;s the sequel now.&rdquo;</div>
      </div>
    </div>

    <div class="cp" data-tag="pivot" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 10, 2026</div><div class="cp-hash"><span class="git">@</span>4d6e580</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Walking off the edge of the world</h3><span class="tag pivot">Pivot</span></div>
        <p class="cp-desc">Connected-tile rendering (water/lake/path that knows its neighbors) plus chunk transitions: step off a screen&rsquo;s edge and the neighboring chunk fades in. The open-world tech &mdash; later kept, but repurposed for the dungeon.</p>
        <div class="cp-shot"><b>The shot</b> &middot; One unbroken walk across three chunks. The &ldquo;it&rsquo;s bigger than one screen now&rdquo; reveal.</div>
      </div>
    </div>
  </section>

  <!-- ===================== ARC 4 ===================== -->
  <section class="arc" style="--arc: var(--arc4);">
    <div class="arc-head">
      <div class="arc-num">4</div>
      <h2 class="arc-title">The Rescope: A Turn-Based RPG</h2>
      <div class="arc-meta">Jul 10 &ndash; Jul 18, 2026 &middot; floors, loot, hunger, real enemies</div>
    </div>
    <p class="arc-thesis">The island dream, folded back into something shippable: a persistent Rogue-style dungeon of floors and zones, real loot and gear, hunger and survival, multiple enemy species. The game it actually became &mdash; and the arc you&rsquo;re living in now.</p>

    <div class="cp" data-tag="pivot" data-best="1">
      <div class="cp-rail"><div class="cp-date">Jul 10, 2026</div><div class="cp-hash"><span class="git">@</span>33b02ee</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title"><span class="star">&starf;</span> Rogue-style dungeon replaces the forest</h3><span class="tag pivot">Pivot</span></div>
        <p class="cp-desc">The defining rescope: linear forest levels give way to a persistent 3&times;3 chunked dungeon generated with the actual 1980 Rogue region algorithm &mdash; emergent room counts, spanning-tree corridors, one doorway per edge. The moment the game&rsquo;s genre changed.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Fly a seed through the live generator doc, then explore the same layout in-game. The single most important pivot in the project &mdash; give it its own episode.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 11&ndash;12, 2026</div><div class="cp-hash"><span class="git">@</span>9e8fb9e</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">A real inventory</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Equip slots, a capacity pool, a tap-driven inventory screen, a backpack that expands your bag. The RPG bones arrive.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Open the inventory, equip a weapon, slot a backpack. Menus feel &ldquo;real game&rdquo; instantly.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 13, 2026</div><div class="cp-hash"><span class="git">@</span>0344a8d</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Loot that matters: rarity &amp; real gear</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Rarity-rolled weapon/armor drops with rarity-tinted glows, wired into real combat damage, auto-pickup and auto-equip. The core loot-RPG dopamine loop.</p>
        <div class="cp-shot"><b>The shot</b> &middot; A rare drop glowing on the ground &rarr; auto-equip &rarr; a visibly bigger hit. Loot-reveal content practically films itself.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 13, 2026</div><div class="cp-hash"><span class="git">@</span>42106b3</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Ranged combat: the bow</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Aim and fire a bow across the grid, built on a shooter-agnostic ranged core. Combat is no longer just melee bumps.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Line up a shot down a corridor and drop a snake from range.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 15, 2026</div><div class="cp-hash"><span class="git">@</span>f605399</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">A starting town &amp; the hole/chute descent</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Every run now begins in a hand-built town &mdash; Old Man, fountain, houses &mdash; and door/key progression is replaced by falling through a &#x1F573;&#xFE0F; with a &#x1FA82; chute to reach the next floor.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Spawn in town, talk to the Old Man, grab a chute, dive into the hole. A clean &ldquo;start of a run&rdquo; opener.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 15, 2026</div><div class="cp-hash"><span class="git">@</span>0b13be1</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Survival: the hunger system</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">A fullness meter that ticks down each turn, starvation damage when it empties, food you eat, food that spoils. Turns exploration into a resource clock.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Watch the meter drain to zero and start chipping health &mdash; then a clutch bite of food. Tension in five seconds.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 15, 2026</div><div class="cp-hash"><span class="git">@</span>569348d</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">Zones &amp; the tower-descent screen</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">Floors are grouped into themed zones with their own enemy weighting, and descending plays a tower-cutaway transition marking how deep you are. Depth and progression made legible.</p>
        <div class="cp-shot"><b>The shot</b> &middot; The descent animation between two floors &mdash; a natural &ldquo;and down we go&rdquo; episode ender.</div>
      </div>
    </div>

    <div class="cp" data-tag="feature" data-best="0">
      <div class="cp-rail"><div class="cp-date">Jul 16, 2026</div><div class="cp-hash"><span class="git">@</span>b7c8031</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title">New threats: bats &amp; rats</h3><span class="tag feature">Feature</span></div>
        <p class="cp-desc">The bestiary grows past the lone snake: rats and bats join, unified under one flying-mover render system &mdash; a bat literally flies <em>over</em> a tree without erasing it, and moves diagonally.</p>
        <div class="cp-shot"><b>The shot</b> &middot; A bat flapping diagonally over the treetops. Enemy-variety reveal; sets up the next bug perfectly.</div>
      </div>
    </div>

    <div class="cp" data-tag="bug" data-best="1">
      <div class="cp-rail"><div class="cp-date">Jul 17&ndash;18, 2026</div><div class="cp-hash"><span class="git">@</span>8072321 &rarr; 7463a40</div></div>
      <div class="cp-body">
        <div class="cp-titleline"><h3 class="cp-title"><span class="star">&starf;</span> The great iPhone &ldquo;zoom-after-a-hit&rdquo; bug</h3><span class="tag bug">Bug war-story</span></div>
        <p class="cp-desc">The best debugging saga in the repo. On real iPhone Safari only &mdash; never Chromium &mdash; landing a hit on a <em>bat specifically</em> would zoom the whole board until your next move. A two-day hunt through four wrong theories (pinch-zoom, a WebKit SVG-filter bug, <code>vmin</code> doubling, duplicate DOM) before an on-device diagnostic caught tiles rendering at 2&times; size. Root cause: flattening a flying bat&rsquo;s two-part tile back to plain text during its lunge broke the grid&rsquo;s column sizing.</p>
        <div class="cp-shot"><b>The shot</b> &middot; Real-device footage of the screen &ldquo;zooming&rdquo; on a bat hit, then walking the four dead-ends before the reveal. A full mini-documentary &mdash; the strongest bug story you have.</div>
      </div>
    </div>
  </section>

  <div class="foot">
    Built from <code>git log</code> across 982 commits. Hashes are commit prefixes &mdash; <code>git show &lt;hash&gt;</code> or <code>git checkout &lt;hash&gt;</code> to revisit any checkpoint. Dates are commit dates. &starf; marks the four strongest standalone videos.
  </div>
 </div>
</div>
`;function Hn(e){let t=e.querySelector(`.doc-cp-wrap`);if(!t)return;let n=e.querySelectorAll(`.doc-cp-wrap .chip`),r=e.querySelectorAll(`.doc-cp-wrap .arc`),i=[`filtering`,`filter-best`,`filter-feature`,`filter-bug`,`filter-pivot`];function a(e){t.classList.remove(...i),e!==`all`&&t.classList.add(`filtering`,`filter-`+e),r.forEach(e=>{let t=e.querySelectorAll(`.cp`).length>0&&Array.from(e.querySelectorAll(`.cp`)).some(e=>getComputedStyle(e).display!==`none`);e.classList.toggle(`arc-empty`,!t)})}n.forEach(e=>{e.addEventListener(`click`,()=>{n.forEach(t=>t.classList.toggle(`active`,t===e)),a(e.dataset.filter||`all`)})})}var Z=[{id:`overview`,title:`Overview`,category:`Getting Started`,kind:`markdown`,content:W},{id:`dev-guide`,title:`Dev Guide`,category:`Getting Started`,kind:`markdown`,content:G},{id:`game-design`,title:`Game Design`,category:`Design`,kind:`markdown`,content:ae},{id:`game-spec`,title:`Game Spec`,category:`Design`,kind:`markdown`,content:oe},{id:`snake-inventory`,title:`Snake Inventory & Loot Box`,category:`Design`,kind:`markdown`,content:pe},{id:`drops-core`,title:`Drops Core`,category:`Design`,kind:`markdown`,content:ye},{id:`weapon-drops`,title:`Weapon Drops`,category:`Design`,kind:`markdown`,content:be},{id:`armor-drops`,title:`Armor Drops`,category:`Design`,kind:`markdown`,content:xe},{id:`bow-drops`,title:`Bow Drops`,category:`Design`,kind:`markdown`,content:Se},{id:`ranged-attacks`,title:`Ranged Attacks`,category:`Design`,kind:`markdown`,content:Ce},{id:`food-drops`,title:`Food Drops`,category:`Design`,kind:`markdown`,content:we},{id:`healing-potion-drops`,title:`Healing Potion Drops`,category:`Design`,kind:`markdown`,content:Te},{id:`speed-potion-drops`,title:`Speed Potion Drops`,category:`Design`,kind:`markdown`,content:Ee},{id:`backpack-drops`,title:`Backpack Drops`,category:`Design`,kind:`markdown`,content:De},{id:`inventory-system`,title:`Inventory System`,category:`Design`,kind:`markdown`,content:Oe},{id:`ground-pickup`,title:`🫳 Ground Pickup`,category:`Design`,kind:`markdown`,content:ke},{id:`fullness-system`,title:`Fullness System`,category:`Design`,kind:`markdown`,content:Ae},{id:`ground-pickup-ui`,title:`Ground Pickup Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive mockup of manual ground pickup — the 🫳 icon, transferring items individually or with Take All, bumping a box/grave straight into the same panel, and the item inspect + compare-to-equipped popover.`,html:je,setup:Le},{id:`inventory-ui`,title:`Inventory Screen Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive mockup of the equip section + 4 bag slots — pick up/drop items, equip gear, and see a backpack break and spill its contents.`,html:Re,setup:Ue},{id:`ranged-attacks-ui`,title:`Ranged Attacks Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive mockup of the bow's aim-mode control flow and line-of-sight firing resolution (obstacle blocks, enemy hit, or miss).`,html:We,setup:qe},{id:`fullness-meter-ui`,title:`Fullness Meter Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive mockup of the fullness HUD bar, eating food's restore/slow-down effect, and the starving health-drain penalty.`,html:Je,setup:Ze},{id:`durability-break-ui`,title:`Durability & Destruction Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive mockup of the shared "destroyed at 0 durability" rule across weapon/armor/bow/backpack.`,html:Qe,setup:tt},{id:`drop-tables-tuner`,title:`Drop Tables Tuner`,category:`Interactive Tools`,kind:`interactive`,description:`Tune every weapon/armor/bow/food/backpack tier number live, preview effective drop weight by floor, and copy the whole config as JSON.`,html:nt,setup:vt},{id:`combat-balance`,title:`Combat Balance`,category:`Interactive Tools`,kind:`interactive`,description:`Weapon damage and armor rating plotted across floors 1-25 against flat enemy HP/attack-damage reference lines, with a tier-by-tier hits-to-kill/hits-to-die outcomes table.`,html:yt,setup:At},{id:`house-plan`,title:`House Interior Plan`,category:`Interactive Tools`,kind:`interactive`,description:`First-pass visual prototype of a house interior floor plan — rooms, furniture, and layout.`,html:Nt,setup:Pt},{id:`economy`,title:`Economy Dashboard`,category:`Interactive Tools`,kind:`interactive`,description:`Live calculations for item values, level-by-level gold totals, and cave gate pricing.`,html:zt,setup:Bt},{id:`animations`,title:`Animations`,category:`Interactive Tools`,kind:`interactive`,description:`Fire tile animation timing tuner — adjust the CSS variable live with a slider.`,html:jt,setup:Mt},{id:`ghost-anim`,title:`Ghost Movement Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Side-by-side comparison of current blocking slide vs ghost fire-and-forget — shows drop rate difference. Includes attack and interact ghost demos.`,html:Gt,setup:Kt},{id:`soundboard`,title:`Soundboard`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive preview of all game sound effects and music. Click any button to play.`,html:Ut,setup:Wt},{id:`entity-health-bar`,title:`Entity Health Bar`,category:`Interactive Tools`,kind:`interactive`,description:`Tune the mini heart+bar health indicator shown above a snake’s head — icon/bar size and position — then copy the settings as JSON.`,html:qt,setup:Xt},{id:`damage-numbers`,title:`💥 Floating Damage Numbers`,category:`Interactive Tools`,kind:`interactive`,description:`Prototype for replacing the broken repeated-💔 damage notify with real floating damage numbers, for both the player and enemies — includes a before/after overflow comparison, stacking demo, and a tunable settings panel.`,html:$t,setup:an},{id:`npc-dialogue`,title:`NPC Dialogue Prototype (inkjs)`,category:`Interactive Tools`,kind:`interactive`,description:`A playable Zelda-style NPC conversation compiled and run client-side by inkjs, with a two-way variable bridge to page-side "game" state.`,html:sn,setup:pn},{id:`dungeon-generator`,title:`Chunked Dungeon Generator`,category:`Interactive Tools`,kind:`interactive`,description:`Live preview of the Rogue-style dungeon generator — tweak room count/size and seed, see the full 9x9 chunk grid rendered tile-for-tile using the real generateDungeonLayout/getDungeonChunk implementation.`,html:Dn,setup:On},{id:`tower-cutaway`,title:`Tower Cutaway`,category:`Interactive Tools`,kind:`interactive`,description:`Loading-screen concept: a 3/4 cutaway orthographic view of the whole tower, town down through all 25 floors, colored via the real zone data. Descend/ascend to reveal floors — unexplored ones stay dark with a ❓.`,html:kn,setup:An},{id:`tower-sky-gradient`,title:`Tower Backdrop — Sky Gradient`,category:`Interactive Tools`,kind:`interactive`,description:`Prototype backdrop for the Tower Cutaway: a vertical gradient from starry space down through dark blue, sky blue, and clouds to a grass/dirt ground band, with flat vs. perspective ground variants — not wired into production yet.`,html:zn,setup:Bn},{id:`firebase-config`,title:`Dynamic Strings (Firestore)`,category:`Architecture`,kind:`markdown`,content:fe},{id:`data-model-redesign`,title:`Data Model Redesign`,category:`Architecture`,kind:`markdown`,content:me},{id:`dungeon-generation`,title:`Chunked Dungeon Generation`,category:`Architecture`,kind:`markdown`,content:he},{id:`starting-town`,title:`Starting Town`,category:`Design`,kind:`markdown`,content:ge},{id:`zones`,title:`Zones`,category:`Design`,kind:`markdown`,content:_e},{id:`boss-fights`,title:`Boss Fights`,category:`Design`,kind:`markdown`,content:ve},{id:`save-slots-plan`,title:`Save Slots Plan`,category:`Architecture`,kind:`interactive`,description:`Implementation plan for 4 independent save slots — key namespacing, restart/delete semantics, main menu and slot-select screen redesign.`,html:mn,setup:hn},{id:`capacitor-plan`,title:`Capacitor Plan`,category:`Release & Deploy`,kind:`markdown`,content:se},{id:`release`,title:`Release Process`,category:`Release & Deploy`,kind:`markdown`,content:ce},{id:`mac-setup`,title:`macOS Setup`,category:`Release & Deploy`,kind:`interactive`,description:`Step-by-step interactive checklist for setting up the macOS / iOS Capacitor development environment.`,html:Vt,setup:Ht},{id:`screenshots`,title:`Screenshots`,category:`Release & Deploy`,kind:`markdown`,content:le},{id:`checkpoints`,title:`Dev Log Checkpoints`,category:`Reference`,kind:`interactive`,description:`A retrospective timeline of the moments worth filming for social media, grouped by the four development arcs — each with its date, commit hash, and a note on what to point the camera at. Filterable by arc/tag.`,html:Vn,setup:Hn},{id:`bugs`,title:`Bug Log`,category:`Reference`,kind:`markdown`,content:ue},{id:`links`,title:`Links`,category:`Reference`,kind:`markdown`,content:de}];function Q(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function $(e){let t=Q(e);return t=t.replace(/`([^`]+)`/g,`<code>$1</code>`),t=t.replace(/\*\*([^*\n]+)\*\*/g,`<strong>$1</strong>`),t=t.replace(/\*([^*\n]+)\*/g,`<em>$1</em>`),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,`<a href="$2" target="_blank" rel="noopener">$1</a>`),t}function Un(e){let t=`<div class="table-wrap"><table>`,n=!1;for(let r of e){let e=r.split(`|`).slice(1,-1).map(e=>e.trim());if(e.every(e=>/^[-: ]+$/.test(e))){n=!0;continue}let i=n?`td`:`th`;t+=`<tr>`+e.map(e=>`<${i}>${$(e)}</${i}>`).join(``)+`</tr>`}return t+=`</table></div>`,t}function Wn(e){let t=e.split(`
`),n=``,r=!1,i=``,a=[],o=!1,s=[],c=null,l=()=>{c&&=(n+=`</${c}>`,null)},u=()=>{o&&(n+=Un(s),o=!1,s=[])};for(let e of t){if(r){if(e.trimStart().startsWith("```")){let e=a.join(`
`).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);n+=`<pre><code class="lang-${Q(i)}">${e}</code></pre>`,r=!1,a=[],i=``}else a.push(e);continue}let t=e.match(/^```(\w*)/);if(t){l(),u(),r=!0,i=t[1]||``;continue}if(e.startsWith(`|`)){l(),o||=!0,s.push(e);continue}if(o&&u(),/^[-*_]{3,}$/.test(e.trim())){l(),n+=`<hr>`;continue}let d=e.match(/^(#{1,3}) (.+)/);if(d){l();let e=d[1].length,t=d[2].toLowerCase().replace(/[^\w\s-]/g,``).replace(/\s+/g,`-`).replace(/-+/g,`-`);n+=`<h${e} id="${t}">${$(d[2])}</h${e}>`;continue}let f=e.match(/^\s*[-*+] (.+)/);if(f){c!==`ul`&&(l(),n+=`<ul>`,c=`ul`),n+=`<li>${$(f[1])}</li>`;continue}let p=e.match(/^\s*\d+\. (.+)/);if(p){c!==`ol`&&(l(),n+=`<ol>`,c=`ol`),n+=`<li>${$(p[1])}</li>`;continue}let m=e.match(/^> (.+)/);if(m){l(),n+=`<blockquote><p>${$(m[1])}</p></blockquote>`;continue}if(e.trim()===``){l();continue}l(),n+=`<p>${$(e)}</p>`}if(l(),u(),r){let e=a.join(`
`).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);n+=`<pre><code>${e}</code></pre>`}return n}var Gn=[...new Set(Z.map(e=>e.category))];function Kn(e=``){let t=document.getElementById(`docs-nav`);t.innerHTML=``;let n=e.toLowerCase().trim();for(let e of Gn){let r=Z.filter(t=>t.category===e),i=n?r.filter(e=>e.title.toLowerCase().includes(n)?!0:e.kind===`markdown`?e.content.toLowerCase().includes(n):e.description.toLowerCase().includes(n)):r;if(i.length===0)continue;let a=document.createElement(`div`);a.className=`nav-category`,a.textContent=e,t.appendChild(a);for(let e of i){let n=document.createElement(`button`);n.className=`nav-item`,n.textContent=e.title,n.dataset.id=e.id,n.addEventListener(`click`,()=>Yn(e.id)),t.appendChild(n)}}}function qn(e){document.querySelectorAll(`.nav-item`).forEach(t=>{t.classList.toggle(`active`,t.dataset.id===e)})}function Jn(e){let t=Z.find(t=>t.id===e),n=document.getElementById(`docs-content`);if(!t){n.innerHTML=`<p>Document not found.</p>`;return}t.kind===`markdown`?n.innerHTML=Wn(t.content):t.kind===`interactive`?(n.innerHTML=t.html,t.setup(n)):n.innerHTML=`
      <h1>${Q(t.title)}</h1>
      <div class="doc-link-card">
        <p>${Q(t.description)}</p>
        <a href="${Q(t.href)}" class="doc-link-btn">${Q(t.linkLabel)} →</a>
      </div>
    `,document.getElementById(`docs-main`).scrollTop=0}function Yn(e){history.pushState(null,``,`#${e}`),Jn(e),qn(e)}function Xn(){let e=document.getElementById(`sidebar-toggle`),t=document.getElementById(`docs-sidebar`);e.addEventListener(`click`,()=>{let n=t.classList.toggle(`collapsed`);e.innerHTML=n?`&#8250;`:`&#8249;`,e.title=n?`Expand sidebar`:`Collapse sidebar`})}function Zn(){let e=document.getElementById(`theme-toggle`);localStorage.getItem(`docsTheme`)===`dark`&&(document.body.classList.add(`dark`),e.textContent=`☀️`,e.title=`Switch to light mode`),e.addEventListener(`click`,()=>{let t=document.body.classList.toggle(`dark`);e.textContent=t?`☀️`:`🌙`,e.title=t?`Switch to light mode`:`Switch to dark mode`,localStorage.setItem(`docsTheme`,t?`dark`:`light`)})}Kn(),Xn(),Zn();var Qn=location.hash.slice(1)||Z[0].id;Jn(Qn),qn(Qn),window.addEventListener(`popstate`,()=>{let e=location.hash.slice(1)||Z[0].id;Jn(e),qn(e)}),document.getElementById(`docs-search`).addEventListener(`input`,function(){Kn(this.value),qn(location.hash.slice(1)||Z[0].id)});