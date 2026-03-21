const SAVE_KEY = 'ninjack_save';
const SAVE_HASH_KEY = 'ninjack_save_hash';

async function hashString(str) {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
	return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function saveGame() {
	const tiles = document.querySelectorAll('.tile');
	const gridState = Array.from(tiles).map(tile => tile.textContent);
	const saveData = {
		playerX: state.playerX, playerY: state.playerY,
		currentHealth: state.currentHealth, currentLevel: state.currentLevel,
		gold: state.gold, swords: state.swords,
		currentKeys: state.currentKeys, currentChutes: state.currentChutes,
		currentMoves: state.currentMoves, snakesCount: state.snakesCount,
		doorLocked: state.doorLocked,
		currentLootTable: state.currentLootTable, currentLootIndex: state.currentLootIndex,
		currentTileTable: state.currentTileTable,
		snakes: state.snakes.map(s => ({ x: s.x, y: s.y })),
		timerSeconds: timer.value(),
		gridState
	};
	const json = JSON.stringify(saveData);
	const hash = await hashString(json);
	localStorage.setItem(SAVE_KEY, json);
	localStorage.setItem(SAVE_HASH_KEY, hash);
}

function clearSave() {
	localStorage.removeItem(SAVE_KEY);
	localStorage.removeItem(SAVE_HASH_KEY);
}

function restoreWorld(gridState) {
	state.rocks = [];
	const world = document.getElementById('world');
	world.innerHTML = '';
	let gridIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile';
			const content = gridState[gridIndex++];
			setTile(tile, content);
			if (content === NINJA) state.centerTile = tile;
			if (content === ROCK) state.rocks.push({ tile, x, y });
			tile.classList.add("p" + [x, y].toString().replace(",", "-"));
			world.appendChild(tile);
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
		state.playerX = d.playerX; state.playerY = d.playerY;
		state.currentHealth = d.currentHealth; state.currentLevel = d.currentLevel;
		state.gold = d.gold; state.swords = d.swords;
		state.currentKeys = d.currentKeys; state.currentChutes = d.currentChutes;
		state.currentMoves = d.currentMoves; state.snakesCount = d.snakesCount;
		state.doorLocked = d.doorLocked;
		state.currentLootTable = d.currentLootTable; state.currentLootIndex = d.currentLootIndex;
		state.currentTileTable = d.currentTileTable;
		state.snakes = d.snakes.map(s => ({ ...s, justSpawned: false }));
		timer.reset();
		timer.seconds = d.timerSeconds + 1;
		timer.start();
		restoreWorld(d.gridState);
		updateGoldDisplay();
		await saveGame();
		return true;
	} catch (e) {
		clearSave();
		return false;
	}
}
