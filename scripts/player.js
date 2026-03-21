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

function move(direction) {
	checkForMissingKey();
	state.currentMoves += 1;
	updateGoldDisplay();
	const currentTile = document.querySelector(`.tile.${NINJA}`);
	let shouldEndGame = false;
	const { newTile, newX, newY } = getNewTileInDirection(direction, state.playerX, state.playerY);

	if(hasClass(newTile, HOLE)) {
		if(state.currentChutes > 0) {
			setTile(currentTile, '');
			removeClass(currentTile, NINJA);
			notify(CHUTE, newTile);
			handleWin();
		} else {
			notify(SKULL, newTile);
			handleDamage(state.currentHealth, currentTile);
		}
		return;
	} else if (hasClass(newTile, TREE) || hasClass(newTile, ROCK)) {
		isRock = hasClass(newTile, ROCK);
		removeClass(newTile, TREE);
		removeClass(newTile, ROCK);

		const revealedTile = isRock ? SNAKE : state.currentLootTable[state.currentLootIndex++];
		if(revealedTile === SNAKE) {
			addSnake(newX, newY);
		}
		setTile(newTile, revealedTile);
		notify(isRock ? ROCK : TREE, newTile);
	} else if(hasClass(newTile, DOOR)) {
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
			return;
		}

		currentTile.textContent = '';
		removeClass(currentTile, NINJA);

		state.playerX = newX;
		state.playerY = newY;

		newTile.textContent = NINJA;
		newTile.classList.add(NINJA);
		notify(DOOR, newTile);
		endGame();
		return;
	} else {
		if (hasClass(newTile, GOLD)) {
			const goldAmount = 5;
			state.gold += goldAmount;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, GOLD);
			notify(GOLD, newTile);
		} else if (hasClass(newTile, COIN)) {
			const goldAmount = 1;
			state.gold += goldAmount;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, COIN);
			notify(COIN, newTile);
		} else if (hasClass(newTile, GEM)) {
			const goldAmount = 10;
			state.gold += goldAmount;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, GEM);
			notify(GEM, newTile);
		} else if(hasClass(newTile, SWORD)) {
			state.swords++;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, SWORD);
			notify(SWORD, newTile);
		} else if(hasClass(newTile, HEART)) {
			state.currentHealth += 1;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, HEART);
			notify(HEART, newTile);
		} else if(hasClass(newTile, KEY)) {
			state.currentKeys = 1;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, KEY);
			notify(KEY, newTile);
		} else if(hasClass(newTile, CHUTE)) {
			state.currentChutes = 1;
			updateGoldDisplay();
			newTile.textContent = '';
			removeClass(newTile, CHUTE);
			notify(CHUTE, newTile);
			handleFinalBoss();
		} else if(hasClass(newTile, SNAKE)) {
			if(state.swords > 0 || state.currentHealth > 1) {
				setTile(newTile, '');
				removeClass(newTile, SNAKE);
				notify(SKULL, newTile);
				killSnake(newX, newY);
			} else {
				notify(SKULL, currentTile);
			}

			if(state.swords > 0) {
				const isHeart = getRandomInRange(1, 100) > 80;
				const lootDrop = isHeart ? HEART : GOLD;
				setTile(newTile, lootDrop);
				state.swords--;
				updateGoldDisplay();
				notify(SWORD, currentTile);
				notify(SKULL, newTile);
				return;
			} else {
				handleDamage(1, currentTile);
				return;
			}
		}

		currentTile.textContent = '';
		removeClass(currentTile, NINJA);

		state.playerX = newX;
		state.playerY = newY;

		newTile.textContent = NINJA;
		newTile.classList.add(NINJA);
	}

	moveSnakes();
	saveGame();
}
