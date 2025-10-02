const cryptoTypes = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC', 'LINK', 'UNI'];
const cryptoNames = {
	'BTC': 'Bitcoin',
	'ETH': 'Ethereum',
	'ADA': 'Cardano',
	'SOL': 'Solana',
	'DOT': 'Polkadot',
	'MATIC': 'Polygon',
	'LINK': 'Chainlink',
	'UNI': 'Uniswap'
};

const transactionTypes = ['send', 'receive', 'exchange'];
const addresses = [
	'0x742d35Cc6634C0532925a3b844Bc9e7595f0bEe2',
	'0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
	'0xD551234Ae421e3BCBA99A0Da6d736074f22192FF',
	'0x8e23Ee67d1332aD560396262C48ffbB273f626a1',
	'0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
];

// Generate random transaction
function generateRandomTransaction(index) {
	const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
	const crypto = cryptoTypes[Math.floor(Math.random() * cryptoTypes.length)];
	const isPositive = type === 'receive';

	// Generate amount
	let amount;
	if (crypto === 'BTC') {
		amount = (Math.random() * 0.5).toFixed(8);
	} else if (crypto === 'ETH') {
		amount = (Math.random() * 5).toFixed(6);
	} else {
		amount = (Math.random() * 1000).toFixed(2);
	}

	// Date within last 30 days
	const daysAgo = Math.floor(Math.random() * 30);
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);

	// Random address
	const address = addresses[Math.floor(Math.random() * addresses.length)] || "0x000...";

	// Hash
	const hash = '0x' + Array.from({ length: 64 }, () =>
		Math.floor(Math.random() * 16).toString(16)
	).join('');

	// Prices
	const prices = {
		'BTC': 43000,
		'ETH': 2300,
		'ADA': 0.45,
		'SOL': 95,
		'DOT': 6.5,
		'MATIC': 0.85,
		'LINK': 14.5,
		'UNI': 6.2
	};

	const price = prices[crypto] || 0;
	const usdValue = (parseFloat(amount) * price).toFixed(2);

	return {
		id: `tx-${Date.now()}-${index}`,
		type: type,
		crypto: crypto,
		cryptoName: cryptoNames[crypto] || crypto,
		amount: amount,
		usdValue: usdValue,
		address: type === 'receive' ? 'From: ' + address : 'To: ' + address,
		date: date,
		hash: hash,
		status: Math.random() > 0.1 ? 'completed' : 'pending',
		isPositive: isPositive
	};
}

// Generate multiple transactions
function generateTransactionList(count = 15) {
	const transactions = [];
	for (let i = 0; i < count; i++) {
		transactions.push(generateRandomTransaction(i));
	}
	transactions.sort((a, b) => b.date - a.date);
	return transactions;
}

// Format date
function formatTransactionDate(date) {
	const now = new Date();
	const diff = now - date;
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days === 0) {
		const hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours === 0) {
			const minutes = Math.floor(diff / (1000 * 60));
			return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
		}
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	} else if (days === 1) {
		return 'Yesterday';
	} else if (days < 7) {
		return `${days} days ago`;
	} else {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
}

// Render one transaction
function renderTransaction(transaction) {
	const statusBadge = transaction.status === 'pending'
		? '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Pending</span>'
		: '';

	return `
		<div class="transaction-item">
			<div class="transaction-header">
				<div>
					<span class="transaction-amount ${transaction.isPositive ? 'positive' : 'negative'}">
						${transaction.isPositive ? '+' : '-'}${transaction.amount} ${transaction.crypto}
					</span>
					${statusBadge}
				</div>
				<span class="transaction-date">${formatTransactionDate(transaction.date)}</span>
			</div>
			<div class="transaction-details">
				<div style="margin-bottom: 0.25rem;">
					<strong>${transaction.cryptoName}</strong> • ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
				</div>
				<div style="color: #9ca3af; font-size: 0.8rem;">
					${transaction.address}
				</div>
				<div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
					<span style="color: #6b7280;">≈ $${transaction.usdValue} USD</span>
					<span style="color: #9ca3af; font-size: 0.75rem; font-family: monospace;" title="${transaction.hash}">
						${transaction.hash.substring(0, 10)}...
					</span>
				</div>
			</div>
		</div>
	`;
}

// Load and display transactions
function loadTransactions() {
	const container = document.getElementById('transactions-list');
	const spinner = document.getElementById('transactions-spinner');
	const errorEl = document.getElementById('transactions-error');

	// Clear previous
	container.innerHTML = 'Loading...';
	spinner.classList.add('active');

	setTimeout(() => {
		try {
			const transactions = generateTransactionList(15);

			if (transactions.length === 0) {
				container.innerHTML = `<div>📭 No transactions yet</div>`;
			} else {
				container.innerHTML = transactions.map(tx => renderTransaction(tx)).join('');
			}

			window.logger?.info('Transactions loaded', { count: transactions.length });
		} catch (error) {
			window.logger?.error('Failed to load transactions', { error: error.message });
			errorEl.textContent = 'Failed to load transactions. Please try again.';
			errorEl.classList.add('active');
		} finally {
			spinner.classList.remove('active');
		}
	}, 800);
}

// Add new transaction
function addNewTransaction(crypto, amount, recipientAddress) {
	const newTransaction = {
		id: `tx-${Date.now()}`,
		type: 'send',
		crypto: crypto,
		cryptoName: cryptoNames[crypto] || crypto,
		amount: amount.toString(),
		usdValue: '0.00',
		address: 'To: ' + recipientAddress,
		date: new Date(),
		hash: '0x' + Array.from({ length: 64 }, () =>
			Math.floor(Math.random() * 16).toString(16)
		).join(''),
		status: 'pending',
		isPositive: false
	};

	// Directly prepend it to DOM
	const container = document.getElementById('transactions-list');
	container.insertAdjacentHTML('afterbegin', renderTransaction(newTransaction));

	window.logger?.info('New transaction added', { crypto, amount });
}
