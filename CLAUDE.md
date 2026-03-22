# Ninjack – Development Notes

## Cache Busting (REQUIRED after every change)

After modifying any asset, increment its version query parameter in `index.html`:

| File | Tag in index.html |
|---|---|
| `scripts/app.js` | `<script src="scripts/app.js?v=N">` |
| `styles/styles.css` | `<link rel="stylesheet" href="styles/styles.css?v=N">` |

**Current versions:**
- `app.js`: v11
- `styles.css`: v4

Bump the version every time you make changes to the file, even minor ones.
