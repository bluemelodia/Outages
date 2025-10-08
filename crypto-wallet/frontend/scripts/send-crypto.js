import { loadAddresses } from "./addresses.js";
import { loadCryptocurrencies } from "./cryptocurrencies.js";
import { navigateTo } from "./navigation.js";

function loadSendCryptoPage() {
	Promise.all([
		loadCryptocurrencies(),
		loadAddresses()
	])
		.then(([cryptoOptions, addresses]) => {
			doLoadSendCryptoPage(cryptoOptions, addresses);
		});
}

function doLoadSendCryptoPage(cryptoOptions, addresses) {
	const container = document.getElementById('send-crypto-page');
	if (container == null) {
		console.error("Send crypto page container not found");
		return;
	}

	// Clear existing content
	container.innerHTML = '';

	const heading = document.createElement('h2');
	heading.textContent = 'Send Crypto';
	container.appendChild(heading);

	const errorDiv = document.createElement('div');
	errorDiv.className = 'error-message';
	errorDiv.id = 'send-error';
	container.appendChild(errorDiv);

	// Recipient
	const recipientGroup = document.createElement('div');
	recipientGroup.className = 'form-group';

	const recipientLabel = document.createElement('label');
	recipientLabel.setAttribute('for', 'recipient');
	recipientLabel.textContent = 'Recipient Address';

	const wrapper = document.createElement('div');
	wrapper.className = 'recipient-wrapper';

	const ghost = document.createElement('div');
	ghost.id = 'recipient-suggestion';

	const input = document.createElement('input');
	input.type = 'text';
	input.id = 'recipient';
	input.placeholder = '0x742d35Cc6545C4532...';
	wrapper.appendChild(ghost);
	wrapper.appendChild(input);

	recipientGroup.appendChild(recipientLabel);
	recipientGroup.appendChild(wrapper);
	container.appendChild(recipientGroup);

	// Suggestion container
	const suggestionBox = document.createElement('div');
	suggestionBox.className = 'suggestion-box';
	suggestionBox.style.display = 'none';
	suggestionBox.style.position = 'absolute';
	suggestionBox.style.top = '100%';
	suggestionBox.style.left = '0';
	suggestionBox.style.width = '100%';
	recipientGroup.appendChild(suggestionBox);

	container.appendChild(recipientGroup);

	// Crypto type
	const cryptoGroup = document.createElement('div');
	cryptoGroup.className = 'form-group';
	const cryptoLabel = document.createElement('label');
	cryptoLabel.setAttribute('for', 'crypto-type');
	cryptoLabel.textContent = 'Cryptocurrency';
	const cryptoSelect = document.createElement('select');
	cryptoSelect.id = 'crypto-type';

	console.log("Crypto options:", cryptoOptions);
	if (cryptoOptions.length === 0) {
		cryptoSelect.disabled = true;
	} else {
		cryptoOptions.forEach(opt => {
			const option = document.createElement('option');
			option.value = opt.id;
			option.textContent = opt.name;
			cryptoSelect.appendChild(option);
		});
	}

	cryptoGroup.appendChild(cryptoLabel);
	cryptoGroup.appendChild(cryptoSelect);
	container.appendChild(cryptoGroup);

	const amountGroup = document.createElement('div');
	amountGroup.className = 'form-group';
	const amountLabel = document.createElement('label');
	amountLabel.setAttribute('for', 'amount');
	amountLabel.textContent = 'Amount';
	const amountInput = document.createElement('input');
	amountInput.type = 'number';
	amountInput.id = 'amount';
	amountInput.placeholder = '0.00';
	amountInput.step = '0.01';
	amountGroup.appendChild(amountLabel);
	amountGroup.appendChild(amountInput);
	container.appendChild(amountGroup);

	const sendButton = document.createElement('button');
	sendButton.className = 'btn btn-primary';
	sendButton.textContent = 'Send Transaction';
	sendButton.addEventListener('click', initiateSendCrypto);
	container.appendChild(sendButton);

	const backButton = document.createElement('button');
	backButton.className = 'btn btn-secondary';
	backButton.textContent = 'Back to Menu';
	backButton.addEventListener('click', () => navigateTo('menu'));
	container.appendChild(backButton);

	const spinner = document.createElement('div');
	spinner.className = 'spinner';
	spinner.id = 'send-spinner';
	container.appendChild(spinner);

	setupRecipientInlineAutocomplete(input, ghost, addresses);
}

function setupRecipientInlineAutocomplete(input, ghost, addresses) {
	input.addEventListener('input', () => {
		const value = input.value;
		if (!value) {
			ghost.textContent = '';
			return;
		}

		const match = addresses.find(a =>
			(a.address || a.id || '').toLowerCase().startsWith(value.toLowerCase())
		);

		if (match) {
			ghost.textContent = match.address || match.id; // full suggestion
		} else {
			ghost.textContent = '';
		}
	});

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			if (
				ghost.textContent &&
				ghost.textContent.toLowerCase().startsWith(input.value.toLowerCase())
			) {
				input.value = ghost.textContent;
				ghost.textContent = '';
			}
		}
	});
}

function initiateSendCrypto() {
}

export {
	loadSendCryptoPage
};