import { isProduction } from "./logger";
import { createEnum } from "./utils";

const pilots = createEnum([
	"CRYPTO_V1",
	"CRYPTO_V2"
]);

async function getUserPilotMembership() {
	const user = auth.currentUser;
	if (!user) {
		console.error("User not logged in.");
		return null;
	}

	const userUUID = user.uid;
	let pilotGroup = pilots.CRYPTO_V2;

	const collectionName = isProduction() ? "pilotMemberships_prod" : "pilotMemberships_qa";

	try {
		const userDocRef = doc(db, collectionName, userUUID);
		const userDocSnap = await getDoc(userDocRef);

		if (userDocSnap.exists()) {
			const docData = userDocSnap.data();
			if (typeof docData.pilotGroup === 'string') {
				pilotGroup = docData.pilotGroup;
			} else {
				console.warn(`'pilotGroup' field not found or not a string for user ${userUUID}. Using default.`);
			}
		} else {
			console.log(`Pilot membership document not found for user ${userUUID} in ${collectionName}. Using default.`);
		}
	} catch (error) {
		console.error("Error fetching pilot membership:", error);
	}

	return pilotGroup;
}

async function isCryptoRewrite(pilot) {
	let pilot = await getUserPilotMembership();
	return pilot == pilots.CRYPTO_V2;
}

export {
	isCryptoRewrite
};