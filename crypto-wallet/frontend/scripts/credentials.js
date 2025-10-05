import { auth, logoutUser } from "./auth.js";
import { createPasswordField } from "./form-common.js";
import { navigateTo } from "./navigation.js";

function loadChangeCredentialsPage() {
	const container = document.getElementById('credentials-page');
	if (container == null) {
		console.error("Credentials page container not found");
		return;
	}

	// Clear existing content
	container.innerHTML = '';

	const heading = document.createElement('h2');
	heading.textContent = 'Change Credentials';
	container.appendChild(heading);

	const errorDiv = document.createElement('div');
	errorDiv.className = 'error-message';
	errorDiv.id = 'credentials-error';
	container.appendChild(errorDiv);

	// Create password fields programmatically
	createPasswordField(container, 'Current Password', 'current-password');
	createPasswordField(container, 'New Password', 'new-password');
	createPasswordField(container, 'Confirm New Password', 'confirm-password');

	const updateBtn = document.createElement('button');
	updateBtn.className = 'btn btn-primary';
	updateBtn.textContent = 'Update Credentials';
	updateBtn.onclick = initiateChangeCredentials;
	container.appendChild(updateBtn);

	const backBtn = document.createElement('button');
	backBtn.className = 'btn btn-secondary';
	backBtn.textContent = 'Back to Menu';
	backBtn.onclick = () => navigateTo('menu');
	container.appendChild(backBtn);

	// Spinner
	const spinner = document.createElement('div');
	spinner.className = 'spinner';
	spinner.id = 'credentials-spinner';
	container.appendChild(spinner);
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

export {
	initiateChangeCredentials,
	loadChangeCredentialsPage
};