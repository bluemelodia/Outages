import { clearConfigCache } from "./config.js";
import { fetchAllKeys } from "./keys.js";
import { logger } from "./logger.js";
import { setupLoginForm } from "./login-form.js";
import { hideMenu, navigateTo, showMenu } from "./navigation.js";
import { hideSpinner, showSpinner } from "./utils.js";

let auth = null;

// Maps Firebase error codes to user-friendly messages
const authErrorMessageMap = {
	'auth/invalid-email': 'The email address is not valid. Please check the format.',
	'auth/user-disabled': 'Your account has been disabled. Please contact support.',
	'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
	'auth/wrong-password': 'The email or password you entered is incorrect. Please try again.',
	'auth/invalid-login-credentials': 'The email or password you entered is incorrect. Please try again.', // This is the generic one you're seeing
	'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
	'auth/network-request-failed': 'Network error. Please check your internet connection.',

	// Common errors that might occur
	'auth/requires-recent-login': 'For security reasons, please re-authenticate before performing this action.',

	// Default fallback message for unhandled errors
	'default': 'An unexpected error occurred during login. Please try again.'
};

function setupFirebase() {
	// Initialize Firebase
	// It's fine to make this information public, as it
	// acts as an identifier for the project.
	const firebaseConfig = {
		apiKey: "AIzaSyDHoK-BIvYRO-zzhsUZngj0tgxx9eq_yhg",
		authDomain: "outages-85d7f.firebaseapp.com",
		projectId: "outages-85d7f",
		storageBucket: "outages-85d7f.firebasestorage.app",
		messagingSenderId: "407900343819",
		appId: "1:407900343819:web:5bb41148df166cfd63c10e",
		measurementId: "G-YQ1MGNCBYZ"
	};

	firebase.initializeApp(firebaseConfig);
	auth = firebase.auth();

	auth.onAuthStateChanged((user) => {
		if (user) {
			clearConfigCache();
			fetchAllKeys();

			// User is signed in → show menu page
			document.getElementById("login-page").classList.remove("active");
			showMenu();

			// Show welcome message
			const welcomeEl = document.getElementById("welcome-message");
			const nameOrEmail = user.displayName || user.email || "User";
			welcomeEl.textContent = `Welcome, ${nameOrEmail}!`;
		} else {
			// No user → show login page
			hideMenu();
			document.getElementById("login-page").classList.add("active");
		}
	});
}

// E-mail authentication
function sendEmailLink() {
	const email = document.getElementById('email').value;
	const actionCodeSettings = {
		url: window.location.href, // Return to this page
		handleCodeInApp: true,
	};

	auth.sendSignInLinkToEmail(email, actionCodeSettings)
		.then(() => {
			window.localStorage.setItem('emailForSignIn', email);
			alert('Verification Sent', 'Check your email for the verification link!');
		})
		.catch((error) => {
			alert('Verification Error', 'Error: ' + error.message);
		});
}

function loginUser() {
	const email = document.getElementById("login-username").value;
	const password = document.getElementById("login-password").value;

	// Prevent empty fields
	if (!email || !password) {
		showAuthError('login-error', "Please enter both username and password.");
		logger.warn("Empty login attempt", { username });
		return;
	}

	// Password length validation
	if (password.length <= 3) {
		showAuthError('login-error', "Password must be at least 3 characters long.");
		logger.warn("Weak password attempt", { username });
		return;
	}

	showSpinner();

	auth.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			console.log("Logged in as:", user.email);
			navigateTo("menu"); // ✅ show menu after login

			// Show welcome message
			const welcomeMessage = document.getElementById("welcome-message");
			welcomeMessage.textContent = `Welcome, ${user.email || "Anonymous"}!`;
		})
		.catch((error) => {
			console.error("Firebase Auth Error:", error.code, error.message); // Log full error for debugging

			// Get the custom message for the error code, or use the default
			const customErrorMessage = authErrorMessageMap[error.code] || authErrorMessageMap['default'];

			// Display the custom, user-friendly message
			showAuthError('login-error', customErrorMessage);
		})
		.finally(() => {
			hideSpinner();
		});
}

function logoutUser() {
	auth.signOut()
		.then(() => {
			// Hide menu page, show login
			hideMenu();
			document.getElementById("login-page").classList.add("active");

			logger.info("User logged out");
		})
		.catch((error) => {
			console.error("Logout error:", error);
			alert("Logout failed: " + error.message);
		});

	// TODO: with the auth rewrite, some of this code
	// is no longer needed. Clean it up in an upcoming release.

	// Clear stored user
	localStorage.removeItem("loggedInUser");
	logger.info("👋 User logged out");

	// Hide all pages
	document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

	// Reset UI
	document.getElementById("login-page").classList.add("active");
	console.log("Logout completed.");

	// Reset the login form
	setupLoginForm();
}

// Helper to show errors,
function showAuthError(elementId, message) {
	const el = document.getElementById(elementId);
	el.textContent = message;
	el.classList.add('active');
}

// Register with email/password.
function registerUser() {
	const email = document.getElementById('register-email').value;
	const password = document.getElementById('register-password').value;
	const confirmPassword = document.getElementById('register-confirm-password').value;

	// Clear previous errors
	document.getElementById('register-error').classList.remove('active');

	if (!email || !password || !confirmPassword) {
		showAuthError('register-error', 'Please fill in all fields');
		return;
	}

	if (password !== confirmPassword) {
		showAuthError('register-error', 'Passwords do not match');
		return;
	}

	if (password.length < 6) {
		showAuthError('register-error', 'Password must be at least 6 characters');
		return;
	}

	auth.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			alert("Registration success!");
			logger.info('User registered successfully', { email });
			// Store user and navigate to menu
			localStorage.setItem('loggedInUser', email);
			navigateTo('menu');
		})
		.catch((error) => {
			logger.error('Registration failed', { error: error.message });
			showAuthError('register-error', error.message);
		});
}

export {
	auth,
	loginUser,
	logoutUser,
	sendEmailLink,
	setupFirebase,
	showAuthError,
	registerUser
};
