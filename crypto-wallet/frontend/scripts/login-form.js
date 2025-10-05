import { loginUser, registerUser } from "./auth.js";
import { createEnum } from "./utils.js";

const tabs = Object.values(
	createEnum([
		'login',
		'register'
	])
);

/**
 * Tech debt: the login form is too tightly coupled.
 * The functions have to be called in a specific order
 * for it to work.
 */
function setupLoginForm() {
	createAuthTabs();
	createLoginContent();
	createRegisterContent();
	setupLoginInputs();
	attachEventListeners()
}

function attachEventListeners() {
	document.querySelectorAll('.toggle-password').forEach(toggle => {
		toggle.addEventListener('click', function () {
			const inputId = this.dataset.inputId; // Get the specific input ID
			togglePassword(inputId, this);
		});
	});
}

function clearLoginError() {
	const errorDiv = document.getElementById('login-error');
	errorDiv.textContent = '';
	errorDiv.classList.remove('active');
	console.log("Cleared login error messages");
}

function createAuthTabs() {
	let authTabs = document.getElementById('auth-tabs');
	authTabs.innerHTML = ''; // Clear existing tabs

	tabs.forEach(tab => {
		const tabElement = document.createElement('div');
		tabElement.className = 'auth-tab';
		tabElement.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
		if (tab === 'login') tabElement.classList.add('active');

		tabElement.addEventListener('click', switchAuthTab.bind(null, tab));
		authTabs.appendChild(tabElement);
	});
	
	switchAuthTab('login'); // Default to login tab
}

function createLoginContent() {
	const container = document.getElementById('login-tab-content');
	if (container == null) {
		console.error("Login tab container not found");
		return;
	}

	container.innerHTML = `
		<div class="error-message" id="login-error"></div>
		<div class="form-group">
			<label for="login-username">E-mail</label>
			<input type="text" id="login-username" required autocomplete="username">
		</div>
		<div class="form-group">
			<label for="login-password">Password</label>
			<div class="password-wrapper">
				<input type="password" id="login-password" required autocomplete="current-password">
				<span class="toggle-password" data-input-id="login-password">
					<svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
						fill="none" viewBox="0 0 24 24" stroke="#667eea">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0s-3.5 7-10.5 7S2.5 12 2.5 12 6 5 12 5s9.5 7 9.5 7z" />
					</svg>
					<svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
						fill="none" viewBox="0 0 24 24" stroke="#667eea" style="display:none;">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0121 12c-1.5 2.5-5 7-9 7a8.38 8.38 0 01-4.17-1.17M6.73 6.73A8.38 8.38 0 003 12c1.5 2.5 5 7 9 7a8.38 8.38 0 004.17-1.17M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" />
					</svg>
				</span>
			</div>
		</div>
		<button class="btn btn-primary" id="login-user-btn">Login</button>
	`;

	let button = document.getElementById("login-user-btn");
	button.addEventListener('click', function () {
		loginUser();
	});
}

function createRegisterContent() {
	const container = document.getElementById('register-tab-content');
	if (container == null) {
		console.error("Register tab container not found");
		return;
	}
	
	container.innerHTML = `
		<div class="error-message" id="register-error"></div>

		<div class="form-group">
			<label for="register-email">Email</label>
			<input type="email" id="register-email" autocomplete="username">
		</div>
		<div class="form-group">
			<label for="register-password">Password</label>
			<div class="password-wrapper">
				<input type="password" id="register-password" autocomplete="new-password">
				<span class="toggle-password" data-input-id="register-password">
					<svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
						fill="none" viewBox="0 0 24 24" stroke="#667eea">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0s-3.5 7-10.5 7S2.5 12 2.5 12 6 5 12 5s9.5 7 9.5 7z" />
					</svg>
					<svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
						fill="none" viewBox="0 0 24 24" stroke="#667eea" style="display:none;">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0121 12c-1.5 2.5-5 7-9 7a8.38 8.38 0 01-4.17-1.17M6.73 6.73A8.38 8.38 0 003 12c1.5 2.5 5 7 9 7a8.38 8.38 0 004.17-1.17M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" />
					</svg>
				</span>
			</div>
		</div>
		<div class="form-group">
			<label for="register-confirm-password">Confirm Password</label>
			<div class="password-wrapper">
				<input type="password" id="register-confirm-password" autocomplete="new-password">
				<span class="toggle-password" data-input-id="register-confirm-password">
					<svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
						fill="none" viewBox="0 0 24 24" stroke="#667eea">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0s-3.5 7-10.5 7S2.5 12 2.5 12 6 5 12 5s9.5 7 9.5 7z" />
					</svg>
					<svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
						fill="none" viewBox="0 0 24 24" stroke="#667eea" style="display:none;">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0121 12c-1.5 2.5-5 7-9 7a8.38 8.38 0 01-4.17-1.17M6.73 6.73A8.38 8.38 0 003 12c1.5 2.5 5 7 9 7a8.38 8.38 0 004.17-1.17M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" />
					</svg>
				</span>
			</div>
		</div>
		<button class="btn btn-primary" id="register-user-button">Create Account</button>
	`;

	let button = document.getElementById("register-user-button");
	button.addEventListener('click', function () {
		registerUser();
	});
}

function renderPasswordField(containerId, label, inputId) {
	const container = document.getElementById(containerId);
	if (container == null) {
		console.error(`Container with id: ${containerId} not found`);
		return;
	}
	
	container.innerHTML = `
		<label for="${inputId}">${label}</label>
		<div class="password-wrapper">
			<input type="password" id="${inputId}">
			<span class="toggle-password-${inputId}">
				<svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#667eea">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0s-3.5 7-10.5 7S2.5 12 2.5 12 6 5 12 5s9.5 7 9.5 7z"/>
				</svg>
				<svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#667eea" style="display:none;">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0121 12c-1.5 2.5-5 7-9 7a8.38 8.38 0 01-4.17-1.17M6.73 6.73A8.38 8.38 0 003 12c1.5 2.5 5 7 9 7a8.38 8.38 0 004.17-1.17M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12"/>
				</svg>
			</span>
		</div>
	`;

	let toggle = container.getElementById(`toggle-password-${inputId}`);
	toggle.addEventListener('click', function () {
		togglePassword(inputId, this);
	});
}

function setupLoginInputs() {
	document.getElementById('login-username').addEventListener('input', clearLoginError);
	document.getElementById('login-password').addEventListener('input', clearLoginError);
}

function switchAuthTab(tabName) {
	const allTabs = document.querySelectorAll('.auth-tab');
	allTabs.forEach(tab => {
		tab.classList.remove('active');
		// Check if this tab's text matches the tabName
		if (tab.textContent.toLowerCase() === tabName.toLowerCase()) {
			tab.classList.add('active');
		}
	});

	// Update tab content
	const tabContents = document.querySelectorAll('.auth-tab-content');
	tabContents.forEach(content => {
		content.classList.remove('active');
	});
	document.getElementById(tabName + '-tab-content').classList.add('active');

	// Clear error messages
	document.querySelectorAll('.error-message').forEach(el => {
		el.classList.remove('active');
		el.textContent = '';
	});
}

function togglePassword(inputId, iconElem) {
	const input = document.getElementById(inputId);
	const eyeOpen = iconElem.querySelector('.eye-open');
	const eyeClosed = iconElem.querySelector('.eye-closed');
	if (input.type === "password") {
		input.type = "text";
		eyeOpen.style.display = "none";
		eyeClosed.style.display = "inline";
	} else {
		input.type = "password";
		eyeOpen.style.display = "inline";
		eyeClosed.style.display = "none";
	}
}

export {
	renderPasswordField,
	setupLoginForm,
	togglePassword
};