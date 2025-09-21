// Transaction-related functionality

function initiateSendCrypto() {
    requireVerification(processSendCrypto);
}

async function processSendCrypto() {
    const recipient = document.getElementById('recipient').value;
    const cryptoType = document.getElementById('crypto-type').value;
    const amount = document.getElementById('amount').value;
    const spinner = document.getElementById('send-spinner');

    if (!recipient || !amount || parseFloat(amount) <= 0) {
        showError('send', 'Please fill in all fields with valid values');
        return;
    }

    try {
        spinner.classList.add('active');
        
        const result = await apiCall('/send-crypto', {
            method: 'POST',
            body: JSON.stringify({
                recipient,
                cryptoType,
                amount: parseFloat(amount)
            })
        });

        if (result.success) {
            alert('Transaction sent successfully!');
            clearSendForm();
            navigateTo('menu');
        } else {
            showError('send', result.message || 'Transaction failed');
        }
    } catch (error) {
        showError('send', 'Failed to send transaction. Please try again.');
    } finally {
        spinner.classList.remove('active');
    }
}

function clearSendForm() {
    document.getElementById('recipient').value = '';
    document.getElementById('amount').value = '';
}

async function loadTransactions() {
    requireVerification(fetchTransactions);
}

async function fetchTransactions() {
    const spinner = document.getElementById('transactions-spinner');
    const list = document.getElementById('transactions-list');
    
    try {
        spinner.classList.add('active');
        
        const transactions = await apiCall('/transactions');
        
        if (transactions && transactions.length > 0) {
            list.innerHTML = transactions.map(tx => `
                <div class="transaction-item">
                    <div class="transaction-header">
                        <div class="transaction-amount ${tx.type === 'received' ? 'positive' : 'negative'}">
                            ${tx.type === 'received' ? '+' : '-'}$${tx.amount.toFixed(2)}
                        </div>
                        <div class="transaction-date">${new Date(tx.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="transaction-details">
                        ${tx.cryptoType} • ${tx.type === 'sent' ? 'To: ' + tx.recipient : 'From: ' + tx.sender}
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p style="text-align: center; color: #6b7280; margin: 2rem 0;">No transactions found.</p>';
        }
    } catch (error) {
        showError('transactions', 'Failed to load transactions');
        list.innerHTML = '';
    } finally {
        spinner.classList.remove('active');
    }
}