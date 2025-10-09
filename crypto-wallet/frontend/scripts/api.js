import { logger } from "./logger.js";

async function apiCall(endpoint, options = {}) {
	logger.info(`API Call: ${endpoint}`, { method: options.method || 'GET' });

	try {
		const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return await response.json();
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