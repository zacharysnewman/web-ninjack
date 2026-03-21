const alertMessages = {
	welcome: `Welcome to Ninjack! A rogue-like puzzle-ish dungeon crawler game! Let me know if you love it or have any issues! And good luck!\n\nCan you escape Level 🚪10 of the Forest?`,
	nextLevel: 'Next level!',
	death: () => `You died 💀 on Level ${state.currentLevel}!`,
	win: () => `Take a screenshot! 📸\nYou escaped the Forest!\n\nFinal score:\n💰${state.gold} Gold\n⏺️${state.currentMoves} Moves\n🕥${timer.value()} Seconds\n\nReady to beat your score?`
};

function updateGoldDisplay() {
	const inventory = document.getElementById('inventory');
	const stats = document.getElementById('stats');
	const dynamicText = state.currentChutes > 0 ? ` 🪂${state.currentChutes}` : `🔑${state.currentKeys}`;
	inventory.textContent = `🚪${state.currentLevel} ❤️${state.currentHealth} 🗡${state.swords}${dynamicText}`;
	stats.textContent = `💰${state.gold} ⏺️${state.currentMoves} 🕥${timer.value()}`;
}

function notify(emoji, targetElement) {
	const container = document.getElementById('notification-container');

	const rect = targetElement.getBoundingClientRect();

	const emojiElement = document.createElement('div');
	emojiElement.textContent = emoji;
	emojiElement.classList.add('emoji-notification');

	emojiElement.style.width = `${rect.width}px`;
	emojiElement.style.height = `${rect.height}px`;
	emojiElement.style.fontSize = `${rect.height * 0.8}px`;
	emojiElement.style.lineHeight = `${rect.height}px`;

	container.appendChild(emojiElement);
	const emojiRect = emojiElement.getBoundingClientRect();

	const x = rect.left + rect.width / 2 - emojiRect.width / 2;
	const y = rect.top + rect.height / 2 - emojiRect.height / 2;

	emojiElement.style.left = `${x}px`;
	emojiElement.style.top = `${y}px`;

	emojiElement.addEventListener('animationend', () => {
		emojiElement.remove();
	});
}

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

	return new Promise((resolve) => {
		modal.querySelector('#modal-ok').onclick = () => {
			document.body.removeChild(modal);
			resolve(true);
		};
	});
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
