class App {
	constructor() {
		if(!localStorage.getItem('user')) this._createStorage();

		this._storage = localStorage.getItem('user');
		this._loginBtn = document.getElementById('login-btn');
		this._tabs = document.getElementById('tabs');
		this._modal = document.getElementById('modal');
		this._auth = document.getElementById('login-auth');
		this._logout = document.getElementById('logout');
		this._user = document.getElementById('user-text');
		this._userInput = document.getElementById('user-textbox');

		this._init();
	}
	_init() {
		this._checkRemember();
		this._tabs.addEventListener('click', event => {
			const target = event.target;

			if(!target.classList.contains('tab')) return;
			if(target.classList.contains('active')) return;

			this._removeActiveClass();

			target.classList.add('active');

			this._showContentByTabClick(target.dataset.action);
		});
		this._loginBtn.addEventListener('click', () => this._modal.style.display = 'block');
		this._modal.addEventListener('click', () => {
			const action = event.target.dataset.action;

			if(!action) return;

			this._clickHandleInModal(action);
		});
		this._user.addEventListener('click', () => {
			this._userInput.style.display = 'block';
			this._userInput.value = this._user.textContent.trim();
			this._userInput.focus();
			this._user.style.display = 'none';
		})
		this._userInput.addEventListener('blur', () => {
			this._setUsernameInHeader(this._userInput.value);
			this._userInput.style.display = 'none';
			this._user.style.display = 'block';
		})
		this._logout.addEventListener('click', () => {
			const storage = JSON.parse(this._storage);

			storage.remember = false;

			this._setStorage(storage);
			this._auth.style.display = 'none';
			this._loginBtn.style.display = 'block';
		})
	}
	_checkRemember() {
		const {remember, username} = JSON.parse(this._storage);

		if(remember) {
			this._authorizeUser();
			this._user.textContent = username;
		}
	}
	_clickHandleInModal(action) {
		const actions = {
			'modal-close': () => {
				this._clearModalInputs();
				this._modal.style.display = 'none';
			},
			'login': () => {
				const [login, password, remember] = Array.from(this._getModalInputs());

				if(!this._checkEmptyInputs(login, password)) return;

				this._checkCorrectData(login.value, password.value, remember.checked);
				this._clickHandleInModal.call(this, 'modal-close');
			}
		}

		actions[action]();
	}
	_checkCorrectData(loginValue, passwordValue, rememberValue) {
		const {login, password, username, remember} = JSON.parse(this._storage);

		if(login !== loginValue.trim() || password !== passwordValue.trim()) {
			return alert('Неверный логин или пароль!');
		}

		const data ={
			login,
			password,
			username,
			remember: rememberValue
		};
		this._setStorage(data);
		this._authorizeUser();
		this._setUsernameInHeader(username);
	}
	_authorizeUser() {
		this._loginBtn.style.display = 'none';
		this._auth.style.display = 'flex';
	}
	_setStorage(data) {
		localStorage.setItem('user', JSON.stringify(data));
		this._storage = localStorage.getItem('user');
	}
	_setUsernameInHeader(username) {
		const storage = JSON.parse(this._storage);

		storage.username = username;
		this._user.textContent = username.trim();

		this._setStorage(storage);
	}
	_checkEmptyInputs(login, password) {
		let flag = true;

		for(let input of [login, password]) {
			if(input.value !== '') continue;

			flag = false;
			input.style.backgroundColor = 'red';
			setTimeout(() => input.style.backgroundColor = '', 300);
		}

		return flag;
	}
	_getModalInputs() {
		return this._modal.querySelectorAll('input');
	}
	_clearModalInputs() {
		const inputs = this._getModalInputs();

		inputs.forEach(input => input.checked ? input.checked = false : input.value = '');
	}
	_createStorage() {
		localStorage.setItem('user', JSON.stringify({
			login: 'user',
			password: '111',
			remember: false,
			username: 'Иванов'
		}))
	}
	_showContentByTabClick(action) {
		const movies = document.getElementById('movies');
		const genres = document.getElementById('genres');
		const channels = document.getElementById('channels');

		const actions = {
			'show-movies': () => {
				movies.style.display = '';
				genres.style.display = '';
				channels.style.display = 'none';
			},
			'show-channels': () => {
				movies.style.display = 'none';
				genres.style.display = 'none';
				channels.style.display = 'flex';
			}
		}

		actions[action]();
	}
	_removeActiveClass() {
		const tabs_list = this._tabs.querySelectorAll('div.tab');

		tabs_list.forEach(tab => tab.classList.remove('active'));
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	console.log(app);
})