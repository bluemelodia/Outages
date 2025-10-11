import { auth } from "./auth.js";

async function loadCryptocurrencies() {
	const user = auth.currentUser;

	if (user) {
		try {
			let cryptocurrencies = await doLoadCryptocurrencies();
			if (cryptocurrencies.length === 0) {
				return [];
			} else {
				return cryptocurrencies;
			}
		} catch (error) {
			console.error('Error loading cryptocurrencies:', error);
			logger?.error('Failed to load cryptocurrencies', { error: error.message });
			throw new Error("Failed to load cryptocurrencies.");
		}
	} else {
		alert("Not Signed In", "You must be signed in to send crypto.");
		console.log("No user signed in. Cannot fetch cryptocurrencies.");
		logoutUser();
	}
}

async function doLoadCryptocurrencies() {
	const db = firebase.firestore(); // Using Firebase SDK v8 style
	const cryptocurrenciesCollectionRef = db.collection("cryptocurrencies");

	try {
		const querySnapshot = await cryptocurrenciesCollectionRef.get();

		const cryptocurrencies = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			console.debug(doc.id, " => ", data);

			cryptocurrencies.push({
				id: doc.id,
				...data
			});
		});

		return cryptocurrencies;
	} catch (error) {
		console.error("Error getting cryptocurrency documents: ", error);
		throw error;
	}
}

export {
	loadCryptocurrencies
};