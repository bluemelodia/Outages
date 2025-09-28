// Application configuration
window.config = {
    API_BASE: 'http://localhost:8080/api',
    VERIFICATION_CODE_LENGTH: 6,
    MAX_VERIFICATION_ATTEMPTS: 3,
	grafana: { // loki
    username: "1347130",
    apiKey: window.keys.GRAFANA_API_KEY,
    url: "https://logs-prod-036.grafana.net/loki/api/v1/push"
  },
  coinGecko: {
    apiKey: window.keys.COINGECKO_API_KEY,
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
  }
};