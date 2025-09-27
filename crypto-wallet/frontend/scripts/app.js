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
        let v1 = a[key], v2 = b[key];
        // Handle null/undefined
        v1 = v1 ?? 0;
        v2 = v2 ?? 0;
        // String comparison for name/symbol
        if (typeof v1 === "string" && typeof v2 === "string") {
            return dir === 'asc' ? v1.localeCompare(v2) : v2.localeCompare(v1);
        }
        return dir === 'asc' ? v1 - v2 : v2 - v1;
    });

    // Column definitions: key, label, isNumeric
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

    // Sort indicator
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
                    <img src="${coin.image}" alt="${coin.name}" style="width:24px;vertical-align:middle;margin-right:8px;">
                    ${coin.name} (${coin.symbol.toUpperCase()})
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
				// Set default direction per column
				if (sortKey === 'market_cap_rank') {
					coinTableSort.dir = 'asc';
				} else if (sortKey === 'name') {
					coinTableSort.dir = 'asc';
				} else if (colDef && colDef.isNumeric) {
					coinTableSort.dir = 'desc';
				} else {
					coinTableSort.dir = 'asc';
				}
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
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (username === "prodtest" && password === "Crypto1") {
        // Hide login, show menu
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('menu-page').classList.add('active');
        document.getElementById('login-error').textContent = '';
        document.getElementById('login-error').classList.remove('active');
    } else {
        document.getElementById('login-error').textContent = 'Invalid username or password.';
        document.getElementById('login-error').classList.add('active');
    }
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