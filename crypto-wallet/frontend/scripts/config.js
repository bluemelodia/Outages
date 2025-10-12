import { keys, fetchAllKeys } from "./keys.js";

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
    API_BASE: "http://localhost:8080/api",
    VERIFICATION_CODE_LENGTH: 6,
    MAX_VERIFICATION_ATTEMPTS: 3,
    logger: {
      accessToken: keys.LOGGER_API_ACCESS_TOKEN,
      apiKey: keys.LOGGER_API_KEY,
      sourceID: keys.LOGGER_API_SOURCEID
    },
    coinGecko: {
      apiKey: keys.COINGECKO_API_KEY,
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    }
  };

  return cachedConfig;
}

export { 
	clearConfigCache, 
	getConfig
};