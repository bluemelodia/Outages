# Outages

## Note
There is a LOT of tech debt in this code base. The developers and product owners who originally worked on the project have since left the team, and the original requirements document is old. Try to optimize the code and replace tactical fixes with maintainable code when you can, but production stability comes first.

## Background

CORS (Cross-Origin Resource Sharing) is a security feature built into web browsers. It prevents a website from making requests to a different domain (origin) unless that server explicitly allows it. For example, if your app is running at http://localhost:3000 and tries to fetch data from https://logs-prod-036.grafana.net, the browser will block the request unless Grafana allows your origin through CORS headers.

Not every request triggers CORS: requests to the same origin, requests from server-side code, or requests to APIs that allow your origin will succeed. But if the API disallows CORS, your request will fail in the browser even if it works in Postman or server-side scripts.

A common solution during development is to use a local CORS proxy like lcp. The proxy runs on your machine (e.g., http://localhost:8010, which is a domain that is not always allowed by APIs) and forwards requests to the real API. Because the browser sees the request as going to localhost (same origin), it doesn’t block it. In production, your app can call the real API directly without the proxy.

# Setup instructions

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
