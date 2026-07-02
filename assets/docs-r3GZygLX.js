import"./modulepreload-polyfill-Dezn_h7o.js";import{I as e,a as t,h as n,m as r,p as i}from"./constants-czZI6IJk.js";import{n as a,t as o}from"./audio-r26FRT3_.js";import{t as s}from"./controls-render-23mpbGsB.js";var c=`# Ninjack

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
`,l="# Ninjack – Development Notes\n\nFor release configuration (version fields, secrets, TODOs), see [RELEASE.md](RELEASE.md).\n\n## Build System\n\nThis project uses **Vite + TypeScript**. All source files are in `scripts/*.ts`.\n\n| Command | What it does |\n|---|---|\n| `npm run dev` | Start Vite dev server (hot reload) |\n| `npm run build` | Production build → `dist/` |\n| `npm run typecheck` | TypeScript type check (no emit) |\n| `npm run sync` | Build + Capacitor sync (both platforms) |\n\n**Cache busting is automatic** — Vite adds content hashes to all output filenames (e.g. `main-abc123.js`). No manual version bumping needed.\n\n## Adding New HTML Pages\n\nEvery new `.html` file must be registered in **two places**:\n\n1. **`vite.config.ts`** — add an entry to `rollupOptions.input`, e.g.:\n   ```ts\n   'my-page': resolve(__dirname, 'my-page.html'),\n   ```\n   Without this the page 404s in the built/served app.\n\n2. **`index.html`** — add a redirect in the inline script if the page should be reachable via a query param, e.g.:\n   ```js\n   if (sp.has('my-page')) { location.replace('my-page.html'); return; }\n   ```\n\n## Adding New Docs\n\nEvery new `.md` file in `docs/` must be registered in **`scripts/docs-page.ts`** in two places:\n\n1. **Import** the file at the top:\n   ```ts\n   import myDocMd from '../docs/my-doc.md?raw';\n   ```\n\n2. **Add an entry** to the `docs` array with an `id`, `title`, `category`, and `content`:\n   ```ts\n   { id: 'my-doc', title: 'My Doc', category: 'Design', kind: 'markdown', content: myDocMd },\n   ```\n\nWithout this the doc exists on disk but never appears in the docs hub sidebar.\n\n## Keeping Docs Current\n\nWhen implementing or changing a feature, update the relevant doc(s) in the docs hub to reflect the new behavior. Interactive docs live in `scripts/docs-*.ts`. The \"Animations\" doc (`scripts/docs-animations.ts`) should be updated whenever animation timings or types change.\n\n## Testing\n\nUse **vitest** for all unit tests. Tests live in `tests/*.test.ts`.\n\n| Command | What it does |\n|---|---|\n| `npm test` | Run all unit tests (vitest run) |\n\n**Workflow rule**: For every bug fix or behavior change, write a *failing* unit test first that reproduces the issue, then fix the code so the test passes. Commit both together. If the code under test requires a browser environment (DOM, canvas, Web Audio), test the *logic and ordering contracts* instead — e.g. verify that callbacks fire in the right sequence, that state is correct before/after, or that config objects passed to animation queues have the right shape. Pure logic tests are always possible; \"needs the browser\" is not an excuse to skip.\n\n## Module Structure\n\nScripts are ES modules with explicit imports/exports. Load order is managed by the bundler.\n\nKey files:\n- `scripts/main.ts` — entry point; wires up timer callback and move handler\n- `scripts/constants.ts` — exports `NINJA` as a live `let` binding; use `setNinja()` to mutate it\n- `scripts/state.ts` — `GameState` class + singleton `state`\n- `scripts/game.ts` ↔ `scripts/snake.ts` — safe circular dep (all cross-calls are in function bodies)\n- `scripts/game.ts` ↔ `scripts/menu.ts` — same\n\n## Animation Contract Gotchas (`scripts/animations.ts`)\n\n- **`slide`/`lunge` configs with a `destEl`/`srcEl` MUST pass `syncDestText` (or rely on `srcElClear: false`) to restore the tile's text after the overlay finishes.** `animateSlide` clears `destEl.textContent` at the start and only restores it via `syncDestText()` — if you omit it, the tile silently stays blank forever after that entity moves. This exact bug caused the mad money monster to \"vanish\" after every move (`moveMoneyMonster` in `scripts/cave.ts` queued a slide with `destEl` but no `syncDestText`). When adding a new animated mover, always pass one of: `syncDestText: () => tileFromType(getGridTile(x, y)).display` (safe when the grid `TileType` maps 1:1 to a display) or `syncDestText: () => emoji` (use the entity's own captured display when it doesn't — see below).\n- **`tileFromType()` collapses tile variants that share one `TileType`.** `MONEY_MONSTER`, `SICK_MONEY_MONSTER`, and `MAD_MONEY_MONSTER` (`scripts/constants.ts`) all share `type: 'MONEY_MONSTER'`, but `tileFromType('MONEY_MONSTER')` always returns the base 🤑 tile. Never use `tileFromType(getGridTile(...)).display` to resync a tile that might hold one of these — capture the entity's own `tile.display` up front and reuse that instead.\n- **Glow that lives on a tile's `dataset` (e.g. `data-has-key`) does not carry over to the animated overlay clone.** The overlay is a separate `<div>` appended to `#notification-container` in `makeOverlay()`, not the tile element — a CSS rule scoped to `.tile[data-has-key]` has no effect on it. To keep a key-carrying (or otherwise glowing) entity glowing *while it slides/lunges*, pass `glowKey: true` on the `AnimConfig` and let `makeOverlay` add the `.anim-overlay-key-glow` class (mirrors the tile's radial-gradient glow CSS). Follow this pattern for any future \"glow persists through animation\" need rather than only styling the resting tile.\n\n## Manual/Live Verification via Console\n\nThis game is heavily DOM/animation-driven and procedurally generated, so unit tests can't exercise real rendering, and organically reaching rare states (e.g. the cave's mad money monster, which requires bumping an empty-handed money monster 25 times) is slow. When verifying in a real browser (e.g. via Playwright), the fastest reliable path is to reach into the page's own already-loaded ES module graph rather than reimplementing logic:\n\n```js\n// Bind live handles ONCE, up front — do this in a single page.evaluate() call.\n// (Note the Vite `base` prefix, e.g. /web-ninjack/, from vite.config.ts.)\nawait page.evaluate(async () => {\n  window.__move = (await import('/web-ninjack/scripts/player.ts')).move;\n  window.__state = (await import('/web-ninjack/scripts/state.ts')).state;\n});\n```\n\n`import()` of a URL the page has already loaded returns the *same* live singleton the UI uses (same `state`, same `move()`/`moveSnakes()`/etc.), so calling these from the console is driving the real app, not a reimplementation — safe to use for setup (placing entities, forcing an AI pattern's next step, jumping straight to `advanceLevel()` to skip maze-solving) as long as the actual behavior under test is still triggered through the real production function.\n\nPitfalls hit in practice:\n- **Don't re-import a module for the first time mid-script in a later `page.evaluate()` call** — bind everything you'll need in one evaluate at the start. A fresh dynamic import issued later produced one confusing stale/inconsistent read of `state` during this session's testing (looked like a false game bug; it wasn't).\n- **Space consecutive `move()` calls generously (≥200ms)** — `move()` doesn't always await its enemy animation phase (only when a lunge is queued), so rapid-fire calls can have their slide animations (110ms each) overlap and produce misleading intermediate DOM reads.\n\n### `window.__debug` (`scripts/debug.ts`)\n\nLoad the game with `?dev` and `window.__debug` is installed automatically (console-only, no UI) with shortcuts for exactly the setup pain points above: `dump()`/`dumpGrid()` for state snapshots, `setTile`/`clearArea`/`teleportPlayer` for board control, `setHealth`/`setGold`/`giveKey`/`giveSword`/`giveChute` for inventory, `spawnSnake`/`forceMadMonster` for entities (the latter skips the 25-bump grind to reach the cave boss state), plus raw access to `state` and the real `move`/`moveSnakes`/`moveMoneyMonster`/`moveRabbit`/`advanceLevel`/`enterCave` functions for manual turn-stepping. Extend this file rather than re-inventing the console-import dance above when a new debug need comes up.\n\n",u=`# Ninjack — Game Design Notes

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
`,d='# Capacitor Native Mobile Port — Plan\n\n> **Key:** Steps marked 🖱️ are manual GitHub/account actions. Steps marked ⌨️ are code/CLI work done in this repo.\n\n## Overview\n\nPort Ninjack to native iOS and Android using Capacitor, while continuing to support the existing web version. As part of this work, restructure the deployment pipeline to comply with the music sync license (which requires the game be distributed only as a finished, end-user work).\n\n---\n\n## Repo Restructuring\n\n### Problem\nThe current repo is public, which means raw music files in `music/` are publicly accessible and downloadable outside of any game context. The music license requires the music be distributed "only as a finished, end-user work" — a public source repo does not satisfy this.\n\n### Solution\n\n🖱️ **Manual — GitHub.com**\n1. Make this repo private: Settings → Danger Zone → Change visibility → Private\n2. Create a new public repo (e.g. `ninjack-web`) on GitHub — this will be the web deploy target\n3. Enable GitHub Pages on `ninjack-web`: Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`\n4. Create a Personal Access Token (or use a Deploy Key) with write access to `ninjack-web`, and add it as a secret on this private repo: Settings → Secrets → Actions → `DEPLOY_REPO_TOKEN`\n\n⌨️ **Code — this repo**\n5. Add a GitHub Actions workflow that pushes built assets to `ninjack-web` on every push to `main` (see Web Deployment Pipeline below)\n\nThe music license is satisfied because the public-facing artifact is the finished game, not raw source files.\n\n---\n\n## Build Step\n\nCurrently there is no build step — the repo root is served directly. Capacitor requires a `webDir` to copy into native projects, and the deploy pipeline needs a clean output folder (to avoid pushing `node_modules/`, `ios/`, `android/`, etc.).\n\n⌨️ **Code changes**\n- Add `package.json` with a `build` script that copies web assets to `www/`\n- Set `webDir: "www"` in `capacitor.config.json`\n- Add `www/`, `ios/`, `android/`, `node_modules/` to `.gitignore`\n\nThe copy includes: `index.html`, `scripts/`, `styles/`, `music/` (or bundled equivalent — see below).\n\n### Music bundling (optional hardening)\nConverting MP3s to base64 and inlining them in a JS file means the public deploy repo contains no standalone audio files — only a game bundle. This removes any ambiguity about whether the deployed artifact constitutes a "finished work." Not strictly required once the source repo is private, but cleaner.\n\n---\n\n## Capacitor Setup\n\n### Phase 1 — Bootstrap ⌨️\n1. `npm init` — create `package.json`\n2. Install `@capacitor/core`, `@capacitor/cli`\n3. `npx cap init` — app name: Ninjack, app ID: `com.ninjack.app`\n4. Create `capacitor.config.json` with `webDir: "www"`\n\n### Phase 2 — Add Platforms ⌨️\n5. Install `@capacitor/ios`, `@capacitor/android`\n6. `npx cap add ios` / `npx cap add android`\n7. `npx cap sync` — copies `www/` into native projects\n\n### Phase 3 — Compatibility Fixes ⌨️\n\n| Concern | Status | Action |\n|---|---|---|\n| Touch controls | Already implemented (pointer events + joystick mode) | None |\n| Viewport / scaling | Already set (`user-scalable=no`) | None |\n| `localStorage` | Works in Capacitor WebView | None (or upgrade to `@capacitor/preferences`) |\n| `AudioContext` | iOS requires user gesture to unlock | Already handled — verify on device |\n| `crypto.subtle` | Requires secure context | Capacitor serves via localhost — works fine |\n| Safe area insets | iPhone notch / home bar overlap | Add `env(safe-area-inset-*)` padding to game container in CSS |\n\n### Phase 4 — Native Polish (optional) ⌨️\n\n| Plugin | Purpose |\n|---|---|\n| `@capacitor/status-bar` | Hide or style the native status bar |\n| `@capacitor/splash-screen` | Launch screen while app loads |\n| `@capacitor/haptics` | Vibration feedback on hits/deaths |\n\nAll official Capacitor plugins include web fallback implementations — no platform-specific guards needed in game code.\n\n### Phase 5 — Build & Test (mixed)\n\n⌨️ Open native projects:\n- iOS: `npx cap open ios` → Xcode → run on simulator/device\n- Android: `npx cap open android` → Android Studio → run on emulator/device\n\n🖱️ Manual device testing:\n- Touch controls (all layouts), audio unlock on iOS, save/load, safe area on notch devices\n\n🖱️ App Store / Play Store submission (future, when ready):\n- Requires Apple Developer account ($99/yr) and/or Google Play Developer account ($25 one-time)\n- App signing, provisioning profiles, store listings — all manual\n\n---\n\n## Web Deployment Pipeline\n\n### GitHub Actions Workflow ⌨️\n\nFile: `.github/workflows/deploy.yml`  \nTrigger: push to `main`\n\nSteps:\n1. Run `npm run build` (copies assets to `www/`)\n2. Push contents of `www/` to the `main` branch of the `ninjack-web` deploy repo using `DEPLOY_REPO_TOKEN`\n3. GitHub Pages on `ninjack-web` serves the game automatically\n\nThe deploy repo has no source history — just the latest built game. Music files are present (they must be, to play in the browser) but only as part of the deployed game artifact.\n\n> Note: The first deploy requires the manual GitHub steps in Repo Restructuring (token, Pages config) to be completed first.\n\n---\n\n## Development Workflow (ongoing)\n\n```\nEdit source files in private repo\n        │\n        ├── Web testing:    serve repo root locally → test in browser\n        │\n        ├── Web deploy:     git push main → GitHub Actions → ninjack-web → GitHub Pages\n        │\n        └── Native:         npm run build → npx cap sync → Xcode / Android Studio\n```\n\n---\n\n## Summary of All Changes\n\n| Area | Who | Change |\n|---|---|---|\n| Repo visibility | 🖱️ Manual | Make this repo private on GitHub |\n| Deploy repo | 🖱️ Manual | Create `ninjack-web` public repo, enable GitHub Pages |\n| Deploy token | 🖱️ Manual | Create PAT, add as `DEPLOY_REPO_TOKEN` secret |\n| CI/CD workflow | ⌨️ Code | Add `.github/workflows/deploy.yml` |\n| Build step | ⌨️ Code | Add `npm run build` copy script + `www/` output dir |\n| `.gitignore` | ⌨️ Code | Ignore `www/`, `ios/`, `android/`, `node_modules/` |\n| Capacitor config | ⌨️ Code | Add `package.json`, `capacitor.config.json` |\n| Native platforms | ⌨️ Code | Add `ios/` and `android/` via `npx cap add` |\n| CSS | ⌨️ Code | Add `env(safe-area-inset-*)` padding for notch/home-bar |\n| Optional | ⌨️ Code | Bundle audio as base64, add status bar / splash / haptics plugins |\n| NG+ flag | — | Unchanged — re-enable per CLAUDE.md instructions when ready |\n',f='# Ninjack – Release Configuration\n\n## Fields to bump before every build\n\n| Field | File | Notes |\n|---|---|---|\n| `versionCode` | `android/app/build.gradle` | Integer, increment by 1 each upload |\n| `versionName` | `android/app/build.gradle` | Human-readable, e.g. `"1.1"` |\n| `CURRENT_PROJECT_VERSION` | `ios/App/App.xcodeproj/project.pbxproj` | iOS build number — fastlane `increment_build_number` handles this automatically |\n| `MARKETING_VERSION` | `ios/App/App.xcodeproj/project.pbxproj` | iOS marketing version — set manually |\n\n## One-time setup fields (never change)\n\n| Field | File | Notes |\n|---|---|---|\n| `appId` | `capacitor.config.json` | `com.dropkick.ninjack` — must match stores |\n| `app_identifier` | `fastlane/Appfile` | Same bundle ID |\n| `package_name` | `fastlane/Appfile` | Android package name |\n| `apple_id` | `fastlane/Appfile` | Apple ID email |\n| `app_identifier` | `fastlane/Matchfile` | Match cert sync |\n| `PRODUCT_BUNDLE_IDENTIFIER` | Xcode project | Must match `appId` |\n| `applicationId` | `android/app/build.gradle` | Must match `appId` |\n\n## Secrets (`fastlane/.env` — never commit)\n\nCopy `fastlane/.env.example` → `fastlane/.env` and fill in:\n\n| Field | Required | Notes |\n|---|---|---|\n| `ANDROID_KEYSTORE_PATH` | Yes | Path to `.keystore` file |\n| `ANDROID_KEYSTORE_PASSWORD` | Yes | |\n| `ANDROID_KEY_ALIAS` | Yes | `ninjack` |\n| `ANDROID_KEY_PASSWORD` | Yes | |\n| `APP_STORE_CONNECT_API_KEY_KEY_ID` | Optional | Avoids 2FA; generate at App Store Connect → Users & Access → Integrations |\n| `APP_STORE_CONNECT_API_KEY_ISSUER_ID` | Optional | |\n| `APP_STORE_CONNECT_API_KEY_KEY_FILEPATH` | Optional | Path to `.p8` file |\n\n## App Store Connect fields (iOS)\n\nAll fields live at appstoreconnect.apple.com → Ninjack → Distribution.\n\n### iOS App Version 1.0 (set each release)\n\n| Field | Status | Required | Notes |\n|---|---|---|---|\n| Previews & Screenshots | EMPTY | Yes | At least 1 iPhone 6.5" screenshot required |\n| Description | EMPTY | Yes | Up to 4000 chars |\n| Keywords | EMPTY | Yes | Up to 100 chars, comma-separated |\n| Support URL | EMPTY | Yes | |\n| Copyright | EMPTY | Yes | e.g. `© 2026 Dropkick, LLC` |\n| Promotional Text | EMPTY | No | Up to 170 chars; can change without resubmitting |\n| Marketing URL | EMPTY | No | |\n| Build | NOT UPLOADED | Yes | Run `fastlane ios beta` to upload |\n| App Review — Contact: First/Last name, Phone, Email | EMPTY | Yes | Reviewer contact info |\n| App Review — Notes | EMPTY | No | Any special instructions for reviewer |\n\n### App Information (one-time, survives across versions)\n\n| Field | Status | Required | Notes |\n|---|---|---|---|\n| Name | "Ninjack" | Yes | Done |\n| Subtitle | "Escape the Forest!" | No | Done |\n| Category | Games › Adventure, Puzzle | Yes | Done |\n| Age Ratings | 13+ | Yes | Done (via questionnaire) |\n| Content Rights | Not configured | Yes | Declare whether app contains third-party content |\n| App Encryption Documentation | Not uploaded | Conditional | Required if app uses non-exempt encryption; declare via `NSAllowsArbitraryLoads` in Info.plist or upload docs |\n| Digital Services Act (EU) | Not set up | Yes | Go to Business → set trader status to submit in EU |\n\n### App Privacy (one-time, must publish separately)\n\n| Field | Status | Required | Notes |\n|---|---|---|---|\n| Privacy Policy URL | EMPTY | Yes | Must be a live URL before submission |\n| Data collection questionnaire | Not started | Yes | Click "Get Started" on App Privacy page |\n\n## Incomplete / TODO\n\n- `fastlane/Matchfile` — `git_url` is commented out; Match isn\'t fully configured (`sync_code_signing` is also commented out in Fastfile)\n- `fastlane/Appfile` — `itc_team_id` / `team_id` commented out (needed if Apple account has multiple teams)\n- `fastlane/google-play-key.json` — does not exist yet; required for Android Play Store uploads\n',p=`# Ninjack – App Store Screenshot Sizes

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
`,m="# Known Bugs\n\n## Missing Key Softlock — Player Cannot Exit Without a Key\n\n**Status: Fixed ✅ (no unit test)**\n\n**Description:**\nThe player can end up with no key and no way to unlock the door. Two independent failure modes produce this:\n\n**Mode 1 — Key overwritten by a snake.**\nThe level key (`🔑`) lives in the shuffled loot table and is placed on the grid when its corresponding tree is broken. After placement it is just a tile — a snake can move onto it, overwriting it with the snake tile. The key is silently destroyed. The player breaks all remaining trees, no key exists on the grid or in inventory, and cannot exit.\n\n**Mode 2 — Key absent from the loot table.**\n`generateLootTable()` (`scripts/worldGen.ts`) calculates a `remainingCount` for empty-slot padding:\n\n```ts\nconst remainingCount = treeCount - state.snakesCount - swordsCount - coinCount\n                     - goldCount - gemCount - doorCount - keyCount - chuteCount;\n```\n\nIf `state.snakesCount` grows large enough (later levels) or the constants shift, `remainingCount` can go negative. `Array(negative)` in the V8 engine throws a `RangeError`, crashing the loot table generation entirely so no key slot is ever created. Even without a crash, any future refactor that removes the `keyDrop` from the shuffled array or misconfigures `keyCount` leaves the player without a key.\n\n**Fix Applied:**\n`checkForMissingKey()` in `scripts/player.ts` runs at the start of every `move()` call. It checks: all trees are gone AND no `KEY` tile exists anywhere on the grid AND a `DOOR` tile exists AND the door is locked AND player holds no key. When all conditions hold, it calls `state.giveKey()`, silently granting a key.\n\n**Why a unit test is needed:**\nNeither failure mode is reliably reproducible through normal play. Mode 1 requires a specific shuffle ordering placing the key tile adjacent to a snake's starting path. Mode 2 requires a `snakesCount` value large enough to make `remainingCount` negative. No test currently verifies `checkForMissingKey()` fires under either scenario, nor that `generateLootTable()` throws before the guard has a chance to run (Mode 2 would crash the level before `checkForMissingKey()` could help). A unit test for Mode 1 should mock `state.grid` with no key, no trees, a locked door, and confirm the key is granted. Mode 2 needs a test asserting `generateLootTable()` never produces a negative `remainingCount` for any valid level configuration.\n\n**Affected Files:**\n- `scripts/player.ts` — `checkForMissingKey()` function\n- `scripts/worldGen.ts` — `generateLootTable()` negative `remainingCount` risk\n\n---\n\n## Final Boss: Enemies Spawn on Already-Revealed Rock Tiles\n\n**Status: Fixed ✅**\n\n**Description:**\n`handleFinalBoss()` in `game.js` iterates over `state.rocks` and spawns an enemy at every position in that array. However, `state.rocks` is never pruned when a rock is revealed during normal play — `addRock()` populates it at level generation and `clearRocks()` only runs at level setup. As a result, if the player has already dug up one or more rocks before the boss trigger fires, enemies are still spawned at those now-empty (or loot-containing) tile positions, overwriting whatever tile was there.\n\nTriggered by collecting the chute (`interactWithOpenTile` → `handleFinalBoss()`). All remaining rocks burst open as snakes.\n\n**Fix Applied:**\n- Added `state.removeRock(x, y)` to `state.js`\n- `interactWithVegetation()` calls `state.removeRock(newX, newY)` whenever a rock is revealed\n- `handleFinalBoss()` trusts `state.rocks` is current; calls `state.clearRocks()` after burst\n\n**Affected Files:**\n- `scripts/game.js` — `handleFinalBoss()`\n- `scripts/state.js` — `removeRock(x, y)` method added\n- `scripts/player.js` — `interactWithVegetation()` calls `state.removeRock()`\n",h=`# Ninjack – Important Links

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
`,g=`# Architectural Specification: Config-as-Code for Firebase Remote Config (v2)

This specification defines a game-agnostic framework for managing application configurations in TypeScript/JavaScript, guaranteeing compile-time type-safety, and executing client-side version checks before applying remote overrides.

## 1. Core Architecture & Client-Side Gating

The application bundles local defaults and enforces minimum version gates immediately at runtime. If the running application's version is lower than the remote-required version, the client rejects the remote configuration and falls back to safe local values.

\`\`\`typescript
// src/config/schema.ts
export interface AppConfig {
  min_app_version: string; // Semantic version format, e.g. "1.1.0"
  features: Record<string, boolean>;
  settings: Record<string, number | string>;
}

export const localDefaults: AppConfig = {
  min_app_version: "1.0.0",
  features: { enable_multiplayer: false },
  settings: { max_framerate: 60 }
};
\`\`\`

## 2. Typesafe Mapper Helper

Rather than reading raw values throughout your codebase, the client routes all configuration accesses through a mapping utility that parses type-appropriate primitives and JSON strings back into your \`AppConfig\` shape:

\`\`\`typescript
import { RemoteConfig, getString, getNumber, getBoolean } from 'firebase/remote-config';

export function getTypesafeConfig<T extends Record<string, any>>(
  remoteConfig: RemoteConfig,
  defaults: T
): T {
  const config = { ...defaults } as any;

  for (const key of Object.keys(defaults)) {
    const val = defaults[key];
    const type = typeof val;

    if (type === 'boolean') config[key] = getBoolean(remoteConfig, key);
    else if (type === 'number') config[key] = getNumber(remoteConfig, key);
    else if (type === 'string') config[key] = getString(remoteConfig, key);
    else if (type === 'object' && val !== null) {
      try {
        const rawJson = getString(remoteConfig, key);
        config[key] = rawJson ? JSON.parse(rawJson) : val;
      } catch {
        config[key] = val; // Roll back to default if JSON parse fails
      }
    }
  }
  return config;
}
\`\`\`

\`\`\`typescript
// src/config/loader.ts
import { isSemverLower } from './utils'; // Custom version compare

export function loadAndGateConfig(remoteConfig: RemoteConfig, currentVersion: string): AppConfig {
  const remoteMinVersion = getString(remoteConfig, 'min_app_version');

  if (isSemverLower(currentVersion, remoteMinVersion)) {
    console.warn(\`App version (\${currentVersion}) too low for remote (\${remoteMinVersion}). Using defaults.\`);
    return localDefaults;
  }

  return getTypesafeConfig(remoteConfig, localDefaults);
}
\`\`\`

## 3. Schema Type Checking & Testing

To ensure your JSON build script never diverges from the TypeScript definitions, run unit tests directly against your schema modules during testing or pre-commit hooks:

\`\`\`typescript
describe('Remote Config Schema and Default Alignment', () => {
  it('should guarantee localDefaults strictly implements the AppConfig interface compile-time types', () => {
    // Handled statically by the TypeScript compiler
  });

  it('should successfully build the JSON template with identical parameter keys', () => {
    // Assert generated file keys match Object.keys(localDefaults)
  });

  it('should reject parameter types that are not serializable by the build generator', () => {
    // Ensure nested objects can be stringified and don't contain invalid types like functions
  });
});
\`\`\`
`,_=`# Snake Inventory & Loot Box UI

## Overview

Snakes now carry an inventory. When killed, they drop a **loot box** tile that
holds all collected items. The player opens it with two bumps — the first reveals
contents, the second collects everything.

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

- The snake's tile becomes a **loot box** 📦.
- The loot box holds the full inventory (≥ 1 item; a single item still uses the
  same tile so the player sees consistency).

### 3 — First bump: peek panel opens

Player tries to move into the loot box tile.

\`\`\`
Before bump                     After first bump
───────────────────────────────────────────────────────
  [ ][ ][ ][ ][ ]                [💰¹⁵][🗡][❤️][🔑][ ]  ← peek strip (1 tile tall)
  [ ][ ][ ][ ][ ]                [ ][ ][ ][ ][ ]
  [ ][ ][ ][ ][ ]                [ ][ ][📦][ ][ ]       ← loot box
  [ ][ ][📦][ ][ ]               [ ][ ][🥷][ ][ ]       ← player
  [ ][ ][🥷][ ][ ]
\`\`\`

Gold always shows its value as a badge (e.g. \`💰\` with \`15\`), even when the value is 1.

The **peek strip** normally appears directly above the loot box, centred on it.
Each item occupies one cell. The strip expands left and/or right as needed and
clips at the grid edge.

**Horizontal fallback**: when no safe vertical row exists (e.g. the box is at the
top edge and the player is one row below, or the box is at the bottom edge and
the player is one row above), the strip appears in the *same row* as the box,
sliding in from the box toward the right (or left if the right side would
overflow). The box cell itself is not overwritten — items occupy adjacent cells.

The loot box itself stays in place. The player has not moved.

### 4 — Second bump: collect all

Player bumps the loot box again.

- Every item in the peek strip plays its **collect animation** (same pop/fade
  used when the player walks over a tile today), one after another in rapid
  succession (staggered ~80 ms apart, left → right).
- Items are added to the player's inventory in that order.
- The peek strip and loot box tile are both removed.
- Player does not move (same bump-without-moving contract as doors/walls).

### Dismiss without collecting

If the player moves in any direction while the peek strip is open (including
walking away from the loot box), the strip closes with no animation and no
items are collected. The loot box remains on the board.

---

## Visual Reference

**Normal case — strip above the box:**
\`\`\`
╔══════════════════════════════════════════════╗
║  Peek strip — centred above loot box         ║
║                                              ║
║   ┌────┬──┬──┬──┐                           ║
║   │💰15│🗡│❤️│🔑│  ← gold shows value badge  ║
║   └────┴──┴──┴──┘                           ║
║          │                                  ║
║         📦   ← loot box                     ║
║         🥷   ← player (did not move)        ║
╚══════════════════════════════════════════════╝
\`\`\`

**Horizontal fallback — strip to the right of the box (same row):**
\`\`\`
╔══════════════════════════════════════════════╗
║  Top edge: player below blocks vertical peek ║
║                                              ║
║  🪨🪨🪨📦│💰15│🗡│❤️│🔑│🪨  ← horizontal strip ║
║  🪨🪨🪨🥷🪨🪨🪨🪨🪨🪨         ← player          ║
╚══════════════════════════════════════════════╝
\`\`\`
Items slide in from the box direction (right for a rightward strip, left for a
leftward strip). Dismiss slides them back the same way.

**Collect animation sequence (second bump):**
\`\`\`
  💰¹⁵ → flies up & fades with badge (t=0 ms)
  🗡   → flies up & fades (t=80 ms)
  ❤️   → flies up & fades (t=160 ms)
  🔑   → flies up & fades (t=240 ms)
  📦   → removed after last animation completes
\`\`\`

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| Loot box at top row, no vertical blocker | Peek strip appears one row *below* the box |
| Loot box at top row, player at row 1 | No safe vertical row — strip slides out **horizontally** (same row as box) |
| Loot box at bottom row, player at row above | No safe vertical row — strip slides out **horizontally** (same row as box) |
| Horizontal strip, right side has room | Items appear to the right of the box, sliding in from the left |
| Horizontal strip, right side would overflow | Items appear to the left of the box, sliding in from the right |
| Inventory has 1 item | Still uses loot box + peek strip for consistency |
| Loot box at left/right edge (vertical peek) | Strip shifts toward centre so it stays fully in bounds — all items remain visible |
| Snake dies with empty inventory | No loot box placed (current behaviour) |
| Another snake steps on loot box | Loot box is added to that snake's inventory; box removed from board |

---

## Open Questions

- Should the loot box be passable by snakes (they absorb its contents) or
  treated as a blocked tile?
- Gold always shows its value badge (even at 1), using the same \`.peek-badge\`
  style as the stack count badge. 🪙 coin and 💎 gem tiles are gone; all currency
  is 💰 gold with a numeric value.
`,v=`
<style>
  .dlb-wrap {
    background: #0a280a;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 48px;
    min-height: 400px;
  }
  #docs-content .dlb-wrap h1 {
    color: #FFD700;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,215,0,0.2);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .dlb-wrap section {
    max-width: 560px;
    margin: 0 auto 44px;
  }
  .dlb-sec-lbl {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 14px;
    font-family: Arial, sans-serif;
  }

  /* ── Game tile grid ── */
  .dlb-area {
    background: forestgreen;
    display: inline-block;
    padding: 3px;
    border-radius: 3px;
  }
  .dlb-tile {
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
    -webkit-user-select: none;
  }

  /* ── Snake threat glow (matches game CSS exactly) ── */
  @keyframes dlbSnakePulse {
    0%, 100% { opacity: 0.55; transform: scale(0.85); }
    50%       { opacity: 1;    transform: scale(1.1); }
  }
  .dlb-snake-glow { isolation: isolate; }
  .dlb-snake-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,0,0,0) 68%);
    z-index: -1;
    pointer-events: none;
    animation: dlbSnakePulse 0.6s ease-in-out infinite;
  }

  /* ── Loot box glow (gold pulse) ── */
  @keyframes dlbLootPulse {
    0%, 100% { opacity: 0.4; transform: scale(0.88); }
    50%       { opacity: 0.95; transform: scale(1.12); }
  }
  .dlb-loot-glow { isolation: isolate; }
  .dlb-loot-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,215,0,0.65) 0%, rgba(255,215,0,0) 68%);
    z-index: -1;
    pointer-events: none;
    animation: dlbLootPulse 1.4s ease-in-out infinite;
  }

  /* ── Peek strip tile (used only for static badge examples) ── */
  .dlb-peek-tile {
    background: #004800;
    border-color: #003300;
  }

  /* ── Count badge ── */
  .dlb-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.9);
    color: #FFD700;
    font-size: 11px;
    font-weight: bold;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    font-family: Arial, sans-serif;
    pointer-events: none;
    z-index: 3;
    line-height: 1;
    box-sizing: border-box;
  }

  /* ── Collect notification (matches game floatUpAndFade) ── */
  @keyframes dlbFloatUp {
    0%   { transform: translateY(0);    opacity: 1; }
    100% { transform: translateY(-56px); opacity: 0; }
  }
  /* inset:0 variant — used when notification is a direct child of the tile */
  .dlb-notify-el {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    pointer-events: none;
    z-index: 10;
    animation: dlbFloatUp 0.8s ease-out forwards;
  }
  /* free-positioned variant — reparented to grid so tile can animate independently */
  .dlb-notify-free {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    pointer-events: none;
    z-index: 20;
    animation: dlbFloatUp 0.8s ease-out forwards;
  }

  /* ── Peek strip window-shade reveal / conceal ── */
  /* Slides up from below — used when strip is above the loot box (normal case) */
  @keyframes dlbRevealUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes dlbConcealDown {
    from { transform: translateY(0); }
    to   { transform: translateY(100%); }
  }
  /* Slides down from above — used when strip is below the loot box (top-row edge case) */
  @keyframes dlbRevealDown {
    from { transform: translateY(-100%); }
    to   { transform: translateY(0); }
  }
  @keyframes dlbConcealUp {
    from { transform: translateY(0); }
    to   { transform: translateY(-100%); }
  }

  /* Clips the sliding overlay to the tile's content bounds */
  .dlb-peek-clip {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  /* The sliding face of the peek strip */
  .dlb-peek-overlay {
    position: absolute;
    inset: 0;
    background: #004800;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  }
  .dlb-reveal-up    { animation: dlbRevealUp    0.18s ease-out both; }
  .dlb-conceal-down { animation: dlbConcealDown  0.18s ease-in  both; }
  .dlb-reveal-down  { animation: dlbRevealDown   0.18s ease-out both; }
  .dlb-conceal-up   { animation: dlbConcealUp    0.18s ease-in  both; }

  /* ── Buttons ── */
  .dlb-btn-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 14px;
    justify-content: center;
  }
  .dlb-btn {
    padding: 8px 18px;
    background: rgba(30,80,30,0.9);
    color: #ccffcc;
    border: 1px solid rgba(45,122,45,0.6);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: Arial, sans-serif;
    transition: background 0.1s;
  }
  .dlb-btn:hover:not(:disabled) { background: rgba(50,110,50,0.9); }
  .dlb-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .dlb-btn.dlb-sec {
    background: rgba(15,45,15,0.9);
    color: rgba(200,255,200,0.5);
    border-color: rgba(45,122,45,0.25);
  }
  .dlb-state-lbl {
    text-align: center;
    margin-top: 10px;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
    font-family: Arial, sans-serif;
    min-height: 1.2em;
  }

  /* ── Badge example tiles ── */
  .dlb-badge-row {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .dlb-badge-ex {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
  }
  .dlb-badge-cap {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.38);
    font-family: Arial, sans-serif;
    text-align: center;
    line-height: 1.4;
  }
  .dlb-ex-tile {
    width: 56px;
    height: 56px;
    background: green;
    border: 1px solid forestgreen;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
  }
  .dlb-ex-tile.dlb-peek-tile {
    background: #004800;
    border-color: #003300;
  }
  .dlb-separator {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin: 0;
  }
</style>

<div class="dlb-wrap">
  <h1>📦 Loot Box UI</h1>

  <!-- ─────────────── SECTION 1: Full flow ─────────────── -->
  <section>
    <div class="dlb-sec-lbl">Full Flow — Interactive Demo</div>
    <div style="text-align:center">
      <div class="dlb-area">
        <div id="dlb-grid" style="display:grid;grid-template-columns:repeat(5,56px);grid-template-rows:repeat(5,56px);position:relative;background:green;">
          <!-- Row 0: empty buffer -->
          <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
          <!-- Row 1: peek strip slots (cols 1-3) -->
          <div class="dlb-tile"></div>
          <div class="dlb-tile" id="dlb-p0"></div>
          <div class="dlb-tile" id="dlb-p1"></div>
          <div class="dlb-tile" id="dlb-p2"></div>
          <div class="dlb-tile"></div>
          <!-- Row 2: snake / loot box -->
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <div class="dlb-tile dlb-snake-glow" id="dlb-center">🐍</div>
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <!-- Row 3: player -->
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <div class="dlb-tile" id="dlb-player">🥷</div>
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <!-- Row 4: empty -->
          <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
        </div>
      </div>
    </div>
    <div class="dlb-btn-row">
      <button class="dlb-btn" id="dlb-kill">⚔️ Kill Snake</button>
      <button class="dlb-btn" id="dlb-bump" disabled>↑ Bump Loot Box</button>
      <button class="dlb-btn" id="dlb-collect" disabled>↑ Bump Again — Collect</button>
      <button class="dlb-btn" id="dlb-walk" disabled>↙ Walk Away</button>
      <button class="dlb-btn dlb-sec" id="dlb-reset">↺ Reset</button>
    </div>
    <div class="dlb-state-lbl" id="dlb-state-lbl">Snake carrying: 💰×2 &nbsp;🗡 &nbsp;🔑</div>
  </section>

  <hr class="dlb-separator">

  <!-- ─────────────── SECTION: In-game context ─────────────── -->
  <section style="margin-top:40px;">
    <div class="dlb-sec-lbl">In Context — Underlying Game Tiles</div>
    <p style="font-size:0.82rem;color:rgba(255,255,255,0.45);font-family:Arial,sans-serif;line-height:1.6;margin:0 0 16px;">
      The peek strip overlays the row directly above the loot box. Toggle it to see which game tiles sit underneath.
    </p>
    <div style="text-align:center">
      <div class="dlb-area">
        <div id="dlb-ctx-grid" style="display:grid;grid-template-columns:repeat(5,56px);grid-template-rows:repeat(5,56px);position:relative;background:green;">
          <!-- Row 0 -->
          <div class="dlb-tile">🌲</div><div class="dlb-tile">🌲</div><div class="dlb-tile">🪨</div><div class="dlb-tile">🌲</div><div class="dlb-tile">🌲</div>
          <!-- Row 1: peek strip slots (cols 1-3) — game tiles always present underneath -->
          <div class="dlb-tile">🌲</div>
          <div class="dlb-tile" id="dlb-ctx-p0">🌲</div>
          <div class="dlb-tile" id="dlb-ctx-p1"></div>
          <div class="dlb-tile" id="dlb-ctx-p2">🪨</div>
          <div class="dlb-tile">🌲</div>
          <!-- Row 2: loot box with gold and heart on flanks -->
          <div class="dlb-tile">💰</div><div class="dlb-tile"></div>
          <div class="dlb-tile dlb-loot-glow">📦</div>
          <div class="dlb-tile"></div><div class="dlb-tile">❤️</div>
          <!-- Row 3: player -->
          <div class="dlb-tile">🌲</div><div class="dlb-tile"></div>
          <div class="dlb-tile">🥷</div>
          <div class="dlb-tile"></div><div class="dlb-tile">🌲</div>
          <!-- Row 4 -->
          <div class="dlb-tile">🪨</div><div class="dlb-tile">🌲</div><div class="dlb-tile"></div><div class="dlb-tile">🌲</div><div class="dlb-tile">🪨</div>
        </div>
      </div>
    </div>
    <div class="dlb-btn-row">
      <button class="dlb-btn" id="dlb-ctx-toggle">↑ Bump Loot Box</button>
    </div>
    <div class="dlb-state-lbl" id="dlb-ctx-lbl">Game tiles visible under peek strip row — 🌲 empty 🪨</div>
  </section>

  <hr class="dlb-separator">

  <!-- ─────────────── SECTION 2: Stack badges ─────────────── -->
  <section style="margin-top:40px;">
    <div class="dlb-sec-lbl">Stacked Item Badges — All Contexts</div>
    <div style="margin-bottom:18px;">
      <div style="font-size:0.75rem;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;margin-bottom:12px;letter-spacing:0.04em;">GAME TILE &amp; PEEK STRIP</div>
      <div class="dlb-badge-row">
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile">💰<span class="dlb-badge">1</span></div>
          <div class="dlb-badge-cap">gold = 1<br>always shows</div>
        </div>
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile">💰<span class="dlb-badge">5</span></div>
          <div class="dlb-badge-cap">gold = 5</div>
        </div>
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile">💰<span class="dlb-badge">10</span></div>
          <div class="dlb-badge-cap">gold = 10</div>
        </div>
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile">💰<span class="dlb-badge">16</span></div>
          <div class="dlb-badge-cap">gold = 16<br>(merged)</div>
        </div>
      </div>
    </div>
    <div>
      <div style="font-size:0.75rem;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;margin-bottom:12px;letter-spacing:0.04em;">SAME BADGE ON PEEK STRIP TILE (DARKER BG)</div>
      <div class="dlb-badge-row">
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile dlb-peek-tile">💰<span class="dlb-badge">1</span></div>
          <div class="dlb-badge-cap">gold = 1<br>always shows</div>
        </div>
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile dlb-peek-tile">💰<span class="dlb-badge">15</span></div>
          <div class="dlb-badge-cap">gold = 15</div>
        </div>
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile dlb-peek-tile">🗡</div>
          <div class="dlb-badge-cap">count = 1<br>no badge</div>
        </div>
        <div class="dlb-badge-ex">
          <div class="dlb-ex-tile dlb-peek-tile">🔑</div>
          <div class="dlb-badge-cap">count = 1<br>no badge</div>
        </div>
      </div>
    </div>
  </section>

  <hr class="dlb-separator">

  <!-- ─────────────── SECTION 3: Collect notification ─────────────── -->
  <section style="margin-top:40px;">
    <div class="dlb-sec-lbl">Collect Notification — Badge Travels With Item</div>
    <p style="font-size:0.82rem;color:rgba(255,255,255,0.45);font-family:Arial,sans-serif;line-height:1.6;margin:0 0 16px;">
      The float-up notification that fires on collection carries the same value badge — so collecting 💰 worth 15 shows "15" in the notification just as it did in the peek strip.
    </p>
    <div style="text-align:center;margin-bottom:14px;">
      <div class="dlb-area">
        <div style="display:grid;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(2,56px);">
          <div class="dlb-tile"></div>
          <div class="dlb-tile dlb-peek-tile" id="dlb-notify-src">💰<span class="dlb-badge">2</span></div>
          <div class="dlb-tile"></div>
          <div class="dlb-tile"></div>
          <div class="dlb-tile">🥷</div>
          <div class="dlb-tile"></div>
        </div>
      </div>
    </div>
    <div class="dlb-btn-row">
      <button class="dlb-btn" id="dlb-notify-btn">▶ Play collect animation</button>
    </div>
  </section>

  <hr class="dlb-separator">

  <!-- ─────────────── SECTION 4: Top-row edge case ─────────────── -->
  <section style="margin-top:40px;">
    <div class="dlb-sec-lbl">Top-Row Edge Case — Strip Opens Below</div>
    <p style="font-size:0.82rem;color:rgba(255,255,255,0.45);font-family:Arial,sans-serif;line-height:1.6;margin:0 0 16px;">
      When the loot box is in the top row of the grid the peek strip has nowhere to go above it — so it opens below instead.
    </p>
    <div style="text-align:center;margin-bottom:8px;">
      <div class="dlb-area">
        <div id="dlb-top-grid" style="display:grid;grid-template-columns:repeat(5,56px);grid-template-rows:repeat(3,56px);background:green;">
          <!-- Row 0: loot box at col 2 -->
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <div class="dlb-tile dlb-loot-glow" id="dlb-top-box">📦</div>
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <!-- Row 1: peek strip below (cols 1-3) -->
          <div class="dlb-tile"></div>
          <div class="dlb-tile" id="dlb-top-p0"></div>
          <div class="dlb-tile" id="dlb-top-p1"></div>
          <div class="dlb-tile" id="dlb-top-p2"></div>
          <div class="dlb-tile"></div>
          <!-- Row 2: player below -->
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
          <div class="dlb-tile">🥷</div>
          <div class="dlb-tile"></div><div class="dlb-tile"></div>
        </div>
      </div>
    </div>
    <div class="dlb-btn-row">
      <button class="dlb-btn" id="dlb-top-toggle">Toggle Peek Strip</button>
    </div>
    <div class="dlb-state-lbl" id="dlb-top-lbl">Strip closed</div>
  </section>

  <hr class="dlb-separator">

  <!-- ─────────────── SECTION 5: Left/right edge cases ─────────────── -->
  <section style="margin-top:40px;">
    <div class="dlb-sec-lbl">Left / Right Edge Cases — Strip Shifts to Stay In Bounds</div>
    <p style="font-size:0.82rem;color:rgba(255,255,255,0.45);font-family:Arial,sans-serif;line-height:1.6;margin:0 0 20px;">
      When the loot box is at the left or right edge, the strip shifts so it stays fully within the grid — all items remain visible.
    </p>
    <div style="display:flex;gap:32px;justify-content:center;flex-wrap:wrap;align-items:flex-start;">

      <!-- Left edge -->
      <div>
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;text-align:center;margin-bottom:8px;letter-spacing:0.06em;">LOOT BOX AT LEFT EDGE</div>
        <div style="text-align:center">
          <div class="dlb-area">
            <div id="dlb-left-grid" style="display:grid;grid-template-columns:repeat(5,56px);grid-template-rows:repeat(4,56px);position:relative;background:green;">
              <!-- Row 0: peek strip cols 0-2 (shifted right — ideal -1,0,1 clamps to 0,1,2) -->
              <div class="dlb-tile" id="dlb-left-p0"></div>
              <div class="dlb-tile" id="dlb-left-p1"></div>
              <div class="dlb-tile" id="dlb-left-p2"></div>
              <div class="dlb-tile"></div><div class="dlb-tile"></div>
              <!-- Row 1: loot box at col 0 -->
              <div class="dlb-tile dlb-loot-glow">📦</div>
              <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
              <!-- Row 2: player -->
              <div class="dlb-tile">🥷</div>
              <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
              <!-- Row 3: empty -->
              <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
            </div>
          </div>
        </div>
        <div class="dlb-btn-row">
          <button class="dlb-btn" id="dlb-left-toggle">↑ Bump Loot Box</button>
        </div>
      </div>

      <!-- Right edge -->
      <div>
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;text-align:center;margin-bottom:8px;letter-spacing:0.06em;">LOOT BOX AT RIGHT EDGE</div>
        <div style="text-align:center">
          <div class="dlb-area">
            <div id="dlb-right-grid" style="display:grid;grid-template-columns:repeat(5,56px);grid-template-rows:repeat(4,56px);position:relative;background:green;">
              <!-- Row 0: peek strip cols 2-4 (shifted left — ideal 3,4,5 clamps to 2,3,4) -->
              <div class="dlb-tile"></div><div class="dlb-tile"></div>
              <div class="dlb-tile" id="dlb-right-p0"></div>
              <div class="dlb-tile" id="dlb-right-p1"></div>
              <div class="dlb-tile" id="dlb-right-p2"></div>
              <!-- Row 1: loot box at col 4 -->
              <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
              <div class="dlb-tile dlb-loot-glow">📦</div>
              <!-- Row 2: player -->
              <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
              <div class="dlb-tile">🥷</div>
              <!-- Row 3: empty -->
              <div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div><div class="dlb-tile"></div>
            </div>
          </div>
        </div>
        <div class="dlb-btn-row">
          <button class="dlb-btn" id="dlb-right-toggle">↑ Bump Loot Box</button>
        </div>
      </div>

    </div>
    <div class="dlb-state-lbl" id="dlb-edge-lbl">Strip shifts to keep all items on-screen</div>
  </section>
</div>
`,y=[{emoji:`💰`,count:2},{emoji:`🗡`,count:1},{emoji:`🔑`,count:1}];function b(e,t){return e+(t>1?`<span class="dlb-badge">${t}</span>`:``)}function x(e,t=`up`){y.forEach((n,r)=>{let i=e[r],a=document.createElement(`div`);a.className=`dlb-peek-clip`,a.dataset.dir=t;let o=document.createElement(`div`);o.className=`dlb-peek-overlay ${t===`up`?`dlb-reveal-up`:`dlb-reveal-down`}`,o.innerHTML=b(n.emoji,n.count),a.appendChild(o),i.appendChild(a)})}function S(e){e.forEach(e=>e.querySelector(`.dlb-peek-clip`)?.remove())}function C(e,t){let n=e.map(e=>{let t=e.querySelector(`.dlb-peek-clip`),n=t?.querySelector(`.dlb-peek-overlay`);return t&&n?{clip:t,overlay:n,dir:t.dataset.dir??`up`}:null}).filter(e=>e!==null);if(n.length===0){t&&t();return}n.forEach(({overlay:e,dir:r},i)=>{e.classList.remove(`dlb-reveal-up`,`dlb-reveal-down`),e.classList.add(r===`up`?`dlb-conceal-down`:`dlb-conceal-up`),i===n.length-1&&e.addEventListener(`animationend`,()=>{n.forEach(e=>e.clip.remove()),t&&t()},{once:!0})})}function w(e){let t=e.querySelector(`#dlb-grid`),n=e.querySelector(`#dlb-center`),r=[0,1,2].map(t=>e.querySelector(`#dlb-p${t}`)),i=e.querySelector(`#dlb-kill`),a=e.querySelector(`#dlb-bump`),o=e.querySelector(`#dlb-collect`),s=e.querySelector(`#dlb-walk`),c=e.querySelector(`#dlb-reset`),l=e.querySelector(`#dlb-state-lbl`);function u(e){i.disabled=e!==`alive`,a.disabled=e!==`loot`,o.disabled=e!==`peek`,s.disabled=e!==`peek`,e===`alive`?(n.innerHTML=`🐍`,n.className=`dlb-tile dlb-snake-glow`,S(r),l.textContent=`Snake carrying: 💰×2  🗡  🔑`):e===`loot`?(n.innerHTML=`📦`,n.className=`dlb-tile dlb-loot-glow`,S(r),l.textContent=`📦 Loot box placed — bump it to peek inside`):e===`peek`?(x(r),l.textContent=`👀 Peek strip open — bump again to collect, or walk away to close`):e===`collecting`?l.textContent=`✨ Collecting…`:e===`done`&&(n.innerHTML=``,n.className=`dlb-tile`,S(r),l.textContent=`✅ All items collected — reset to replay`)}function d(e,t,n){let r=document.createElement(`div`);r.className=`dlb-notify-el`,r.innerHTML=t,e.innerHTML=``,e.className=`dlb-tile`,e.appendChild(r),r.addEventListener(`animationend`,()=>{r.remove(),n&&n()},{once:!0})}function f(e,t,n){let r=e.getBoundingClientRect(),i=t.getBoundingClientRect(),a=document.createElement(`div`);a.className=`dlb-notify-free`,a.style.left=r.left-i.left+`px`,a.style.top=r.top-i.top+`px`,a.style.width=r.width+`px`,a.style.height=r.height+`px`,a.innerHTML=n,t.appendChild(a);let o=e.querySelector(`.dlb-peek-overlay`);o&&(o.innerHTML=``),a.addEventListener(`animationend`,()=>a.remove(),{once:!0})}function p(){u(`collecting`),i.disabled=a.disabled=o.disabled=s.disabled=!0,y.forEach((e,n)=>{setTimeout(()=>f(r[n],t,b(e.emoji,e.count)),n*120)}),setTimeout(()=>C(r),(y.length-1)*120),setTimeout(()=>d(n,`📦`,()=>u(`done`)),y.length*120)}i.addEventListener(`click`,()=>u(`loot`)),a.addEventListener(`click`,()=>u(`peek`)),o.addEventListener(`click`,()=>p()),s.addEventListener(`click`,()=>C(r,()=>u(`loot`))),c.addEventListener(`click`,()=>u(`alive`));let m=e.querySelector(`#dlb-notify-src`),h=e.querySelector(`#dlb-notify-btn`);h.addEventListener(`click`,()=>{h.disabled=!0;let e=document.createElement(`div`);e.className=`dlb-notify-el`,e.innerHTML=b(`💰`,2),m.innerHTML=``,m.appendChild(e),e.addEventListener(`animationend`,()=>{e.remove(),m.innerHTML=b(`💰`,2),h.disabled=!1},{once:!0})});let g=[0,1,2].map(t=>e.querySelector(`#dlb-ctx-p${t}`)),_=e.querySelector(`#dlb-ctx-toggle`),v=e.querySelector(`#dlb-ctx-lbl`),w=!1;_.addEventListener(`click`,()=>{w=!w,w?(x(g),_.textContent=`↙ Walk Away`,v.textContent=`Peek strip open — game tiles beneath are covered`):C(g,()=>{_.textContent=`↑ Bump Loot Box`,v.textContent=`Game tiles visible under peek strip row — 🌲 empty 🪨`})});let T=[0,1,2].map(t=>e.querySelector(`#dlb-top-p${t}`)),E=e.querySelector(`#dlb-top-toggle`),D=e.querySelector(`#dlb-top-lbl`),O=!1;E.addEventListener(`click`,()=>{O=!O,O?(x(T,`down`),D.textContent=`Strip open below — bump again to collect, or move to close`):C(T,()=>{D.textContent=`Strip closed`})});let k=[0,1,2].map(t=>e.querySelector(`#dlb-left-p${t}`)),A=[0,1,2].map(t=>e.querySelector(`#dlb-right-p${t}`)),j=e.querySelector(`#dlb-left-toggle`),M=e.querySelector(`#dlb-right-toggle`),N=e.querySelector(`#dlb-edge-lbl`),P=!1,F=!1;j.addEventListener(`click`,()=>{P=!P,P?(x(k),j.textContent=`↙ Walk Away`,N.textContent=`Left edge: strip shifted right — loot box at col 0, strip spans cols 0-2`):C(k,()=>{j.textContent=`↑ Bump Loot Box`,N.textContent=`Strip shifts to keep all items on-screen`})}),M.addEventListener(`click`,()=>{F=!F,F?(x(A),M.textContent=`↙ Walk Away`,N.textContent=`Right edge: strip shifted left — loot box at col 4, strip spans cols 2-4`):C(A,()=>{M.textContent=`↑ Bump Loot Box`,N.textContent=`Strip shifts to keep all items on-screen`})})}var T=`
<style>
  .doc-controls-wrap {
    background: #0a280a;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-controls-wrap h1 {
    color: #FFD700;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,215,0,0.2);
    padding-bottom: 8px;
    margin-bottom: 6px;
  }
  .doc-controls-wrap .ctrl-subtitle {
    color: rgba(255,255,255,0.35);
    font-size: 0.78rem;
    margin-bottom: 24px;
  }
  .ctrl-cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 520px;
    margin: 0 auto;
  }
  .ctrl-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 18px;
    padding: 22px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .ctrl-card-title { font-size: 1.05rem; font-weight: bold; color: #FFD700; letter-spacing: 0.04em; }
  .ctrl-card-desc { font-size: 0.78rem; color: #88cc88; text-align: center; line-height: 1.5; }
  .ctrl-indicator {
    font-size: 2rem;
    width: 54px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.35);
    border-radius: 10px;
    color: #FFD700;
    transition: transform 0.08s ease, background 0.08s ease;
  }
  .ctrl-indicator.flash { transform: scale(1.25); background: rgba(60,140,60,0.4); }
  .jmark {
    position: absolute;
    font-size: 13px;
    color: rgba(255,255,255,0.18);
    pointer-events: none;
    line-height: 1;
  }
  .jmark-n { top: 10px;    left: 50%; transform: translateX(-50%); }
  .jmark-s { bottom: 10px; left: 50%; transform: translateX(-50%); }
  .jmark-w { left: 10px;   top: 50%;  transform: translateY(-50%); }
  .jmark-e { right: 10px;  top: 50%;  transform: translateY(-50%); }
  /* ctrl-* button styles (styles.css not loaded in docs.html) */
  .doc-controls-wrap .ctrl-btn {
    width: 64px;
    height: 64px;
    box-sizing: border-box;
    background: rgba(15, 70, 15, 0.92);
    border: 2px solid #2d7a2d;
    border-radius: 12px;
    font-size: 22px;
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
  .doc-controls-wrap .ctrl-btn:active {
    background: rgba(50, 150, 50, 0.95);
    color: white;
    transform: scale(0.93);
  }
  .doc-controls-wrap .ctrl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .doc-controls-wrap .ctrl-arrow-left  { display: inline-block; transform: rotate(-90deg); line-height: 1; }
  .doc-controls-wrap .ctrl-arrow-right { display: inline-block; transform: rotate(90deg);  line-height: 1; }
  .doc-controls-wrap .ctrl-noop { background: transparent; pointer-events: none; }
  .doc-controls-wrap .ctrl-hub  { background: rgba(5,35,5,0.8); border: 2px solid rgba(45,122,45,0.35); border-radius: 50%; pointer-events: none; touch-action: manipulation; }
  .doc-controls-wrap .ctrl-cross {
    display: grid;
    grid-template-columns: repeat(3, 64px);
    grid-template-rows: repeat(3, 64px);
    gap: 4px;
    -webkit-tap-highlight-color: transparent;
  }
  .doc-controls-wrap .ctrl-invt {
    display: grid;
    grid-template-columns: repeat(3, 64px);
    grid-template-rows: repeat(2, 64px);
    gap: 4px;
    -webkit-tap-highlight-color: transparent;
  }
  .doc-controls-wrap .ctrl-btn.ctrl-btn--flash {
    background: rgba(50, 150, 50, 0.95);
    color: white;
  }
  .doc-controls-wrap .ctrl-linear { display: flex; gap: 4px; }
  .doc-controls-wrap .ctrl-linear-gap { width: 80px; flex-shrink: 0; }
  .doc-controls-wrap .ctrl-split { display: flex; align-items: center; gap: 96px; }
  .doc-controls-wrap .ctrl-split-vert  { display: flex; flex-direction: column; gap: 4px; }
  .doc-controls-wrap .ctrl-split-horiz { display: flex; flex-direction: row;    gap: 4px; }
</style>
<div class="doc-controls-wrap">
  <h1>🎮 Controls Preview</h1>
  <p class="ctrl-subtitle">Tap any control to test it live</p>
  <div class="ctrl-cards">
    <div class="ctrl-card">
      <div class="ctrl-card-title">D-Pad</div>
      <div class="ctrl-card-desc">3×3 grid, empty corners, hub in center.<br>Classic game controller layout — spatial mapping is immediately obvious.</div>
      <div class="ctrl-indicator" data-ind="cross">–</div>
      <div data-pad="cross"></div>
    </div>
    <div class="ctrl-card">
      <div class="ctrl-card-title">Arrow Keys</div>
      <div class="ctrl-card-desc">Mirrors the keyboard arrow key layout.<br>Up floats above, flanked by Left/Down/Right on the bottom row.</div>
      <div class="ctrl-indicator" data-ind="invt">–</div>
      <div data-pad="invt"></div>
    </div>
    <div class="ctrl-card">
      <div class="ctrl-card-title">Split Row</div>
      <div class="ctrl-card-desc">Left thumb: Left/Down. Right thumb: Up/Right.<br>Wide gap separates the two sides into distinct thumb zones.</div>
      <div class="ctrl-indicator" data-ind="linear">–</div>
      <div data-pad="linear"></div>
    </div>
    <div class="ctrl-card">
      <div class="ctrl-card-title">Thumbs</div>
      <div class="ctrl-card-desc">Left thumb: Up/Down (vertical). Right thumb: Left/Right (horizontal).<br>Each axis mapped to the thumb that controls it naturally.</div>
      <div class="ctrl-indicator" data-ind="split">–</div>
      <div data-pad="split"></div>
    </div>
    <div class="ctrl-card">
      <div class="ctrl-card-title">Thumbs Lefty</div>
      <div class="ctrl-card-desc">Mirrored for left-handed players. Left thumb: Left/Right. Right thumb: Up/Down.</div>
      <div class="ctrl-indicator" data-ind="split-lefty">–</div>
      <div data-pad="split-lefty"></div>
    </div>
  </div>
</div>
`;function E(e){let t={up:`▲`,down:`▼`,left:`◀`,right:`▶`};for(let n of[`cross`,`invt`,`linear`,`split`,`split-lefty`]){let r=e.querySelector(`[data-pad="${n}"]`),i=e.querySelector(`[data-ind="${n}"]`);s(n,r,e=>{i&&(i.textContent=t[e]??e,i.classList.add(`flash`),setTimeout(()=>i.classList.remove(`flash`),200))})}}var D=`
<style>
  .doc-animations-wrap {
    background: #0a280a;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-animations-wrap h1 {
    color: #FFD700;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,215,0,0.2);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  #docs-content .doc-animations-wrap h2 {
    color: #aada88;
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
    color: rgba(255,255,255,0.35);
    margin-bottom: 10px;
  }
  .doc-animations-wrap .preview-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .doc-animations-wrap .anim-preview-tile {
    width: 72px;
    height: 72px;
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    border: 1px solid #0f0f0f;
    border-radius: 4px;
  }
  @keyframes fireFlip {
    0%   { transform: scaleX(1); }
    50%  { transform: scaleX(-1); }
    100% { transform: scaleX(1); }
  }
  .doc-animations-wrap .anim-preview-tile.fire {
    animation: fireFlip calc(var(--fire-flip-ms) * 2ms) steps(1, end) infinite;
  }
  .doc-animations-wrap .control-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
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
    color: rgba(255,255,255,0.6);
    min-width: 80px;
  }
  .doc-animations-wrap input[type=range] {
    flex: 1;
    accent-color: #4caf50;
    height: 6px;
    cursor: pointer;
  }
  .doc-animations-wrap input[type=number] {
    width: 72px;
    padding: 6px 8px;
    background: rgba(10, 60, 10, 0.9);
    border: 1px solid #2d7a2d;
    border-radius: 8px;
    color: #eee;
    font-size: 0.9rem;
    font-family: Arial, sans-serif;
    text-align: right;
  }
  .doc-animations-wrap .unit-label {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.35);
    width: 20px;
  }
  .doc-animations-wrap .reset-btn {
    align-self: flex-start;
    padding: 6px 16px;
    background: rgba(30, 80, 30, 0.9);
    color: #ccffcc;
    border: 1px solid rgba(45, 122, 45, 0.6);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: Arial, sans-serif;
  }
  .doc-animations-wrap .reset-btn:hover { background: rgba(50, 110, 50, 0.9); }

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
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
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
    color: rgba(255,255,255,0.4);
  }
  .doc-animations-wrap .demo-stage {
    position: relative;
    display: flex;
    gap: 4px;
    overflow: visible;
  }
  .doc-animations-wrap .demo-tile {
    width: 56px;
    height: 56px;
    font-size: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
    border: 1px solid #1e3a1e;
    border-radius: 4px;
    line-height: 1;
  }
  .doc-animations-wrap .demo-btn {
    padding: 5px 18px;
    background: rgba(20, 70, 20, 0.9);
    color: #ccffcc;
    border: 1px solid rgba(45, 122, 45, 0.5);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    font-family: Arial, sans-serif;
    transition: background 0.1s;
  }
  .doc-animations-wrap .demo-btn:hover:not(:disabled) { background: rgba(40, 100, 40, 0.9); }
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
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .doc-animations-wrap .timing-table th {
    color: rgba(255,255,255,0.45);
    font-weight: normal;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .doc-animations-wrap .timing-table td:last-child {
    color: #8fc;
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
            <tr><td>Attack (lunge)</td><td>Player</td><td>170 ms</td></tr>
            <tr><td>Move (slide)</td><td>Enemy</td><td>110 ms</td></tr>
            <tr><td>Attack (lunge)</td><td>Enemy</td><td>150 ms</td></tr>
            <tr><td>Death dissolve</td><td>Enemy</td><td>160 ms</td></tr>
            <tr><td>Hit flash</td><td>Any</td><td>130 ms</td></tr>
            <tr><td>Attack anticipation pause</td><td>Enemy</td><td>220 ms</td></tr>
          </tbody>
        </table>
        <p style="font-size:0.78rem;color:rgba(255,255,255,0.35);margin:4px 0 0">
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
`;function O(e){let t=`fireFlipMs`,n=1e3,r=e.querySelector(`.doc-animations-wrap`),i=e.querySelector(`[data-anim="slider"]`),a=e.querySelector(`[data-anim="number"]`),o=e.querySelector(`[data-anim="reset"]`);function s(e){let o=Math.min(n,Math.max(50,e));localStorage.setItem(t,String(o)),r.style.setProperty(`--fire-flip-ms`,String(o)),i.value=String(o),a.value=String(o)}let c=localStorage.getItem(t);s(c?Math.min(n,Math.max(50,parseInt(c,10))):200),i.addEventListener(`input`,()=>s(parseInt(i.value,10))),a.addEventListener(`change`,()=>{let e=parseInt(a.value,10);isNaN(e)||s(e)}),o.addEventListener(`click`,()=>s(200));function l(e,t){let n=document.createElement(`div`);n.textContent=e;let r=t.offsetWidth,i=t.offsetHeight;return n.style.cssText=[`position:absolute`,`pointer-events:none`,`left:${t.offsetLeft}px`,`top:${t.offsetTop}px`,`width:${r}px`,`height:${i}px`,`font-size:${i*.8}px`,`line-height:${i}px`,`text-align:center`,`z-index:10`].join(`;`),n}function u(e,t,n,r){let i=t.offsetLeft,a=t.offsetTop,o=n.offsetLeft,s=n.offsetTop,c=t.offsetWidth,l=t.offsetHeight;for(let t of[{t:0,op:.65,dur:500},{t:1/3,op:.45,dur:370},{t:2/3,op:.25,dur:240}]){let n=document.createElement(`div`);n.textContent=r,n.style.cssText=[`position:absolute`,`pointer-events:none`,`left:${i+(o-i)*t.t}px`,`top:${a+(s-a)*t.t}px`,`width:${c}px`,`height:${l}px`,`font-size:${l*.8}px`,`line-height:${l}px`,`text-align:center`,`opacity:${t.op}`,`transition:opacity ${t.dur}ms ease-out, filter ${t.dur}ms ease-out`,`z-index:9`].join(`;`),e.appendChild(n),requestAnimationFrame(()=>{n.style.opacity=`0`,n.style.filter=`blur(5px)`}),setTimeout(()=>n.remove(),t.dur)}}function d(t,n){let r=e.querySelector(`[data-trigger="${t}"]`);r?.addEventListener(`click`,()=>{r.disabled||(r.disabled=!0,n(r))})}d(`slide`,t=>{let n=e.querySelector(`[data-demo="slide"]`),r=n.querySelector(`[data-role="src"]`),i=n.querySelector(`[data-role="dst"]`);i.style.color=`transparent`,u(n,r,i,`🥷`);let a=l(`🥷`,r);n.appendChild(a);let o=i.offsetLeft-r.offsetLeft,s=i.offsetTop-r.offsetTop;requestAnimationFrame(()=>{a.style.transition=`transform 90ms ease-out`,a.style.transform=`translate(${o}px,${s}px)`}),setTimeout(()=>{a.remove(),i.style.color=``,i.textContent=`🥷`,r.textContent=``,setTimeout(()=>{r.textContent=`🥷`,i.textContent=``,t.disabled=!1},700)},90)}),d(`lunge`,t=>{let n=e.querySelector(`[data-demo="lunge"]`),r=n.querySelector(`[data-role="src"]`),i=n.querySelector(`[data-role="dst"]`);u(n,r,r,`🥷`),r.style.color=`transparent`;let a=l(`🥷`,r);n.appendChild(a);let o=(i.offsetLeft-r.offsetLeft)*.45,s=(i.offsetTop-r.offsetTop)*.45;requestAnimationFrame(()=>{a.style.transition=`transform 85ms ease-out`,a.style.transform=`translate(${o}px,${s}px)`}),setTimeout(()=>{let e=l(`🐍`,i);e.style.animationDuration=`160ms`,e.style.animation=`docAnimDie 160ms ease-out forwards`,n.appendChild(e),i.textContent=``,a.style.transition=`transform 85ms ease-in`,a.style.transform=`translate(0,0)`,setTimeout(()=>{a.remove(),r.style.color=``,e.remove(),setTimeout(()=>{i.textContent=`🐍`,t.disabled=!1},600)},85)},85)}),d(`hit`,t=>{let n=e.querySelector(`[data-demo="hit"]`).querySelector(`[data-role="src"]`);n.style.animation=`docAnimHit 130ms ease-out`,setTimeout(()=>{n.style.animation=``,t.disabled=!1},130)}),d(`die`,t=>{let n=e.querySelector(`[data-demo="die"]`),r=n.querySelector(`[data-role="src"]`),i=l(`🐍`,r);i.style.animation=`docAnimDie 160ms ease-out forwards`,n.appendChild(i),r.textContent=``,setTimeout(()=>{i.remove(),setTimeout(()=>{r.textContent=`🐍`,t.disabled=!1},400)},160)})}var k=`
<style>
  .doc-cave-wrap {
    background: #111111;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-cave-wrap h1 {
    color: #cccccc;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .doc-cave-wrap .content {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .doc-cave-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 10px;
  }
  .doc-cave-wrap .info-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    overflow: hidden;
  }
  .doc-cave-wrap .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.82rem;
  }
  .doc-cave-wrap .info-row:last-child { border-bottom: none; }
  .doc-cave-wrap .info-row-label { color: rgba(255,255,255,0.6); }
  .doc-cave-wrap .info-row-value { color: #999999; font-weight: bold; font-variant-numeric: tabular-nums; }
  .doc-cave-wrap .info-row-value.accent { color: #cccccc; }
  .doc-cave-wrap .info-row-value.gold { color: #FFD700; }
  .doc-cave-wrap .info-row-note { color: rgba(255,255,255,0.28); font-size: 0.72rem; margin-left: 6px; font-weight: normal; }
  .doc-cave-wrap .concept-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .doc-cave-wrap .concept-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }
  .doc-cave-wrap .concept-icon { font-size: 1.8rem; line-height: 1; flex-shrink: 0; margin-top: 2px; }
  .doc-cave-wrap .concept-body { flex: 1; }
  .doc-cave-wrap .concept-title { font-size: 0.88rem; font-weight: bold; color: #ccc; margin-bottom: 4px; }
  .doc-cave-wrap .concept-desc { font-size: 0.78rem; color: rgba(255,255,255,0.5); line-height: 1.55; }
  .doc-cave-wrap .room-wrap {
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 20px;
  }
  .doc-cave-wrap .room-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 3px;
    max-width: 360px;
    margin: 0 auto;
  }
  .doc-cave-wrap .cell {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(18, 18, 18, 0.97);
    border-radius: 5px;
    font-size: clamp(0.7rem, 3vw, 1.1rem);
    border: 1px solid rgba(255,255,255,0.05);
  }
  .doc-cave-wrap .cell.entrance {
    background: rgba(60, 60, 60, 0.4);
    border-color: rgba(180, 180, 180, 0.2);
  }
  .doc-cave-wrap .cell.exit {
    background: rgba(70, 70, 70, 0.35);
    border-color: rgba(200, 200, 200, 0.25);
  }
  .doc-cave-wrap .cell.monster {
    background: rgba(200, 150, 0, 0.15);
    border-color: rgba(255, 200, 0, 0.3);
  }
  .doc-cave-wrap .cell.hole {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(150, 100, 200, 0.3);
  }
  .doc-cave-wrap .cell.fire {
    background: rgba(200, 60, 0, 0.25);
    border-color: rgba(255, 120, 0, 0.4);
  }
  .doc-cave-wrap .room-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
    justify-content: center;
  }
  .doc-cave-wrap .room-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.45);
  }
  .doc-cave-wrap .table-wrap {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.09);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .doc-cave-wrap table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }
  .doc-cave-wrap thead {
    background: rgba(0,0,0,0.4);
  }
  .doc-cave-wrap thead th {
    padding: 9px 10px;
    text-align: right;
    white-space: nowrap;
    font-size: 0.67rem;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .doc-cave-wrap thead th:first-child { text-align: center; }
  .doc-cave-wrap tbody tr {
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .doc-cave-wrap tbody tr:hover { background: rgba(255,255,255,0.03); }
  .doc-cave-wrap tbody td {
    padding: 9px 10px;
    text-align: right;
    color: #bbb;
    white-space: nowrap;
  }
  .doc-cave-wrap tbody td:first-child {
    text-align: center;
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
  }
  .doc-cave-wrap tbody td.em { color: #eee; }
  .doc-cave-wrap tbody td.gold { color: #FFD700; font-weight: bold; }
  .doc-cave-wrap tbody td.price { color: #ff9944; font-weight: bold; }
  .doc-cave-wrap tbody td.runs { color: #88aacc; }
  .doc-cave-wrap .note {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.32);
    line-height: 1.55;
    padding: 0 2px;
  }
  .doc-cave-wrap .note strong { color: rgba(255,255,255,0.5); }
  .doc-cave-wrap .checklist {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .doc-cave-wrap .check-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 9px 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.55);
  }
  .doc-cave-wrap .check-box {
    width: 16px;
    height: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .doc-cave-wrap .check-item.done { color: rgba(255,255,255,0.3); }
  .doc-cave-wrap .check-item.done .check-box {
    background: rgba(100, 200, 100, 0.3);
    border-color: rgba(100, 200, 100, 0.5);
  }
  .doc-cave-wrap code {
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
    padding: 1px 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
</style>
<div class="doc-cave-wrap">
  <h1>🪨 Cave Plan</h1>
  <div class="content">
    <section>
      <div class="section-label">Concept</div>
      <div class="concept-cards">
        <div class="concept-card">
          <div class="concept-icon">🪨</div>
          <div class="concept-body">
            <div class="concept-title">Gate Room — Between Every Level</div>
            <div class="concept-desc">After clearing each forest level (1–9), the ninja enters a cave gate room. It does not count as a level. There is no fighting — just a toll checkpoint. Pay enough gold across runs to open the door and advance.</div>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-icon">🤑</div>
          <div class="concept-body">
            <div class="concept-title">Money Monster — Bump to Pay</div>
            <div class="concept-desc">Walking into the money monster contributes 10g at a time from the ninja's current run gold toward the gate goal. Bump repeatedly to drain your gold into the gate. Once the goal is fully funded the door unlocks.</div>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-icon">🕳️</div>
          <div class="concept-body">
            <div class="concept-title">Hole — Only Way Out (by dying)</div>
            <div class="concept-desc">If the gate isn't fully paid, the only exit is the hole. Stepping into it kills the ninja and ends the run. Contributions made this visit are saved — progress toward the gate persists between runs.</div>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-icon">📊</div>
          <div class="concept-body">
            <div class="concept-title">One Gate at a Time</div>
            <div class="concept-desc">Only the current gate's contribution total needs to be tracked. Gates unlock sequentially — you can't skip ahead. Once a gate is paid it stays open forever; no re-payment on future runs.</div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="section-label">Run Flow</div>
      <div class="info-card">
        <div class="info-row">
          <span class="info-row-label">1. Enter cave</span>
          <span class="info-row-value accent">Spawn at bottom-middle with current run gold</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">2. Bump 🤑 monster</span>
          <span class="info-row-value accent">Each bump: −10g from run, +10g toward gate goal</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">3a. Gate fully funded</span>
          <span class="info-row-value gold">🤑 Monster dies — path to 🚪 door is clear; walk through</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">3b. Gold exhausted / give up</span>
          <span class="info-row-value" style="color:#cc7755">🕳️ Step into hole — die, progress saved</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Next run</span>
          <span class="info-row-value accent">Gate contribution total carries over; keep chipping away</span>
        </div>
      </div>
    </section>
    <section>
      <div class="section-label">Room Layout — 9 × 9</div>
      <div class="room-wrap">
        <div class="room-grid" data-cave="grid"></div>
        <div class="room-legend">
          <span class="room-legend-item">🚪 Exit door (blocked by monster)</span>
          <span class="room-legend-item">🔥 Impassable fire — flanking door</span>
          <span class="room-legend-item">🤑 Monster — dies when paid</span>
          <span class="room-legend-item">🕳️ Hole — exit by dying</span>
          <span class="room-legend-item">🥷 Player spawn</span>
        </div>
      </div>
    </section>
    <section>
      <div class="section-label">Gate Prices — formula: cumulative max gold × 5, rounded up to nearest 10</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cave</th>
              <th>After Lvl</th>
              <th>Before Lvl</th>
              <th>Max Cum. Gold</th>
              <th>Gate Price</th>
              <th>Min Runs</th>
            </tr>
          </thead>
          <tbody data-cave="tbody"></tbody>
        </table>
      </div>
      <p class="note" style="margin-top:10px">
        <strong>Max per level:</strong> 17g pickups + 25g snake kills = 42g. Cumulative max at level N = N × 42g.<br>
        <strong>Gate price:</strong> cumulative max × 5, rounded up to nearest 10.<br>
        <strong>Min runs</strong> to afford the gate = ceil(gate price / 42g per level-1 run if farming level 1).
      </p>
    </section>
    <section>
      <div class="section-label">Implementation</div>
      <div class="checklist">
        <div class="check-item">
          <div class="check-box"></div>
          <span>Add <code>caveGoldContributed</code> and <code>currentGate</code> (1–9) to save state — both persist across runs, survive death and new game. <code>currentGate</code> identifies which gate the contribution belongs to so it can't be misapplied on a future run</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>After each forest level (1–9), transition to cave room instead of next level directly — fade to black, then fade in to cave</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>Walking through cave door to next forest level — fade to black, then fade in to forest. Player position carries over from their forest exit position (same existing mechanic); persist that position through the cave so it's still available when the next forest level loads</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>Render cave: 9×9, cave-wall border, entrance (4,8), door (4,0), fire walls (3,0)+(5,0), monster (4,1), hole (4,4)</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>Monster bump: contribute <code>min(runGold, 10, remainingNeeded)</code> per bump — capped so you never overpay, and the last bump can be less than 10g if that's all you have or all that's left</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>When <code>caveGoldContributed</code> reaches gate price: monster dies (removed from grid), path to door is clear</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>Walking through door: advance to next forest level; reset <code>caveGoldContributed</code> to 0 for next gate</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>Hole interaction: kills player (same as existing death flow), contributions already saved</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>If re-entering a cave where gate was already paid this run (continue save): render monster as dead, door walkable</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>When a save exists (game in progress), show only <strong>Continue</strong> on the main menu — hide New Game so the player can't accidentally discard their run</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>Delete New Game+ entirely — remove the NG+ game mode, all directly connected features (MOAI tile, house/house key tiles, NG+ snake variant), and any NG+ sound effects and save state fields</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>On bump with gold: play kaChing sound; float 💰 notify above the ninja (player tile)</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>On bump with 0 gold: play "nuh-uh" sound; float 💲 notify above the money monster tile</span>
        </div>
        <div class="check-item">
          <div class="check-box"></div>
          <span>While in cave, swap inventory bar to <code>🚪{level} 🤑 {contributed}/{price}g</code>; stats bar unchanged — still shows <code>💰{runGold} ⏺️{moves} 🕥{timer}</code> (timer keeps running). Level shown is the one just completed — does not increment until the player walks through the door</span>
        </div>
      </div>
    </section>
  </div>
</div>
`;function A(e){let t=e.querySelector(`[data-cave="grid"]`);if(t)for(let e=0;e<9;e++)for(let n=0;n<9;n++){let r=document.createElement(`div`);e===0&&n===4?(r.className=`cell exit`,r.textContent=`🚪`):e===0&&(n===3||n===5)?(r.className=`cell fire`,r.textContent=`🔥`):e===8&&n===4?(r.className=`cell entrance`,r.textContent=`🥷`):e===1&&n===4?(r.className=`cell monster`,r.textContent=`🤑`):e===4&&n===4?(r.className=`cell hole`,r.textContent=`🕳️`):e===0||e===8||n===0||n===8?(r.className=`cell wall`,r.textContent=``):(r.className=`cell`,r.textContent=``),t.appendChild(r)}let n=e.querySelector(`[data-cave="tbody"]`);if(n){let e=0;for(let t=1;t<=9;t++){e+=42;let r=e*5,i=Math.ceil(r/10)*10,a=Math.ceil(i/42),o=document.createElement(`tr`);o.innerHTML=`<td>${t}</td><td class="em">${t}</td><td class="em">${t+1}</td><td class="gold">${e}g</td><td class="price">${i}g</td><td class="runs">${a}×</td>`,n.appendChild(o)}}}var j=`
<style>
  .doc-economy-wrap {
    background: #0a280a;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-economy-wrap h1 {
    color: #FFD700;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,215,0,0.2);
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
    color: rgba(255,255,255,0.35);
    margin-bottom: 10px;
  }
  .doc-economy-wrap .pickup-cards {
    display: flex;
    gap: 10px;
  }
  .doc-economy-wrap .pickup-card {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .doc-economy-wrap .pickup-card-emoji { font-size: 1.6rem; line-height: 1; }
  .doc-economy-wrap .pickup-card-count { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
  .doc-economy-wrap .pickup-card-gold { font-size: 1.4rem; font-weight: bold; color: #FFD700; line-height: 1; }
  .doc-economy-wrap .pickup-card-gold span { font-size: 0.8rem; color: rgba(255,255,255,0.35); font-weight: normal; }
  .doc-economy-wrap .pickup-card.total {
    border-color: rgba(255,215,0,0.25);
    background: rgba(255,215,0,0.06);
  }
  .doc-economy-wrap .pickup-card.total .pickup-card-gold { font-size: 1.8rem; }
  .doc-economy-wrap .info-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    overflow: hidden;
  }
  .doc-economy-wrap .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.82rem;
  }
  .doc-economy-wrap .info-row:last-child { border-bottom: none; }
  .doc-economy-wrap .info-row-label { color: rgba(255,255,255,0.6); }
  .doc-economy-wrap .info-row-value { color: #88cc88; font-weight: bold; font-variant-numeric: tabular-nums; }
  .doc-economy-wrap .info-row-value.gold { color: #FFD700; }
  .doc-economy-wrap .info-row-value.total { color: #FFD700; font-size: 1.1em; }
  .doc-economy-wrap .info-row-note { color: rgba(255,255,255,0.28); font-size: 0.72rem; margin-left: 6px; font-weight: normal; }
  .doc-economy-wrap .info-row.divider { background: rgba(255,215,0,0.05); border-top: 1px solid rgba(255,215,0,0.15); }
  .doc-economy-wrap .table-wrap {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.09);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .doc-economy-wrap table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }
  .doc-economy-wrap thead { background: rgba(0,0,0,0.4); }
  .doc-economy-wrap thead th {
    padding: 9px 10px;
    text-align: right;
    white-space: nowrap;
    font-size: 0.67rem;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .doc-economy-wrap thead th:first-child { text-align: center; }
  .doc-economy-wrap tbody tr { border-top: 1px solid rgba(255,255,255,0.05); }
  .doc-economy-wrap tbody tr:hover { background: rgba(255,255,255,0.03); }
  .doc-economy-wrap tbody td {
    padding: 9px 10px;
    text-align: right;
    color: #bbb;
    white-space: nowrap;
  }
  .doc-economy-wrap tbody td:first-child {
    text-align: center;
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
  }
  .doc-economy-wrap tbody td.em { color: #eee; }
  .doc-economy-wrap tbody td.gold { color: #FFD700; font-weight: bold; }
  .doc-economy-wrap tbody td.dimmed { color: rgba(255,255,255,0.28); }
  .doc-economy-wrap tbody tr.gate-row { background: rgba(255,215,0,0.07); border-top: 1px solid rgba(255,215,0,0.2); }
  .doc-economy-wrap .note {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.32);
    line-height: 1.55;
    padding: 0 2px;
  }
  .doc-economy-wrap .note strong { color: rgba(255,255,255,0.5); }
  .doc-economy-wrap .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .doc-economy-wrap .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 10px 14px;
    flex: 1;
    min-width: 100px;
  }
  .doc-economy-wrap .legend-emoji { font-size: 1.5rem; line-height: 1; }
  .doc-economy-wrap .legend-name { font-size: 0.75rem; color: rgba(255,255,255,0.4); flex: 1; }
  .doc-economy-wrap .legend-value { font-size: 1.05rem; font-weight: bold; color: #FFD700; }
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
        <div class="info-row">
          <span class="info-row-label"><strong>Subtotal — pickups + rock snakes</strong></span>
          <span class="info-row-value gold">50g</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">🪨 Hidden gem rock (cave)</span>
          <span class="info-row-value gold">+10g <span class="info-row-note">(1 × 💰<sup>10</sup>)</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">🐇 White rabbit</span>
          <span class="info-row-value gold">+40g</span>
        </div>
        <div class="info-row divider">
          <span class="info-row-label"><strong>Max per level — all sources</strong></span>
          <span class="info-row-value total">100g</span>
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
        Tree snakes grow each level but the snake-gold ceiling stays at <strong>25g</strong> — more snakes, same max. Add gem rock (💰<sup>10</sup>) + rabbit (40g) for a total max of <strong>100g</strong> per level.
      </p>
    </section>
    <section>
      <div class="section-label">Run Progression — Max Gold &amp; Gate Unlocks</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Run</th>
              <th>Max Lvl</th>
              <th>Gold / Run</th>
              <th>Total Gold</th>
              <th>Gate</th>
            </tr>
          </thead>
          <tbody data-eco="run-tbody"></tbody>
        </table>
      </div>
      <p class="note" style="margin-top:10px">
        Assumes max gold (100g) earned each level. Each run carries gold through all open gates —
        overflow from filling one gate rolls into the next.
        Highlighted rows are gate-unlock runs.
      </p>
    </section>
    <section>
      <div class="section-label">🪨 Cave Gate Prices — between each level</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cave</th>
              <th>After Lvl</th>
              <th>Before Lvl</th>
              <th>Max Cum. Gold</th>
              <th>Gate Price</th>
              <th>Min Runs</th>
              <th>Total Runs</th>
            </tr>
          </thead>
          <tbody data-eco="cave-tbody"></tbody>
        </table>
      </div>
      <p class="note" style="margin-top:10px">
        <strong>Formula:</strong> price = gate × (gate × 100g) × mult, where mult is ×1/×2/×4 for gates 1–3 and ×5 for gates 4–9.
        Each run contributing to gate N earns N × 100g (levels 1 through N), so <strong>Min Runs</strong> = price ÷ (N × 100g) = mult exactly.
        <strong>Total Runs</strong> = cumulative runs from game start needed to open all gates up to and including this one.
      </p>
    </section>
  </div>
</div>
`;function M(a){let o=a.querySelector(`[data-eco="legend"]`);o&&(o.innerHTML=[[`${r.display}<sup>${t}</sup>`,t,`Small gold`],[`${r.display}<sup>${n}</sup>`,n,`Gold`],[`${r.display}<sup>${i}</sup>`,i,`Large gold`]].map(([e,t,n])=>`<div class="legend-item"><span class="legend-emoji">${e}</span><span class="legend-name">${n}</span><span class="legend-value">${t}g</span></div>`).join(``));let s=5*t+2*n+1*i,c=i+40,l=s+5*n+c,u=a.querySelector(`[data-eco="gold-tbody"]`);if(u){let e=0;for(let t=1;t<=10;t++){let r=t-1,i=13+r,a=i,o=Math.min(5,i),c=Math.min(o,a)*n,l=s+c;e+=l;let d=t===10,f=document.createElement(`tr`);f.innerHTML=`<td>${t}${d?` 🏁`:``}</td><td class="em">${s}g</td><td>5</td><td>13</td><td class="${r>0?`em`:`dimmed`}">${r}</td><td>${i}</td><td>${o}</td><td class="gold">${c}g</td><td class="gold">${l}g</td><td class="gold">${e}g</td>`,u.appendChild(f)}}let d=a.querySelector(`[data-eco="run-tbody"]`);if(d){let t=Array.from({length:9},(t,n)=>e(n+1)),n=Array(9).fill(0),r=0,i=0;for(;n.some((e,n)=>e<t[n]);){i++;let e=0,a=null,o=0;for(let r=1;r<=10;r++){e+=l,o=r;let i=r-1;if(i>=9)break;if(n[i]<t[i]){let r=t[i]-n[i],o=Math.min(e,r);if(n[i]+=o,e-=o,n[i]>=t[i])a=i+1;else break}}let s=o*l;r+=s;let c=document.createElement(`tr`);a!==null&&c.classList.add(`gate-row`);let u=a===null?``:`🔓 Gate ${a}${a===9?` 🏁`:``}`;c.innerHTML=`<td>${i}</td><td>${o}${o===10?` 🏁`:``}</td><td class="em">${s}g</td><td class="gold">${r}g</td><td style="color:#ffd700">${u}</td>`,d.appendChild(c)}}let f=a.querySelector(`[data-eco="cave-tbody"]`);if(f){let t=0,n=0;for(let r=1;r<=9;r++){t+=l;let i=e(r),a=i/(r*l);n+=a;let o=document.createElement(`tr`);o.innerHTML=`<td>${r}</td><td class="em">${r}</td><td class="em">${r+1}</td><td class="gold">${t}g</td><td style="color:#ff9944;font-weight:bold">${i}g</td><td style="color:#88aacc">${a}×</td><td style="color:#aaaacc">${n}</td>`,f.appendChild(o)}}}var N=`
<style>
  .doc-mac-wrap {
    --bg: #f7f7f8;
    --surface: #ffffff;
    --border: #e4e4e7;
    --text: #18181b;
    --muted: #71717a;
    --accent: #6366f1;
    --accent-light: #eef2ff;
    --green: #16a34a;
    --green-light: #f0fdf4;
    --amber: #d97706;
    --amber-light: #fffbeb;
    --red: #dc2626;
    --code-bg: #1e1e2e;
    --code-text: #cdd6f4;
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
    color: var(--accent);
    margin-bottom: 8px;
  }
  .doc-mac-wrap .header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    color: var(--text);
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
    background: var(--accent);
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
    background: var(--accent);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .doc-mac-wrap .section-title { font-size: 1rem; font-weight: 700; flex: 1; }
  .doc-mac-wrap .badge {
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 99px;
    letter-spacing: 0.03em;
  }
  .doc-mac-wrap .badge-once { background: var(--accent-light); color: var(--accent); }
  .doc-mac-wrap .badge-each { background: var(--green-light); color: var(--green); }
  .doc-mac-wrap .card {
    background: var(--surface);
    border: 1px solid var(--border);
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
  .doc-mac-wrap .step:has(input:checked) { background: var(--green-light); }
  .doc-mac-wrap .step-check {
    margin-top: 2px;
    flex-shrink: 0;
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    transition: all 0.15s;
    background: white;
  }
  .doc-mac-wrap .step-check:checked { background: var(--green); border-color: var(--green); }
  .doc-mac-wrap .step-check:checked::after {
    content: "";
    position: absolute;
    left: 3px;
    top: 0px;
    width: 8px;
    height: 11px;
    border: 2px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg) scaleY(0.9);
  }
  .doc-mac-wrap .step-body { flex: 1; min-width: 0; }
  .doc-mac-wrap .step-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
  .doc-mac-wrap .step-check:checked ~ .step-body .step-title {
    text-decoration: line-through;
    color: var(--muted);
  }
  .doc-mac-wrap .step-desc { font-size: 0.83rem; color: var(--muted); margin-bottom: 8px; }
  .doc-mac-wrap .step-desc:last-child { margin-bottom: 0; }
  .doc-mac-wrap pre {
    background: var(--code-bg);
    color: var(--code-text);
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
    background: #f0f0f2;
    padding: 1px 5px;
    border-radius: 4px;
    color: #d63864;
  }
  .doc-mac-wrap pre code { background: none; color: inherit; padding: 0; font-size: inherit; }
  .doc-mac-wrap .note {
    display: flex;
    gap: 8px;
    background: var(--amber-light);
    border: 1px solid #fde68a;
    border-radius: 7px;
    padding: 9px 12px;
    font-size: 0.82rem;
    color: #78350f;
    margin: 8px 0 4px;
    line-height: 1.5;
  }
  .doc-mac-wrap .note-icon { flex-shrink: 0; font-size: 0.9rem; }
  .doc-mac-wrap .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .doc-mac-wrap table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .doc-mac-wrap thead { background: var(--bg); }
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
  .doc-mac-wrap td { padding: 10px 16px; border-bottom: 1px solid var(--border); }
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
`;function P(e){let t=e.querySelectorAll(`.step-check`),n=e.querySelector(`[data-mac="progress-bar"]`),r=e.querySelector(`[data-mac="progress-label"]`);function i(){let e=t.length,i=[...t].filter(e=>e.checked).length;n&&(n.style.width=i/e*100+`%`),r&&(r.textContent=i+` of `+e+` steps complete`)}t.forEach(e=>{let t=`ninjack-setup-`+e.id;e.checked=localStorage.getItem(t)===`true`,e.addEventListener(`change`,()=>{localStorage.setItem(t,String(e.checked)),i()})}),i()}var F=`
<style>
  .doc-soundboard-wrap {
    background: #0d0d1a;
    color: #eee;
    font-family: monospace;
    padding: 32px;
    min-height: 400px;
  }
  #docs-content .doc-soundboard-wrap h1 {
    color: #eee;
    font-size: 2rem;
    letter-spacing: 2px;
    border-bottom: none;
    margin-bottom: 8px;
  }
  .doc-soundboard-wrap .sb-sub {
    opacity: 0.5;
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  .doc-soundboard-wrap .sb-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    font-size: 0.85rem;
    opacity: 0.8;
  }
  .doc-soundboard-wrap .sb-slider-label { white-space: nowrap; }
  .doc-soundboard-wrap input[type=range] { flex: 1; accent-color: #888; }
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
</div>
`;function I(e){let t=null,n=null,r=null;fetch(`music/woods-of-linzor.mp3`).then(e=>e.arrayBuffer()).then(e=>{t=e}).catch(()=>{});let i=e.querySelector(`[data-sb="music-vol"]`),s=e.querySelector(`[data-sb="music-vol-label"]`);i.value=String(o),s.textContent=o.toFixed(2),i.addEventListener(`input`,()=>{let e=parseFloat(i.value);a.setMusicVolume(e),s.textContent=e.toFixed(2)});let c=e.querySelector(`[data-sb="sfx-vol"]`),l=e.querySelector(`[data-sb="sfx-vol-label"]`);c.value=`2.5`,l.textContent=`2.5`,c.addEventListener(`input`,()=>{let e=parseFloat(c.value);a.setSfxVolume(e),l.textContent=e.toFixed(1)});let u=e.querySelector(`[data-sb="music-btn"]`),d=!1,f=document.createElement(`button`);f.style.cssText=[`display:flex;flex-direction:column;align-items:center;justify-content:center;`,`gap:6px;padding:16px 8px;border:2px solid #555;border-radius:10px;`,`background:#1a1a2e;color:#eee;cursor:pointer;font-family:monospace;`,`font-size:0.8rem;transition:background 0.1s,border-color 0.1s;width:100%;margin-bottom:12px;`].join(``),f.innerHTML=`<span style="font-size:2rem;line-height:1">🎵</span><span>Woods of Linzor — Play</span>`,f.addEventListener(`click`,()=>{if(d)r&&=(r.stop(),null),d=!1,f.innerHTML=`<span style="font-size:2rem;line-height:1">🎵</span><span>Woods of Linzor — Play</span>`,f.style.borderColor=`#555`;else{let e=a.getCtx();function i(t){n=t,r=e.createBufferSource(),r.buffer=n,r.loop=!0,a.connectToMusicOutput(r),r.start(),d=!0,f.innerHTML=`<span style="font-size:2rem;line-height:1">🎵</span><span>Woods of Linzor — Stop</span>`,f.style.borderColor=`#aaa`}n?i(n):t&&e.decodeAudioData(t).then(i)}}),u.appendChild(f);let p=e.querySelector(`[data-sb="grid"]`);[{label:`Gold ×1`,emoji:`💰`,fn:()=>a.kaChing(1)},{label:`Gold ×5`,emoji:`💰`,fn:()=>a.kaChing(5)},{label:`Gold ×10`,emoji:`💰`,fn:()=>a.kaChing(10)},{label:`Ring`,emoji:`💍`,fn:()=>a.kaChing(20)},{label:`Sword Pickup`,emoji:`🗡`,fn:()=>a.shing()},{label:`Sword Hit`,emoji:`🗡`,fn:()=>a.swordHit()},{label:`Heart Pickup`,emoji:`❤️`,fn:()=>a.heartPickup()},{label:`Key Pickup`,emoji:`🔑`,fn:()=>a.keyPickup()},{label:`Snake Attack`,emoji:`🐍`,fn:()=>a.snakeAttack()},{label:`Player Hit`,emoji:`💔`,fn:()=>a.playerHit()},{label:`Enemy Death`,emoji:`💀`,fn:()=>a.enemyDeath()},{label:`Player Death`,emoji:`☠️`,fn:()=>a.playerDeath()},{label:`Secret Found`,emoji:`💎`,fn:()=>a.secretFound()},{label:`Rock Break`,emoji:`🪨`,fn:()=>a.rockBreak()},{label:`Tree Break`,emoji:`🌲`,fn:()=>a.treeBreak()},{label:`Door Unlock`,emoji:`🔐`,fn:()=>a.doorUnlock()},{label:`Door Locked`,emoji:`🔒`,fn:()=>a.doorLocked()},{label:`Level Complete`,emoji:`🚪`,fn:()=>a.levelComplete()},{label:`Win!`,emoji:`🏆`,fn:()=>a.win()},{label:`Final Boss`,emoji:`🪂`,fn:()=>a.finalBoss()},{label:`Chute Fall`,emoji:`🕳️`,fn:()=>a.chute()},{label:`Hole Death`,emoji:`💥`,fn:()=>a.holeDeath()},{label:`Footstep`,emoji:`👢`,fn:()=>a.footstep()},{label:`Nuh-Uh`,emoji:`💲`,fn:()=>a.nuhUh()},{label:`Rabbit Spawn`,emoji:`🐇`,fn:()=>a.rabbitSpawn()},{label:`Monster Sick`,emoji:`🤢`,fn:()=>a.monsterSick()},{label:`Monster Rage`,emoji:`👹`,fn:()=>a.monsterRage()}].forEach(({label:e,emoji:t,fn:n})=>{let r=document.createElement(`button`);r.style.cssText=[`display:flex;flex-direction:column;align-items:center;justify-content:center;`,`gap:6px;padding:16px 8px;border:1px solid #333;border-radius:10px;`,`background:#1a1a2e;color:#eee;cursor:pointer;font-family:monospace;`,`font-size:0.8rem;transition:background 0.1s,border-color 0.1s;`].join(``),r.innerHTML=`<span style="font-size:2rem;line-height:1">${t}</span><span>${e}</span>`,r.addEventListener(`click`,()=>{r.style.background=`#2a2a4e`,r.style.borderColor=`#666`,n(),setTimeout(()=>{r.style.background=`#1a1a2e`,r.style.borderColor=`#333`},200)}),p.appendChild(r)})}var L=`
<style>
  .doc-ghost-wrap {
    background: #0a280a;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 40px;
    min-height: 400px;
  }
  #docs-content .doc-ghost-wrap h1 {
    color: #FFD700;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,215,0,0.2);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
  .doc-ghost-wrap .ghost-intro {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.5);
    line-height: 1.55;
    margin-bottom: 20px;
  }
  .doc-ghost-wrap .ghost-intro strong { color: rgba(255,255,255,0.85); }

  /* ── Panels ── */
  .doc-ghost-wrap .ghost-panels {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .doc-ghost-wrap .ghost-panel {
    flex: 1 1 220px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.09);
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
    color: rgba(255,255,255,0.45);
  }
  .doc-ghost-wrap .ghost-panel.good .ghost-panel-title { color: #8fc; }
  .doc-ghost-wrap .ghost-panel-sub {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.25);
    text-align: center;
    margin-top: -6px;
  }
  .doc-ghost-wrap .ghost-panel.good .ghost-panel-sub { color: rgba(140,255,180,0.4); }

  /* ── Lock bar ── */
  .doc-ghost-wrap .lock-bar {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
  }
  .doc-ghost-wrap .lock-bar-fill {
    height: 100%;
    width: 0%;
    border-radius: 2px;
  }
  .doc-ghost-wrap .lock-bar-fill.red   { background: #e55; }
  .doc-ghost-wrap .lock-bar-fill.amber { background: #e92; }

  /* ── Grid ── */
  .doc-ghost-wrap .ghost-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 40px);
    gap: 2px;
    background: #2e4e2e;
    border: 2px solid #2e4e2e;
    border-radius: 5px;
  }
  .doc-ghost-wrap .ghost-tile {
    width: 40px;
    height: 40px;
    background: #0e1c0e;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    user-select: none;
    border-radius: 2px;
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
    color: #eee;
    line-height: 1;
    min-width: 28px;
    text-align: center;
  }
  .doc-ghost-wrap .ghost-stat-n.bad  { color: #f66; }
  .doc-ghost-wrap .ghost-stat-n.good { color: #6f6; }
  .doc-ghost-wrap .ghost-stat-l {
    font-size: 0.6rem;
    color: rgba(255,255,255,0.28);
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
  .doc-ghost-wrap .ghost-dpad {
    display: grid;
    grid-template-rows: repeat(3, 48px);
    gap: 4px;
  }
  .doc-ghost-wrap .ghost-dpad-row {
    display: grid;
    grid-template-columns: repeat(3, 48px);
    gap: 4px;
  }
  .doc-ghost-wrap .ghost-btn {
    width: 48px; height: 48px;
    background: rgba(15,70,15,0.9);
    border: 2px solid #2d7a2d;
    border-radius: 10px;
    color: #aaddaa; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; touch-action: manipulation; outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.08s;
  }
  .doc-ghost-wrap .ghost-btn:active { background: rgba(50,150,50,0.95); color: #fff; }
  .doc-ghost-wrap .ghost-btn-noop { background: transparent !important; border-color: transparent !important; pointer-events: none; }
  .doc-ghost-wrap .ghost-btn-hub {
    background: rgba(5,35,5,0.8); border: 2px solid rgba(45,122,45,0.25);
    border-radius: 50%; pointer-events: none; font-size: 20px;
    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
  }
  .doc-ghost-wrap .ghost-auto {
    display: flex; flex-direction: column; gap: 10px; min-width: 200px;
  }
  .doc-ghost-wrap .auto-row {
    display: flex; align-items: center; gap: 8px;
  }
  .doc-ghost-wrap .ghost-auto-btn {
    padding: 8px 14px;
    background: rgba(20,80,20,0.9);
    border: 1px solid rgba(45,122,45,0.6);
    border-radius: 8px; color: #ccffcc;
    font-size: 0.85rem; font-family: Arial, sans-serif;
    cursor: pointer; white-space: nowrap;
  }
  .doc-ghost-wrap .ghost-auto-btn:hover { background: rgba(40,100,40,0.9); }
  .doc-ghost-wrap .ghost-auto-btn.active {
    background: rgba(140,40,40,0.85);
    border-color: rgba(200,80,80,0.5); color: #ffcccc;
  }
  .doc-ghost-wrap .auto-ms-input {
    width: 60px; padding: 6px 8px;
    background: rgba(10,60,10,0.9);
    border: 1px solid #2d7a2d; border-radius: 7px;
    color: #eee; font-size: 0.88rem; font-family: Arial, sans-serif; text-align: right;
  }
  .doc-ghost-wrap .auto-unit { font-size: 0.78rem; color: rgba(255,255,255,0.35); }
  .doc-ghost-wrap .auto-note {
    font-size: 0.72rem; color: rgba(255,255,255,0.3); line-height: 1.55;
  }
  .doc-ghost-wrap .auto-note em { color: #ffa; font-style: normal; }
  .doc-ghost-wrap .ghost-reset-btn {
    align-self: flex-start; padding: 6px 14px;
    background: rgba(30,50,30,0.85);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; color: rgba(255,255,255,0.45);
    font-size: 0.8rem; font-family: Arial, sans-serif; cursor: pointer;
  }
  .doc-ghost-wrap .ghost-reset-btn:hover { color: #eee; }

  /* ── Demo cards ── */
  .doc-ghost-wrap .ghost-section-hd {
    font-size: 0.7rem; font-weight: bold;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin: 28px 0 12px; text-align: center;
  }
  .doc-ghost-wrap .ghost-demo-row {
    display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
  }
  .doc-ghost-wrap .ghost-demo-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 12px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 9px;
  }
  .doc-ghost-wrap .ghost-demo-card-title {
    font-size: 0.7rem; font-weight: bold;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(255,255,255,0.38);
  }
  .doc-ghost-wrap .ghost-demo-stage {
    position: relative; display: flex; gap: 4px;
  }
  .doc-ghost-wrap .ghost-demo-tile {
    width: 54px; height: 54px;
    background: #0e1c0e; border: 1px solid #2a4a2a;
    border-radius: 4px; font-size: 34px;
    display: flex; align-items: center; justify-content: center;
    line-height: 1; user-select: none;
  }
  .doc-ghost-wrap .ghost-demo-btn {
    padding: 5px 16px;
    background: rgba(20,80,20,0.9);
    border: 1px solid rgba(45,122,45,0.5);
    border-radius: 8px; color: #ccffcc;
    font-size: 0.78rem; font-family: Arial, sans-serif;
    cursor: pointer; transition: background 0.1s;
  }
  .doc-ghost-wrap .ghost-demo-btn:hover:not(:disabled) { background: rgba(40,100,40,0.9); }
  .doc-ghost-wrap .ghost-demo-btn:disabled { opacity: 0.4; cursor: default; }
  @keyframes ghostDemoAttackDie {
    0%   { opacity: 1; transform: scale(1); }
    30%  { opacity: 1; transform: scale(1.35); }
    100% { opacity: 0; transform: scale(0.5) rotate(14deg); }
  }
  @keyframes ghostDemoInteractShake {
    0%   { transform: scale(1); }
    20%  { transform: scale(1.3) rotate(-7deg); }
    50%  { transform: scale(1.1) rotate(4deg); }
    78%  { transform: scale(1.04) rotate(-2deg); }
    100% { transform: scale(1); }
  }
  .doc-ghost-wrap .ghost-demo-note {
    font-size: 0.72rem; color: rgba(255,255,255,0.24);
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
`;function R(e){let t={up:0,down:0,left:-1,right:1},n={up:-1,down:1,left:0,right:0},r=[`up`,`down`,`left`,`right`],i=e.querySelector(`[data-grid="blocking"]`),a=e.querySelector(`[data-grid="freerun"]`),o=e.querySelector(`[data-stat="b-moved"]`),s=e.querySelector(`[data-stat="b-dropped"]`),c=e.querySelector(`[data-stat="b-rate"]`),l=e.querySelector(`[data-stat="b-hits"]`),u=e.querySelector(`[data-stat="g-moved"]`),d=e.querySelector(`[data-stat="g-dropped"]`),f=e.querySelector(`[data-stat="g-rate"]`),p=e.querySelector(`[data-stat="g-hits"]`),m=e.querySelector(`#b-lock-fill`),h=e.querySelector(`#g-lock-fill`),g=[],_=[];for(let e=0;e<25;e++){let e=document.createElement(`div`);e.className=`ghost-tile`;let t=document.createElement(`div`);t.className=`ghost-tile`,g.push(e),i.appendChild(e),_.push(t),a.appendChild(t)}let v=2,y=2,b=4,x=4,S=!1,C=0,w=0,T=0,E=0,D=2,O=2,k=4,A=4,j=!1,M=0,N=0,P=0,F=0,I=new Set;function L(){for(let e of g)e.textContent=``;g[y*5+v].textContent=`🥷`,g[x*5+b].textContent=`🐍`}function R(){for(let e of _)e.textContent=``;let e=O*5+D,t=A*5+k;I.has(e)||(_[e].textContent=`🥷`),I.has(t)||(_[t].textContent=`🐍`)}function z(){o.textContent=String(w),s.textContent=String(C),l.textContent=String(T);let e=w+C;c.textContent=e>=5?`${Math.round(C/e*100)}%`:`—`}function B(){u.textContent=String(N),d.textContent=String(M),p.textContent=String(P);let e=N+M;f.textContent=e>=5?`${Math.round(M/e*100)}%`:`—`}function V(e,t,n,r){let i=n-e,a=r-t,o=e,s=t;return Math.abs(i)>=Math.abs(a)?o=e+Math.sign(i):s=t+Math.sign(a),o=Math.max(0,Math.min(4,o)),s=Math.max(0,Math.min(4,s)),{nx:o,ny:s,attack:o===n&&s===r}}function H(e,t,n,r,i){let a=document.createElement(`div`);return a.className=i,a.textContent=t,Object.assign(a.style,{position:`absolute`,pointerEvents:`none`,zIndex:`2`,left:`${n*42}px`,top:`${r*42}px`,width:`40px`,height:`40px`,fontSize:`26px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(a),a}function U(e,t){e.style.transition=`none`,e.style.width=`0%`,e.offsetWidth,e.style.transition=`width ${t}ms linear`,e.style.width=`100%`}function W(e){e.style.transition=`none`,e.style.width=`0%`}function G(e,t,n,r,i){let a=r*5+n;t[a].textContent=``;let o=H(e,i,n,r,`ghost-hit-flash-ov`);o.style.zIndex=`3`,setTimeout(()=>{o.remove(),t[a].textContent=i},150)}function ee(e){if(S){C++,z();return}let r=v+t[e],a=y+n[e];if(r<0||r>=5||a<0||a>=5||r===b&&a===x)return;let{nx:o,ny:s,attack:c}=V(b,x,r,a);S=!0,w++,z(),U(m,c?520:210);let l=v,u=y;g[y*5+v].textContent=``,v=r,y=a,g[y*5+v].textContent=``;let d=H(i,`🥷`,l,u,`b-ov`),f=++E;requestAnimationFrame(()=>{d.style.transition=`transform 90ms ease-out`,d.style.transform=`translate(${(v-l)*42}px,${(y-u)*42}px)`}),setTimeout(()=>{if(E===f)if(d.remove(),g[y*5+v].textContent=`🥷`,c){g[x*5+b].textContent=``;let e=H(i,`🐍`,b,x,`b-ov`),t=(v-b)*42*.45,n=(y-x)*42*.45;requestAnimationFrame(()=>{e.style.transition=`transform 140ms ease-out`,e.style.transform=`translate(${t}px,${n}px)`}),setTimeout(()=>{E===f&&(e.style.transition=`transform 140ms ease-in`,e.style.transform=`translate(0,0)`,setTimeout(()=>{E===f&&(e.remove(),g[x*5+b].textContent=`🐍`,G(i,g,v,y,`🥷`),T++,setTimeout(()=>{E===f&&(S=!1,W(m),z())},150))},140))},140)}else{let e=b,t=x;g[x*5+b].textContent=``,g[s*5+o].textContent=``,b=o,x=s;let n=H(i,`🐍`,e,t,`b-ov`);requestAnimationFrame(()=>{n.style.transition=`transform 120ms ease-out`,n.style.transform=`translate(${(b-e)*42}px,${(x-t)*42}px)`}),setTimeout(()=>{E===f&&(n.remove(),g[x*5+b].textContent=`🐍`,S=!1,W(m),z())},120)}},90)}function K(e,t,n,r,i,a,o){let s=a*5+i;I.add(s),_[s].textContent=``;let c=H(e,t,n,r,`g-ov`);requestAnimationFrame(()=>{c.style.transition=`transform ${o}ms ease-out`,c.style.transform=`translate(${(i-n)*42}px,${(a-r)*42}px)`}),setTimeout(()=>{c.remove(),I.delete(s),R()},o)}function te(e){if(j){M++,B();return}let r=D+t[e],i=O+n[e];if(r<0||r>=5||i<0||i>=5||r===k&&i===A)return;let{nx:o,ny:s,attack:c}=V(k,A,r,i),l=D,u=O,d=k,f=A;if(D=r,O=i,c||(k=o,A=s),N++,R(),B(),K(a,`🥷`,l,u,D,O,90),c){j=!0,U(h,430);let e=++F,t=A*5+k;I.add(t),_[t].textContent=``;let n=H(a,`🐍`,k,A,`g-ov`),r=(D-k)*42*.45,i=(O-A)*42*.45;requestAnimationFrame(()=>{n.style.transition=`transform 140ms ease-out`,n.style.transform=`translate(${r}px,${i}px)`}),setTimeout(()=>{F===e&&(n.style.transition=`transform 140ms ease-in`,n.style.transform=`translate(0,0)`,setTimeout(()=>{F===e&&(n.remove(),I.delete(t),R(),G(a,_,D,O,`🥷`),P++,setTimeout(()=>{F===e&&(j=!1,W(h),B())},150))},140))},140)}else K(a,`🐍`,d,f,k,A,120)}L(),z(),R(),B();function q(e){ee(e),te(e)}e.querySelectorAll(`[data-dir]`).forEach(e=>{e.addEventListener(`click`,()=>q(e.dataset.dir)),e.addEventListener(`touchstart`,t=>{t.preventDefault(),q(e.dataset.dir)},{passive:!1})});let J=e.querySelector(`#ghost-auto-btn`),Y=e.querySelector(`#ghost-auto-ms`),X=null,Z=!1,Q=0,$=[`right`,`right`,`down`,`down`,`left`,`left`,`up`,`up`];function ne(){X&&=(clearInterval(X),null),Z=!1,J.textContent=`▶ Auto`,J.classList.remove(`active`)}function re(){let e=Math.max(20,parseInt(Y.value,10)||80);Z=!0,J.textContent=`⏹ Stop`,J.classList.add(`active`),X=setInterval(()=>{q(Math.random()<.6?r[Math.floor(Math.random()*4)]:$[Q++%$.length])},e)}J.addEventListener(`click`,()=>{Z?ne():re()}),Y.addEventListener(`change`,()=>{Z&&(ne(),re())}),e.querySelector(`#ghost-reset`).addEventListener(`click`,()=>{ne(),E++,F++,I.clear(),v=2,y=2,b=4,x=4,S=!1,C=0,w=0,T=0,D=2,O=2,k=4,A=4,j=!1,M=0,N=0,P=0,Q=0,i.querySelectorAll(`.b-ov, .ghost-hit-flash-ov`).forEach(e=>e.remove()),a.querySelectorAll(`.g-ov, .ghost-hit-flash-ov`).forEach(e=>e.remove()),W(m),W(h),L(),z(),R(),B()});let ie={ArrowUp:`up`,ArrowDown:`down`,ArrowLeft:`left`,ArrowRight:`right`};function ae(t){if(!e.isConnected){document.removeEventListener(`keydown`,ae);return}let n=ie[t.key];n&&(t.preventDefault(),q(n))}document.addEventListener(`keydown`,ae);function oe(e,t,n,r,i,a){let o=t.offsetLeft,s=t.offsetTop,c=n.offsetLeft-o,l=n.offsetTop-s,u=document.createElement(`div`);u.textContent=r,Object.assign(u.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${o}px`,top:`${s}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(u),requestAnimationFrame(()=>{u.style.transition=`transform ${i}ms ease-out`,u.style.transform=`translate(${c}px,${l}px)`}),setTimeout(()=>{u.remove(),a()},i)}function se(e,t){let n=t.textContent||``;t.textContent=``;let r=document.createElement(`div`);r.className=`ghost-hit-flash-ov`,r.textContent=n,Object.assign(r.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${t.offsetLeft}px`,top:`${t.offsetTop}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(r),setTimeout(()=>{r.remove(),t.textContent=n},150)}function ce(e,t,n,r,i,a){let o=t.offsetLeft,s=t.offsetTop,c=(n.offsetLeft-o)*.45,l=(n.offsetTop-s)*.45,u=document.createElement(`div`);u.textContent=r,Object.assign(u.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${o}px`,top:`${s}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`}),e.appendChild(u),t.textContent=``,requestAnimationFrame(()=>{u.style.transition=`transform 140ms ease-out`,u.style.transform=`translate(${c}px,${l}px)`}),setTimeout(()=>{i(),u.style.transition=`transform 140ms ease-in`,u.style.transform=`translate(0,0)`,setTimeout(()=>{u.remove(),t.textContent=r,a()},140)},140)}{let t=e.querySelector(`[data-demo="slide"]`),n=e.querySelector(`[data-demo-btn="slide"]`),r=t.querySelector(`[data-role="src"]`),i=t.querySelector(`[data-role="dst"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,r.textContent=``,oe(t,r,i,`🥷`,90,()=>{i.textContent=`🥷`,setTimeout(()=>{r.textContent=`🥷`,i.textContent=``,n.disabled=!1},500)}))})}{let t=e.querySelector(`[data-demo="snake-slide"]`),n=e.querySelector(`[data-demo-btn="snake-slide"]`),r=t.querySelector(`[data-role="src"]`),i=t.querySelector(`[data-role="dst"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,r.textContent=``,oe(t,r,i,`🐍`,120,()=>{i.textContent=`🐍`,setTimeout(()=>{r.textContent=`🐍`,i.textContent=``,n.disabled=!1},500)}))})}{let t=e.querySelector(`[data-demo="attack"]`),n=e.querySelector(`[data-demo-btn="attack"]`),r=t.querySelector(`[data-role="player"]`),i=t.querySelector(`[data-role="enemy"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,ce(t,r,i,`🥷`,()=>{let e=document.createElement(`div`);e.textContent=`🐍`,Object.assign(e.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${i.offsetLeft}px`,top:`${i.offsetTop}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`,animation:`ghostDemoAttackDie 240ms ease-out forwards`}),t.appendChild(e),i.textContent=``,setTimeout(()=>{e.remove(),setTimeout(()=>{i.textContent=`🐍`},300)},240)},()=>{n.disabled=!1}))})}{let t=e.querySelector(`[data-demo="snake-attack"]`),n=e.querySelector(`[data-demo-btn="snake-attack"]`),r=t.querySelector(`[data-role="snake"]`),i=t.querySelector(`[data-role="player"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,ce(t,r,i,`🐍`,()=>{se(t,i)},()=>{setTimeout(()=>{n.disabled=!1},150)}))})}{let t=e.querySelector(`[data-demo="interact"]`),n=e.querySelector(`[data-demo-btn="interact"]`),r=t.querySelector(`[data-role="player"]`),i=t.querySelector(`[data-role="target"]`);n.addEventListener(`click`,()=>{n.disabled||(n.disabled=!0,ce(t,r,i,`🥷`,()=>{let e=document.createElement(`div`);e.textContent=`🌲`,Object.assign(e.style,{position:`absolute`,pointerEvents:`none`,zIndex:`3`,left:`${i.offsetLeft}px`,top:`${i.offsetTop}px`,width:`54px`,height:`54px`,fontSize:`34px`,lineHeight:`1`,display:`flex`,alignItems:`center`,justifyContent:`center`,transformOrigin:`center`,animation:`ghostDemoInteractShake 220ms ease-out forwards`}),i.textContent=``,t.appendChild(e),setTimeout(()=>{e.remove(),i.textContent=`🌲`},220)},()=>{n.disabled=!1}))})}}var z=`
<style>
  .shp-wrap {
    background: #0a280a;
    color: #eee;
    font-family: Arial, sans-serif;
    padding: 24px 16px 48px;
    min-height: 400px;
  }
  #docs-content .shp-wrap h1 {
    color: #FFD700;
    font-size: 1.4em;
    border-bottom: 1px solid rgba(255,215,0,0.2);
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .shp-wrap .content {
    max-width: 560px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .shp-wrap .section-label {
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 12px;
  }
  .shp-wrap p.shp-desc {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.6;
    margin: 0 0 16px;
  }

  /* ── Preview stage: mini board around the snake tile ── */
  .shp-area {
    background: forestgreen;
    display: inline-block;
    padding: 3px;
    border-radius: 3px;
  }
  .shp-grid {
    display: grid;
    grid-template-columns: repeat(3, 56px);
    grid-template-rows: repeat(3, 56px);
    position: relative;
  }
  .shp-tile {
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

  /* ── Health hearts, rendered above the entity's tile ── */
  .shp-hearts {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(calc(-50% + var(--shp-offset-x, 0px)), var(--shp-offset-y, -14px));
    font-size: var(--shp-heart-size, 14px);
    line-height: 1;
    pointer-events: none;
    z-index: 5;
    white-space: nowrap;
  }
  .shp-hb-wrapper { position: relative; display: inline-block; white-space: nowrap; }
  .shp-hb-full { position: absolute; left: 0; top: 0; height: 100%; overflow: hidden; white-space: nowrap; }

  /* ── Snake direction arrow, copied exactly from styles.css
     .tile[data-snake-dir]::after — for clash reference only ── */
  .shp-dir-arrow {
    display: none;
    position: absolute;
    font-size: 0.38em;
    line-height: 1;
    color: rgba(255, 220, 50, 0.88);
    pointer-events: none;
    z-index: 1;
  }
  .shp-dir-arrow.shp-visible { display: block; }
  .shp-dir-arrow[data-dir="up"]    { top: -3px;    left: 50%; transform: translateX(-50%) rotate(-90deg); }
  .shp-dir-arrow[data-dir="down"]  { bottom: -3px; left: 50%; transform: translateX(-50%) rotate(90deg); }
  .shp-dir-arrow[data-dir="left"]  { left: -3px;   top: 50%;  transform: translateY(-50%) rotate(180deg); }
  .shp-dir-arrow[data-dir="right"] { right: -3px;  top: 50%;  transform: translateY(-50%); }

  /* ── Controls ── */
  .shp-control-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .shp-control-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .shp-control-label {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    min-width: 110px;
  }
  .shp-wrap input[type=range] {
    flex: 1;
    accent-color: #4caf50;
    height: 6px;
    cursor: pointer;
  }
  .shp-wrap input[type=number] {
    width: 64px;
    padding: 6px 8px;
    background: rgba(10, 60, 10, 0.9);
    border: 1px solid #2d7a2d;
    border-radius: 8px;
    color: #eee;
    font-size: 0.9rem;
    font-family: Arial, sans-serif;
    text-align: right;
  }
  .shp-wrap .shp-unit {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.35);
    width: 20px;
  }
  .shp-wrap select {
    padding: 6px 8px;
    background: rgba(10, 60, 10, 0.9);
    border: 1px solid #2d7a2d;
    border-radius: 8px;
    color: #eee;
    font-size: 0.85rem;
    font-family: Arial, sans-serif;
  }
  .shp-btn-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .shp-btn {
    padding: 8px 18px;
    background: rgba(30,80,30,0.9);
    color: #ccffcc;
    border: 1px solid rgba(45,122,45,0.6);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: Arial, sans-serif;
    transition: background 0.1s;
  }
  .shp-btn:hover { background: rgba(50,110,50,0.9); }
  .shp-btn.shp-sec {
    background: rgba(15,45,15,0.9);
    color: rgba(200,255,200,0.5);
    border-color: rgba(45,122,45,0.25);
  }
  .shp-copy-lbl {
    font-size: 0.75rem;
    color: #8fc;
    min-height: 1.2em;
    align-self: center;
  }
  .shp-json {
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'Courier New', monospace;
    font-size: 0.78rem;
    color: #cde8cd;
    white-space: pre;
    overflow-x: auto;
  }

  /* ── Gallery of fixed health states ── */
  .shp-gallery-row {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .shp-gallery-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .shp-gallery-cap {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.4);
  }
</style>

<div class="shp-wrap">
  <h1>❤️ Snake Health Hearts</h1>

  <div class="content">

    <!-- ─────────────── Interactive preview ─────────────── -->
    <section>
      <div class="section-label">Live Preview</div>
      <p class="shp-desc">
        Tweak heart count, size, and position below. The center tile shows a snake at the
        "Preview Health" value; neighboring tiles are included so you can check for overlap
        with tiles above/beside it. Toggle the direction arrow and pick a side to check for a
        clash — it's the same ▸ indicator the game shows for a snake's next move, positioned and
        rotated exactly like styles.css does for each of the 4 directions.
      </p>
      <div style="text-align:center;margin-bottom:20px;">
        <div class="shp-area">
          <div class="shp-grid" id="shp-grid">
            <div class="shp-tile"></div><div class="shp-tile"></div><div class="shp-tile"></div>
            <div class="shp-tile"></div>
            <div class="shp-tile" id="shp-snake-tile">
              🐍
              <div class="shp-hearts" id="shp-hearts"></div>
              <div class="shp-dir-arrow" id="shp-dir-arrow" data-dir="up">▸</div>
            </div>
            <div class="shp-tile"></div>
            <div class="shp-tile"></div><div class="shp-tile"></div><div class="shp-tile"></div>
          </div>
        </div>
      </div>

      <div class="shp-control-card">
        <div class="shp-control-row">
          <span class="shp-control-label">Heart Count</span>
          <input type="range" id="shp-count-range" min="1" max="5" step="1">
          <input type="number" id="shp-count-number" min="1" max="5" step="1">
        </div>
        <div class="shp-control-row">
          <span class="shp-control-label">Preview Health</span>
          <input type="range" id="shp-health-range" min="0" max="5" step="0.5">
          <input type="number" id="shp-health-number" min="0" max="5" step="0.5">
        </div>
        <div class="shp-control-row">
          <span class="shp-control-label">Heart Size</span>
          <input type="range" id="shp-size-range" min="6" max="28" step="1">
          <input type="number" id="shp-size-number" min="6" max="28" step="1">
          <span class="shp-unit">px</span>
        </div>
        <div class="shp-control-row">
          <span class="shp-control-label">Offset Y (+down)</span>
          <input type="range" id="shp-offy-range" min="-40" max="40" step="1">
          <input type="number" id="shp-offy-number" min="-40" max="40" step="1">
          <span class="shp-unit">px</span>
        </div>
        <div class="shp-control-row">
          <span class="shp-control-label">Offset X</span>
          <input type="range" id="shp-offx-range" min="-20" max="20" step="1">
          <input type="number" id="shp-offx-number" min="-20" max="20" step="1">
          <span class="shp-unit">px</span>
        </div>
        <div class="shp-control-row">
          <span class="shp-control-label">Dir. Arrow</span>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:rgba(255,255,255,0.6);cursor:pointer;">
            <input type="checkbox" id="shp-arrow-toggle" checked>
            Show the real ▸ arrow (from styles.css) for clash reference
          </label>
          <select id="shp-dir-select">
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div class="shp-btn-row">
          <button class="shp-btn" id="shp-copy-btn">📋 Copy Settings as JSON</button>
          <button class="shp-btn shp-sec" id="shp-reset-btn">↺ Reset to Default</button>
          <span class="shp-copy-lbl" id="shp-copy-lbl"></span>
        </div>
      </div>

      <div class="shp-json" id="shp-json"></div>
    </section>

    <!-- ─────────────── Gallery of fixed states ─────────────── -->
    <section>
      <div class="section-label">Reference — Full / Half / Empty</div>
      <div class="shp-gallery-row" id="shp-gallery"></div>
    </section>

  </div>
</div>
`,B={heartCount:1,heartSize:8,offsetX:0,offsetY:0,previewHealth:1};function V(e,t,n){e.innerHTML=``;let r=document.createElement(`span`);r.className=`shp-hb-wrapper`;let i=document.createElement(`span`);i.textContent=`🤍`.repeat(t);let a=document.createElement(`span`);a.className=`shp-hb-full`,a.textContent=`❤️`.repeat(t);let o=t>0?Math.max(0,Math.min(1,n/t))*100:0;a.style.width=`${o}%`,r.appendChild(i),r.appendChild(a),e.appendChild(r)}function H(e){let t=e.querySelector(`#shp-grid`),n=e.querySelector(`#shp-hearts`),r=e.querySelector(`#shp-dir-arrow`),i=e.querySelector(`#shp-arrow-toggle`),a=e.querySelector(`#shp-dir-select`),o=e.querySelector(`#shp-count-range`),s=e.querySelector(`#shp-count-number`),c=e.querySelector(`#shp-health-range`),l=e.querySelector(`#shp-health-number`),u=e.querySelector(`#shp-size-range`),d=e.querySelector(`#shp-size-number`),f=e.querySelector(`#shp-offy-range`),p=e.querySelector(`#shp-offy-number`),m=e.querySelector(`#shp-offx-range`),h=e.querySelector(`#shp-offx-number`),g=e.querySelector(`#shp-copy-btn`),_=e.querySelector(`#shp-reset-btn`),v=e.querySelector(`#shp-copy-lbl`),y=e.querySelector(`#shp-json`),b=e.querySelector(`#shp-gallery`),x={...B};function S(){return JSON.stringify(x,null,2)}function C(){b.innerHTML=``;let e=[{label:`Full`,health:x.heartCount},{label:`Half`,health:x.heartCount/2},{label:`Empty`,health:0}];for(let{label:t,health:n}of e){let e=document.createElement(`div`);e.className=`shp-gallery-item`;let r=document.createElement(`div`);r.className=`shp-tile`,r.style.position=`relative`,r.textContent=`🐍`;let i=document.createElement(`div`);i.className=`shp-hearts`,r.appendChild(i),V(i,x.heartCount,n);let a=document.createElement(`div`);a.className=`shp-gallery-cap`,a.textContent=`${t} (${n})`,e.appendChild(r),e.appendChild(a),b.appendChild(e)}}function w(){t.style.setProperty(`--shp-heart-size`,`${x.heartSize}px`),t.style.setProperty(`--shp-offset-y`,`${x.offsetY}px`),t.style.setProperty(`--shp-offset-x`,`${x.offsetX}px`),V(n,x.heartCount,x.previewHealth),o.value=s.value=String(x.heartCount),c.max=l.max=String(x.heartCount),c.value=l.value=String(x.previewHealth),u.value=d.value=String(x.heartSize),f.value=p.value=String(x.offsetY),m.value=h.value=String(x.offsetX),y.textContent=S(),C()}function T(e,t,n){let r=e=>{let t=Number(e);Number.isNaN(t)||(n(t),w())};e.addEventListener(`input`,()=>r(e.value)),t.addEventListener(`input`,()=>r(t.value))}T(o,s,e=>{x.heartCount=Math.max(1,Math.min(5,Math.round(e))),x.previewHealth=Math.min(x.previewHealth,x.heartCount)}),T(c,l,e=>{x.previewHealth=Math.max(0,Math.min(x.heartCount,e))}),T(u,d,e=>{x.heartSize=Math.max(6,Math.min(28,e))}),T(f,p,e=>{x.offsetY=Math.max(-40,Math.min(40,e))}),T(m,h,e=>{x.offsetX=Math.max(-20,Math.min(20,e))});let E;g.addEventListener(`click`,async()=>{let e=S();try{await navigator.clipboard.writeText(e),v.textContent=`✅ Copied to clipboard!`}catch{v.textContent=`⚠️ Clipboard blocked — copy the JSON below manually`}E&&clearTimeout(E),E=setTimeout(()=>{v.textContent=``},2200)}),_.addEventListener(`click`,()=>{x={...B},w()}),r.classList.toggle(`shp-visible`,i.checked),i.addEventListener(`change`,()=>{r.classList.toggle(`shp-visible`,i.checked)}),r.dataset.dir=a.value,a.addEventListener(`change`,()=>{r.dataset.dir=a.value}),w()}var U=[{id:`overview`,title:`Overview`,category:`Getting Started`,kind:`markdown`,content:c},{id:`dev-guide`,title:`Dev Guide`,category:`Getting Started`,kind:`markdown`,content:l},{id:`game-design`,title:`Game Design`,category:`Design`,kind:`markdown`,content:u},{id:`snake-inventory`,title:`Snake Inventory & Loot Box`,category:`Design`,kind:`markdown`,content:_},{id:`loot-box-ui`,title:`Loot Box UI Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive prototype of the loot box peek strip — full flow, stacked badges, collect animations, and edge cases.`,html:v,setup:w},{id:`cave-plan`,title:`Cave Plan`,category:`Interactive Tools`,kind:`interactive`,description:`Visual design doc for the cave/gate progression system with room layout and concept cards.`,html:k,setup:A},{id:`economy`,title:`Economy Dashboard`,category:`Interactive Tools`,kind:`interactive`,description:`Live calculations for item values, level-by-level gold totals, and cave gate pricing.`,html:j,setup:M},{id:`controls`,title:`Controls`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive preview of all 6 control layouts with live tap feedback.`,html:T,setup:E},{id:`animations`,title:`Animations`,category:`Interactive Tools`,kind:`interactive`,description:`Fire tile animation timing tuner — adjust the CSS variable live with a slider.`,html:D,setup:O},{id:`ghost-anim`,title:`Ghost Movement Prototype`,category:`Interactive Tools`,kind:`interactive`,description:`Side-by-side comparison of current blocking slide vs ghost fire-and-forget — shows drop rate difference. Includes attack and interact ghost demos.`,html:L,setup:R},{id:`soundboard`,title:`Soundboard`,category:`Interactive Tools`,kind:`interactive`,description:`Interactive preview of all game sound effects and music. Click any button to play.`,html:F,setup:I},{id:`snake-health`,title:`Snake Health Hearts`,category:`Interactive Tools`,kind:`interactive`,description:`Tune the mini health-hearts display shown above a snake’s head — count, size, and position — then copy the settings as JSON.`,html:z,setup:H},{id:`firebase-config`,title:`Firebase Config Spec`,category:`Architecture`,kind:`markdown`,content:g},{id:`capacitor-plan`,title:`Capacitor Plan`,category:`Release & Deploy`,kind:`markdown`,content:d},{id:`release`,title:`Release Process`,category:`Release & Deploy`,kind:`markdown`,content:f},{id:`mac-setup`,title:`macOS Setup`,category:`Release & Deploy`,kind:`interactive`,description:`Step-by-step interactive checklist for setting up the macOS / iOS Capacitor development environment.`,html:N,setup:P},{id:`screenshots`,title:`Screenshots`,category:`Release & Deploy`,kind:`markdown`,content:p},{id:`bugs`,title:`Bug Log`,category:`Reference`,kind:`markdown`,content:m},{id:`links`,title:`Links`,category:`Reference`,kind:`markdown`,content:h}];function W(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function G(e){let t=W(e);return t=t.replace(/`([^`]+)`/g,`<code>$1</code>`),t=t.replace(/\*\*([^*\n]+)\*\*/g,`<strong>$1</strong>`),t=t.replace(/\*([^*\n]+)\*/g,`<em>$1</em>`),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,`<a href="$2" target="_blank" rel="noopener">$1</a>`),t}function ee(e){let t=`<div class="table-wrap"><table>`,n=!1;for(let r of e){let e=r.split(`|`).slice(1,-1).map(e=>e.trim());if(e.every(e=>/^[-: ]+$/.test(e))){n=!0;continue}let i=n?`td`:`th`;t+=`<tr>`+e.map(e=>`<${i}>${G(e)}</${i}>`).join(``)+`</tr>`}return t+=`</table></div>`,t}function K(e){let t=e.split(`
`),n=``,r=!1,i=``,a=[],o=!1,s=[],c=null,l=()=>{c&&=(n+=`</${c}>`,null)},u=()=>{o&&(n+=ee(s),o=!1,s=[])};for(let e of t){if(r){if(e.trimStart().startsWith("```")){let e=a.join(`
`).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);n+=`<pre><code class="lang-${W(i)}">${e}</code></pre>`,r=!1,a=[],i=``}else a.push(e);continue}let t=e.match(/^```(\w*)/);if(t){l(),u(),r=!0,i=t[1]||``;continue}if(e.startsWith(`|`)){l(),o||=!0,s.push(e);continue}if(o&&u(),/^[-*_]{3,}$/.test(e.trim())){l(),n+=`<hr>`;continue}let d=e.match(/^(#{1,3}) (.+)/);if(d){l();let e=d[1].length,t=d[2].toLowerCase().replace(/[^\w\s-]/g,``).replace(/\s+/g,`-`).replace(/-+/g,`-`);n+=`<h${e} id="${t}">${G(d[2])}</h${e}>`;continue}let f=e.match(/^\s*[-*+] (.+)/);if(f){c!==`ul`&&(l(),n+=`<ul>`,c=`ul`),n+=`<li>${G(f[1])}</li>`;continue}let p=e.match(/^\s*\d+\. (.+)/);if(p){c!==`ol`&&(l(),n+=`<ol>`,c=`ol`),n+=`<li>${G(p[1])}</li>`;continue}let m=e.match(/^> (.+)/);if(m){l(),n+=`<blockquote><p>${G(m[1])}</p></blockquote>`;continue}if(e.trim()===``){l();continue}l(),n+=`<p>${G(e)}</p>`}if(l(),u(),r){let e=a.join(`
`).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);n+=`<pre><code>${e}</code></pre>`}return n}var te=[...new Set(U.map(e=>e.category))];function q(e=``){let t=document.getElementById(`docs-nav`);t.innerHTML=``;let n=e.toLowerCase().trim();for(let e of te){let r=U.filter(t=>t.category===e),i=n?r.filter(e=>e.title.toLowerCase().includes(n)?!0:e.kind===`markdown`?e.content.toLowerCase().includes(n):e.description.toLowerCase().includes(n)):r;if(i.length===0)continue;let a=document.createElement(`div`);a.className=`nav-category`,a.textContent=e,t.appendChild(a);for(let e of i){let n=document.createElement(`button`);n.className=`nav-item`,n.textContent=e.title,n.dataset.id=e.id,n.addEventListener(`click`,()=>X(e.id)),t.appendChild(n)}}}function J(e){document.querySelectorAll(`.nav-item`).forEach(t=>{t.classList.toggle(`active`,t.dataset.id===e)})}function Y(e){let t=U.find(t=>t.id===e),n=document.getElementById(`docs-content`);if(!t){n.innerHTML=`<p>Document not found.</p>`;return}t.kind===`markdown`?n.innerHTML=K(t.content):t.kind===`interactive`?(n.innerHTML=t.html,t.setup(n)):n.innerHTML=`
      <h1>${W(t.title)}</h1>
      <div class="doc-link-card">
        <p>${W(t.description)}</p>
        <a href="${W(t.href)}" class="doc-link-btn">${W(t.linkLabel)} →</a>
      </div>
    `,document.getElementById(`docs-main`).scrollTop=0}function X(e){history.pushState(null,``,`#${e}`),Y(e),J(e)}function Z(){let e=document.getElementById(`sidebar-toggle`),t=document.getElementById(`docs-sidebar`);e.addEventListener(`click`,()=>{let n=t.classList.toggle(`collapsed`);e.innerHTML=n?`&#8250;`:`&#8249;`,e.title=n?`Expand sidebar`:`Collapse sidebar`})}function Q(){let e=document.getElementById(`theme-toggle`);localStorage.getItem(`docsTheme`)===`dark`&&(document.body.classList.add(`dark`),e.textContent=`☀️`,e.title=`Switch to light mode`),e.addEventListener(`click`,()=>{let t=document.body.classList.toggle(`dark`);e.textContent=t?`☀️`:`🌙`,e.title=t?`Switch to light mode`:`Switch to dark mode`,localStorage.setItem(`docsTheme`,t?`dark`:`light`)})}q(),Z(),Q();var $=location.hash.slice(1)||U[0].id;Y($),J($),window.addEventListener(`popstate`,()=>{let e=location.hash.slice(1)||U[0].id;Y(e),J(e)}),document.getElementById(`docs-search`).addEventListener(`input`,function(){q(this.value),J(location.hash.slice(1)||U[0].id)});