function endGame() {
	resetGame(false);
}

function handleDamage(damage, currentTile) {
	state.currentHealth -= damage;
	updateGoldDisplay();

	if(state.currentHealth <= 0) {
		handleDeath(currentTile);
	} else {
		notify(DAMAGE, currentTile);
	}
}

function handleDeath(currentTile) {
	clearSave();
	timer.stop();
	setTile(currentTile, '');
	removeClass(currentTile, NINJA);

	const delay = 1000;
	disableButtons();
	setTimeout(async () => {
		await showModal(alertMessages.death());
		resetGame();
		enableButtons();
	}, delay);
}

function handleFinalBoss() {
	state.rocks.forEach(rock => {
		removeClass(rock.tile, ROCK);
		notify(ROCK, rock.tile);
		setTile(rock.tile, SNAKE);
		addSnake(rock.x, rock.y);
	});
}

function handleWin() {
	timer.stop();
	const delay = 1000;
	disableButtons();
	setTimeout(async () => {
		await showModal(alertMessages.win());
		resetGame();
		enableButtons();
	}, delay);
}

function resetGame(newGame = true) {
	let chuteCount = 0;
	let doorCount = 1;
	let keyCount = 1;

	if(newGame) {
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
	} else {
		state.snakesCount += 1;
		if(state.currentLevel === 9) {
			chuteCount = 1;
			doorCount = 0;
			keyCount = 0;
		}
	}

	state.snakes = [];
	state.currentKeys = 0;
	state.doorLocked = true;

	state.currentLootIndex = 0;
	state.currentLootTable = generateLootTable(chuteCount, doorCount, keyCount);
	state.currentTileTable = fisherYatesShuffle([...tileTable]);
	generateWorld();
	state.currentLevel += 1;
	updateGoldDisplay();

	if(!newGame) {
		saveGame();
	}
}
