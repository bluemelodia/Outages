import { getConfig } from "./config.js";
import { formatLargeNumber } from "./formatters.js";
import { logger } from "./logger.js";

let coinTableData = [];
let coinTableSort = { key: 'market_cap_rank', dir: 'asc' };

function loadCoinMarketTable() {
	getConfig().then(cfg => {
		logger.info('Fetch crypto data');
		doLoadCoinMarketTable(cfg);
	});
}

function showInlineSpinner() {
	const tableWrapper = document.querySelector('.table-scroll-wrapper');
	tableWrapper.classList.add("loading");
	tableWrapper.querySelector(".spinner").classList.add("active");
}

function hideInlineSpinner() {
	const tableWrapper = document.querySelector('.table-scroll-wrapper');
	tableWrapper.querySelector(".spinner").classList.remove("active");
	tableWrapper.classList.remove("loading");
	tableWrapper.style.overflowY = 'auto';
	tableWrapper.style.overflowX = 'auto';
}

function doLoadCoinMarketTable(config) {
	//showInlineSpinner()
	fetch(config.coinGecko.url, {
		headers: {
			'x_cg_demo_api_key': config.coinGecko.apiKey
		}
	})
		.then(async (res) => {
			if (!res.ok) {
				const errorText = await res.text(); // capture error response body
				console.error('Error response from CoinGecko:', errorText);
				throw new Error(`HTTP ${res.status} ${res.statusText}: ${errorText}`);
			}
			return res.json();
		})
		.then((data) => {
			if (!Array.isArray(data)) {
				throw new Error(`Unexpected response format: ${JSON.stringify(data).slice(0, 200)}...`);
			}

			coinTableData = data;
			logger.info(`Received crypto table data: ${data.length}`);
			renderCoinTable();
		})
		.catch((error) => {
			console.error('Error fetching crypto table data:', error);
			logger.error(`Failed to load coin data: ${error}`);

			const table = document.querySelector("table-container");
			if (table == null) {
				console.error("Crypto table container not found");
				return;
			}

			table.innerHTML = `
			<thead>
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
	console.debug(`Successfully received crypto table data: ${coinTableData.count}`);

	//hideInlineSpinner();

	const table = document.getElementById('coin-market-table');
	if (table == null) {
		console.error("Crypto table container not found");
		return;
	}

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

	let thead = `<thead><tr>`;
	columns.forEach(col => {
		thead += `<th class="sortable" data-key="${col.key}" style="cursor:pointer;">${col.label}${sortIndicator(col.key)}</th>`;
	});
	thead += `</tr></thead>`;

	let rows = sorted.map(coin => {
		const changeClass = coin.price_change_24h < 0 ? 'negative' : 'positive';

		console.debug(`Rendering row for coin: ${coin.name} (${coin.symbol}) with data: ${JSON.stringify(coin)}...`);

		let priceChangeElement = '';
		if (coin.price_change_24h != null && coin.price_change_percentage_24h != null) {
			priceChangeElement = `<td class="${changeClass}">
				${coin.price_change_24h.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				(${coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%)
			</td>`;
		}

		return `
			<tr>
				<td>
					<div>
						<img src="${coin.image}" alt="${coin.name}" class="coin-icon">
						<span class="coin-name">${coin.name} (${coin.symbol.toUpperCase()})</span>
					</div>
				</td>
				<td>${coin.current_price != null ? coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}</td>
				<td>${formatLargeNumber(coin.market_cap)}</td>
				<td>${coin.market_cap_rank != null ? coin.market_cap_rank : 'N/A'}</td>
				<td>${formatLargeNumber(coin.total_volume)}</td>
				<td>${coin.high_24h != null ? coin.high_24h.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}</td>
				<td>${coin.low_24h != null ? coin.low_24h.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}</td>
				${priceChangeElement}
				<td>${formatLargeNumber(coin.circulating_supply)}</td>
				<td>${formatLargeNumber(coin.max_supply)}</td>
			</tr>
		`;
	}).join('');

	table.innerHTML = `${thead}<tbody>${rows}</tbody>`;

	// Sorting
	table.querySelectorAll('.sortable').forEach(th => {
		th.onclick = () => {
			const sortKey = th.getAttribute('data-key');
			const colDef = columns.find(c => c.key === sortKey);
			logger.error(`Sorting table by ${sortKey}, sort direction: ${coinTableSort.key}`);
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

export {
	loadCoinMarketTable
};