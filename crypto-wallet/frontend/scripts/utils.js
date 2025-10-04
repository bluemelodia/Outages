// Utility functions

function createEnum(values) {
	const enumObj = {};
	values.forEach(value => {
		enumObj[value] = value;
	});
	return Object.freeze(enumObj);
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
	showError,
};