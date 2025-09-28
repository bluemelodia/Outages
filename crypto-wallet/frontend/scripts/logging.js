class PinoLogflareLogger {
	constructor(options = {}) {
		console.log("Initializing Pino Logflare Logger...");

		// Pino-style configuration
		this.options = {
			level: options.level || 'info',
			name: options.name || 'webapp',
			base: {
				app: 'webapp',
				environment: 'development',
				url: window.location?.href || 'unknown',
				...options.base
			},
			// Logflare configuration
			logflare: {
				sourceToken: options.logflare?.sourceToken || window.config?.logger?.sourceID,
				apiKey: options.logflare?.apiKey || window.config?.logger?.apiKey,
				endpoint: options.logflare?.endpoint || 'https://api.logflare.app/logs'
			},
			...options
		};

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

		this.currentLevel = this.levels[this.options.level] || this.levels.info;

		// Batching configuration
		this.logQueue = [];
		this.batchSize = options.batchSize || 10;
		this.flushInterval = options.flushInterval || 5000; // 5 seconds

		// Auto-flush logs periodically
		this.flushTimer = setInterval(() => this.flush(), this.flushInterval);

		// Validate Logflare configuration
		if (!this.options.logflare.sourceToken) {
			console.warn('Logflare sourceToken not configured. Logs will not be sent to Logflare.');
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
			pid: 0, // Browser doesn't have process ID
			hostname: window.location.hostname,
			name: this.options.name,
			msg: message,
			...this.options.base,
			...logObj
		};

		// Add to queue for Logflare
		this._queueForLogflare(levelName, logEntry);

		// Console output (Pino-style JSON)
		console.log(JSON.stringify(logEntry));

		return this;
	}

	// Format message with interpolation (similar to util.format)
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
		if (!this.options.logflare.sourceToken) return;

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
		if (this.logQueue.length === 0 || !this.options.logflare.sourceToken) return;

		const logs = [...this.logQueue];
		this.logQueue = []; // Clear queue

		try {
			const headers = {
				'Content-Type': 'application/json'
			};

			// Add API key if provided
			if (this.options.logflare.apiKey) {
				headers['X-API-KEY'] = this.options.logflare.apiKey;
			}

			const url = `${this.options.logflare.endpoint}?source=${this.options.logflare.sourceToken}`;
			
			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({ batch: logs })
			});

			if (response.ok) {
				console.debug(`✅ Sent ${logs.length} log entries to Logflare`);
			} else {
				console.error('Failed to send logs to Logflare:', response.status, response.statusText);
				// Put logs back in queue for retry
				this.logQueue.unshift(...logs);
			}
		} catch (error) {
			console.error('Error sending logs to Logflare:', error);
			// Put logs back in queue for retry
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

	// Pino-style child logger
	child(bindings) {
		const childOptions = {
			...this.options,
			base: {
				...this.options.base,
				...bindings
			}
		};
		return new PinoLogflareLogger(childOptions);
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

// Create logger instance with configuration
const createLogger = (options = {}) => {
	return new PinoLogflareLogger(options);
};

// Default logger instance
const logger = createLogger({
	level: 'info',
	name: 'webapp',
	logflare: {
		sourceToken: window.config?.logger?.sourceID,
		apiKey: window.config?.logger?.apiKey
	}
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { createLogger, PinoLogflareLogger };
} else {
	window.logger = logger;
	window.createLogger = createLogger;
}