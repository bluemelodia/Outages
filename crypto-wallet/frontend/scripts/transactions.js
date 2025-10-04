import { auth } from './auth.js';
import { logger } from './logger.js';

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
async function loadTransactions() {
	const container = document.getElementById('transactions-list');
	const spinner = document.getElementById('transactions-spinner');
	const errorEl = document.getElementById('transactions-error');

	// Clear previous
	container.innerHTML = 'Loading...';
	spinner.classList.add('active');

	const user = auth.currentUser;

	if (user) {
		try {
			let transactions = doLoadTransactions();
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
			spinner.classList.remove('active');
		}
	} else {
		alert("Not Signed In", "You must be signed in to view transactions.");
		console.log("No user signed in. Cannot fetch transactions.");
		logoutUser();
	}
}

async function doLoadTransactions() {
	// Get the Firestore service instance
	const db = firebase.firestore();

	const transactionsCollectionRef = db.collection("transactions");

	try {
		// Get all documents from the 'transactions' data store.
		const querySnapshot = await transactionsCollectionRef.get();

		const transactions = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());

			// Add the document data (and its ID) to our transactions array
			transactions.push({
				id: doc.id,
				...doc.data()
			});
		});

		console.log("All transactions:", transactions);
		return transactions;
	} catch (error) {
		console.error("Error getting documents: ", error);
		// Important: Handle 'permission denied' errors here if the user isn't authenticated
		if (error.code === 'permission-denied') {
			alert("Cannot Load Transactions", "Permission denied. Please ensure you are signed in and have access to view transactions.");
		} else {
			alert("Cannot Load Transactions", "Failed to retrieve transactions. Please try again.");
		}

		throw error; // Re-throw the error after handling
	}
}