// Credential management functionality

function renderPasswordField(containerId, label, inputId) {
	const container = document.getElementById(containerId);
	container.innerHTML = `
		<label for="${inputId}">${label}</label>
		<div class="password-wrapper">
			<input type="password" id="${inputId}">
			<span class="toggle-password" onclick="togglePassword('${inputId}', this)">
				<svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#667eea">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0s-3.5 7-10.5 7S2.5 12 2.5 12 6 5 12 5s9.5 7 9.5 7z"/>
				</svg>
				<svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#667eea" style="display:none;">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0121 12c-1.5 2.5-5 7-9 7a8.38 8.38 0 01-4.17-1.17M6.73 6.73A8.38 8.38 0 003 12c1.5 2.5 5 7 9 7a8.38 8.38 0 004.17-1.17M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12"/>
				</svg>
			</span>
		</div>
	`;
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

function initiateChangeCredentials() {
	processChangeCredentials();
}

async function processChangeCredentials() {
	const currentPassword = document.getElementById('current-password').value;
	const newPassword = document.getElementById('new-password').value;
	const confirmPassword = document.getElementById('confirm-password').value;
	const spinner = document.getElementById('credentials-spinner');

	if (!currentPassword || !newPassword || !confirmPassword) {
		showError('credentials', 'Please fill in all fields');
		return;
	}

	if (newPassword !== confirmPassword) {
		showError('credentials', 'New passwords do not match');
		return;
	}

	if (newPassword.length < 8) {
		showError('credentials', 'New password must be at least 8 characters long');
		return;
	}

	try {
		spinner.classList.add('active');
		changePassword(newPassword);
	} catch (error) {
		showError('credentials', 'Failed to update credentials. Please try again.');
		console.error("Error details:", error);
	} finally {
		spinner.classList.remove('active');
	}
}

function changePassword(newPassword) {
	const user = auth.currentUser;

	if (user) {
		user.updatePassword(newPassword)
			.then(() => {
				// Password updated successfully!
				console.log("Password updated!");
				alert("Update Success", "Your password has been changed successfully.");
			})
			.catch((error) => {
				// An error occurred.
				console.error("Error updating password:", error.code, error.message);

				if (error.code === "auth/requires-recent-login") {
					// The user's sign-in session is too old.
					// Prompt the user to re-authenticate before trying again.
					alert("Re-login Needed", "For security, please sign in again to change your password.");
					// Redirect to a re-authentication flow or show a modal.
					logoutUser();
				} else if (error.code === "auth/weak-password") {
					alert("Invalid Password", "The new password is too weak. Please choose a stronger one.");
				} else {
					alert("Update Failed", "Failed to update password. Please try again.");
					console.error("Error details:", error);
				}
			});
	} else {
		console.log("No user is signed in.");
		alert("Login Required", "You must be signed in to change your password.");
	}
}

function clearCredentialsForm() {
	console.log('Clear all credentials');
	document.getElementById('current-password').value = '';
	document.getElementById('new-password').value = '';
	document.getElementById('confirm-password').value = '';
}