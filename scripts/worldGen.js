function fisherYatesShuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function generateTileTable() {
	const rockTiles = Array(rockCount).fill(ROCK);
	const treeTiles = Array(treeCount).fill(TREE);
	const holeTiles = Array(holeCount).fill(HOLE);
	return [...rockTiles, ...treeTiles, ...holeTiles];
}

function generateSnakeLootTable() {
	const totalSnakes = (rockCount - 2) + state.snakesCount;
	const heartDrops = Array(2).fill(HEART);
	const goldDrops = Array(totalSnakes - 2).fill(GOLD);
	return fisherYatesShuffle([...heartDrops, ...goldDrops]);
}

function generateRockLootTable() {
	const heartDrops = Array(2).fill(HEART);
	const snakeDrops = Array(rockCount - 2).fill(SNAKE);
	return fisherYatesShuffle([...heartDrops, ...snakeDrops]);
}

function generateLootTable(chuteCount, doorCount, keyCount) {
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
	state.resetGrid();

	const world = document.getElementById('world');
	world.innerHTML = '';

	let tileIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile p' + x + '-' + y;
			world.appendChild(tile);

			const value = (x === state.playerX && y === state.playerY)
				? NINJA
				: state.currentTileTable[tileIndex++];

			setGridTile(x, y, value);
			if (value === ROCK) state.addRock({ x, y });
		}
	}
}
