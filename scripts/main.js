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

	// Pre-render world before menu — load save if available, otherwise generate a new game
	const hasSave = await loadGame();
	if (!hasSave) {
		startNewGame();
	}
	timer.stop();

	await showMainMenu(hasSave);
	state.buttonsDisabled = false;

	if (hasSave) {
		timer.start();
	} else {
		timer.reset();
		await showModal(alertMessages.welcome);
		timer.start();
	}
}

main();
