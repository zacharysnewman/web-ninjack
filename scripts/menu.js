const SKIN_OPTIONS = ['🥷', '🥷🏻', '🥷🏼', '🥷🏽', '🥷🏾', '🥷🏿'];
const SKIN_KEY = 'ninjaSkin';

function showMainMenu(saveLevel = null, onContinue = null, onNewGame = () => {}, onNgPlus = null) {
	state.setButtonsDisabled(true);
	return new Promise(resolve => {
		const menu = document.createElement('div');
		menu.id = 'main-menu';

		const hasSave = saveLevel !== null && onContinue !== null;
		const hasNgPlus = onNgPlus !== null;

		let buttonsHtml = '';
		if (hasSave) buttonsHtml += `<button id="menu-continue">Continue at Level ${saveLevel}</button>`;
		buttonsHtml += `<button id="menu-new-game">New Game</button>`;
		if (hasNgPlus) buttonsHtml += `<button id="menu-ng-plus">New Game+</button>`;

		// Centered content
		const content = document.createElement('div');
		content.id = 'menu-content';
		content.innerHTML = `
			<h1 class="menu-title">Ninjack</h1>
			<div id="menu-skin-preview">${NINJA}</div>
			<div class="skin-dropdown-wrapper">
				<span class="skin-label">Ninja</span>
				<div class="skin-dropdown-inner">
					<div class="skin-dropdown-popup" id="skin-popup"></div>
					<button class="skin-dropdown-btn" id="skin-dropdown-btn">${NINJA} ▾</button>
				</div>
			</div>
			${buttonsHtml}
		`;
		menu.appendChild(content);

		document.body.appendChild(menu);

		const popup = menu.querySelector('#skin-popup');
		const dropdownBtn = menu.querySelector('#skin-dropdown-btn');
		const skinPreview = menu.querySelector('#menu-skin-preview');
		let popupOpen = false;

		function closePopup() {
			popupOpen = false;
			popup.classList.remove('open');
		}

		function openPopup() {
			popupOpen = true;
			popup.classList.add('open');
		}

		SKIN_OPTIONS.forEach(skin => {
			const btn = document.createElement('button');
			btn.className = 'skin-option' + (skin === NINJA ? ' skin-selected' : '');
			btn.textContent = skin;
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				NINJA = skin;
				localStorage.setItem(SKIN_KEY, skin);
				dropdownBtn.textContent = skin + ' ▾';
				skinPreview.textContent = skin;
				popup.querySelectorAll('.skin-option').forEach(b =>
					b.classList.toggle('skin-selected', b.textContent === skin)
				);
				closePopup();
			});
			popup.appendChild(btn);
		});

		dropdownBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (popupOpen) {
				closePopup();
			} else {
				openPopup();
			}
		});

		document.addEventListener('click', () => { closePopup(); });

		async function handleAction(callback) {
			menu.querySelectorAll('#menu-continue, #menu-new-game, #menu-ng-plus').forEach(b => b.disabled = true);
			await callback();
			menu.style.opacity = '0';
			menu.addEventListener('transitionend', () => {
				menu.remove();
				resolve();
			}, { once: true });
		}

		if (hasSave) {
			menu.querySelector('#menu-continue').addEventListener('click', () => handleAction(onContinue));
		}
		menu.querySelector('#menu-new-game').addEventListener('click', () => handleAction(onNewGame));
		if (hasNgPlus) {
			menu.querySelector('#menu-ng-plus').addEventListener('click', () => handleAction(onNgPlus));
		}
	});
}
