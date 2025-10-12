import { auth } from "./auth.js";

const keys = {
	COINGECKO_API_KEY: "",
	LOGGER_API_KEY: "",
	LOGGER_API_ACCESS_TOKEN: "",
	LOGGER_API_SOURCEID: ""
};

// Fetch public CoinGecko key
async function fetchCoinGeckoApiKey() {
	const db = firebase.firestore();

	try {
		const docSnapshot = await db.collection("keys").doc("public_api_credentials").get();
		if (docSnapshot.exists) {
			keys.COINGECKO_API_KEY = docSnapshot.data().COINGECKO_API_KEY;
		} else {
			console.error("Failed to retrieve CoinGecko API key.");
		}
	} catch (error) {
		console.error("Error fetching CoinGecko API Key:", error);
	}
}

// Fetch private Logger keys
async function fetchPrivateLoggerApiKeys() {
	const authInstance = firebase.auth();
	const db = firebase.firestore();

	const currentUser = authInstance.currentUser;
	if (!currentUser) {
		console.warn("User is not authenticated. Cannot fetch private Logger API keys.");
		return null;
	}

	try {
		const docSnapshot = await db.collection("keys").doc("private_api_credentials").get();
		if (docSnapshot.exists) {
			const data = docSnapshot.data();
			keys.LOGGER_API_KEY = data.LOGGER_API_KEY;
			keys.LOGGER_API_ACCESS_TOKEN = data.LOGGER_API_ACCESS_TOKEN;
			keys.LOGGER_API_SOURCEID = data.LOGGER_API_SOURCEID;
		} else {
			console.error("Failed to retrieve post-auth API keys.");
		}
	} catch (error) {
		console.error("Error fetching post-auth API Keys:", error);
	}
}

// Fetch all keys
async function fetchAllKeys() {
	await fetchCoinGeckoApiKey();

	const user = auth.currentUser;
	if (user) {
		await fetchPrivateLoggerApiKeys();
	}
}

export { 
	keys,
	fetchAllKeys
};