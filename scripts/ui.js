const alertMessages = {
	welcome: `Welcome to Ninjack! A rogue-like puzzle-ish dungeon crawler game! Let me know if you love it or have any issues! And good luck!\n\nCan you escape Level 🚪10 of the Forest?`,
	nextLevel: 'Next level!',
	death: () => `You died 💀 on Level ${state.currentLevel}${state.ngPlus ? '+' : ''}!`,
	win: () => `Take a screenshot! 📸\nYou escaped the Forest!\n\nFinal score:\n💰${state.gold} Gold\n⏺️${state.currentMoves} Moves\n🕥${timer.value()} Seconds\n\nReady to beat your score?`,
	winNgPlus: () => `Take a screenshot! 📸\nYou escaped the Forest... in New Game+!\n\nFinal score:\n💰${state.gold} Gold\n⏺️${state.currentMoves} Moves\n🕥${timer.value()} Seconds\n\nReady to beat your score?`
};

function updateGoldDisplay() {
	const inventory = document.getElementById('inventory');
	const stats = document.getElementById('stats');
	const dynamicText = state.currentChutes > 0
		? ` 🪂${state.currentChutes}`
		: (state.ngPlus && state.currentLevel === 9)
			? ` 🗝️${state.houseKeys}`
			: ` 🔑${state.currentKeys}`;
	const levelStr = `🚪${state.currentLevel}${state.ngPlus ? '+' : ''}`;
	inventory.textContent = `${levelStr} ❤️${state.currentHealth} 🗡${state.swords}${dynamicText}`;
	stats.textContent = `💰${state.gold} ⏺️${state.currentMoves} 🕥${timer.value()}`;
}

function notify(emoji, targetElement) {
	const container = document.getElementById('notification-container');

	const rect = targetElement.getBoundingClientRect();

	const emojiElement = document.createElement('div');
	emojiElement.textContent = emoji;
	emojiElement.classList.add('emoji-notification');

	emojiElement.style.width = 'auto';
	emojiElement.style.whiteSpace = 'nowrap';
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

function notifyEcho(emoji, direction, sourceElement) {
	const container = document.getElementById('notification-container');
	const rect = sourceElement.getBoundingClientRect();

	const el = document.createElement('div');
	el.textContent = emoji;
	el.classList.add('knockback-echo');

	const dist = rect.width * 2;
	const translate = {
		up:    `0px, -${dist}px`,
		down:  `0px,  ${dist}px`,
		left:  `-${dist}px, 0px`,
		right: ` ${dist}px, 0px`,
	};
	el.style.setProperty('--kb-translate', translate[direction]);
	el.style.width      = `${rect.width}px`;
	el.style.height     = `${rect.height}px`;
	el.style.fontSize   = `${rect.height * 0.8}px`;
	el.style.lineHeight = `${rect.height}px`;
	el.style.left       = `${rect.left}px`;
	el.style.top        = `${rect.top}px`;

	container.appendChild(el);
	el.addEventListener('animationend', () => el.remove());
}

function notifyKnockbackEcho(direction, sourceElement) {
	notifyEcho(NINJA, direction, sourceElement);
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
		modal.querySelector('#modal-ok').addEventListener('click', () => {
			modal.remove();
			resolve(true);
		});
	});
}

function disableButtons() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => { button.disabled = true; });
	state.setButtonsDisabled(true);
}

function enableButtons() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => { button.disabled = false; });
	state.setButtonsDisabled(false);
}
