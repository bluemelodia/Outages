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

function showSpinner() {
  const spinner = document.getElementById('global-spinner');
  if (spinner) spinner.style.display = 'flex';
}

function hideSpinner() {
  const spinner = document.getElementById('global-spinner');
  if (spinner) spinner.style.display = 'none';
}

export {
	createEnum,
	showError,
	showSpinner,
	hideSpinner
};