function canSnakeMoveToTile(tile, x, y) {
	const blockingClasses = [TREE, ROCK, SNAKE, DOOR, KEY, CHUTE];
	const isBlocking = blockingClasses.some(className => hasClass(tile, className));
	return !isBlocking;
}

function snakeMove(snake, oldTile, newTile, newX, newY) {
	if(!oldTile || !newTile) {
		const text = !oldTile ? "oldTile" : "newTile";
		console.log("No tile: " + text);
		return;
	}

	if(snake.justSpawned) {
		snake.justSpawned = false;
		return;
	}

	if(canSnakeMoveToTile(newTile, newX, newY)) {
		removeClass(oldTile, SNAKE);
		setTile(oldTile, '');
		const isHole = hasClass(newTile, HOLE);
		const isPlayer = hasClass(newTile, NINJA);
		const shouldDie = isHole || (isPlayer && state.currentHealth > 1);

		if(hasClass(newTile, NINJA)) {
			if(state.currentHealth <= 1) {
				notify(SKULL, newTile);
			}
			handleDamage(1, newTile);
		}

		if(shouldDie) {
			killSnake(snake.x, snake.y);
			notify(SKULL, isHole ? newTile : oldTile);
		} else {
			setTile(newTile, SNAKE);
			removeClasses(newTile, [GOLD, SWORD, HEART, COIN, GEM]);
			snake.x = newX;
			snake.y = newY;
		}
	}
}

function killSnake(x, y) {
	state.snakes = state.snakes.filter(snake => !(snake.x === x && snake.y === y));
}

function addSnake(x, y) {
	state.snakes.push({ x, y, justSpawned: true });
}

function moveSnakes() {
	for(const snake of state.snakes) {
		const direction = getRandomDirection();
		const selector = "p" + [snake.x, snake.y].toString().replace(",", "-");
		const tile = document.getElementsByClassName(selector)[0];
		const { newTile, newX, newY } = getNewTileInDirection(direction, snake.x, snake.y);
		snakeMove(snake, tile, newTile, newX, newY);
	}
}
