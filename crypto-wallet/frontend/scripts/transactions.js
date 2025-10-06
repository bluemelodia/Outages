import { auth } from './auth.js';
import { formatTransactionDate } from './formatters.js';
import { logger } from './logger.js';
import { navigateTo } from './navigation.js';

function saveCrypto() {
	const cryptoCurrencies = [
		{
			"id": "bitcoin",
			"symbol": "btc",
			"name": "Bitcoin"
		},
		{
			"id": "ethereum",
			"symbol": "eth",
			"name": "Ethereum"
		},
		{
			"id": "ripple",
			"symbol": "xrp",
			"name": "XRP"
		},
		{
			"id": "tether",
			"symbol": "usdt",
			"name": "Tether"
		},
		{
			"id": "binancecoin",
			"symbol": "bnb",
			"name": "BNB"
		},
		{
			"id": "solana",
			"symbol": "sol",
			"name": "Solana"
		},
		{
			"id": "usd-coin",
			"symbol": "usdc",
			"name": "USDC"
		},
		{
			"id": "dogecoin",
			"symbol": "doge",
			"name": "Dogecoin"
		},
		{
			"id": "staked-ether",
			"symbol": "steth",
			"name": "Lido Staked Ether"
		},
		{
			"id": "tron",
			"symbol": "trx",
			"name": "TRON"
		},
		{
			"id": "cardano",
			"symbol": "ada",
			"name": "Cardano"
		},
		{
			"id": "wrapped-steth",
			"symbol": "wsteth",
			"name": "Wrapped stETH"
		},
		{
			"id": "wrapped-beacon-eth",
			"symbol": "wbeth",
			"name": "Wrapped Beacon ETH"
		},
		{
			"id": "wrapped-bitcoin",
			"symbol": "wbtc",
			"name": "Wrapped Bitcoin"
		},
		{
			"id": "chainlink",
			"symbol": "link",
			"name": "Chainlink"
		},
		{
			"id": "ethena-usde",
			"symbol": "usde",
			"name": "Ethena USDe"
		},
		{
			"id": "hyperliquid",
			"symbol": "hype",
			"name": "Hyperliquid"
		},
		{
			"id": "sui",
			"symbol": "sui",
			"name": "Sui"
		},
		{
			"id": "stellar",
			"symbol": "xlm",
			"name": "Stellar"
		},
		{
			"id": "avalanche-2",
			"symbol": "avax",
			"name": "Avalanche"
		},
		{
			"id": "figure-heloc",
			"symbol": "figr_heloc",
			"name": "Figure Heloc"
		},
		{
			"id": "wrapped-eeth",
			"symbol": "weeth",
			"name": "Wrapped eETH"
		},
		{
			"id": "bitcoin-cash",
			"symbol": "bch",
			"name": "Bitcoin Cash"
		},
		{
			"id": "weth",
			"symbol": "weth",
			"name": "WETH"
		},
		{
			"id": "hedera-hashgraph",
			"symbol": "hbar",
			"name": "Hedera"
		},
		{
			"id": "litecoin",
			"symbol": "ltc",
			"name": "Litecoin"
		},
		{
			"id": "leo-token",
			"symbol": "leo",
			"name": "LEO Token"
		},
		{
			"id": "coinbase-wrapped-btc",
			"symbol": "cbbtc",
			"name": "Coinbase Wrapped BTC"
		},
		{
			"id": "binance-bridged-usdt-bnb-smart-chain",
			"symbol": "bsc-usd",
			"name": "Binance Bridged USDT (BNB Smart Chain)"
		},
		{
			"id": "mantle",
			"symbol": "mnt",
			"name": "Mantle"
		},
		{
			"id": "usds",
			"symbol": "usds",
			"name": "USDS"
		},
		{
			"id": "shiba-inu",
			"symbol": "shib",
			"name": "Shiba Inu"
		},
		{
			"id": "crypto-com-chain",
			"symbol": "cro",
			"name": "Cronos"
		},
		{
			"id": "the-open-network",
			"symbol": "ton",
			"name": "Toncoin"
		},
		{
			"id": "polkadot",
			"symbol": "dot",
			"name": "Polkadot"
		},
		{
			"id": "usdt0",
			"symbol": "usdt0",
			"name": "USDT0"
		},
		{
			"id": "whitebit",
			"symbol": "wbt",
			"name": "WhiteBIT Coin"
		},
		{
			"id": "monero",
			"symbol": "xmr",
			"name": "Monero"
		},
		{
			"id": "ethena-staked-usde",
			"symbol": "susde",
			"name": "Ethena Staked USDe"
		},
		{
			"id": "world-liberty-financial",
			"symbol": "wlfi",
			"name": "World Liberty Financial"
		},
		{
			"id": "uniswap",
			"symbol": "uni",
			"name": "Uniswap"
		},
		{
			"id": "okb",
			"symbol": "okb",
			"name": "OKB"
		},
		{
			"id": "dai",
			"symbol": "dai",
			"name": "Dai"
		},
		{
			"id": "aave",
			"symbol": "aave",
			"name": "Aave"
		},
		{
			"id": "pepe",
			"symbol": "pepe",
			"name": "Pepe"
		},
		{
			"id": "ethena",
			"symbol": "ena",
			"name": "Ethena"
		},
		{
			"id": "bitget-token",
			"symbol": "bgb",
			"name": "Bitget Token"
		},
		{
			"id": "near",
			"symbol": "near",
			"name": "NEAR Protocol"
		},
		{
			"id": "aptos",
			"symbol": "apt",
			"name": "Aptos"
		},
		{
			"id": "aster-2",
			"symbol": "aster",
			"name": "Aster"
		},
		{
			"id": "jito-staked-sol",
			"symbol": "jitosol",
			"name": "Jito Staked SOL"
		},
		{
			"id": "memecore",
			"symbol": "m",
			"name": "MemeCore"
		},
		{
			"id": "bittensor",
			"symbol": "tao",
			"name": "Bittensor"
		},
		{
			"id": "story-2",
			"symbol": "ip",
			"name": "Story"
		},
		{
			"id": "ethereum-classic",
			"symbol": "etc",
			"name": "Ethereum Classic"
		},
		{
			"id": "ondo-finance",
			"symbol": "ondo",
			"name": "Ondo"
		},
		{
			"id": "binance-staked-sol",
			"symbol": "bnsol",
			"name": "Binance Staked SOL"
		},
		{
			"id": "blackrock-usd-institutional-digital-liquidity-fund",
			"symbol": "buidl",
			"name": "BlackRock USD Institutional Digital Liquidity Fund"
		},
		{
			"id": "binance-peg-weth",
			"symbol": "weth",
			"name": "Binance-Peg WETH"
		},
		{
			"id": "zcash",
			"symbol": "zec",
			"name": "Zcash"
		},
		{
			"id": "worldcoin-wld",
			"symbol": "wld",
			"name": "Worldcoin"
		},
		{
			"id": "usd1-wlfi",
			"symbol": "usd1",
			"name": "USD1"
		},
		{
			"id": "c1usd",
			"symbol": "c1usd",
			"name": "Currency One USD"
		},
		{
			"id": "polygon-ecosystem-token",
			"symbol": "pol",
			"name": "POL (ex-MATIC)"
		},
		{
			"id": "paypal-usd",
			"symbol": "pyusd",
			"name": "PayPal USD"
		},
		{
			"id": "internet-computer",
			"symbol": "icp",
			"name": "Internet Computer"
		},
		{
			"id": "jupiter-perpetuals-liquidity-provider-token",
			"symbol": "jlp",
			"name": "Jupiter Perpetuals Liquidity Provider Token"
		},
		{
			"id": "arbitrum",
			"symbol": "arb",
			"name": "Arbitrum"
		},
		{
			"id": "pump-fun",
			"symbol": "pump",
			"name": "Pump.fun"
		},
		{
			"id": "susds",
			"symbol": "susds",
			"name": "sUSDS"
		},
		{
			"id": "pi-network",
			"symbol": "pi",
			"name": "Pi Network"
		},
		{
			"id": "kucoin-shares",
			"symbol": "kcs",
			"name": "KuCoin"
		},
		{
			"id": "kaspa",
			"symbol": "kas",
			"name": "Kaspa"
		},
		{
			"id": "rocket-pool-eth",
			"symbol": "reth",
			"name": "Rocket Pool ETH"
		},
		{
			"id": "gatechain-token",
			"symbol": "gt",
			"name": "Gate"
		},
		{
			"id": "vechain",
			"symbol": "vet",
			"name": "VeChain"
		},
		{
			"id": "pudgy-penguins",
			"symbol": "pengu",
			"name": "Pudgy Penguins"
		},
		{
			"id": "algorand",
			"symbol": "algo",
			"name": "Algorand"
		},
		{
			"id": "cosmos",
			"symbol": "atom",
			"name": "Cosmos Hub"
		},
		{
			"id": "kinetic-staked-hype",
			"symbol": "khype",
			"name": "Kinetiq Staked HYPE"
		},
		{
			"id": "render-token",
			"symbol": "render",
			"name": "Render"
		},
		{
			"id": "flare-networks",
			"symbol": "flr",
			"name": "Flare"
		},
		{
			"id": "kelp-dao-restaked-eth",
			"symbol": "rseth",
			"name": "Kelp DAO Restaked ETH"
		},
		{
			"id": "usdtb",
			"symbol": "usdtb",
			"name": "USDtb"
		},
		{
			"id": "sei-network",
			"symbol": "sei",
			"name": "Sei"
		},
		{
			"id": "hash-2",
			"symbol": "hash",
			"name": "Provenance Blockchain"
		},
		{
			"id": "stakewise-v3-oseth",
			"symbol": "oseth",
			"name": "StakeWise Staked ETH"
		},
		{
			"id": "falcon-finance",
			"symbol": "usdf",
			"name": "Falcon USD"
		},
		{
			"id": "bfusd",
			"symbol": "bfusd",
			"name": "BFUSD"
		},
		{
			"id": "doublezero",
			"symbol": "2z",
			"name": "DoubleZero"
		},
		{
			"id": "liquid-staked-ethereum",
			"symbol": "lseth",
			"name": "Liquid Staked ETH"
		},
		{
			"id": "filecoin",
			"symbol": "fil",
			"name": "Filecoin"
		},
		{
			"id": "plasma",
			"symbol": "xpl",
			"name": "Plasma"
		},
		{
			"id": "bonk",
			"symbol": "bonk",
			"name": "Bonk"
		},
		{
			"id": "sky",
			"symbol": "sky",
			"name": "Sky"
		},
		{
			"id": "official-trump",
			"symbol": "trump",
			"name": "Official Trump"
		},
		{
			"id": "wbnb",
			"symbol": "wbnb",
			"name": "Wrapped BNB"
		},
		{
			"id": "spx6900",
			"symbol": "spx",
			"name": "SPX6900"
		},
		{
			"id": "lombard-staked-btc",
			"symbol": "lbtc",
			"name": "Lombard Staked BTC"
		},
		{
			"id": "fetch-ai",
			"symbol": "fet",
			"name": "Artificial Superintelligence Alliance"
		}
	];

	// Get the Firestore service instance
	const db = firebase.firestore();

	// Function to save the list of cryptocurrencies
	async function saveCryptoCurrencies() {
		const cryptoCollectionRef = db.collection("cryptocurrencies");
		let successfulWrites = 0;
		let failedWrites = 0;

		console.log("Attempting to save cryptocurrencies to Firestore...");

		// We'll use a Promise.all to handle all writes concurrently and wait for them to finish
		const writePromises = cryptoCurrencies.map(async (crypto) => {
			try {
				if (!crypto.id) {
					console.warn("Skipping crypto with no ID:", crypto);
					failedWrites++;
					return; // Skip this one if it has no ID
				}
				await cryptoCollectionRef.doc(crypto.id).set(crypto);
				successfulWrites++;
				// console.log(`Successfully wrote: ${crypto.id}`); // Optional: log each success
			} catch (error) {
				failedWrites++;
				console.error(`Error writing ${crypto.id} to Firestore: `, error);
				// More detailed error handling for individual items can go here
			}
		});

		// Wait for all write operations to complete
		await Promise.all(writePromises);

		console.log(`Finished saving cryptocurrencies.`);
		console.log(`Successful writes: ${successfulWrites}, Failed writes: ${failedWrites}`);

		if (failedWrites === 0) {
			alert("All cryptocurrencies saved successfully to Firestore!");
		} else {
			alert(`Some cryptocurrencies failed to save. Check console for details. Successful: ${successfulWrites}, Failed: ${failedWrites}`);
		}
	}

	firebase.auth().onAuthStateChanged((user) => {
	  if (user) {
	    saveCryptoCurrencies();
	  } else {
	    console.warn("User not authenticated. Cannot save cryptocurrencies.");
	    alert("Please sign in to save cryptocurrency data.");
	  }
	});

}

// Render one transaction
function renderTransaction(transaction) {
	saveCrypto();
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
	const spinner = document.getElementById('transactions-spinner');
	const errorEl = document.getElementById('transactions-error');

	// Clear previous transactions list...
	spinner.classList.add('active');

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
			let transactions = await doLoadTransactions();
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

export {
	loadTransactions
};