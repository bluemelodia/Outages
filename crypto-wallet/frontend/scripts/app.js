// Main application initialization

document.addEventListener('DOMContentLoaded', function() {
	console.log('Initialized');
	
	// Initialize event listeners
	initializeEventListeners();
	
	// Initialize any startup logic
	initializeApp();
	loadCoinMarketTable();
});

let coinTableData = [];
let coinTableSort = { key: 'market_cap_rank', dir: 'asc' };

function loadCoinMarketTable() {
	logger.info('Fetch crypto');

	fetch(config.coinGecko.url, {
		headers: {
			'x_cg_demo_api_key': config.coinGecko.apiKey
		}
	})
	.then(res => res.json())
	.then(data => {
		coinTableData = data;
		renderCoinTable();
	})
	.catch(() => {
		const table = document.getElementById('coin-market-table');
		table.innerHTML = `
			<thead>
				<tr>
					<th>Coin</th>
					<th>Price</th>
					<th>Rank</th>
					<th>24h Change</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td colspan="4">Failed to load coin data.</td>
				</tr>
			</tbody>
		`;
	});
}

function renderCoinTable() {
	const table = document.getElementById('coin-market-table');
	let sorted = [...coinTableData];
	const { key, dir } = coinTableSort;
	sorted.sort((a, b) => {
		let v1 = a[key] ?? 0;
		let v2 = b[key] ?? 0;
		if (typeof v1 === "string" && typeof v2 === "string") {
			return dir === 'asc' ? v1.localeCompare(v2) : v2.localeCompare(v1);
		}
		return dir === 'asc' ? v1 - v2 : v2 - v1;
	});

	const columns = [
		{ key: 'name', label: 'Coin', isNumeric: false },
		{ key: 'current_price', label: 'Price', isNumeric: true },
		{ key: 'market_cap', label: 'Market Cap', isNumeric: true },
		{ key: 'market_cap_rank', label: 'Rank', isNumeric: true },
		{ key: 'total_volume', label: 'Total Volume', isNumeric: true },
		{ key: 'high_24h', label: 'High (24h)', isNumeric: true },
		{ key: 'low_24h', label: 'Low (24h)', isNumeric: true },
		{ key: 'price_change_24h', label: 'Change (24h)', isNumeric: true },
		{ key: 'circulating_supply', label: 'Circulating Supply', isNumeric: true },
		{ key: 'max_supply', label: 'Max Supply', isNumeric: true }
	];

	function sortIndicator(colKey) {
		if (colKey !== key) return '';
		return dir === 'asc' ? ' ▲' : ' ▼';
	}

	// Table header
	let thead = `<thead><tr>`;
	columns.forEach(col => {
		thead += `<th class="sortable" data-key="${col.key}" style="cursor:pointer;">${col.label}${sortIndicator(col.key)}</th>`;
	});
	thead += `</tr></thead>`;

	// Table rows
	let rows = sorted.map(coin => {
		const changeClass = coin.price_change_24h < 0 ? 'negative' : 'positive';
		return `
			<tr>
				<td>
					<div>
						<img src="${coin.image}" alt="${coin.name}" class="coin-icon">
						<span class="coin-name">${coin.name} (${coin.symbol.toUpperCase()})</span>
					</div>
				</td>
				<td>${coin.current_price.toLocaleString('en-US', {style:'currency',currency:'USD'})}</td>
				<td>${formatLargeNumber(coin.market_cap)}</td>
				<td>${coin.market_cap_rank}</td>
				<td>${formatLargeNumber(coin.total_volume)}</td>
				<td>${coin.high_24h.toLocaleString('en-US', {style:'currency',currency:'USD'})}</td>
				<td>${coin.low_24h.toLocaleString('en-US', {style:'currency',currency:'USD'})}</td>
				<td class="${changeClass}">
					${coin.price_change_24h.toLocaleString('en-US', {style:'currency',currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})}
					(${coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%)
				</td>
				<td>${formatLargeNumber(coin.circulating_supply)}</td>
				<td>${formatLargeNumber(coin.max_supply)}</td>
			</tr>
		`;
	}).join('');

	table.innerHTML = `${thead}<tbody>${rows}</tbody>`;

	// Add click handlers for sorting
	table.querySelectorAll('.sortable').forEach(th => {
		th.onclick = () => {
			const sortKey = th.getAttribute('data-key');
			const colDef = columns.find(c => c.key === sortKey);
			if (coinTableSort.key === sortKey) {
				coinTableSort.dir = coinTableSort.dir === 'asc' ? 'desc' : 'asc';
			} else {
				coinTableSort.key = sortKey;
				if (sortKey === 'market_cap_rank' || sortKey === 'name') coinTableSort.dir = 'asc';
				else coinTableSort.dir = colDef?.isNumeric ? 'desc' : 'asc';
			}
			renderCoinTable();
		};
	});
}

function initializeEventListeners() {
	// Add Enter key support for verification modal
	const verificationInput = document.getElementById('verification-code');
	if (verificationInput) {
		verificationInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				verifyIdentity();
			}
		});
	}

	// Add Enter key support for login form
	const loginInputs = document.querySelectorAll('#login-username, #login-password');
	loginInputs.forEach(input => {
		input.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				loginUser();
			}
		});
	});

	// Add form validation listeners
	const forms = document.querySelectorAll('input');
	forms.forEach(input => {
		input.addEventListener('blur', validateField);
	});
}

function initializeApp() {
	// Hide all pages
	document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
	// Show only the login page
	document.getElementById('login-page').classList.add('active');
	console.log('Initialized');
}

function loginUser() {
	const username = document.getElementById("login-username").value.trim();
	const password = document.getElementById("login-password").value.trim();
	const errorEl = document.getElementById("login-error");

	// Allowed users
	const allowedUsers = Array.from({ length: 8 }, (_, i) => `test_user${i + 1}`);
	const validPassword = "crypto";

	// Validation
	if (!allowedUsers.includes(username) || password !== validPassword) {
		errorEl.textContent = "❌ Invalid username or password.";
		errorEl.classList.add("active");
		window.logger.warn("Failed login attempt", { username });
		return;
	}

	// Success
	errorEl.classList.remove("active");
	errorEl.textContent = "";

	localStorage.setItem("loggedInUser", username);
	window.logger.info("✅ User logged in", { username });

	// Navigate to menu
	document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
	document.getElementById("menu-page").classList.add("active");
}

function logoutUser() {
	// Clear stored user
	localStorage.removeItem("loggedInUser");
	window.logger.info("👋 User logged out");

	// Hide all pages
	document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

	// Reset login form fields
	document.getElementById("login-username").value = "";
	document.getElementById("login-password").value = "";

	// Reset UI
	document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
	document.getElementById("login-page").classList.add("active");
}

// Add this after your initializeApp or inside initializeEventListeners
document.getElementById('login-username').addEventListener('input', clearLoginError);
document.getElementById('login-password').addEventListener('input', clearLoginError);

function clearLoginError() {
	const errorDiv = document.getElementById('login-error');
	errorDiv.textContent = '';
	errorDiv.classList.remove('active');
}

function validateField(event) {
	const input = event.target;
	const value = input.value;
	
	// Basic validation logic
	if (input.required && !value) {
		input.style.borderColor = '#dc2626';
	} else {
		input.style.borderColor = '#e5e7eb';
	}
}