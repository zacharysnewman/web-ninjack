function canSnakeMoveToTile(x, y) {
	return ![TREE, ROCK, SNAKE, SCORPION, DOOR, KEY, CHUTE].includes(getGridTile(x, y));
}

function canScorpionMoveToTile(x, y) {
	return ![TREE, ROCK, SNAKE, SCORPION, DOOR, KEY, CHUTE].includes(getGridTile(x, y));
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
		state.removeSnake(snake.x, snake.y);
		notify(SKULL, notifyEl);
	} else {
		setGridTile(newX, newY, SNAKE);
		snake.x = newX;
		snake.y = newY;
	}
}

function scorpionMove(scorpion, newX, newY) {
	if (scorpion.justSpawned) {
		scorpion.justSpawned = false;
		return;
	}
	if (!canScorpionMoveToTile(newX, newY)) return;

	const tileValue = getGridTile(newX, newY);
	const isHole = tileValue === HOLE;
	const isPlayer = tileValue === NINJA;
	const shouldDie = isHole || (isPlayer && state.currentHealth > 2);

	if (isPlayer) {
		if (state.currentHealth <= 2) notify(SKULL, getTileElement(newX, newY));
		handleDamage(2, newX, newY);
	}

	setGridTile(scorpion.x, scorpion.y, '');

	if (shouldDie) {
		const notifyEl = isHole
			? getTileElement(newX, newY)
			: getTileElement(scorpion.x, scorpion.y);
		state.removeScorpion(scorpion.x, scorpion.y);
		notify(SKULL, notifyEl);
	} else {
		setGridTile(newX, newY, SCORPION);
		scorpion.x = newX;
		scorpion.y = newY;
	}
}

function killSnake(x, y) {
	state.removeSnake(x, y);
}

function killScorpion(x, y) {
	state.removeScorpion(x, y);
}

function addSnake(x, y) {
	state.addSnake({ x, y, justSpawned: true });
}

function addScorpion(x, y) {
	state.addScorpion({ x, y, justSpawned: true, armored: true });
}

function moveSnakes() {
	for (const snake of [...state.snakes]) {
		const { newX, newY } = getNewTileInDirection(getRandomDirection(), snake.x, snake.y);
		snakeMove(snake, newX, newY);
	}
}

function moveScorpions() {
	for (const scorpion of [...state.scorpions]) {
		const { newX, newY } = getNewTileInDirection(getRandomDirection(), scorpion.x, scorpion.y);
		scorpionMove(scorpion, newX, newY);
	}
}
