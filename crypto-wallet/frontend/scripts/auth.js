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
	  welcomeMessage.textContent = `Welcome, ${user.email || "Anonymous"}!`;
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

async function sendOneTimeEmailPasscode() {
	const actionCodeSettings = {
		url: window.location.href, // URL the user is redirected to after clicking the link
		handleCodeInApp: true // Required for web apps
	};
	window.logger.info(`Sending one-time email passcode to: ${actionCodeSettings.url}`);
	console.debug(`Action code settings:`, actionCodeSettings);

	const user = auth.currentUser;
	
	try {
		let userEmail = ""
		if (user) {
			userEmail = user.email;
		} else {
			throw new Error('No authenticated user found');
		}

		await firebase.auth().sendSignInLinkToEmail(userEmail, actionCodeSettings);
		window.localStorage.setItem('emailForSignIn', userEmail); // Store email for later verification
		alert('A one-time access link has been sent to your email. Check your inbox!');
	} catch (error) {
		console.error('Error sending email link:', error);
		alert('Failed to send access link. Please try again.');
	}
}

async function handleEmailLinkCompletion() {
  const auth = getAuth();
  if (!isSignInWithEmailLink(auth, window.location.href)) {
	console.log("Not an email link for sign-in or re-authentication.");
	return;
  }

  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
	email = window.prompt('Please provide your email for confirmation');
	if (!email) {
	  alert('Email is required to complete re-authentication.');
	  return;
	}
  }

  try {
	const credential = EmailAuthProvider.credentialWithLink(email, window.location.href);

	// Re-authenticate the current user with this credential
	await auth.currentUser.reauthenticateWithCredential(credential);

	window.localStorage.removeItem('emailForSignIn');
	console.log('User successfully re-authenticated via email link!');
	alert('You have successfully re-authenticated. You can now access the sensitive page.');

	// No need to store auth_time in sessionStorage here anymore.
	// The next time we check for sensitive access, we'll fetch it live.

	// Immediately try to display sensitive content, as re-auth is fresh
	displaySensitiveContent();

  } catch (error) {
	console.error('Error during email link re-authentication:', error);
	alert('Failed to re-authenticate. The link might be invalid or expired. Please try again.');
	// Optionally, redirect to a different page or show an error state
  }
}

/*async function completeEmailLinkSignIn() {
  // Check if this is a sign-in with email link
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
	let email = window.localStorage.getItem('emailForSignIn');

	if (!email) {
	  // User might have opened the link on a different device or cleared storage
	  email = prompt('Please enter your email to complete verification:');
	}

	try {
	  const result = await firebase.auth().signInWithEmailLink(email, window.location.href);
	  window.localStorage.removeItem('emailForSignIn'); // Clean up
	  alert('Access granted! You are now verified for this session.');
	  // Redirect to the sensitive content or display it.
	} catch (error) {
	  console.error('Error completing sign-in with email link:', error);
	  alert('Invalid or expired access link. Please request a new one.');
	}
  }
}*/

// Call this, e.g., on a button click:
// sendOneTimeEmailPasscode('user@example.com', 'https://outages-85d7f.web.app/sensitive-page');

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
