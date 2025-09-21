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
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', {
        headers: {
            'x_cg_demo_api_key': '<YOUR_API_KEY>'
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
        if (key === 'price_change_percentage_24h') {
            v1 = v1 ?? 0; v2 = v2 ?? 0;
        }
        if (dir === 'asc') return v1 - v2;
        else return v2 - v1;
    });

    let rows = sorted.map(coin => {
        const changeClass = coin.price_change_percentage_24h < 0 ? 'negative' : 'positive';
        return `
            <tr>
                <td><img src="${coin.image}" alt="${coin.name}" style="width:24px;vertical-align:middle;margin-right:8px;">${coin.name} (${coin.symbol.toUpperCase()})</td>
                <td>${coin.current_price.toLocaleString('en-US', {style:'currency',currency:'USD'})}</td>
                <td>${coin.market_cap_rank}</td>
                <td class="${changeClass}">${coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%</td>
            </tr>
        `;
    }).join('');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Coin</th>
                <th class="sortable" data-key="current_price">Price</th>
                <th class="sortable" data-key="market_cap_rank">Rank</th>
                <th class="sortable" data-key="price_change_percentage_24h">24h Change</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    `;

    // Add click handlers for sorting
    table.querySelectorAll('.sortable').forEach(th => {
        th.style.cursor = 'pointer';
        th.onclick = () => {
            const sortKey = th.getAttribute('data-key');
            if (coinTableSort.key === sortKey) {
                coinTableSort.dir = coinTableSort.dir === 'asc' ? 'desc' : 'asc';
            } else {
                coinTableSort.key = sortKey;
                coinTableSort.dir = 'asc';
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