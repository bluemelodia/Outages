// Application configuration

window.config = {
    API_BASE: 'http://localhost:8080/api',
    VERIFICATION_CODE_LENGTH: 6,
    MAX_VERIFICATION_ATTEMPTS: 3,
	logger: { 
		accessToken: window.keys.LOGGER_API_ACCESS_TOKEN,
		apiKey: window.keys.LOGGER_API_KEY,
		sourceID: window.keys.LOGGER_API_SOURCEID
	},
	coinGecko: {
		apiKey: window.keys.COINGECKO_API_KEY,
		url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
	}
};