import { logger } from "./logger.js";

async function apiCall(url, options = {}) {
	logger.info(`API Call: ${url}`, { method: options.method || 'GET' });

	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				...options
			});

			// Handle both JSON and text responses
			//const data = await response.json();
			const data = {
				confirmation_number: "1234-5678-9999-0000",
				limit_message: "You can send $99,999.99 more crypto today."
			}
			parseResponse(data, resolve);
		} catch (error) {
			logger.info('API call failed:', error);
			reject(error);
		}
	});
}

function parseResponse(data, resolve) {
	if (data.confirmation_number && data.limit_message) {
		const result = {
			confirmation_number: data.confirmation_number,
			limit_message: data.limit_message
		};
		resolve(result);
	}
}

async function withTimeout(promise, timeoutMs = 10000) {
	if (!navigator.onLine) {
		throw new Error("No network connection. Please reconnect and try again.");
	}

	const timeoutPromise = new Promise((_, reject) => setTimeout(
		() => { reject },
		timeoutMs
	));

	return Promise.race([promise, timeoutPromise]);
}

export {
	apiCall,
	withTimeout
};