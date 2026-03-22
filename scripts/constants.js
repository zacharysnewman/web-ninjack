/* Tile Symbols */
const SNAKE = "🐍";
const ROCK = "🪨";
const TREE = "🌲";
const HOLE = "🕳️";
const CHUTE = '🪂';
const KEY = "🔑";
const LOCK = "🔒";
const UNLOCK = "🔐";
const COIN = "🪙";
const GOLD = "💰";
const GEM = "💎";
const SWORD = "🗡";
let NINJA = localStorage.getItem('ninjaSkin') || '🥷';
const DOOR = "🚪";
const HEART = "❤️";
const DAMAGE = "💔";
const SKULL = "💀";

/* Game Constants */
const startingLevel = 0;
const maxHealth = 5;
const startingSnakesCount = 0;

/* World Constants */
const worldSize = 9;
const totalTiles = worldSize * worldSize;
const rockCount = 15;
const holeCount = 1;
const playerCount = 1;
const treeCount = totalTiles - playerCount - holeCount - rockCount;

/* Loot Constants */
const swordsCount = 5;
const goldBagsCount = 7;
const gemCount = 1;
