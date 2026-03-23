/* Tile Symbols */
const SNAKE = "🐍";
const CRAB = "🦀";
const SCORPION = "🦂";
const ROCK = "🪨";
const TREE = "🌲";
const TREE_NG = "🌳";
const HOLE = "🕳️";
const CHUTE = '🪂';
const KEY = "🔑";
const HOUSE_KEY = "🗝️";
const HOUSE = "🏠";
const HOUSE_DAMAGED = "🏚️";
const LOCK = "🔒";
const UNLOCK = "🔐";
const COIN = "🪙";
const GOLD = "💰";
const GEM = "💎";
const RING = "💍";
const SWORD = "🗡";
const DBL_SWORD = "⚔️";
let NINJA = localStorage.getItem('ninjaSkin') || '🥷';
const DOOR = "🚪";
const HEART = "❤️";
const DAMAGE = "💔";
const SKULL = "💀";

/* Game Constants */
const startingLevel = 0;
const maxHealth = 5;
const startingSnakesCount = 0;
const devMode = new URLSearchParams(window.location.search).get('dev') === 'true';

/* World Constants */
const worldSize = 9;
const totalTiles = worldSize * worldSize;
const rockCount = 15;
const playerCount = 1;
// holeCount is computed dynamically in worldGen.js (NG+ uses 1 hole + 1 house = 2 special tiles)

/* Loot Constants */
const swordsCount = 5;
const goldBagsCount = 7;
const gemCount = 1;
