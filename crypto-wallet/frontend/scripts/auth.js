// Tab switching function
function switchAuthTab(tabName) {
	// Update tab buttons
	document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
	event.target.classList.add('active');
	
	// Update tab content
	document.querySelectorAll('.auth-tab-content').forEach(content => {
		content.classList.remove('active');
	});
	document.getElementById(tabName + '-tab-content').classList.add('active');
	
	// Clear error messages
	document.querySelectorAll('.error-message').forEach(el => {
		el.classList.remove('active');
		el.textContent = '';
	});
}

function loginUser() {
  const email = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      navigateTo("menu"); // ✅ show menu after login

	  // Show welcome message
      const welcomeMessage = document.getElementById("welcome-message");
      welcomeMessage.textContent = `Welcome, ${user.email || "Anonymous"}`;
    })
    .catch((error) => {
		showAuthError('login-error', error.message);
    });
}

// Helper to show errors
function showAuthError(elementId, message) {
	const el = document.getElementById(elementId);
	el.textContent = message;
	el.classList.add('active');
}

// Register with email/password - NEW FUNCTION
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
			window.logger.info('User registered successfully', { email });
			// Store user and navigate to menu
			localStorage.setItem('loggedInUser', email);
			navigateTo('menu');
		})
		.catch((error) => {
			window.logger.error('Registration failed', { error: error.message });
			showAuthError('register-error', error.message);
		});
}

let phoneConfirmationResult;

function registerWithPhone() {
	const phoneNumber = document.getElementById('register-phone').value;

	document.getElementById('register-error').classList.remove('active');

	if (!phoneNumber) {
		showAuthError('register-error', 'Please enter a phone number');
		return;
	}

	// Set up reCAPTCHA
	if (!window.recaptchaVerifier) {
		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
			'size': 'normal',
			'callback': (response) => {
				window.logger.info('reCAPTCHA solved');
			}
		});
	}

	const appVerifier = window.recaptchaVerifier;

	auth.signInWithPhoneNumber(phoneNumber, appVerifier)
		.then((result) => {
			phoneConfirmationResult = result;
			window.logger.info('OTP sent to phone', { phoneNumber });
			
			// Prompt for code
			const code = prompt('Enter the 6-digit code sent to your phone:');
			if (code) {
				verifyPhoneCode(code, phoneNumber);
			}
		})
		.catch((error) => {
			window.logger.error('Phone registration failed', { error: error.message });
			showAuthError('register-error', error.message);
		});
}

function verifyPhoneCode(code, phoneNumber) {
	phoneConfirmationResult.confirm(code)
		.then((result) => {
			window.logger.info('Phone verified successfully', { phoneNumber });
			// Store user and navigate to menu
			localStorage.setItem('loggedInUser', phoneNumber);
			navigateTo('menu');
		})
		.catch((error) => {
			window.logger.error('Phone verification failed', { error: error.message });
			showAuthError('register-error', 'Invalid verification code');
		});
}
