// pino-logflare-logger.js - Simplified Pino-style logging to Logflare

class PinoLogflareLogger {
	constructor() {
		console.log("Initializing Pino Logflare Logger...");

		// Pino log levels (numeric values)
		this.levels = {
			fatal: 60,
			error: 50,
			warn: 40,
			info: 30,
			debug: 20,
			trace: 10
		};

		this.levelNames = Object.fromEntries(
			Object.entries(this.levels).map(([name, level]) => [level, name])
		);

		this.currentLevel = this.levels.info;

		// Base metadata
		this.baseMetadata = {
			app: 'webapp',
			environment: 'development',
			url: window.location?.href || 'unknown'
		};

		// Batching configuration
		this.logQueue = [];
		this.batchSize = 10;
		this.flushInterval = 5000; // 5 seconds

		// Auto-flush logs periodically
		this.flushTimer = setInterval(() => this.flush(), this.flushInterval);

		// Validate config
		if (!window.config?.logger?.sourceID) {
			console.warn('Logflare sourceID not configured in window.config.logger.sourceID');
		}
		if (!window.config?.logger?.apiKey) {
			console.warn('Logflare apiKey not configured in window.config.logger.apiKey');
		}
	}

	// Core logging method (Pino-style)
	_log(level, obj = {}, msg = '', ...args) {
		const levelValue = typeof level === 'string' ? this.levels[level] : level;
		const levelName = typeof level === 'string' ? level : this.levelNames[level];

		// Check if this level should be logged
		if (levelValue < this.currentLevel) {
			return;
		}

		// Handle different argument patterns like Pino
		let logObj = {};
		let message = '';

		if (typeof obj === 'string') {
			// logger.info('message')
			message = obj;
			if (args.length > 0) {
				message = this._formatMessage(obj, args);
			}
		} else if (obj && typeof obj === 'object') {
			// logger.info({key: 'value'}, 'message')
			logObj = { ...obj };
			if (typeof msg === 'string') {
				message = args.length > 0 ? this._formatMessage(msg, args) : msg;
			}
		}

		// Create Pino-style log entry
		const logEntry = {
			level: levelValue,
			time: Date.now(),
			pid: 0,
			hostname: window.location.hostname,
			name: 'webapp',
			msg: message,
			...this.baseMetadata,
			...logObj
		};

		// Add to queue for Logflare
		this._queueForLogflare(levelName, logEntry);

		// Console output (Pino-style JSON)
		console.log(JSON.stringify(logEntry));

		return this;
	}

	// Format message with interpolation
	_formatMessage(template, args) {
		let i = 0;
		return template.replace(/%[sdj%]/g, (match) => {
			if (i >= args.length) return match;
			switch (match) {
				case '%s': return String(args[i++]);
				case '%d': return Number(args[i++]);
				case '%j':
					try {
						return JSON.stringify(args[i++]);
					} catch (_) {
						return '[Circular]';
					}
				case '%%': return '%';
				default:
					return match;
			}
		});
	}

	// Queue log for Logflare transmission
	_queueForLogflare(level, logEntry) {
		if (!window.config?.logger?.sourceID) return;

		// Transform to Logflare format
		const logflareEntry = {
			message: logEntry.msg || '',
			metadata: {
				level: level,
				timestamp: new Date(logEntry.time).toISOString(),
				pid: logEntry.pid,
				hostname: logEntry.hostname,
				name: logEntry.name,
				app: logEntry.app,
				environment: logEntry.environment,
				url: logEntry.url,
				// Include all custom fields
				...Object.fromEntries(
					Object.entries(logEntry).filter(([key]) => 
						!['level', 'time', 'pid', 'hostname', 'name', 'msg', 'app', 'environment', 'url'].includes(key)
					)
				)
			}
		};

		this.logQueue.push(logflareEntry);

		// Flush if queue is full
		if (this.logQueue.length >= this.batchSize) {
			this.flush();
		}
	}

	// Flush logs to Logflare
	async flush() {
		if (this.logQueue.length === 0 || !window.config?.logger?.sourceID) return;

		const logs = [...this.logQueue];
		this.logQueue = []; // Clear queue

		try {
			// Use config values directly
			const sourceID = window.config.logger.sourceID;
			const apiKey = window.config.logger.apiKey;
			const accessToken = window.config.logger.accessToken;

			// Build URL
			const url = `https://api.logflare.app/api/logs?source=${sourceID}`;

			const headers = {
				'Content-Type': 'application/json'
			};

			// Add authentication headers
			if (apiKey) {
				headers['X-API-KEY'] = apiKey;
			}
			if (accessToken) {
				headers['Authorization'] = `Bearer ${accessToken}`;
			}

			console.debug(`Sending ${logs.length} logs to: ${url}`);
			console.debug('Headers:', headers);

			// Send as batch
			const batchPayload = {
				batch: logs.map(log => ({
					message: log.message,
					metadata: log.metadata
				}))
			};

			console.debug('Batch payload:', batchPayload);

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(batchPayload)
			});

			if (response.ok) {
				console.debug(`✅ Sent ${logs.length} log entries to Logflare`);
			} else {
				const responseText = await response.text();
				console.error(`Failed to send logs to Logflare: ${response.status} ${response.statusText}`);
				console.error('Response body:', responseText);
				console.error('Config used:', { sourceID, apiKey: apiKey ? '***' : 'missing', accessToken: accessToken ? '***' : 'missing' });
				// Put logs back in queue for retry
				this.logQueue.unshift(...logs);
			}

		} catch (error) {
			console.error('Error in flush operation:', error);
			// Put all logs back in queue for retry
			this.logQueue.unshift(...logs);
		}
	}

	// Pino-style level methods
	fatal(obj, msg, ...args) {
		return this._log('fatal', obj, msg, ...args);
	}

	error(obj, msg, ...args) {
		return this._log('error', obj, msg, ...args);
	}

	warn(obj, msg, ...args) {
		return this._log('warn', obj, msg, ...args);
	}

	info(obj, msg, ...args) {
		return this._log('info', obj, msg, ...args);
	}

	debug(obj, msg, ...args) {
		return this._log('debug', obj, msg, ...args);
	}

	trace(obj, msg, ...args) {
		return this._log('trace', obj, msg, ...args);
	}

	// Convenience methods (maintaining backward compatibility)
	userAction(action, details = {}) {
		this.info({
			action_type: 'user_action',
			action: action,
			...details
		}, `User action: ${action}`);
	}

	pageView(page) {
		this.info({
			action_type: 'page_view',
			page: page,
			referrer: document.referrer || 'direct'
		}, `Page view: ${page}`);
	}

	apiCall(endpoint, method, status, duration) {
		this.info({
			action_type: 'api_call',
			endpoint: endpoint,
			method: method,
			status_code: status,
			duration_ms: duration
		}, `API call: ${method} ${endpoint}`);
	}

	// Set log level
	level(newLevel) {
		if (typeof newLevel === 'string' && this.levels[newLevel] !== undefined) {
			this.currentLevel = this.levels[newLevel];
		} else if (typeof newLevel === 'number') {
			this.currentLevel = newLevel;
		}
	}

	// Check if level is enabled
	isLevelEnabled(level) {
		const levelValue = typeof level === 'string' ? this.levels[level] : level;
		return levelValue >= this.currentLevel;
	}

	// Cleanup
	destroy() {
		if (this.flushTimer) {
			clearInterval(this.flushTimer);
		}
		// Final flush
		this.flush();
	}
}

// Create default logger instance
const logger = new PinoLogflareLogger();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { PinoLogflareLogger };
} else {
	window.logger = logger;
}