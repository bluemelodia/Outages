import { navigateTo } from "./navigation.js";

const cryptoOptions = [
	{ value: 'BTC', text: 'Bitcoin (BTC)' },
	{ value: 'ETH', text: 'Ethereum (ETH)' },
	{ value: 'ADA', text: 'Cardano (ADA)' }
];

function loadSendCryptoPage() {
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
	const recipientInput = document.createElement('input');
	recipientInput.type = 'text';
	recipientInput.id = 'recipient';
	recipientInput.placeholder = '0x742d35Cc6545C4532...';
	recipientGroup.appendChild(recipientLabel);
	recipientGroup.appendChild(recipientInput);
	container.appendChild(recipientGroup);

	// Crypto type
	const cryptoGroup = document.createElement('div');
	cryptoGroup.className = 'form-group';
	const cryptoLabel = document.createElement('label');
	cryptoLabel.setAttribute('for', 'crypto-type');
	cryptoLabel.textContent = 'Cryptocurrency';
	const cryptoSelect = document.createElement('select');
	cryptoSelect.id = 'crypto-type';

	cryptoOptions.forEach(opt => {
		const option = document.createElement('option');
		option.value = opt.value;
		option.textContent = opt.text;
		cryptoSelect.appendChild(option);
	});

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
}

function initiateSendCrypto() {
}

export {
	loadSendCryptoPage
};