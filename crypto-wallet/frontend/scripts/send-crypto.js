import { loadAddresses } from "./addresses.js";
import { loadCryptocurrencies } from "./cryptocurrencies.js";
import { navigateTo } from "./navigation.js";
import { addTransaction } from "./transactions.js";
import { hideSpinner, showError, showSpinner } from "./utils.js";
import { showValidateTransactionModal } from "./validate-transaction.js";

function loadSendCryptoPage() {
	// At the same time, load the form in the background.
	Promise.all([loadCryptocurrencies(), loadAddresses()])
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
	errorDiv.id = 'send-crypto-error';
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

	// Create datalist for saved addresses
	const datalist = document.createElement('datalist');
	datalist.id = 'recipient-options';

	addresses.forEach(addr => {
		const option = document.createElement('option');
		option.value = addr.address || addr.id;
		datalist.appendChild(option);
	});

	// Link input to datalist
	recipientInput.setAttribute('list', datalist.id);

	recipientGroup.appendChild(recipientLabel);
	recipientGroup.appendChild(recipientInput);
	recipientGroup.appendChild(datalist); // attach datalist to DOM
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
}

function initiateSendCrypto() {
	const recipientInput = document.getElementById('recipient');
	const cryptoSelect = document.getElementById('crypto-type');
	const amountInput = document.getElementById('amount');

	const address = recipientInput.value.trim();
	const amount = amountInput.value.trim();
	const selectedCrypto = cryptoSelect.options[cryptoSelect.selectedIndex];
	const crypto = selectedCrypto ? selectedCrypto.value : '';
	const cryptoName = selectedCrypto ? selectedCrypto.textContent : '';

	// Basic validation
	if (!address || !amount || !crypto) {
		showError('send-crypto', 'Please fill in all fields before sending.');
		return;
	}

	// Validate amount: must be numeric and up to 2 decimal places
	const validAmountPattern = /^(?:\d+)(?:\.\d{1,2})?$/;
	if (!validAmountPattern.test(amount)) {
		showError('send-crypto', 'Please enter a valid dollar amount (e.g. 25 or 25.50).');
		return;
	}

	const amountNum = parseFloat(amount);
	if (isNaN(amountNum) || amountNum <= 0) {
		showError('send-crypto', 'Amount must be a positive number.');
		return;
	}

	// Create transaction object
	const timestamp = new Date();
	const formattedDate = timestamp.toLocaleString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short'
	});

	const txId = `tx-${Date.now()}-${Math.floor(Math.random() * 10)}`;

	const transaction = {
		address: `To: ${address}`,
		amount: amount.toString(),
		crypto: crypto,
		cryptoName: cryptoName,
		date: formattedDate,
		hash: address, // hash uses inputted address
		id: txId,
		isPositive: false,
		status: "pending",
		type: "send",
		usdValue: amount.toString() // using amount entered directly
	};

	console.log("Transaction to be submitted:", transaction);

	showValidateTransactionModal()
		.then(() => {
			doAddTransaction(transaction);
		})
		.catch((error) => {
			console.error("Error during transaction validation:", error);
			alert("Service Unavailable", "Could not complete send crypto transaction at this time. Try again later.")
				.then(() => {
					navigateTo('menu');
				});			
		});
}

function doAddTransaction(transaction) {
	showSpinner();

	addTransaction(transaction)
		.then(docId => {
			console.log("Transaction submitted successfully with ID:", docId);

			alert("Transaction Sent", "Your transaction was submitted successfully.")
				.then(() => {
					// Reload fresh send crypto form
					Promise.all([loadCryptocurrencies(), loadAddresses()])
						.then(([cryptoOptions, addresses]) => {
							doLoadSendCryptoPage(cryptoOptions, addresses);
						});
				})
		})
		.catch(err => {
			console.error("Error submitting transaction:", err);
			alert("Transaction Failed", "Failed to send transaction. Please try again.");
		})
		.finally(() => {
			hideSpinner();
		});
}

export {
	loadSendCryptoPage
};