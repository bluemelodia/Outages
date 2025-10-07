const keys = {
	COINGECKO_API_KEY: "",
	LOGGER_API_KEY: "",
	LOGGER_API_ACCESS_TOKEN: "",
	LOGGER_API_SOURCEID: ""
};

async function fetchCoinGeckoApiKey() {
    const db = firebase.firestore();

    try {
        const publicKeysDocRef = db.collection("keys").doc("public_api_credentials");
        const docSnapshot = await publicKeysDocRef.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            keys.COINGECKO_API_KEY = data.COINGECKO_API_KEY;
        } else {
			console.error("Failed to retrieve CoinGecko API key.");
            return;
        }
    } catch (error) {
        console.error("Error fetching CoinGecko API Key:", error);
        return;
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

			keys.LOGGER_API_KEY = data.LOGGER_API_KEY;
			keys.LOGGER_API_ACCESS_TOKEN = data.LOGGER_API_ACCESS_TOKEN;
			keys.LOGGER_API_SOURCEID = data.LOGGER_API_SOURCEID;
            return;
        } else {
			console.error("Failed to retrieve post-auth API keys.");
            return;
        }
    } catch (error) {
        console.error("Error fetching post-auth API Keys:", error);
        alert("Error", `Failed to retrieve post-auth API keys: ${error.message}`);
        return;
    }
}

export {
	keys,
	fetchCoinGeckoApiKey,
	fetchPrivateLoggerApiKeys
 };