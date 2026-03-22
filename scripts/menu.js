const SKIN_OPTIONS = ['🥷', '🥷🏻', '🥷🏼', '🥷🏽', '🥷🏾', '🥷🏿'];
const SKIN_KEY = 'ninjaSkin';

function showMainMenu() {
	state.buttonsDisabled = true;
	return new Promise(resolve => {
		const menu = document.createElement('div');
		menu.id = 'main-menu';

		// Tiled tree background
		const treeBg = document.createElement('div');
		treeBg.id = 'menu-tree-bg';
		treeBg.setAttribute('aria-hidden', 'true');
		treeBg.textContent = '🌲'.repeat(600);
		menu.appendChild(treeBg);

		// Dark overlay
		const overlay = document.createElement('div');
		overlay.id = 'menu-overlay';
		menu.appendChild(overlay);

		// Centered content
		const content = document.createElement('div');
		content.id = 'menu-content';
		content.innerHTML = `
			<h1 class="menu-title">Ninjack</h1>
			<div id="menu-skin-preview">${NINJA}</div>
			<div class="skin-dropdown-wrapper">
				<span class="skin-label">Ninja Skin</span>
				<div class="skin-dropdown-inner">
					<div class="skin-dropdown-popup" id="skin-popup"></div>
					<button class="skin-dropdown-btn" id="skin-dropdown-btn">${NINJA} ▾</button>
				</div>
			</div>
			<button id="menu-start">Start</button>
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

		menu.querySelector('#menu-start').addEventListener('click', () => {
			menu.style.opacity = '0';
			menu.addEventListener('transitionend', () => {
				menu.remove();
				resolve();
			}, { once: true });
		});
	});
}
