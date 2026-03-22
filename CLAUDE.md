# Ninjack – Development Notes

## Cache Busting (REQUIRED after every change)

After modifying any asset, increment its version query parameter in `index.html`:

| File | Tag in index.html |
|---|---|
| `scripts/constants.js` | `<script src="scripts/constants.js?v=N">` |
| `scripts/state.js` | `<script src="scripts/state.js?v=N">` |
| `scripts/timer.js` | `<script src="scripts/timer.js?v=N">` |
| `scripts/tileUtils.js` | `<script src="scripts/tileUtils.js?v=N">` |
| `scripts/ui.js` | `<script src="scripts/ui.js?v=N">` |
| `scripts/worldGen.js` | `<script src="scripts/worldGen.js?v=N">` |
| `scripts/snake.js` | `<script src="scripts/snake.js?v=N">` |
| `scripts/save.js` | `<script src="scripts/save.js?v=N">` |
| `scripts/game.js` | `<script src="scripts/game.js?v=N">` |
| `scripts/player.js` | `<script src="scripts/player.js?v=N">` |
| `scripts/menu.js` | `<script src="scripts/menu.js?v=N">` |
| `scripts/main.js` | `<script src="scripts/main.js?v=N">` |
| `styles/styles.css` | `<link rel="stylesheet" href="styles/styles.css?v=N">` |

**Current versions:**
- `constants.js`: v2
- `state.js`: v5
- `timer.js`: v2
- `tileUtils.js`: v3
- `ui.js`: v3
- `worldGen.js`: v8
- `snake.js`: v3
- `save.js`: v9
- `game.js`: v10
- `player.js`: v7
- `menu.js`: v11
- `main.js`: v12
- `styles.css`: v12

Bump the version every time you make changes to the file, even minor ones.
