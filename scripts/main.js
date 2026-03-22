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

	const hasSave = !!localStorage.getItem(SAVE_KEY);
	generateBackground();

	const menuPromise = showMainMenu(hasSave, async () => {
		if (hasSave) {
			const loaded = await loadGame();
			if (!loaded) startNewGame();
		} else {
			startNewGame();
		}
	});

	if (!hasSave) await showModal(alertMessages.welcome);
	await menuPromise;
	state.buttonsDisabled = false;
}

main();
