function fisherYatesShuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function pickHolePositions(count) {
	const eligible = [];
	for (let y = 1; y <= 7; y++) {
		for (let x = 1; x <= 7; x++) {
			if (x === state.playerX && y === state.playerY) continue;
			eligible.push({ x, y });
		}
	}
	fisherYatesShuffle(eligible);
	return eligible.slice(0, count);
}

function generateTileTable() {
	// NG+ level 10 uses 3 special tiles (hole + house + moai); NG+ others use 2; normal uses 1
	const specialCount = state.ngPlus ? (state.currentLevel === 9 ? 3 : 2) : 1;
	const treeCount = totalTiles - playerCount - specialCount - rockCount;
	const rockTiles = Array(rockCount).fill(ROCK);
	const treeTiles = Array(treeCount).fill(state.ngPlus ? TREE_NG : TREE);
	// Special tiles are placed separately via pickHolePositions — not in the tile table
	return [...rockTiles, ...treeTiles];
}

function generateSnakeLootTable() {
	if (state.ngPlus) {
		// displayLevel is currentLevel + 1 since increment hasn't happened yet
		const displayLevel = state.currentLevel + 1;
		const snakesInTrees = Math.max(0, Math.min(4 + displayLevel, 10 - displayLevel));
		// On level 10+, all rocks produce crabs (handled by crab loot); 1+–9+ rocks produce snakes
		const rockSnakes = displayLevel < 10 ? rockCount - 2 : 0;
		const totalSnakes = rockSnakes + snakesInTrees;
		if (totalSnakes === 0) return [];
		const heartCount = Math.min(2, totalSnakes);
		const heartDrops = Array(heartCount).fill(HEART);
		const goldDrops = Array(totalSnakes - heartCount).fill(GOLD);
		return fisherYatesShuffle([...heartDrops, ...goldDrops]);
	}
	const totalSnakes = (rockCount - 2) + state.snakesCount;
	const heartDrops = Array(2).fill(HEART);
	const goldDrops = Array(totalSnakes - 2).fill(GOLD);
	return fisherYatesShuffle([...heartDrops, ...goldDrops]);
}

function generateRockLootTable() {
	// Level 10+ (NG+ only): all rocks produce crabs
	if (state.ngPlus && state.currentLevel === 9) {
		return Array(rockCount).fill(CRAB);
	}
	// Normal mode and NG+ levels 1+–9+: same rock loot
	const heartDrops = Array(2).fill(HEART);
	const snakeDrops = Array(rockCount - 2).fill(SNAKE);
	return fisherYatesShuffle([...heartDrops, ...snakeDrops]);
}

function generateCrabLootTable() {
	if (!state.ngPlus) return [];
	const displayLevel = state.currentLevel + 1;
	const crabsInTrees = displayLevel;
	// On level 10+, rocks also produce crabs (15 more potential kills)
	const crabsInRocks = displayLevel === 10 ? rockCount : 0;
	const totalCrabs = crabsInTrees + crabsInRocks;
	const heartCount = Math.min(6, totalCrabs);
	const heartDrops = Array(heartCount).fill(HEART);
	const ringDrops = Array(totalCrabs - heartCount).fill(RING);
	return fisherYatesShuffle([...heartDrops, ...ringDrops]);
}

function generateLootTable(chuteCount, doorCount, keyCount, houseKeyCount = 0) {
	if (state.ngPlus) {
		// Level 10+ has 3 specials (hole + house + moai), others have 2
		const specialCount = state.currentLevel === 9 ? 3 : 2;
		const treeCount = totalTiles - playerCount - specialCount - rockCount;
		const displayLevel = state.currentLevel + 1; // 1–10
		const crabsInTrees = displayLevel;
		const snakesInTrees = Math.max(0, Math.min(4 + displayLevel, 10 - displayLevel));
		const totalEnemySlots = crabsInTrees + snakesInTrees;
		const totalSwordSlots = 5; // 3 single + 2 double
		const remainingCount = treeCount - totalEnemySlots - totalSwordSlots - goldBagsCount - gemCount - doorCount - keyCount - chuteCount - houseKeyCount;
		const snakeDrops = Array(snakesInTrees).fill(SNAKE);
		const crabDrops = Array(crabsInTrees).fill(CRAB);
		const singleSwordDrops = Array(3).fill(SWORD);
		const doubleSwordDrops = Array(2).fill(DBL_SWORD);
		const goldBagDrops = Array(goldBagsCount).fill(COIN);
		const gemDrops = Array(gemCount).fill(GEM);
		const chuteDrop = Array(chuteCount).fill(CHUTE);
		const houseKeyDrop = Array(houseKeyCount).fill(HOUSE_KEY);
		const emptyDrops = Array(remainingCount).fill('');
		const doorDrop = Array(doorCount).fill(DOOR);
		const keyDrop = Array(keyCount).fill(KEY);
		return [...fisherYatesShuffle([
			...snakeDrops, ...crabDrops, ...singleSwordDrops, ...doubleSwordDrops,
			...goldBagDrops, ...gemDrops, ...emptyDrops, ...doorDrop, ...keyDrop
		]), ...chuteDrop, ...houseKeyDrop];
	}
	const holeCount = 1;
	const treeCount = totalTiles - playerCount - holeCount - rockCount;
	const remainingCount = treeCount - state.snakesCount - swordsCount - goldBagsCount - gemCount - doorCount - keyCount - chuteCount;
	const snakeDrops = Array(state.snakesCount).fill(SNAKE);
	const swordDrops = Array(swordsCount).fill(SWORD);
	const goldBagDrops = Array(goldBagsCount).fill(COIN);
	const gemDrops = Array(gemCount).fill(GEM);
	const chuteDrop = Array(chuteCount).fill(CHUTE);
	const emptyDrops = Array(remainingCount).fill('');
	const doorDrop = Array(doorCount).fill(DOOR);
	const keyDrop = Array(keyCount).fill(KEY);

	return [...fisherYatesShuffle([
		...snakeDrops, ...swordDrops, ...goldBagDrops, ...gemDrops,
		...emptyDrops, ...doorDrop, ...keyDrop
	]), ...chuteDrop];
}

function generateBackground() {
	const holeCount = 1;
	const treeCount = totalTiles - playerCount - holeCount - rockCount;
	const world = document.getElementById('world');
	world.innerHTML = '';
	const tiles = fisherYatesShuffle([
		...Array(rockCount).fill(ROCK),
		...Array(treeCount).fill(TREE),
		...Array(holeCount).fill(HOLE),
		...Array(playerCount).fill(''),
	]);
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile p' + x + '-' + y;
			const value = tiles[y * worldSize + x];
			tile.textContent = value;
			if (value) tile.classList.add(value);
			world.appendChild(tile);
		}
	}
	updateGoldDisplay();
}

function generateWorld() {
	state.clearRocks();
	state.clearCrabs();
	state.resetGrid();

	// NG+ level 10 gets hole + house + moai; other NG+ gets hole + house; normal gets hole
	const isFinalNgPlus = state.ngPlus && state.currentLevel === 9;
	const specialCount = isFinalNgPlus ? 3 : (state.ngPlus ? 2 : 1);
	const specialPositions = pickHolePositions(specialCount);
	const holeKey = `${specialPositions[0].x},${specialPositions[0].y}`;
	const houseKey = state.ngPlus ? `${specialPositions[1].x},${specialPositions[1].y}` : null;
	const moaiKey = isFinalNgPlus ? `${specialPositions[2].x},${specialPositions[2].y}` : null;
	const specialSet = new Set(specialPositions.map(p => `${p.x},${p.y}`));

	const world = document.getElementById('world');
	world.innerHTML = '';

	let tileIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile p' + x + '-' + y;
			world.appendChild(tile);

			let value;
			const key = `${x},${y}`;
			if (x === state.playerX && y === state.playerY) {
				value = NINJA;
			} else if (specialSet.has(key)) {
				value = key === houseKey ? HOUSE_DAMAGED : key === moaiKey ? MOAI : HOLE;
			} else {
				value = state.currentTileTable[tileIndex++];
			}

			setGridTile(x, y, value);
			if (value === ROCK) state.addRock({ x, y });
		}
	}
}
