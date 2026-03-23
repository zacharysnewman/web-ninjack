function endGame() {
	advanceLevel();
}

function handleDamage(damage, x, y) {
	state.takeDamage(damage);
	updateGoldDisplay();

	if (state.currentHealth <= 0) {
		handleDeath(x, y);
	} else {
		notify(DAMAGE, getTileElement(x, y));
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
		await showMainMenu(null, null, () => startNewGame(), onNgPlus);
		enableButtons();
	}, 1000);
}

function handleFinalBoss() {
	if (state.ngPlus) {
		const shuffledRocks = [...state.rocks].sort(() => Math.random() - 0.5);
		shuffledRocks.forEach((rock, i) => {
			const isScorpion = i < state.scorpionsCount;
			const enemy = isScorpion ? SCORPION : SNAKE;
			notify(ROCK, getTileElement(rock.x, rock.y));
			setGridTile(rock.x, rock.y, enemy);
			if (isScorpion) {
				addScorpion(rock.x, rock.y);
			} else {
				addSnake(rock.x, rock.y);
			}
		});
	} else {
		state.rocks.forEach(rock => {
			notify(ROCK, getTileElement(rock.x, rock.y));
			setGridTile(rock.x, rock.y, SNAKE);
			addSnake(rock.x, rock.y);
		});
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

function setupLevel(chuteCount, doorCount, keyCount) {
	state.clearSnakes();
	state.clearScorpions();
	state.resetKeys();
	state.lockDoor();
	state.setLootTable(generateLootTable(chuteCount, doorCount, keyCount));
	state.setRockLootTable(generateRockLootTable());
	state.setSnakeLootTable(generateSnakeLootTable());
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
	state.resetScorpionsCount();
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
	state.setSnakesCount(9);
	state.resetScorpionsCount();
	state.setNgPlus(true);
	timer.reset();
	timer.start();
	setupLevel(0, 1, 1);
}

function advanceLevel() {
	if (state.ngPlus) {
		state.incrementScorpionsCount();
		// snakesCount stays fixed at 9
	} else {
		state.incrementSnakesCount();
	}
	const isFinalLevel = state.currentLevel === 9;
	const chuteCount = isFinalLevel ? 1 : 0;
	const doorCount = isFinalLevel ? 0 : 1;
	const keyCount = isFinalLevel ? 0 : 1;
	setupLevel(chuteCount, doorCount, keyCount);
	saveGame();
}
