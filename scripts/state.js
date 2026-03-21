class GameState {
	// ── Private Fields ───────────────────────────────────────────────
	#playerX = Math.floor(worldSize / 2);
	#playerY = Math.floor(worldSize / 2);
	#grid = [];
	#gold = 0;
	#swords = 0;
	#currentLootTable = [];
	#currentLootIndex = 0;
	#currentRockLootTable = [];
	#currentRockLootIndex = 0;
	#currentSnakeLootTable = [];
	#currentSnakeLootIndex = 0;
	#currentTileTable = [];
	#currentLevel = startingLevel;
	#currentHealth = maxHealth;
	#currentKeys = 0;
	#currentChutes = 0;
	#currentMoves = 0;
	#snakesCount = startingSnakesCount;
	#snakes = [];
	#rocks = [];
	#doorLocked = true;
	#buttonsDisabled = false;

	// ── Getters ──────────────────────────────────────────────────────
	get playerX()          { return this.#playerX; }
	get playerY()          { return this.#playerY; }
	get grid()             { return this.#grid; }
	get gold()             { return this.#gold; }
	get swords()           { return this.#swords; }
	get currentLootTable() { return this.#currentLootTable; }
	get currentLootIndex() { return this.#currentLootIndex; }
	get currentRockLootTable() { return this.#currentRockLootTable; }
	get currentRockLootIndex() { return this.#currentRockLootIndex; }
	get currentSnakeLootTable() { return this.#currentSnakeLootTable; }
	get currentSnakeLootIndex() { return this.#currentSnakeLootIndex; }
	get currentTileTable() { return this.#currentTileTable; }
	get currentLevel()     { return this.#currentLevel; }
	get currentHealth()    { return this.#currentHealth; }
	get currentKeys()      { return this.#currentKeys; }
	get currentChutes()    { return this.#currentChutes; }
	get currentMoves()     { return this.#currentMoves; }
	get snakesCount()      { return this.#snakesCount; }
	get snakes()           { return this.#snakes; }
	get rocks()            { return this.#rocks; }
	get doorLocked()       { return this.#doorLocked; }
	get buttonsDisabled()  { return this.#buttonsDisabled; }

	// ── Player ───────────────────────────────────────────────────────
	setPlayer(x, y)        { this.#playerX = x; this.#playerY = y; }

	// ── Grid ─────────────────────────────────────────────────────────
	resetGrid()            { this.#grid = Array.from({ length: worldSize }, () => Array(worldSize).fill('')); }
	setCell(x, y, value)   { this.#grid[y][x] = value; }

	// ── Gold ─────────────────────────────────────────────────────────
	addGold(n)             { this.#gold += n; }
	resetGold()            { this.#gold = 0; }

	// ── Swords ───────────────────────────────────────────────────────
	addSword()             { this.#swords++; }
	useSword()             { this.#swords--; }
	resetSwords()          { this.#swords = 0; }

	// ── Health ───────────────────────────────────────────────────────
	takeDamage(n)          { this.#currentHealth -= n; }
	heal()                 { this.#currentHealth++; }
	resetHealth()          { this.#currentHealth = maxHealth; }

	// ── Level ────────────────────────────────────────────────────────
	incrementLevel()       { this.#currentLevel++; }
	resetLevel()           { this.#currentLevel = startingLevel; }

	// ── Keys ─────────────────────────────────────────────────────────
	giveKey()              { this.#currentKeys = 1; }
	useKey()               { this.#currentKeys = 0; }
	resetKeys()            { this.#currentKeys = 0; }

	// ── Chutes ───────────────────────────────────────────────────────
	giveChute()            { this.#currentChutes = 1; }
	resetChutes()          { this.#currentChutes = 0; }

	// ── Moves ────────────────────────────────────────────────────────
	incrementMoves()       { this.#currentMoves++; }
	resetMoves()           { this.#currentMoves = 0; }

	// ── Snakes Count ─────────────────────────────────────────────────
	incrementSnakesCount() { this.#snakesCount++; }
	resetSnakesCount()     { this.#snakesCount = startingSnakesCount; }

	// ── Snakes ───────────────────────────────────────────────────────
	clearSnakes()          { this.#snakes = []; }
	addSnake(snake)        { this.#snakes.push(snake); }
	removeSnake(x, y)      { this.#snakes = this.#snakes.filter(s => !(s.x === x && s.y === y)); }
	setSnakes(arr)         { this.#snakes = arr; }

	// ── Rocks ────────────────────────────────────────────────────────
	clearRocks()           { this.#rocks = []; }
	addRock(rock)          { this.#rocks.push(rock); }

	// ── Door ─────────────────────────────────────────────────────────
	lockDoor()             { this.#doorLocked = true; }
	unlockDoor()           { this.#doorLocked = false; }

	// ── Buttons ──────────────────────────────────────────────────────
	setButtonsDisabled(v)  { this.#buttonsDisabled = v; }

	// ── Loot ─────────────────────────────────────────────────────────
	setLootTable(table)        { this.#currentLootTable = table; this.#currentLootIndex = 0; }
	drawLoot()                 { return this.#currentLootTable[this.#currentLootIndex++]; }
	setRockLootTable(table)    { this.#currentRockLootTable = table; this.#currentRockLootIndex = 0; }
	drawRockLoot()             { return this.#currentRockLootTable[this.#currentRockLootIndex++]; }
	restoreRockLoot(table, index) { this.#currentRockLootTable = table; this.#currentRockLootIndex = index; }
	setSnakeLootTable(table)   { this.#currentSnakeLootTable = table; this.#currentSnakeLootIndex = 0; }
	drawSnakeLoot()            { return this.#currentSnakeLootTable[this.#currentSnakeLootIndex++]; }
	restoreSnakeLoot(table, index) { this.#currentSnakeLootTable = table; this.#currentSnakeLootIndex = index; }

	// ── Tile Table ───────────────────────────────────────────────────
	setTileTable(table)    { this.#currentTileTable = table; }

	// ── Restore Setters (used by loadGame only) ───────────────────────
	setHealth(n)           { this.#currentHealth = n; }
	setLevel(n)            { this.#currentLevel = n; }
	setGold(n)             { this.#gold = n; }
	setSwords(n)           { this.#swords = n; }
	setKeys(n)             { this.#currentKeys = n; }
	setChutes(n)           { this.#currentChutes = n; }
	setMoves(n)            { this.#currentMoves = n; }
	setSnakesCount(n)      { this.#snakesCount = n; }
	setDoorLocked(v)       { this.#doorLocked = v; }
	restoreLoot(table, index) { this.#currentLootTable = table; this.#currentLootIndex = index; }
}

const state = new GameState();
