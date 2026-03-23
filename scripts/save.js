const SAVE_KEY = 'ninjack_save';
const SAVE_HASH_KEY = 'ninjack_save_hash';

let _saveGeneration = 0;

async function hashString(str) {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
	return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function saveGame() {
	const generation = ++_saveGeneration;
	const saveData = {
		playerX: state.playerX, playerY: state.playerY,
		currentHealth: state.currentHealth, currentLevel: state.currentLevel,
		gold: state.gold, swords: state.swords,
		currentKeys: state.currentKeys, currentChutes: state.currentChutes,
		currentMoves: state.currentMoves, snakesCount: state.snakesCount,
		doorLocked: state.doorLocked,
		houseLocked: state.houseLocked, houseKeys: state.houseKeys,
		currentLootTable: state.currentLootTable, currentLootIndex: state.currentLootIndex,
		currentRockLootTable: state.currentRockLootTable, currentRockLootIndex: state.currentRockLootIndex,
		currentSnakeLootTable: state.currentSnakeLootTable, currentSnakeLootIndex: state.currentSnakeLootIndex,
		currentCrabLootTable: state.currentCrabLootTable, currentCrabLootIndex: state.currentCrabLootIndex,
		snakes: state.snakes.map(s => ({ x: s.x, y: s.y })),
		timerSeconds: timer.value(),
		gridState: state.grid.map(row => [...row]),
		ngPlus: state.ngPlus,
		crabs: state.crabs.map(s => ({ x: s.x, y: s.y, armored: s.armored, tile: s.tile || CRAB })),
	};
	const json = JSON.stringify(saveData);
	const hash = await hashString(json);
	if (generation !== _saveGeneration) return;
	localStorage.setItem(SAVE_KEY, json);
	localStorage.setItem(SAVE_HASH_KEY, hash);
}

function clearSave() {
	_saveGeneration++;
	localStorage.removeItem(SAVE_KEY);
	localStorage.removeItem(SAVE_HASH_KEY);
}

function restoreWorld(gridState, savedCrabs = []) {
	state.clearRocks();
	state.clearCrabs();
	state.resetGrid();

	const world = document.getElementById('world');
	world.innerHTML = '';

	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile p' + x + '-' + y;
			world.appendChild(tile);

			const value = gridState[y][x];
			setGridTile(x, y, value);
			if (value === ROCK) {
				state.addRock({ x, y });
			} else if (value === CRAB || value === SCORPION) {
				const sd = savedCrabs.find(s => s.x === x && s.y === y);
				state.addCrab({ x, y, justSpawned: false, armored: sd ? sd.armored : 1, tile: sd ? (sd.tile || value) : value });
			}
		}
	}
}

async function loadGame() {
	const json = localStorage.getItem(SAVE_KEY);
	if (!json) return false;
	try {
		const storedHash = localStorage.getItem(SAVE_HASH_KEY);
		const computedHash = await hashString(json);
		if (storedHash !== computedHash) {
			clearSave();
			return false;
		}
		const d = JSON.parse(json);
		state.setPlayer(d.playerX, d.playerY);
		state.setHealth(d.currentHealth);
		state.setLevel(d.currentLevel);
		state.setGold(d.gold);
		state.setSwords(d.swords);
		state.setKeys(d.currentKeys);
		state.setChutes(d.currentChutes);
		state.setMoves(d.currentMoves);
		state.setSnakesCount(d.snakesCount);
		state.setDoorLocked(d.doorLocked);
		state.setHouseLocked(d.houseLocked ?? true);
		state.setHouseKeys(d.houseKeys ?? 0);
		state.restoreLoot(d.currentLootTable, d.currentLootIndex);
		state.restoreRockLoot(d.currentRockLootTable ?? [], d.currentRockLootIndex ?? 0);
		state.restoreSnakeLoot(d.currentSnakeLootTable ?? [], d.currentSnakeLootIndex ?? 0);
		state.restoreCrabLoot(d.currentCrabLootTable ?? [], d.currentCrabLootIndex ?? 0);
		state.setSnakes(d.snakes.map(s => ({ ...s, justSpawned: false })));
		state.setNgPlus(d.ngPlus ?? false);
		// Support legacy saves that used 'scorpions' field name
		const savedCrabs = d.crabs ?? d.scorpions ?? [];
		state.setCrabs(savedCrabs.map(s => ({ ...s, justSpawned: false, tile: s.tile || CRAB })));
		timer.reset();
		timer.seconds = d.timerSeconds + 1;
		timer.start();
		let gridState = d.gridState;
		if (Array.isArray(gridState) && !Array.isArray(gridState[0])) {
			gridState = Array.from({ length: worldSize }, (_, y) =>
				gridState.slice(y * worldSize, (y + 1) * worldSize)
			);
		}
		restoreWorld(gridState, savedCrabs);
		setGridTile(state.playerX, state.playerY, NINJA);
		updateGoldDisplay();
		await saveGame();
		return true;
	} catch (e) {
		clearSave();
		return false;
	}
}
