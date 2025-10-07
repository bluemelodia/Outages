import { setupAlerts } from "./alerts.js";
import { auth, loginUser, setupFirebase } from "./auth.js";
import { storeApiKeysInFirestoreSeparately } from "./key-storer.js";
import { logger, setupLogger } from "./logger.js";
import { setupLoginForm } from "./login-form.js";
import { loadCoinMarketTable } from "./market-table.js";

function initializeApp() {
	console.log('Initializing app...');
	setupAlerts();
	setupLoginForm();
	setupFirebase();
	setupLogger();
	loadCoinMarketTable();
	initializeEventListeners();

	// Example usage: You would typically call this function from an admin panel,
	// or as part of a controlled deployment process, not on every user's page load.
	// It's meant for initial setup or updates of your configuration.
	auth.onAuthStateChanged((user) => {
		if (user) {
			console.log("User is signed in. Ready to store/update API keys if needed (e.g., from an admin feature).");
			storeApiKeysInFirestoreSeparately();
		} else {
			console.log("No user signed in. Cannot run the API key storage function.");
		}
	});

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