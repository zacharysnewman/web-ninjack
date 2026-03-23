function endGame() {
	advanceLevel();
}

// ── Debug (devMode only) ──────────────────────────────────────────
function debugSkipToLevel(targetLevel, ngPlus) {
	clearSave();
	state.setPlayer(Math.floor(worldSize / 2), Math.floor(worldSize / 2));
	state.resetGold();
	state.resetSwords();
	state.resetHealth();
	state.resetChutes();
	state.resetMoves();
	state.setNgPlus(ngPlus);
	state.setSnakesCount(ngPlus ? 0 : targetLevel - 1);
	state.setLevel(targetLevel - 1); // setupLevel's incrementLevel() lands on targetLevel
	timer.reset();
	timer.start();
	const isFinal = targetLevel === 10;
	let chuteCount = 0, doorCount = 0, keyCount = 0, houseKeyCount = 0;
	if (isFinal && ngPlus)    { houseKeyCount = 1; }
	else if (isFinal)         { chuteCount = 1; }
	else                      { doorCount = 1; keyCount = 1; }
	setupLevel(chuteCount, doorCount, keyCount, houseKeyCount);
	saveGame();
}

function debugMaxStats() {
	state.setHealth(99);
	state.setSwords(99);
	updateGoldDisplay();
	saveGame();
}

function handleDamage(damage, x, y) {
	state.takeDamage(damage);
	updateGoldDisplay();

	if (state.currentHealth <= 0) {
		handleDeath(x, y);
	} else {
		notify(DAMAGE.repeat(damage), getTileElement(x, y));
	}
}

function handleDeath(x, y) {
	clearSave();
	timer.stop();
	setGridTile(x, y, '');

	disableButtons();
	setTimeout(async () => {
		await showModal(alertMessages.death());
		generateBackground();
		const ngPlusAvailable = localStorage.getItem('ngPlusUnlocked') === 'true' || devMode;
		const onNgPlus = ngPlusAvailable ? () => startNewGamePlus() : null;
		const ngPlusLabel = (!state.ngPlus && ngPlusAvailable) ? 'Continue in New Game+' : 'New Game+';
		await showMainMenu(null, null, () => startNewGame(), onNgPlus, ngPlusLabel);
		enableButtons();
	}, 1000);
}

// Normal mode (level 10): all remaining rocks burst open as snakes
function handleFinalBoss() {
	state.rocks.forEach(rock => {
		notify(ROCK, getTileElement(rock.x, rock.y));
		setGridTile(rock.x, rock.y, SNAKE);
		addSnake(rock.x, rock.y);
	});
	state.clearRocks();
}

// NG+ (level 10+): house is damaged, rocks burst as crabs + 1 boss scorpion
function handleFinalBossNG() {
	// Transition house: HOUSE → HOUSE_DAMAGED
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			if (getGridTile(x, y) === HOUSE) {
				notify('⚡️', getTileElement(x, y));
				setGridTile(x, y, HOUSE_DAMAGED);
				break;
			}
		}
	}

	if (state.rocks.length === 0) return;

	// Shuffle rocks, first becomes the boss scorpion, rest become crabs
	const shuffledRocks = [...state.rocks].sort(() => Math.random() - 0.5);
	shuffledRocks.forEach((rock, i) => {
		notify(ROCK, getTileElement(rock.x, rock.y));
		if (i === 0) {
			setGridTile(rock.x, rock.y, SCORPION);
			addBoss(rock.x, rock.y);
		} else {
			setGridTile(rock.x, rock.y, CRAB);
			addCrab(rock.x, rock.y);
		}
	});
	state.clearRocks();
}

// Called when player kills the boss scorpion: sweep board, restore house
function handleBossKill() {
	// Remove all remaining crabs (no loot)
	for (const crab of [...state.crabs]) {
		setGridTile(crab.x, crab.y, '');
		state.removeCrab(crab.x, crab.y);
	}
	// Remove all remaining snakes (no loot)
	for (const snake of [...state.snakes]) {
		setGridTile(snake.x, snake.y, '');
		state.removeSnake(snake.x, snake.y);
	}
	// Transition house: HOUSE_DAMAGED → HOUSE, now unlockable
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			if (getGridTile(x, y) === HOUSE_DAMAGED) {
				notify('⚡️', getTileElement(x, y));
				setGridTile(x, y, HOUSE);
				state.unlockHouse();
				return;
			}
		}
	}
}

function handleWin() {
	if (!state.ngPlus) {
		localStorage.setItem('ngPlusUnlocked', 'true');
	}
	clearSave();
	timer.stop();
	disableButtons();
	setTimeout(async () => {
		const msg = state.ngPlus ? alertMessages.winNgPlus() : alertMessages.win();
		await showModal(msg);
		generateBackground();
		const ngPlusAvailable = localStorage.getItem('ngPlusUnlocked') === 'true' || devMode;
		const onNgPlus = ngPlusAvailable ? () => startNewGamePlus() : null;
		await showMainMenu(null, null, () => startNewGame(), onNgPlus);
		enableButtons();
	}, 1000);
}

function setupLevel(chuteCount, doorCount, keyCount, houseKeyCount = 0) {
	state.clearSnakes();
	state.clearCrabs();
	state.resetKeys();
	state.lockDoor();
	state.lockHouse();
	state.resetHouseKeys();
	state.setLootTable(generateLootTable(chuteCount, doorCount, keyCount, houseKeyCount));
	state.setRockLootTable(generateRockLootTable());
	state.setSnakeLootTable(generateSnakeLootTable());
	state.setCrabLootTable(generateCrabLootTable());
	state.setTileTable(fisherYatesShuffle(generateTileTable()));
	generateWorld();
	state.incrementLevel();
	updateGoldDisplay();
}

function startNewGame() {
	clearSave();
	state.setPlayer(Math.floor(worldSize / 2), Math.floor(worldSize / 2));
	state.resetGold();
	state.resetSwords();
	state.resetHealth();
	state.resetLevel();
	state.resetChutes();
	state.resetMoves();
	state.resetSnakesCount();
	state.setNgPlus(false);
	timer.reset();
	timer.start();
	setupLevel(0, 1, 1);
}

function startNewGamePlus() {
	const carriedGold = state.gold;
	clearSave();
	state.setPlayer(Math.floor(worldSize / 2), Math.floor(worldSize / 2));
	state.setGold(carriedGold);
	state.resetSwords();
	state.resetHealth();
	state.resetLevel();
	state.resetChutes();
	state.resetMoves();
	state.resetSnakesCount();
	state.setNgPlus(true);
	timer.reset();
	timer.start();
	setupLevel(0, 1, 1);
}

function advanceLevel() {
	if (!state.ngPlus) {
		state.incrementSnakesCount();
	}
	// NG+ enemy counts are computed per-level in generateLootTable()

	const isFinalLevel = state.currentLevel === 9;
	let chuteCount, doorCount, keyCount, houseKeyCount;
	if (isFinalLevel && state.ngPlus) {
		// Level 10+: house key replaces chute; hole is lethal; no door/key
		chuteCount = 0; doorCount = 0; keyCount = 0; houseKeyCount = 1;
	} else if (isFinalLevel) {
		// Level 10 normal: chute triggers boss, no door/key
		chuteCount = 1; doorCount = 0; keyCount = 0; houseKeyCount = 0;
	} else {
		chuteCount = 0; doorCount = 1; keyCount = 1; houseKeyCount = 0;
	}
	setupLevel(chuteCount, doorCount, keyCount, houseKeyCount);
	saveGame();
}
