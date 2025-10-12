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

			if (!response.ok) {
				logger.error(`HTTP ${response.status}: ${response.statusText}`);
				return;
			}

			// Handle both JSON and text responses
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				resolve(data);
			} else {
				const text = await response.text();
				resolve(text);
			}
		} catch (error) {
			logger.info('API call failed:', error);
			reject(error);
		}
	});
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