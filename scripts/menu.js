const SKIN_OPTIONS = ['🥷', '🥷🏻', '🥷🏼', '🥷🏽', '🥷🏾', '🥷🏿'];
const SKIN_KEY = 'ninjaSkin';

function showMainMenu() {
	state.buttonsDisabled = true;
	return new Promise(resolve => {
		const menu = document.createElement('div');
		menu.id = 'main-menu';
		menu.innerHTML = `
			<h1 class="outlined menu-title">NINJACK</h1>
			<div id="menu-ninja-bg">${NINJA}</div>
			<button id="menu-start">▶ Start</button>
			<div class="skin-dropdown-wrapper">
				<div class="skin-dropdown-popup" id="skin-popup" hidden></div>
				<button class="skin-dropdown-btn" id="skin-dropdown-btn">${NINJA}</button>
			</div>
		`;
		document.body.appendChild(menu);

		const popup = menu.querySelector('#skin-popup');
		const dropdownBtn = menu.querySelector('#skin-dropdown-btn');

		SKIN_OPTIONS.forEach(skin => {
			const btn = document.createElement('button');
			btn.className = 'skin-option' + (skin === NINJA ? ' skin-selected' : '');
			btn.textContent = skin;
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				NINJA = skin;
				localStorage.setItem(SKIN_KEY, skin);
				menu.querySelector('#menu-ninja-bg').textContent = skin;
				dropdownBtn.textContent = skin;
				popup.querySelectorAll('.skin-option').forEach(b =>
					b.classList.toggle('skin-selected', b.textContent === skin)
				);
				popup.hidden = true;
			});
			popup.appendChild(btn);
		});

		dropdownBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			popup.hidden = !popup.hidden;
		});

		document.addEventListener('click', () => { popup.hidden = true; });

		menu.querySelector('#menu-start').addEventListener('click', () => {
			menu.remove();
			resolve();
		});
	});
}
