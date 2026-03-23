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
	const holeCount = state.ngPlus ? 2 : 1;
	const treeCount = totalTiles - playerCount - holeCount - rockCount;
	const rockTiles = Array(rockCount).fill(ROCK);
	const treeTiles = Array(treeCount).fill(TREE);
	// Holes are placed separately via pickHolePositions — not in the tile table
	return [...rockTiles, ...treeTiles];
}

function generateSnakeLootTable() {
	if (state.ngPlus) {
		const totalEnemies = 12 + 9; // 12 rock snakes + 9 tree enemies = 21
		const heartDrops = Array(3).fill(HEART);
		const goldDrops = Array(totalEnemies - 3).fill(GOLD);
		return fisherYatesShuffle([...heartDrops, ...goldDrops]);
	}
	const totalSnakes = (rockCount - 2) + state.snakesCount;
	const heartDrops = Array(2).fill(HEART);
	const goldDrops = Array(totalSnakes - 2).fill(GOLD);
	return fisherYatesShuffle([...heartDrops, ...goldDrops]);
}

function generateRockLootTable() {
	if (state.ngPlus) {
		const heartDrops = Array(3).fill(HEART);
		const snakeDrops = Array(rockCount - 3).fill(SNAKE);
		return fisherYatesShuffle([...heartDrops, ...snakeDrops]);
	}
	const heartDrops = Array(2).fill(HEART);
	const snakeDrops = Array(rockCount - 2).fill(SNAKE);
	return fisherYatesShuffle([...heartDrops, ...snakeDrops]);
}

function generateLootTable(chuteCount, doorCount, keyCount) {
	if (state.ngPlus) {
		const holeCount = 2;
		const treeCount = totalTiles - playerCount - holeCount - rockCount; // 63
		const totalEnemySlots = 9; // always 9 (snakes + scorpions)
		const totalSwordSlots = 5; // 3 single + 2 double
		const remainingCount = treeCount - totalEnemySlots - totalSwordSlots - goldBagsCount - gemCount - doorCount - keyCount - chuteCount;
		const snakeDrops = Array(9 - state.scorpionsCount).fill(SNAKE);
		const scorpionDrops = Array(state.scorpionsCount).fill(SCORPION);
		const singleSwordDrops = Array(3).fill(SWORD);
		const doubleSwordDrops = Array(2).fill(DBL_SWORD);
		const goldBagDrops = Array(goldBagsCount).fill(COIN);
		const gemDrops = Array(gemCount).fill(GEM);
		const chuteDrop = Array(chuteCount).fill(CHUTE);
		const emptyDrops = Array(remainingCount).fill('');
		const doorDrop = Array(doorCount).fill(DOOR);
		const keyDrop = Array(keyCount).fill(KEY);
		return [...fisherYatesShuffle([
			...snakeDrops, ...scorpionDrops, ...singleSwordDrops, ...doubleSwordDrops,
			...goldBagDrops, ...gemDrops, ...emptyDrops, ...doorDrop, ...keyDrop
		]), ...chuteDrop];
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
	state.clearScorpions();
	state.resetGrid();

	const holeCount = state.ngPlus ? 2 : 1;
	const holePositions = pickHolePositions(holeCount);
	const holeSet = new Set(holePositions.map(p => `${p.x},${p.y}`));

	const world = document.getElementById('world');
	world.innerHTML = '';

	let tileIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile p' + x + '-' + y;
			world.appendChild(tile);

			let value;
			if (x === state.playerX && y === state.playerY) {
				value = NINJA;
			} else if (holeSet.has(`${x},${y}`)) {
				value = HOLE;
			} else {
				value = state.currentTileTable[tileIndex++];
			}

			setGridTile(x, y, value);
			if (value === ROCK) state.addRock({ x, y });
		}
	}
}
