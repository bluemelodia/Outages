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
		hostname === "127.0.0.1" ||
		hostname.endsWith(".local") ||
		hostname.startsWith("192.168.")
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

		if (isProduction()) {
			setupLoggerProd();
		} else {
			setupLoggerDev()
		}

		logger.info("🚀 Logger initialized");
	});
}

function setupLoggerProd() {
	const pinoInstance = window.pino({
		browser: {
			asObject: true,
			transmit: {
				level: 'info',
				send: async function (level, logEvent) {
					const user = auth.currentUser?.email || "pre-login";
					
					const message = typeof logEvent.messages[0] === 'string' 
						? logEvent.messages[0] 
						: JSON.stringify(logEvent.messages[0]);

					const headers = {
						"Content-Type": "application/json",
						"X-API-KEY": config.logger.apiKey,
						"Authorization": `Bearer ${config.logger.accessToken}`
					};

					const body = {
						message: `[${user}][${environment}] ${message}`,
						metadata: {
							level: level,
							time: new Date().toISOString(),
							user,
							...logEvent.bindings,
							...(logEvent.messages[1] || {})
						}
					};

					try {
						const response = await fetch(config.logger.url, {
							method: "POST",
							headers: headers,
							body: JSON.stringify(body)
						});
						
						const text = await response.text();
						console.log(text);
					} catch (err) {
						console.error("Logger error:", err);
					}
				}
			}
		}
	});

	logger = {
		log: (level, message, metadata = {}) => pinoInstance[level](metadata, message),
		info: (msg, meta = {}) => pinoInstance.info(meta, msg),
		warn: (msg, meta = {}) => pinoInstance.warn(meta, msg),
		error: (msg, meta = {}) => pinoInstance.error(meta, msg)
	};
}

// Keep this separate from the prod logger.
// May use different APIs in the future.
function setupLoggerDev() {
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
}

export {
	isProduction,
	setupLogger,
	logger
};