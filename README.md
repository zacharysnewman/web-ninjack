# Ninjack

A browser-based roguelike played on a 9×9 grid. You're a ninja navigating a world of hidden loot, roaming snakes, and 10 increasingly dangerous levels.

## How to Play

Move by tapping/clicking the directional buttons or using arrow keys. Every move counts — bumping into a tile interacts with it.

| Tile | What happens |
|------|-------------|
| 🌲 Tree | Reveals hidden loot (sword, gold, gem, snake, key, door, or empty) |
| 🪨 Rock | Reveals hidden loot (snake or ❤️ heart) |
| 🐍 Snake | Damages you (costs 1 ❤️), unless you have a 🗡 sword |
| 🗡 Sword | Pick it up; used automatically on the next snake encounter |
| 🚪 Door | Requires a 🔑 key to unlock, then walk through to advance |
| 🕳️ Hole | Instant death — unless you have a 🪂 chute |
| 🪙 / 💰 / 💎 | Gold pickups worth 1 / 5 / 10 gold |
| ❤️ Heart | Restores 1 health (max 5) |

## Objective

Survive 10 levels. Each level: clear trees to find a 🔑 key, unlock the 🚪 door, and walk through. On level 10, find the 🪂 chute hidden in a tree, then land on the 🕳️ hole to escape.

## Loot System

Loot tables are pre-generated each level using a Fisher-Yates shuffle — no pure RNG mid-game.

- **Trees**: 9×9 grid minus rocks, hole, and player. Contains snakes (count scales +1 per level), swords, gold bags, gems, key, door, and empty tiles.
- **Rocks** (15 per level): exactly 2 ❤️ hearts + 13 🐍 snakes, shuffled.
- **Snake kills** (sword required): exactly 2 ❤️ hearts + rest 💰 gold, shuffled across all snakes for the level.

## Final Level

When you collect the 🪂 chute on level 10, all remaining rocks instantly transform into snakes — fight or flee your way to the 🕳️ hole.

## Saving

Progress is auto-saved to `localStorage` after every move, with a SHA-256 integrity hash to prevent tampering.
