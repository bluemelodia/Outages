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
  const overlay = document.getElementById('global-spinner-overlay');
  const spinner = overlay?.querySelector('.spinner');
  if (overlay && spinner) {
    overlay.classList.add('active');
    spinner.classList.add('active');
  }
}

function hideSpinner() {
  const overlay = document.getElementById('global-spinner-overlay');
  const spinner = overlay?.querySelector('.spinner');
  if (overlay && spinner) {
    overlay.classList.remove('active');
    spinner.classList.remove('active');
  }
}

export {
	createEnum,
	showError,
	showSpinner,
	hideSpinner
};