import { auth } from "./auth.js";
import { isProduction } from "./logger.js";
import { createEnum } from "./utils.js";

const pilots = createEnum([
	"CRYPTO_V1",
	"CRYPTO_V2"
]);

async function getUserPilotMembership() {
	const db = firebase.firestore();

	const user = auth.currentUser;
	if (!user) {
		console.error("User not logged in.");
		return null;
	}

	const userEmail = user.email;
	if (!userEmail) {
		console.error("User email not available.");
		return null;
	}
	let pilotGroup = pilots.CRYPTO_V2;

	const collectionName = isProduction() ? "cryptoPilots_prod" : "cryptoPilots_qa";

	try {
		const userDocSnapshot = await db.collection(collectionName)
			.where("email", "==", userEmail)
			.limit(1)
			.get();
		if (userDocSnapshot.exists) {
			const docData = userDocSnapshot.data();
			if (typeof docData.pilotGroup === 'string') {
				pilotGroup = docData.pilotGroup;
			} else {
				console.error("Failed to retrieve user pilot information.");
			}
		} else {
			console.log(`Pilot membership document not found for user ${userUUID} in ${collectionName}. Using default.`);
		}
	} catch (error) {
		console.error("Error fetching pilot membership:", error);
	}

	return pilotGroup;
}

async function isCryptoRewrite() {
	let pilot = await getUserPilotMembership();
	return pilot == pilots.CRYPTO_V2;
}

export {
	isCryptoRewrite
};