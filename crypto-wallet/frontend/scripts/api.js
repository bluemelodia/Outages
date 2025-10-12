import { logger } from "./logger.js";

async function apiCall(url, options = {}) {
	logger.info(`API Call: ${url}`, { method: options.method || 'GET' });

	try {		
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		if (!response.ok) {
			console.error("===> non-HTTP status code");
			logger.error(`HTTP ${response.status}: ${response.statusText}`);
			return; // Bug: doesn't throw or return promise
		}

		console.error("===> the response is great");
		
		// Handle both JSON and text responses
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return await response.json();
		}
		return await response.text();
	} catch (error) {
		logger.info('API call failed:', error);
		throw error;
	}
}

async function withTimeout(promise, timeoutMs = 10000) {
	if (!navigator.onLine) {
		throw new Error("No network connection. Please reconnect and try again.");
	}

	const timeoutPromise = new Promise((_, reject) =>
		setTimeout(() => reject(new Error("Request timed out. Please try again.")), timeoutMs)
	);

	return Promise.race([promise, timeoutPromise]);
}

export {
	apiCall,
	withTimeout
};