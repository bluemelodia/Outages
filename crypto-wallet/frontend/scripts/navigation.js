// Page navigation functionality
let currentPage = 'menu';

function navigateTo(pageId) {
	// Hide all pages
	document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
	// Show the selected page
	document.getElementById(`${pageId}-page`).classList.add('active');

	if (pageId === 'send-crypto') {
		sendOneTimeEmailPasscode()
	}

	// Only render password fields when navigating to credentials
	if (pageId === 'credentials') {
		renderPasswordField('current-password-field', 'Current Password', 'current-password');
		renderPasswordField('new-password-field', 'New Password', 'new-password');
		renderPasswordField('confirm-password-field', 'Confirm New Password', 'confirm-password');
	} else {
		// Optionally clear password fields when leaving credentials page
		document.getElementById('current-password-field').innerHTML = '';
		document.getElementById('new-password-field').innerHTML = '';
		document.getElementById('confirm-password-field').innerHTML = '';
	}
}
