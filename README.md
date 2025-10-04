# Outages

## Note
There is a LOT of tech debt in this code base. The developers and product owners who originally worked on the project have since left the team, and the original requirements document is old. Try to optimize the code and replace tactical fixes with maintainable code when you can, but production stability comes first.

## Background

CORS (Cross-Origin Resource Sharing) is a security feature built into web browsers. It prevents a website from making requests to a different domain (origin) unless that server explicitly allows it. For example, if your app is running at http://localhost:3000 and tries to fetch data from https://logs-prod-036.grafana.net, the browser will block the request unless Grafana allows your origin through CORS headers.

Not every request triggers CORS: requests to the same origin, requests from server-side code, or requests to APIs that allow your origin will succeed. But if the API disallows CORS, your request will fail in the browser even if it works in Postman or server-side scripts.

A common solution during development is to use a local CORS proxy like lcp. The proxy runs on your machine (e.g., http://localhost:8010, which is a domain that is not always allowed by APIs) and forwards requests to the real API. Because the browser sees the request as going to localhost (same origin), it doesn’t block it. In production, your app can call the real API directly without the proxy.

# Pre-requisites

To use the Crypto API, you need to create a demo account and get an API key.

    1) Navigate to https://www.coingecko.com/en/api/pricing.
    2) Tap on the "Create Free Account" button.
    3) Authenticate via Continue with Google, Continue with Apple, or Continue with email.
    4) Fill out the registration form.
    	Sample input:
    		Company or Project Name:
    			Crypto Wallet
    		Team Size (Number):
    			50
    		Your Role:
    			Developer
    		What are you using CoinGecko API for?
    			Building a website
    		How did you find out about CoinGecko API?
    			Search engines (eg. Google)
    		Please elaborate on the details based on your answers above
    			I'm building a website to explore the CoinGecko API.

    Check the box that indicates you agree to the Terms of Service, then tap on the "Create Demo Account" button.

    5) You should be redirected to the developer dashboard page. If not, navigate to: https://www.coingecko.com/en/developers/dashboard.

    6) In the My API Keys section, tap on the "Add New Key" button.

    7) Give the API key a name, then tap on the "Create" button.

You should now have a demo API key.

# Setup instructions

API keys should be added to keys.js. Format:

    window.keys = {
    	COINGECKO_API_KEY: "...",
    	LOGGER_API_KEY: "...",
    	LOGGER_API_ACCESS_TOKEN: "...",
    	LOGGER_API_SOURCEID: "..."
    };

They are consumed in config.js like this:

	const config = {
		API_BASE: 'http://localhost:8080/api',
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

To run the front-end code locally, run the following:

    cd crypto-wallet
    npm i
    npm start

In a separate terminal tab/window, run the following:

    npx lcp --proxyUrl https://api.logflare.app

where proxyUrl is the remote server that we want to forward requests to (Grafana).

This proxy acts as a middleman: when your browser makes requests to http://localhost:8010, the proxy forwards them to Grafana. Because the browser sees the request as going to localhost (same origin), it bypasses CORS restrictions during local development. In production, this proxy is not needed, because requests go directly to the allowed API.

# Deployment

To deploy the front-end code, run:

    npm run deploy

Check for updates:

    https://bluemelodia.github.io/Outages/
