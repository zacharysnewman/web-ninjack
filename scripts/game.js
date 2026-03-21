function endGame() {
	advanceLevel();
}

function handleDamage(damage, x, y) {
	state.currentHealth -= damage;
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
	state.snakes = [];
	state.currentKeys = 0;
	state.doorLocked = true;
	state.currentLootIndex = 0;
	state.currentLootTable = generateLootTable(chuteCount, doorCount, keyCount);
	state.currentTileTable = fisherYatesShuffle(generateTileTable());
	generateWorld();
	state.currentLevel += 1;
	updateGoldDisplay();
}

function startNewGame() {
	clearSave();
	state.playerX = Math.floor(worldSize / 2);
	state.playerY = Math.floor(worldSize / 2);
	state.gold = 0;
	state.swords = 0;
	state.currentHealth = maxHealth;
	state.currentLevel = startingLevel;
	state.currentChutes = 0;
	state.currentMoves = 0;
	state.snakesCount = startingSnakesCount;
	timer.reset();
	timer.start();
	setupLevel(0, 1, 1);
}

function advanceLevel() {
	state.snakesCount += 1;
	const isFinalLevel = state.currentLevel === 9;
	const chuteCount = isFinalLevel ? 1 : 0;
	const doorCount = isFinalLevel ? 0 : 1;
	const keyCount = isFinalLevel ? 0 : 1;
	setupLevel(chuteCount, doorCount, keyCount);
	saveGame();
}
