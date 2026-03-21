function checkForMissingKey() {
	const allTrees = document.querySelectorAll('.' + TREE);
	if(allTrees.length > 0) {
		return;
	}

	const allKeys = document.querySelectorAll('.' + KEY);
	const key = allKeys[0];

	if(key && key.textContent !== KEY) {
		key.textContent = KEY;
		return;
	}

	if(state.doorLocked && state.currentKeys < 1 && !key) {
		state.currentKeys = 1;
		updateGoldDisplay();
	}
}

function collectGold(tile, amount) {
	state.gold += amount;
	updateGoldDisplay();
	setTile(tile, '');
	notify(amount >= 10 ? GEM : amount >= 5 ? GOLD : COIN, tile);
}

function collectItem(tile, symbol, stateFn) {
	stateFn();
	updateGoldDisplay();
	setTile(tile, '');
	notify(symbol, tile);
}

function interactWithSnake(currentTile, newTile, newX, newY) {
	const canFight = state.swords > 0 || state.currentHealth > 1;
	if(canFight) {
		setTile(newTile, '');
		removeClass(newTile, SNAKE);
		killSnake(newX, newY);
	} else {
		notify(SKULL, currentTile);
	}

	if(state.swords > 0) {
		const isHeart = getRandomInRange(1, 100) > 80;
		setTile(newTile, isHeart ? HEART : GOLD);
		state.swords--;
		updateGoldDisplay();
		notify(SWORD, currentTile);
		notify(SKULL, newTile);
		return true;
	}

	handleDamage(1, currentTile);
	return true;
}

function interactWithDoor(currentTile, newTile, newX, newY) {
	if(state.doorLocked) {
		if(state.currentKeys > 0) {
			state.currentKeys = 0;
			updateGoldDisplay();
			state.doorLocked = false;
			notify(UNLOCK, newTile);
		} else {
			notify(LOCK, newTile);
		}
		saveGame();
		return true;
	}

	currentTile.textContent = '';
	removeClass(currentTile, NINJA);
	state.playerX = newX;
	state.playerY = newY;
	newTile.textContent = NINJA;
	newTile.classList.add(NINJA);
	notify(DOOR, newTile);
	endGame();
	return true;
}

function interactWithHole(currentTile, newTile) {
	if(state.currentChutes > 0) {
		setTile(currentTile, '');
		removeClass(currentTile, NINJA);
		notify(CHUTE, newTile);
		handleWin();
	} else {
		notify(SKULL, newTile);
		handleDamage(state.currentHealth, currentTile);
	}
	return true;
}

function interactWithVegetation(newTile, newX, newY) {
	const isRock = hasClass(newTile, ROCK);
	removeClass(newTile, TREE);
	removeClass(newTile, ROCK);

	const revealedTile = isRock ? SNAKE : state.currentLootTable[state.currentLootIndex++];
	if(revealedTile === SNAKE) {
		addSnake(newX, newY);
	}
	setTile(newTile, revealedTile);
	notify(isRock ? ROCK : TREE, newTile);
	return false;
}

function interactWithOpenTile(currentTile, newTile, newX, newY) {
	if (hasClass(newTile, GOLD)) {
		collectGold(newTile, 5);
	} else if (hasClass(newTile, COIN)) {
		collectGold(newTile, 1);
	} else if (hasClass(newTile, GEM)) {
		collectGold(newTile, 10);
	} else if (hasClass(newTile, SWORD)) {
		collectItem(newTile, SWORD, () => state.swords++);
	} else if (hasClass(newTile, HEART)) {
		collectItem(newTile, HEART, () => state.currentHealth++);
	} else if (hasClass(newTile, KEY)) {
		collectItem(newTile, KEY, () => state.currentKeys = 1);
	} else if (hasClass(newTile, CHUTE)) {
		collectItem(newTile, CHUTE, () => state.currentChutes = 1);
		handleFinalBoss();
	} else if (hasClass(newTile, SNAKE)) {
		return interactWithSnake(currentTile, newTile, newX, newY);
	}
	return false;
}

function movePlayerTo(currentTile, newTile, newX, newY) {
	currentTile.textContent = '';
	removeClass(currentTile, NINJA);
	state.playerX = newX;
	state.playerY = newY;
	newTile.textContent = NINJA;
	newTile.classList.add(NINJA);
}

function move(direction) {
	checkForMissingKey();
	state.currentMoves += 1;
	updateGoldDisplay();

	const currentTile = document.querySelector(`.tile.${NINJA}`);
	const { newTile, newX, newY } = getNewTileInDirection(direction, state.playerX, state.playerY);

	if (hasClass(newTile, HOLE)) {
		interactWithHole(currentTile, newTile);
		return;
	}

	if (hasClass(newTile, TREE) || hasClass(newTile, ROCK)) {
		interactWithVegetation(newTile, newX, newY);
		moveSnakes();
		saveGame();
		return;
	}

	if (hasClass(newTile, DOOR)) {
		interactWithDoor(currentTile, newTile, newX, newY);
		return;
	}

	const didEarlyReturn = interactWithOpenTile(currentTile, newTile, newX, newY);
	if (didEarlyReturn) return;

	movePlayerTo(currentTile, newTile, newX, newY);
	moveSnakes();
	saveGame();
}
