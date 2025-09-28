// Utility functions

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

function showError(context, message) {
	const errorElement = document.getElementById(`${context}-error`);
	if (errorElement) {
		errorElement.textContent = message;
		errorElement.classList.add('active');
		setTimeout(() => {
			errorElement.classList.remove('active');
		}, 5000);
	}
}

function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

function formatCurrency(amount) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(amount);
}

function formatLargeNumber(num) {
	if (num === null || num === undefined) return '—';
	if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
	return num.toLocaleString('en-US');
}

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}