// Pure JavaScript (Firebase SDK v8 style)
// Assuming your 'firebase' object is available globally after initialization
// Assuming your custom 'alert' function is available (e.g., from './alerts.js' or globally)

import { auth } from "./auth.js";

// Define the keys that will be publicly readable (via Firestore Rules)
const publicKeysToStore = {
	COINGECKO_API_KEY: "...",
};

// Define the keys that will require authentication to read (via Firestore Rules)
// These are still considered INSECURE if fetched directly by client-side code for sensitive operations.
const privateKeysToStore = {
	LOGGER_API_KEY: "...",
	LOGGER_API_ACCESS_TOKEN: "...",
	LOGGER_API_SOURCEID: "..."
};

/**
 * Stores public and private API keys in separate Firestore documents.
 * This function handles the *initial setup or update* of these key documents.
 *
 * It requires an authenticated user to execute, as writing configuration data
 * typically falls under administrative privileges.
 *
 * IMPORTANT SECURITY REMINDERS:
 * 1. The 'public_api_credentials' document (containing COINGECKO_API_KEY)
 *    will be readable by anyone if your Firestore Security Rules allow it
 *    (e.g., `allow read: if true;`). This is suitable for non-sensitive public keys.
 * 2. The 'private_api_credentials' document (containing LOGGER keys)
 *    is designed to be readable ONLY by authenticated users. However,
 *    fetching truly sensitive keys *directly to client-side code* remains
 *    an INSECURE practice. For real secrets that grant server-side access,
 *    Firebase Cloud Functions are strongly recommended as a proxy.
 */
async function storeApiKeysInFirestoreSeparately() {
	const authInstance = auth;
	const db = firebase.firestore();

	const currentUser = authInstance.currentUser;

	if (!currentUser) {
		console.warn("User is not authenticated. Cannot store (configure) API keys.");
		alert("Authentication Required", "You must be signed in to configure API keys.");
		return;
	}

	try {
		// Store public keys
		const publicKeysDocRef = db.collection("keys").doc("public_api_credentials");
		await publicKeysDocRef.set(publicKeysToStore, { merge: true }); // Use merge: true to avoid overwriting existing fields
		console.log("Public API keys successfully stored/updated in Firestore under 'keys/public_api_credentials'.");

		// Store private keys
		const privateKeysDocRef = db.collection("keys").doc("private_api_credentials");
		await privateKeysDocRef.set(privateKeysToStore, { merge: true }); // Use merge: true
		console.log("Private API keys successfully stored/updated in Firestore under 'keys/private_api_credentials'.");

		alert("Success", "API keys have been configured in Firestore (public and private documents).");
	} catch (error) {
		console.error("Error storing API keys:", error);
		alert("Error", `Failed to store API keys: ${error.message}`);
	}
}


export {
	storeApiKeysInFirestoreSeparately
};