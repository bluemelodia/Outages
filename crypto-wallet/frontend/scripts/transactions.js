import { withTimeout } from './api.js';
import { auth } from './auth.js';
import { formatTransactionDate } from './formatters.js';
import { logger } from './logger.js';
import { navigateTo } from './navigation.js';
import { hideSpinner, showSpinner } from './utils.js';

// Render one transaction
function renderTransaction(transaction) {
	const statusBadge = `<span class="status-badge">${transaction.status}</span>`;
	const amountClass = transaction.isPositive ? 'positive' : 'negative';
	const amountPrefix = transaction.isPositive ? '+' : '-';

	return `
		<div class="transaction-item">
			<div class="transaction-main">
				<div class="transaction-info">
					<div class="transaction-type">
						<span class="network-badge">${transaction.cryptoName}</span>
						<span class="category-badge">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
						${statusBadge}
					</div>
					<div class="transaction-address">${transaction.address}</div>
				</div>
				
				<div class="transaction-amount-section">
					<div class="amount ${amountClass}">${amountPrefix}${transaction.amount} ${transaction.crypto}</div>
					<div class="amount-usd">≈ $${transaction.usdValue} USD</div>
				</div>
			</div>
			
			<div class="transaction-footer">
				<div class="transaction-date">
					<span>Date</span>
					<span>${formatTransactionDate(transaction.date)}</span>
				</div>
				<div class="transaction-hash">
					<span>Transaction ID</span>
					<span class="transaction-id">${transaction.hash}...</span>
				</div>
			</div>
		</div>
	`;
}

// Load and display transactions
async function loadTransactions() {
	const container = document.getElementById('transactions-list');
	if (container == null) {
		console.error("Transactions container not found");
		return;
	}
	container.innerHTML = '';

	const parent = document.getElementById('transactions-page');
	const errorEl = document.getElementById('transactions-error');

	showSpinner();

	parent.querySelectorAll('.btn-secondary').forEach(el => {
		el.remove();
	});
	const backBtn = document.createElement('button');
	backBtn.className = 'btn btn-secondary';
	backBtn.textContent = 'Back to Menu';
	backBtn.onclick = () => navigateTo('menu');
	parent.appendChild(backBtn);

	const user = auth.currentUser;

	if (user) {
		try {
			const transactions = await withTimeout(doLoadTransactions());
			if (transactions.length === 0) {
				container.innerHTML = `<div>📭 No transactions yet</div>`;
			} else {
				console.debug("Fetched transactions:", transactions);
				container.innerHTML = transactions.map(tx => renderTransaction(tx)).join('');
			}

			logger?.info('Transactions loaded', { count: transactions.length });
		} catch (error) {
			console.error('Error loading transactions:', error);
			logger?.error('Failed to load transactions', { error: error.message });
			errorEl.textContent = 'Failed to load transactions. Please try again.';
			errorEl.classList.add('active');
		} finally {
			hideSpinner();
		}
	} else {
		alert("Not Signed In", "You must be signed in to view transactions.")
			.then(() => {
				logoutUser();
			});
	}
}

async function doLoadTransactions() {
	const db = firebase.firestore();
	const transactionsCollectionRef = db.collection("transactions");

	try {
		// Get all documents from the 'transactions' data store.
		const querySnapshot = await transactionsCollectionRef.get();

		const transactions = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());

			transactions.push({
				id: doc.id,
				...doc.data()
			});
		});

		console.log("All transactions:", transactions);
		return transactions;
	} catch (error) {
		console.error("Error getting documents: ", error);
		// User isn't authenticated
		if (error.code === 'permission-denied') {
			alert("Cannot Load Transactions", "Permission denied. Please ensure you are signed in and have access to view transactions.");
		} else {
			alert("Cannot Load Transactions", "Failed to retrieve transactions. Please try again.");
		}

		throw error;
	}
}

async function addTransaction(transactionData) {
	const db = firebase.firestore();
	const transactionsRef = db.collection("transactions");

	// Generate document ID
	const docId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

	// Prepare data
	const dataToStore = {
		address: transactionData.address,
		amount: transactionData.amount,
		crypto: transactionData.crypto,
		cryptoName: transactionData.cryptoName,
		date: transactionData.date,
		hash: transactionData.hash,
		id: transactionData.id,
		isPositive: transactionData.isPositive,
		status: transactionData.status,
		type: transactionData.type,
		usdValue: transactionData.usdValue
	};

	try {
		await withTimeout(transactionsRef.doc(docId).set(dataToStore));
		console.log(`Transaction document added with ID: ${docId}`);
		return docId;
	} catch (err) {
		console.error("Error adding transaction:", err);
		throw err;
	}
}

export {
	loadTransactions,
	addTransaction
};