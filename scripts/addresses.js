import { withTimeout } from "./api.js";
import { auth } from "./auth.js";

async function loadAddresses() {
	const user = auth.currentUser;

	if (user) {
		try {
			let addresses = await withTimeout(doLoadAddresses());
			if (addresses.length === 0) {
				return [];
			} else {
				return addresses;
			}
		} catch (error) {
			console.error('Error loading addresses:', error);
			logger?.error('Failed to load addresses', { error: error.message });
			return [];
		}
	} else {
		alert("Not Signed In", "You must be signed in to send crypto.")
			.then(() => {
				logoutUser();	
			});
	}
}

async function doLoadAddresses() {
	const db = firebase.firestore(); 
	const addressesCollectionRef = db.collection("addresses");

	try {
		const querySnapshot = await addressesCollectionRef.get();

		const addresses = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			console.debug(doc.id, " => ", data);

			addresses.push({
				id: doc.id,
				...data
			});
		});

		return addresses;
	} catch (error) {
		console.error("Error getting cryptocurrency documents: ", error);
		throw error;
	}
}

export {
	loadAddresses
};