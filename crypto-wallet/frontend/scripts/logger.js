import { auth } from './auth.js';
import { getConfig } from './config.js';
import { createEnum } from './utils.js';

let logger = null;
let environment = null;
let config = null;

const environments = createEnum([
	"development",
	"production"
]);

function getEnvironment() {
	if (environment) return environment;

	const hostname = window.location.hostname;
	environment = (
		hostname === "localhost" ||
		hostname === "127.0.0.1"
	) ? environments.development : environments.production;

	return environment;
}

function isProduction() {
	return getEnvironment() === environments.production;
}

function setupLogger() {
	environment = getEnvironment();

	// Wait for config to load, then initialize logger
	getConfig().then(cfg => {
		config = cfg;

		logger = (() => {
			const originalLogger = {
				log: (level, message, metadata = {}) => {
					const user = auth.currentUser?.email || "pre-login";

					fetch(config.logger.url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-API-KEY": config.logger.apiKey,
							"Authorization": `Bearer ${config.logger.accessToken}`
						},
						body: JSON.stringify({
							message: `[${user}][${environment}] ${message}`,
							metadata: {
								level,
								time: new Date().toISOString(),
								user,
								...metadata
							}
						})
					})
						.then(r => r.text())
						.then(console.log)
						.catch(err => console.error("Logger error:", err));
				}
			};

			return {
				log: originalLogger.log,
				info: (msg, meta) => originalLogger.log("info", msg, meta),
				warn: (msg, meta) => originalLogger.log("warn", msg, meta),
				error: (msg, meta) => originalLogger.log("error", msg, meta)
			};
		})();

		logger.info("🚀 Logger initialized");
	});
}

export {
	isProduction,
	setupLogger,
	logger
};
