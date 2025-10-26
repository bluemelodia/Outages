import { keys, fetchAllKeys } from "./keys.js";
import { isProduction } from "./logger.js";
import { isCryptoRewrite } from "./piloting.js";

let cachedConfig = null;
let ignoreCache = true;

async function clearConfigCache() {
	ignoreCache = true;
}

async function getConfig() {
	// Return cached config if it exists
	if (cachedConfig && !ignoreCache) {
		return cachedConfig;
	}

	// Fetch keys if needed
	await fetchAllKeys();

	// Build config
	cachedConfig = {
		logger: {
			accessToken: keys.LOGGER_API_ACCESS_TOKEN,
			apiKey: keys.LOGGER_API_KEY,
			sourceID: keys.LOGGER_API_SOURCEID,
			url: getLoggingURL(keys.LOGGER_API_SOURCEID)
		},
		coinGecko: {
			apiKey: keys.COINGECKO_API_KEY,
			url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
		}
	};

	ignoreCache = false;

	return cachedConfig;
}

async function getValidateTransactionURL() {
	const isProd = isProduction();
	const isRewrite = await isCryptoRewrite();

	return new Promise(resolve => {
		let url = ""
		if (isProd) {
			const serviceName = isRewrite ? "v2" : "v1";
			url = `https://crypto-svc-${serviceName}.fly.dev/api/transaction`;
		} else {
			const port = isRewrite ? 8013 : 8012;
			url = `http://localhost:${port}/proxy/api/transaction`;
		}

		resolve(url);
	});
}

function getLoggingURL(sourceID) {
	let baseURL = ""
	if (isProduction()) {
		baseURL = "https://api.logflare.app/api";
	} else {
		baseURL = "http://localhost:8010/proxy";
	}

	return `${baseURL}/logs?source=${sourceID}`;
}

export {
	clearConfigCache,
	getConfig,
	getValidateTransactionURL
};