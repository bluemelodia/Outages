import { navigateTo } from "./navigation.js";

let pendingAction = null;
let verificationAttempts = 0;

function requireVerification(action) {
	pendingAction = action;
	document.getElementById('verification-modal').classList.add('active');
	document.getElementById('verification-code').value = '';
	document.getElementById('verification-code').focus();
}

async function verifyIdentity() {
	const code = document.getElementById('verification-code').value;
	const spinner = document.getElementById('verification-spinner');

	if (!code || code.length !== CONFIG.VERIFICATION_CODE_LENGTH) {
		showError('verification', `Please enter a valid ${CONFIG.VERIFICATION_CODE_LENGTH}-digit code`);
		return;
	}

	try {
		spinner.classList.add('active');

		const result = await apiCall('/verify-identity', {
			method: 'POST',
			body: JSON.stringify({ code })
		});

		if (result.verified) {
			closeVerification();
			if (pendingAction) {
				await pendingAction();
				pendingAction = null;
			}
		} else {
			verificationAttempts++;
			if (verificationAttempts >= CONFIG.MAX_VERIFICATION_ATTEMPTS) {
				showError('verification', 'Too many failed attempts. Please try again later.');
				setTimeout(() => {
					cancelVerification();
				}, 2000);
			} else {
				showError('verification', 'Invalid code. Please try again.');
			}
		}
	} catch (error) {
		showError('verification', 'Verification failed. Please try again.');
	} finally {
		spinner.classList.remove('active');
	}
}

function cancelVerification() {
	closeVerification();
	pendingAction = null;
	navigateTo('menu');
}

function closeVerification() {
	document.getElementById('verification-modal').classList.remove('active');
	verificationAttempts = 0;
}