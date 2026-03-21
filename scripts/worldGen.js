function fisherYatesShuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

const rockTiles = Array(rockCount).fill(ROCK);
const treeTiles = Array(treeCount).fill(TREE);
const holeTiles = Array(holeCount).fill(HOLE);
const tileTable = fisherYatesShuffle([...rockTiles, ...treeTiles, ...holeTiles]);

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

	const shuffledDrops = [...fisherYatesShuffle([
		...snakeDrops,
		...swordDrops,
		...goldBagDrops,
		...gemDrops,
		...emptyDrops,
		...doorDrop,
		...keyDrop
	]), ...chuteDrop];

	return shuffledDrops;
}

function generateWorld() {
	state.rocks = [];
	const world = document.getElementById('world');
	world.innerHTML = '';
	let tileIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile';

			if (x === state.playerX && y === state.playerY) {
				tile.textContent = NINJA;
				tile.classList.add(NINJA);
				state.centerTile = tile;
			} else {
				const tileValue = state.currentTileTable[tileIndex++];
				if(tileValue === ROCK) {
					state.rocks.push({tile, x, y});
				}
				setTile(tile, tileValue);
			}
			tile.classList.add("p" + [x,y].toString().replace(",", "-"));
			world.appendChild(tile);
		}
	}
}
