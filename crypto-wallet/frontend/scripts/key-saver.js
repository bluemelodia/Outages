async function fetchCoinGeckoApiKey() {
    const db = firebase.firestore();

    try {
        const publicKeysDocRef = db.collection("keys").doc("public_api_credentials");
        const docSnapshot = await publicKeysDocRef.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            return data.COINGECKO_API_KEY;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching CoinGecko API Key:", error);
        return null;
    }
}

async function fetchPrivateLoggerApiKeys() {
    const authInstance = firebase.auth();
    const db = firebase.firestore();

    const currentUser = authInstance.currentUser;

    if (!currentUser) {
        console.warn("User is not authenticated. Cannot fetch private Logger API keys.");
        alert("Authentication Required", "You must be signed in to access post-auth API keys.");
        return null;
    }

    try {
        const privateKeysDocRef = db.collection("keys").doc("private_api_credentials");
        const docSnapshot = await privateKeysDocRef.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            return {
                LOGGER_API_KEY: data.LOGGER_API_KEY,
                LOGGER_API_ACCESS_TOKEN: data.LOGGER_API_ACCESS_TOKEN,
                LOGGER_API_SOURCEID: data.LOGGER_API_SOURCEID
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching private Logger API Keys:", error);
        alert("Error", `Failed to retrieve Logger API keys: ${error.message}`);
        return null;
    }
}

// --- Example Usage ---

// Fetch CoinGecko API Key (can be done anytime, without user login)
fetchCoinGeckoApiKey().then(apiKey => {
    if (apiKey) {
        console.log("Using CoinGecko API Key (publicly fetched):", apiKey);
        // You can now use apiKey for your CoinGecko API calls
    } else {
        console.log("CoinGecko API Key not available.");
    }
});

// Fetch Logger API Keys (only after user is authenticated)
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User is signed in. Attempting to fetch private Logger API keys...");
        const loggerKeys = await fetchPrivateLoggerApiKeys();
        if (loggerKeys) {
            console.log("Using Logger API Key:", loggerKeys.LOGGER_API_KEY);
            // console.log("Using Logger Access Token:", loggerKeys.LOGGER_API_ACCESS_TOKEN);
            // console.log("Using Logger Source ID:", loggerKeys.LOGGER_API_SOURCEID);
            // You can now use these keys for your Logger API calls
        } else {
            console.log("Private Logger API keys not available.");
        }
    } else {
        console.log("No user signed in. Private Logger API keys cannot be fetched.");
    }
});


export {
    fetchCoinGeckoApiKey,
    fetchPrivateLoggerApiKeys
};