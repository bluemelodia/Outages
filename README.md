# Outages

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

API keys have been added to config.js.

To set-up the front end, run the following commands:

    cd crypto-wallet
    npm i
    npm start
