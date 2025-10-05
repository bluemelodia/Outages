
function createPasswordField(container, labelText, inputId) {
	const formGroup = document.createElement('div');
	formGroup.className = 'form-group';

	const label = document.createElement('label');
	label.setAttribute('for', inputId);
	label.textContent = labelText;
	formGroup.appendChild(label);

	const passwordWrapper = document.createElement('div');
	passwordWrapper.className = 'password-wrapper';

	const input = document.createElement('input');
	input.type = 'password';
	input.id = inputId;
	passwordWrapper.appendChild(input);

	const toggleSpan = document.createElement('span');
	toggleSpan.id = `toggle-password-${inputId}`;
	toggleSpan.style.cursor = 'pointer';
	toggleSpan.innerHTML = `
		<svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#667eea">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0s-3.5 7-10.5 7S2.5 12 2.5 12 6 5 12 5s9.5 7 9.5 7z"/>
		</svg>
		<svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#667eea" style="display:none;">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.73 6.73A9.77 9.77 0 0121 12c-1.5 2.5-5 7-9 7a8.38 8.38 0 01-4.17-1.17M6.73 6.73A8.38 8.38 0 003 12c1.5 2.5 5 7 9 7a8.38 8.38 0 004.17-1.17M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12"/>
		</svg>
	`;

	toggleSpan.addEventListener('click', function () {
		togglePassword(inputId, this);
	});

	passwordWrapper.appendChild(toggleSpan);
	formGroup.appendChild(passwordWrapper);
	container.appendChild(formGroup);

	console.log(`Created password field: ${inputId}`);
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

export { 
	createPasswordField,
	togglePassword
};