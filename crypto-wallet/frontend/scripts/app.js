import { setupAlerts } from "./alerts.js";
import { loginUser, setupFirebase } from "./auth.js";
import { fetchAllKeys } from "./keys.js";
import { logger, setupLogger } from "./logger.js";
import { setupLoginForm } from "./login-form.js";
import { loadCoinMarketTable } from "./market-table.js";

/**
 * Tech debt: the initilization sequence is very
 * tightly coupled. This will be refactored as
 * part of the upcoming login rewrite, don't
 * touch this for now.
 */
function initializeApp() {
	console.log('Initializing app...');
	setupAlerts();
	setupLoginForm();
	setupFirebase();
	// Note: Must be called *after* Firebase is set up.
	fetchAllKeys();
	setupLogger();
	loadCoinMarketTable();
	initializeEventListeners();

	// Hide all pages
	document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
	// Show only the login page
	document.getElementById('login-page').classList.add('active');
}

function initializeEventListeners() {
	// Add Enter key support for verification modal
	const verificationInput = document.getElementById('verification-code');
	if (verificationInput) {
		verificationInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				verifyIdentity();
			}
		});
	}

	// Add Enter key support for login form
	const loginInputs = document.querySelectorAll('#login-username, #login-password');
	loginInputs.forEach(input => {
		input.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				logger.info(`Initiate login for user: ${document.getElementById('login-username').value}`);
				loginUser();
			}
		});
	});

	// Add form validation listeners
	const forms = document.querySelectorAll('input');
	forms.forEach(input => {
		input.addEventListener('blur', validateField);
	});
}

function validateField(event) {
	const input = event.target;
	const value = input.value;

	logger.info(`Validating input field: ${input.id}...`);

	// Basic validation logic
	if (input.required && !value) {
		logger.error(`Validation failed: ${input.id} is required`);
		input.style.borderColor = '#dc2626';
	} else {
		logger.info(`Validation passed: ${input.id}`);
		input.style.borderColor = '#e5e7eb';
	}
}

export { initializeApp };