function canSnakeMoveToTile(x, y) {
	return ![TREE, TREE_NG, ROCK, MOAI, SNAKE, CRAB, SCORPION, DOOR, KEY, CHUTE, HOUSE, HOUSE_DAMAGED].includes(getGridTile(x, y));
}

function canCrabMoveToTile(x, y) {
	return ![TREE, TREE_NG, ROCK, MOAI, SNAKE, CRAB, SCORPION, DOOR, KEY, CHUTE, HOUSE, HOUSE_DAMAGED].includes(getGridTile(x, y));
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

function crabMove(crab, newX, newY) {
	if (crab.justSpawned) {
		crab.justSpawned = false;
		return;
	}
	if (!canCrabMoveToTile(newX, newY)) return;
	// Boss scorpion can't fall into the hole — it must be killed by the player
	if (crab.tile === SCORPION && getGridTile(newX, newY) === HOLE) return;

	const tileValue = getGridTile(newX, newY);
	const isHole = tileValue === HOLE;
	const isPlayer = tileValue === NINJA;
	const shouldDie = isHole || (isPlayer && state.currentHealth > 2);

	if (isPlayer) {
		if (state.currentHealth <= 2) notify(SKULL, getTileElement(newX, newY));
		handleDamage(2, newX, newY);
	}

	setGridTile(crab.x, crab.y, '');

	if (shouldDie) {
		const notifyEl = isHole
			? getTileElement(newX, newY)
			: getTileElement(crab.x, crab.y);
		state.removeCrab(crab.x, crab.y);
		notify(SKULL, notifyEl);
	} else {
		setGridTile(newX, newY, crab.tile || CRAB);
		crab.x = newX;
		crab.y = newY;
	}
}

function killSnake(x, y) {
	state.removeSnake(x, y);
}

function killCrab(x, y) {
	state.removeCrab(x, y);
}

function addSnake(x, y) {
	state.addSnake({ x, y, justSpawned: true });
}

function addCrab(x, y) {
	state.addCrab({ x, y, justSpawned: true, armored: 1, tile: CRAB });
}

function addBoss(x, y) {
	state.addCrab({ x, y, justSpawned: true, armored: 2, tile: SCORPION });
}

function moveSnakes() {
	for (const snake of [...state.snakes]) {
		const { newX, newY } = getNewTileInDirection(getRandomDirection(), snake.x, snake.y);
		snakeMove(snake, newX, newY);
	}
}

function moveCrabs() {
	for (const crab of [...state.crabs]) {
		const { newX, newY } = getNewTileInDirection(getRandomDirection(), crab.x, crab.y);
		crabMove(crab, newX, newY);
	}
}
