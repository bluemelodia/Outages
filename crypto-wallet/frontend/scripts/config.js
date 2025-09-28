// Application configuration
const isLocalhost = ["localhost", "127.0.0.1", "::1"]
	.includes(window.location.hostname);

const GRAFANA_PROXY_BASE = "http://localhost:8010/proxy"; // dev proxy origin
const GRAFANA_PROD_BASE = "https://logs-prod-036.grafana.net"; // prod origin
const GRAFANA_PATH = "/loki/api/v1/push"; // the endpoint path

const GRAFANA_API_BASE = isLocalhost ? GRAFANA_PROXY_BASE : GRAFANA_PROD_BASE;
window.config = {
    API_BASE: 'http://localhost:8080/api',
    VERIFICATION_CODE_LENGTH: 6,
    MAX_VERIFICATION_ATTEMPTS: 3,
	grafana: { // loki
    username: "1347130",
    apiKey: window.keys.GRAFANA_API_KEY,
    url: `${GRAFANA_API_BASE}${GRAFANA_PATH}`
  },
  coinGecko: {
    apiKey: window.keys.COINGECKO_API_KEY,
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
  }
};