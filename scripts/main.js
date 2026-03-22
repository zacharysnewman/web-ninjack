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
		try { saveLevel = JSON.parse(saveJson).currentLevel; } catch(e) {}
	}
	generateBackground();

	const menuPromise = showMainMenu(
		saveLevel,
		async () => {
			const loaded = await loadGame();
			if (!loaded) startNewGame();
		},
		() => startNewGame()
	);

	await showModal(alertMessages.welcome);
	await menuPromise;
	state.setButtonsDisabled(false);
}

main();
