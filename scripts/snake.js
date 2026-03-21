function canSnakeMoveToTile(x, y) {
	const tileValue = getGridTile(x, y);
	return ![TREE, ROCK, SNAKE, DOOR, KEY, CHUTE].includes(tileValue);
}

function snakeMove(snake, newX, newY) {
	if (snake.justSpawned) {
		snake.justSpawned = false;
		return;
	}
	if (!canSnakeMoveToTile(newX, newY)) return;

	const tileValue = getGridTile(newX, newY);
	const isHole = tileValue === HOLE;
	const isPlayer = tileValue === NINJA;
	const shouldDie = isHole || (isPlayer && state.currentHealth > 1);

	if (isPlayer) {
		if (state.currentHealth <= 1) notify(SKULL, getTileElement(newX, newY));
		handleDamage(1, newX, newY);
	}

	setGridTile(snake.x, snake.y, '');

	if (shouldDie) {
		const notifyEl = isHole
			? getTileElement(newX, newY)
			: getTileElement(snake.x, snake.y);
		killSnake(snake.x, snake.y);
		notify(SKULL, notifyEl);
	} else {
		setGridTile(newX, newY, SNAKE);
		snake.x = newX;
		snake.y = newY;
	}
}

function killSnake(x, y) {
	state.snakes = state.snakes.filter(s => !(s.x === x && s.y === y));
}

function addSnake(x, y) {
	state.snakes.push({ x, y, justSpawned: true });
}

function moveSnakes() {
	for (const snake of [...state.snakes]) {
		const { newX, newY } = getNewTileInDirection(getRandomDirection(), snake.x, snake.y);
		snakeMove(snake, newX, newY);
	}
}
