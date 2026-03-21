function getTileElement(x, y) {
	return document.querySelector('.p' + x + '-' + y);
}

function getGridTile(x, y) {
	return state.grid[y][x];
}

function setGridTile(x, y, value) {
	state.setCell(x, y, value);
	const tile = getTileElement(x, y);
	tile.className = 'tile p' + x + '-' + y;
	tile.textContent = value;
	if (value) tile.classList.add(value);
}

function getNewTileInDirection(direction, startX, startY) {
	let newX = startX;
	let newY = startY;

	switch (direction) {
		case 'up':    newY = Math.max(0, startY - 1);             break;
		case 'down':  newY = Math.min(worldSize - 1, startY + 1); break;
		case 'left':  newX = Math.max(0, startX - 1);             break;
		case 'right': newX = Math.min(worldSize - 1, startX + 1); break;
	}

	return { newX, newY };
}

function getRandomDirection() {
	const directions = ['up', 'down', 'left', 'right'];
	return directions[Math.floor(Math.random() * directions.length)];
}

function getRandomInRange(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}
