function hasClass(tile, className) {
	return tile.classList.contains(className);
}

function removeClass(tile, className) {
	return tile.classList.remove(className);
}

function removeClasses(tile, classNames) {
	for(const className of classNames) {
		removeClass(tile, className);
	}
}

function setTile(tile, className) {
	if(className !== '') {
		tile.classList.add(className);
	}
	tile.textContent = className;
}

function getNewTileInDirection(direction, startX, startY) {
	let newX = startX;
	let newY = startY;

	switch (direction) {
		case 'up':
			newY = Math.max(0, startY - 1);
		break;
		case 'down':
			newY = Math.min(worldSize - 1, startY + 1);
		break;
		case 'left':
			newX = Math.max(0, startX - 1);
		break;
		case 'right':
			newX = Math.min(worldSize - 1, startX + 1);
		break;
	}

	const newTile = document.querySelector(`.tile:nth-child(${newY * worldSize + newX + 1})`);

	return { newTile, newX, newY };
}

function getRandomDirection() {
	const directions = ['up', 'down', 'left', 'right'];
	const randomIndex = Math.floor(Math.random() * directions.length);
	return directions[randomIndex];
}

function getRandomInRange(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}
