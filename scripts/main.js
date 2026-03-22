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

	// Pre-render a world so something is visible behind the menu blur
	state.setPlayer(Math.floor(worldSize / 2), Math.floor(worldSize / 2));
	setupLevel(0, 1, 1);

	await showMainMenu();
	if (!await loadGame()) {
		await showModal(alertMessages.welcome);
		startNewGame();
	}
}

main();
