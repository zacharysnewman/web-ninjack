# Ninjack

A browser-based roguelike played on a 9×9 grid. You're a 🥷 ninja navigating a world of hidden loot, roaming snakes, and 10 increasingly dangerous levels.

## How to Play

Move by tapping/clicking the directional buttons or using arrow keys. Every move counts — bumping into a tile interacts with it.

| Tile | What happens |
|------|-------------|
| 🌲 Tree | Reveals hidden loot (🗡 sword, 💰 gold, 💎 gem, 🐍 snake, 🔑 key, 🚪 door, or empty) |
| 🪨 Rock | Reveals hidden loot (🐍 snake or ❤️ heart) |
| 🐍 Snake | Walking into one costs you 1 ❤️; it walking into you costs you 1 ❤️; you attacking it costs 1 🗡 sword (or 1 ❤️ if no sword) |
| 🗡 Sword | Pick it up; used automatically when you attack a 🐍 snake |
| 🚪 Door | Requires a 🔑 key to unlock, then walk through to advance |
| 🕳️ Hole | Instant death |
| 🪙 / 💰 / 💎 | Gold pickups worth 1 / 5 / 10 gold |
| ❤️ Heart | Restores 1 health (max 5) |

## Objective

Survive 10 levels. Each level: clear 🌲 trees to find a 🔑 key, unlock the 🚪 door, and walk through.

## Loot System

Loot tables are pre-generated each level using a Fisher-Yates shuffle — no pure RNG mid-game.

- **🌲 Trees**: Contains 🐍 snakes (count scales +1 per level), 🗡 swords, 💰 gold bags, 💎 gems, 🔑 key, 🚪 door, and empty tiles.
- **🪨 Rocks** (15 per level): Exactly 2 ❤️ hearts + 13 🐍 snakes, shuffled.
- **🐍 Snake kills** (🗡 sword required): Exactly 2 ❤️ hearts + rest 💰 gold, shuffled across all snakes for the level.

## Saving

Progress is auto-saved to `localStorage` after every move, with a SHA-256 integrity hash to prevent tampering.
