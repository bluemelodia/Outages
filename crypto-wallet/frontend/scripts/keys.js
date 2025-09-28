// config.js - Store API keys here (this file will be gitignored)

const config = {
  grafana: { // loki
    username: "1347130",
    apiKey: process.env.GRAFANA_API_KEY,
    url: "https://logs-prod-036.grafana.net/loki/api/v1/push"
  },
  coinGecko: {
    apiKey: process.env.COINGECKO_API_KEY,
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  // Node.js/CommonJS
  module.exports = config;
} else {
  // Browser/ES6 modules
  window.config = config;
}
