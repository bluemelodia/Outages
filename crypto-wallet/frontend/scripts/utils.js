// Utility functions

function createEnum(values) {
	const enumObj = {};
	values.forEach(value => {
		enumObj[value] = value;
	});
	return Object.freeze(enumObj);
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

export {
	createEnum,
	togglePassword,
	showError,
};