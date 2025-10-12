import { keys, fetchAllKeys } from "./keys.js";
import { isProduction } from "./logger.js";

let cachedConfig = null;

async function clearConfigCache() {
	cachedConfig = null;
}

async function getConfig() {
  // Return cached config if it exists
  if (cachedConfig) {
    return cachedConfig;
  }

  // Fetch keys if needed
  await fetchAllKeys();

  // Build config
  cachedConfig = {
    VERIFY_IDENTITY_URL: getVerifyIdentityURL(),
    VERIFICATION_CODE_LENGTH: 6,
    MAX_VERIFICATION_ATTEMPTS: 3,
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

  return cachedConfig;
}

function getVerifyIdentityURL() {
	if (isProduction()) {
		return "...";
	} else {
		return " http://localhost:8080";
	}
}

function getLoggingURL(sourceID) {
	let baseURL = ""
	if (isProduction()) {
		baseURL = "https://api.logflare.app";
	} else {
		baseURL = "http://localhost:8010/proxy";
	}

	return `${baseURL}/logs?source=${sourceID}`;
}

export { 
	clearConfigCache, 
	getConfig
};