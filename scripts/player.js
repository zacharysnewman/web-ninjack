function checkForMissingKey() {
	const hasTree = state.grid.some(row => row.includes(TREE));
	if (hasTree) return;

	const hasKey = state.grid.some(row => row.includes(KEY));
	if (hasKey) return;

	if (state.doorLocked && state.currentKeys < 1) {
		state.giveKey();
		updateGoldDisplay();
	}
}

function collectGold(x, y, amount) {
	state.addGold(amount);
	updateGoldDisplay();
	const symbol = amount >= 10 ? GEM : amount >= 5 ? GOLD : COIN;
	notify(symbol, getTileElement(x, y));
	setGridTile(x, y, '');
}

function collectItem(x, y, symbol, stateFn) {
	stateFn();
	updateGoldDisplay();
	notify(symbol, getTileElement(x, y));
	setGridTile(x, y, '');
}

function interactWithSnake(newX, newY) {
	const playerEl = getTileElement(state.playerX, state.playerY);
	const snakeEl = getTileElement(newX, newY);
	const canFight = state.swords > 0 || state.currentHealth > 1;

	if (canFight) {
		setGridTile(newX, newY, '');
		notify(SKULL, snakeEl);
		killSnake(newX, newY);
	} else {
		notify(SKULL, playerEl);
	}

	if (state.swords > 0) {
		const loot = GOLD;
		setGridTile(newX, newY, loot);
		state.useSword();
		updateGoldDisplay();
		notify(SWORD, playerEl);
		notify(SKULL, snakeEl);
		return true;
	}

	handleDamage(1, state.playerX, state.playerY);
	return true;
}

function interactWithDoor(newX, newY) {
	if (state.doorLocked) {
		if (state.currentKeys > 0) {
			state.useKey();
			updateGoldDisplay();
			state.unlockDoor();
			notify(UNLOCK, getTileElement(newX, newY));
		} else {
			notify(LOCK, getTileElement(newX, newY));
		}
		saveGame();
		return true;
	}

	notify(DOOR, getTileElement(newX, newY));
	setGridTile(state.playerX, state.playerY, '');
	state.setPlayer(newX, newY);
	setGridTile(newX, newY, NINJA);
	endGame();
	return true;
}

function interactWithHole(newX, newY) {
	if (state.currentChutes > 0) {
		setGridTile(state.playerX, state.playerY, '');
		notify(CHUTE, getTileElement(newX, newY));
		handleWin();
	} else {
		notify(SKULL, getTileElement(newX, newY));
		handleDamage(state.currentHealth, state.playerX, state.playerY);
	}
	return true;
}

function interactWithVegetation(newX, newY) {
	const isRock = getGridTile(newX, newY) === ROCK;
	const revealedTile = isRock ? state.drawRockLoot() : state.drawLoot();
	if (revealedTile === SNAKE) addSnake(newX, newY);
	setGridTile(newX, newY, revealedTile);
	notify(isRock ? ROCK : TREE, getTileElement(newX, newY));
	return false;
}

function interactWithOpenTile(newX, newY) {
	const tileValue = getGridTile(newX, newY);

	if (tileValue === GOLD)       { collectGold(newX, newY, 5); }
	else if (tileValue === COIN)  { collectGold(newX, newY, 1); }
	else if (tileValue === GEM)   { collectGold(newX, newY, 10); }
	else if (tileValue === SWORD) { collectItem(newX, newY, SWORD, () => state.addSword()); }
	else if (tileValue === HEART) { collectItem(newX, newY, HEART, () => state.heal()); }
	else if (tileValue === KEY)   { collectItem(newX, newY, KEY,   () => state.giveKey()); }
	else if (tileValue === CHUTE) {
		collectItem(newX, newY, CHUTE, () => state.giveChute());
		handleFinalBoss();
	} else if (tileValue === SNAKE) {
		return interactWithSnake(newX, newY);
	}

	return false;
}

function movePlayerTo(newX, newY) {
	setGridTile(state.playerX, state.playerY, '');
	state.setPlayer(newX, newY);
	setGridTile(newX, newY, NINJA);
}

function move(direction) {
	checkForMissingKey();
	state.incrementMoves();
	updateGoldDisplay();

	const { newX, newY } = getNewTileInDirection(direction, state.playerX, state.playerY);
	const tileValue = getGridTile(newX, newY);

	if (tileValue === HOLE) {
		interactWithHole(newX, newY);
		return;
	}

	if (tileValue === TREE || tileValue === ROCK) {
		interactWithVegetation(newX, newY);
		moveSnakes();
		saveGame();
		return;
	}

	if (tileValue === DOOR) {
		interactWithDoor(newX, newY);
		return;
	}

	const didEarlyReturn = interactWithOpenTile(newX, newY);
	if (didEarlyReturn) return;

	movePlayerTo(newX, newY);
	moveSnakes();
	saveGame();
}
