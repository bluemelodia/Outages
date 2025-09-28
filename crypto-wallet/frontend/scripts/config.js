// Application configuration

window.config = {
    API_BASE: 'http://localhost:8080/api',
    VERIFICATION_CODE_LENGTH: 6,
    MAX_VERIFICATION_ATTEMPTS: 3,
	logger: { 
		bearer: window.tokens.BETTERSTACK_BEARER_TOKEN,
		url: "https://s1533225.eu-nbg-2.betterstackdata.com"
	},
	coinGecko: {
		apiKey: window.keys.COINGECKO_API_KEY,
		url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
	}
};