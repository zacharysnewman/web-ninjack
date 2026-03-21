/* New Features:
- Moving Snakes
- Unlocking Doors
- Cool Animations
- Level 10 Mini Boss
- Winning
*/
// 🌲🪨💰🐍🗡🥷🚪❤️💀

/* Constants */
const SNAKE = "🐍";
const ROCK = "🪨";
const TREE = "🌲";
const HOLE = "🕳️";
const CHUTE = '🪂';
const KEY = "🔑";
const LOCK = "🔒";
const UNLOCK = "🔐";
const COIN = "🪙";
const GOLD = "💰";
const GEM = "💎";
const SWORD = "🗡";
const NINJA = "🥷";
const DOOR = "🚪";
const HEART = "❤️";
const DAMAGE = "💔";
const SKULL = "💀";
const startingLevel = 0;
const maxHealth = 5;
const startingSnakesCount = 0;
const startingHeadStonesCount = 0;

/* State */
const state = {
	playerX: 0,
	playerY: 0,
	centerTile: null,
	gold: 0,
	swords: 0,
	currentLootTable: [],
	currentLootIndex: 0,
	currentTileTable: [],
	currentLevel: startingLevel,
	currentHealth: maxHealth,
	currentKeys: 0,
	currentChutes: 0,
	currentMoves: 0,
	snakesCount: startingSnakesCount,
	snakes: [],
	rocks: [],
	doorLocked: true,
	buttonsDisabled: false,
};

/* Alert Messages */
const alertMessages = {
	welcome: `Welcome to Ninjack! A rogue-like puzzle-ish dungeon crawler game! Let me know if you love it or have any issues! And good luck!\n\nCan you escape Level 🚪10 of the Forest?`,
	nextLevel: 'Next level!',
	death: () => `You died 💀 on Level ${state.currentLevel}!`,
	win: () => `Take a screenshot! 📸\nYou escaped the Forest!\n\nFinal score:\n💰${state.gold} Gold\n⏺️${state.currentMoves} Moves\n🕥${timer.value()} Seconds\n\nReady to beat your score?`
};

/* World Constants */
const worldSize = 9;
const totalTiles = worldSize * worldSize;
const rockCount = 15;
const holeCount = 1;
const playerCount = 1;
const treeCount = totalTiles - playerCount - holeCount - rockCount;

/* lootTable */
const swordsCount = 5;
const goldBagsCount = 7;
const gemCount = 1;

/* START Timer Class */
class Timer {
  constructor() {
	this.seconds = 0; // Keeps track of elapsed seconds
	this.interval = null; // Stores the interval ID
	this.timeUpdateCallback = null; // Callback for time updates
  }

  start() {
	if (this.interval) {
	  console.warn('Timer is already running.');
	  return;
	}
	this.interval = setInterval(() => {
	  this.seconds++;
	  if (this.timeUpdateCallback) {
		this.timeUpdateCallback(this.seconds); // Call the time update callback
	  }
	}, 1000);
  }

  stop() {
	if (!this.interval) {
	  console.warn('Timer is not running.');
	  return;
	}
	clearInterval(this.interval);
	this.interval = null;
  }

  reset() {
	this.stop();
	this.seconds = 0;
  }

  value() {
	return this.seconds;
  }

  setTimeUpdateCallback(callback) {
	if (typeof callback === 'function') {
	  this.timeUpdateCallback = callback;
	} else {
	  console.error('Provided callback is not a function.');
	}
  }

  clearTimeUpdateCallback() {
	this.timeUpdateCallback = null;
  }
}
/* END Timer Class */
const timer = new Timer();
timer.setTimeUpdateCallback(() => {
	updateGoldDisplay();
	saveGame();
});

// Function to show a modal and wait for user confirmation
async function showModal(bodyText) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>${bodyText}</p>
      <button class="modal-button" id="modal-ok">OK</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Return a promise that resolves when the modal is dismissed
  return new Promise((resolve) => {
    modal.querySelector('#modal-ok').onclick = () => {
      document.body.removeChild(modal);
      resolve(true);
    };
  });
}



/* Save Game */
const SAVE_KEY = 'ninjack_save';
const SAVE_HASH_KEY = 'ninjack_save_hash';

async function hashString(str) {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
	return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function saveGame() {
	const tiles = document.querySelectorAll('.tile');
	const gridState = Array.from(tiles).map(tile => tile.textContent);
	const saveData = {
		playerX: state.playerX, playerY: state.playerY,
		currentHealth: state.currentHealth, currentLevel: state.currentLevel,
		gold: state.gold, swords: state.swords,
		currentKeys: state.currentKeys, currentChutes: state.currentChutes,
		currentMoves: state.currentMoves, snakesCount: state.snakesCount,
		doorLocked: state.doorLocked,
		currentLootTable: state.currentLootTable, currentLootIndex: state.currentLootIndex,
		currentTileTable: state.currentTileTable,
		snakes: state.snakes.map(s => ({ x: s.x, y: s.y })),
		timerSeconds: timer.value(),
		gridState
	};
	const json = JSON.stringify(saveData);
	const hash = await hashString(json);
	localStorage.setItem(SAVE_KEY, json);
	localStorage.setItem(SAVE_HASH_KEY, hash);
}

function clearSave() {
	localStorage.removeItem(SAVE_KEY);
	localStorage.removeItem(SAVE_HASH_KEY);
}

function restoreWorld(gridState) {
	state.rocks = [];
	const world = document.getElementById('world');
	world.innerHTML = '';
	let gridIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile';
			const content = gridState[gridIndex++];
			setTile(tile, content);
			if (content === NINJA) state.centerTile = tile;
			if (content === ROCK) state.rocks.push({ tile, x, y });
			tile.classList.add("p" + [x, y].toString().replace(",", "-"));
			world.appendChild(tile);
		}
	}
}

async function loadGame() {
	const json = localStorage.getItem(SAVE_KEY);
	if (!json) return false;
	try {
		const storedHash = localStorage.getItem(SAVE_HASH_KEY);
		const computedHash = await hashString(json);
		if (storedHash !== computedHash) {
			clearSave();
			return false;
		}
		const d = JSON.parse(json);
		state.playerX = d.playerX; state.playerY = d.playerY;
		state.currentHealth = d.currentHealth; state.currentLevel = d.currentLevel;
		state.gold = d.gold; state.swords = d.swords;
		state.currentKeys = d.currentKeys; state.currentChutes = d.currentChutes;
		state.currentMoves = d.currentMoves; state.snakesCount = d.snakesCount;
		state.doorLocked = d.doorLocked;
		state.currentLootTable = d.currentLootTable; state.currentLootIndex = d.currentLootIndex;
		state.currentTileTable = d.currentTileTable;
		state.snakes = d.snakes.map(s => ({ ...s, justSpawned: false }));
		timer.reset();
		timer.seconds = d.timerSeconds + 1;
		timer.start();
		restoreWorld(d.gridState);
		updateGoldDisplay();
		await saveGame();
		return true;
	} catch (e) {
		clearSave();
		return false;
	}
}

function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const rockTiles = Array(rockCount).fill(ROCK);
const treeTiles = Array(treeCount).fill(TREE);
const holeTiles = Array(holeCount).fill(HOLE);
const tileTable = fisherYatesShuffle([...rockTiles, ...treeTiles, ...holeTiles]);

function generateLootTable(chuteCount, doorCount, keyCount) {
	const remainingCount = treeCount - state.snakesCount - swordsCount - goldBagsCount - gemCount - doorCount - keyCount - chuteCount;
	const snakeDrops = Array(state.snakesCount).fill(SNAKE);
	const swordDrops = Array(swordsCount).fill(SWORD);
	const goldBagDrops = Array(goldBagsCount).fill(COIN);
	const gemDrops = Array(gemCount).fill(GEM);
	const chuteDrop = Array(chuteCount).fill(CHUTE);
	const emptyDrops = Array(remainingCount).fill('');
	const doorDrop = Array(doorCount).fill(DOOR);
	const keyDrop = Array(keyCount).fill(KEY);

	const shuffledDrops = [...fisherYatesShuffle([
		...snakeDrops,
		...swordDrops,
		...goldBagDrops,
		...gemDrops,
		...emptyDrops,
		...doorDrop,
		...keyDrop
	]), ...chuteDrop];

	return shuffledDrops;
}

function generateWorld() {
	state.rocks = [];
	const world = document.getElementById('world');
	world.innerHTML = '';
	let tileIndex = 0;
	for (let y = 0; y < worldSize; y++) {
		for (let x = 0; x < worldSize; x++) {
			const tile = document.createElement('div');
			tile.className = 'tile';

			if (x === state.playerX && y === state.playerY) {
				tile.textContent = NINJA;
				tile.classList.add(NINJA);
				state.centerTile = tile;
			} else {
				const tileValue = state.currentTileTable[tileIndex++];
				if(tileValue === ROCK) {
					state.rocks.push({tile,x,y});
				}
				setTile(tile, tileValue);
			}
			tile.classList.add("p" + [x,y].toString().replace(",", "-"));
			world.appendChild(tile);
		}
	}
}

function updateGoldDisplay() {
	const inventory = document.getElementById('inventory');
	const stats = document.getElementById('stats');
	const dynamicText = state.currentChutes > 0 ? ` 🪂${state.currentChutes}` : `🔑${state.currentKeys}`;
	inventory.textContent = `🚪${state.currentLevel} ❤️${state.currentHealth} 🗡${state.swords}${dynamicText}`;
	stats.textContent = `💰${state.gold} ⏺️${state.currentMoves} 🕥${timer.value()}`;
}

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

function endGame() {
	resetGame(false);
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
	const randomDirection = directions[randomIndex];

	return randomDirection;
}

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

function notify(emoji, targetElement) {
  const container = document.getElementById('notification-container');

  // Get the position and size of the target element (tile)
  const rect = targetElement.getBoundingClientRect();

  // Create the emoji element
  const emojiElement = document.createElement('div');
  emojiElement.textContent = emoji;
  emojiElement.classList.add('emoji-notification');

  // Set the size of the emoji to match the target tile
  emojiElement.style.width = `${rect.width}px`;
  emojiElement.style.height = `${rect.height}px`;
  emojiElement.style.fontSize = `${rect.height * 0.8}px`; // Adjust font size to fit inside the tile
  emojiElement.style.lineHeight = `${rect.height}px`; // Center vertically

  // Temporarily append to calculate the emoji's size
  container.appendChild(emojiElement);
  const emojiRect = emojiElement.getBoundingClientRect();

  // Adjust position to center over the target element
  const x = rect.left + rect.width / 2 - emojiRect.width / 2;
  const y = rect.top + rect.height / 2 - emojiRect.height / 2;

  // Set final position
  emojiElement.style.left = `${x}px`;
  emojiElement.style.top = `${y}px`;

  // Remove the element after the animation is complete
  emojiElement.addEventListener('animationend', () => {
	emojiElement.remove();
  });
}

function getRandomInRange(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function disableButtons() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		button.disabled = true;
	});
	state.buttonsDisabled = true;
}

function enableButtons() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		button.disabled = false;
	});
	state.buttonsDisabled = false;
}

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
	let introText;
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

const onKeyDown = (event) => {
	if(state.buttonsDisabled) {
		return;
	}

	switch (event.key) {
		case 'ArrowUp': // Up arrow key
			move('up');
			event.preventDefault();
			break;
		case 'ArrowLeft': // Left arrow key
			move('left');
			event.preventDefault();
			break;
		case 'ArrowRight': // Right arrow key
			move('right');
			event.preventDefault();
			break;
		case 'ArrowDown': // Down arrow key
			move('down');
			event.preventDefault();
			break;
	}
};

async function main() {
	document.addEventListener('contextmenu', function (event) {
		event.preventDefault();
	});
	document.addEventListener('keydown', onKeyDown);
	if (!await loadGame()) {
		resetGame();
		timer.stop();
		await showModal(alertMessages.welcome);
		resetGame();
	}
}

main();
