import { logger } from "./logger";

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

export {
	apiCall
};