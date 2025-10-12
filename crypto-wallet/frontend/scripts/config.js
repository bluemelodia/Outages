import { keys } from './keys.js';

const config = {
	API_BASE: 'http://localhost:3000/api',
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

export { config };