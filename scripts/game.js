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
		startNewGame();
		enableButtons();
	}, 1000);
}

function handleFinalBoss() {
	state.rocks.forEach(rock => {
		notify(ROCK, getTileElement(rock.x, rock.y));
		setGridTile(rock.x, rock.y, SNAKE);
		addSnake(rock.x, rock.y);
	});
}

function handleWin() {
	timer.stop();
	disableButtons();
	setTimeout(async () => {
		await showModal(alertMessages.win());
		startNewGame();
		enableButtons();
	}, 1000);
}

function setupLevel(chuteCount, doorCount, keyCount) {
	state.clearSnakes();
	state.resetKeys();
	state.lockDoor();
	state.setLootTable(generateLootTable(chuteCount, doorCount, keyCount));
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
	timer.reset();
	timer.start();
	setupLevel(0, 1, 1);
}

function advanceLevel() {
	state.incrementSnakesCount();
	const isFinalLevel = state.currentLevel === 9;
	const chuteCount = isFinalLevel ? 1 : 0;
	const doorCount = isFinalLevel ? 0 : 1;
	const keyCount = isFinalLevel ? 0 : 1;
	setupLevel(chuteCount, doorCount, keyCount);
	saveGame();
}
