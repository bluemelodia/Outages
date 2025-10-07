import { auth } from './auth.js';
import { config } from './config.js';

let environment = null;
let logger = null;

function getEnvironment() {
	const hostname = window.location.hostname;
	environment = (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname.endsWith(".local") ||
		hostname.startsWith("192.168.") // optional for local network
	) ? "development" : "production";
}

function setupLogger() {
	environment = getEnvironment();

	// -------------------- Tiny Logger --------------------
	logger = (() => {
		const originalLogger = {
			log: (level, message, metadata = {}) => {
				// TODO: clean up localStorage usage in the next release.
				// const user = localStorage.getItem("loggedInUser") || "pre-login";
				let user = auth.currentUser;

				if (user) {
					console.log("Current user:", user.email || user.phoneNumber);
				} else {
					console.log("No user logged in");
					user = "pre-login"
				}

				fetch(`http://localhost:8010/proxy/logs?source=${config.logger.sourceID}`, {
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

	// Example usage
	logger.info("🚀 Logger initialized"); // user: "pre-login" if no one is logged in
}

export {
	logger,
	setupLogger
};
