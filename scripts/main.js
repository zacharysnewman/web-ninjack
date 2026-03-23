/* New Features:
- Moving Snakes
- Unlocking Doors
- Cool Animations
- Level 10 Mini Boss
- Winning
*/

const onKeyDown = (event) => {
	if(state.buttonsDisabled) {
		return;
	}

	switch (event.key) {
		case 'ArrowUp':
			move('up');
			event.preventDefault();
			break;
		case 'ArrowLeft':
			move('left');
			event.preventDefault();
			break;
		case 'ArrowRight':
			move('right');
			event.preventDefault();
			break;
		case 'ArrowDown':
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

	const saveJson = localStorage.getItem(SAVE_KEY);
	let saveLevel = null;
	if (saveJson) {
		try {
			saveLevel = JSON.parse(saveJson).currentLevel;
			if (typeof saveLevel !== 'number' || saveLevel < 1) saveLevel = null;
		} catch(e) {}
	}
	generateBackground();

	const ngPlusAvailable = localStorage.getItem('ngPlusUnlocked') === 'true' || devMode;
	const onNgPlus = ngPlusAvailable ? () => startNewGamePlus() : null;

	const menuPromise = showMainMenu(
		saveLevel,
		async () => {
			const loaded = await loadGame();
			if (!loaded) startNewGame();
		},
		() => startNewGame(),
		onNgPlus
	);

	await showModal(alertMessages.welcome);
	await menuPromise;
	state.setButtonsDisabled(false);
}

main();

if (devMode) {
	const btn = document.createElement('button');
	btn.id = 'debug-max-btn';
	btn.textContent = '⚡ Max';
	btn.title = 'Set health & swords to 99';
	btn.addEventListener('click', debugMaxStats);
	document.body.appendChild(btn);
}
