class BetterStackLogger {
	constructor() {
		console.log("Initializing Better Stack Logger...");

		this.baseLabels = {
			app: 'webapp',
			environment: 'development',
			url: window.location?.href || 'unknown'
		};

		this.logQueue = [];
		this.batchSize = 5;
		this.flushInterval = 3000; // 3 seconds

		// Auto-flush logs periodically
		setInterval(() => this.flush(), this.flushInterval);
	}

	log(level, message, labels = {}) {
		const timestamp = new Date().toISOString();
		const logEntry = {
			dt: timestamp,
			level: level,
			message: message,
			...this.baseLabels,
			...labels
		};

		this.logQueue.push(logEntry);

		// Flush if queue is full
		if (this.logQueue.length >= this.batchSize) {
			this.flush();
		}
	}

	async flush() {
		if (this.logQueue.length === 0) return;

		const logs = [...this.logQueue];
		this.logQueue = []; // Clear queue

		let config = window.config.betterStack;

		try {
			const response = await fetch(config.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${config.bearer}`
				},
				body: JSON.stringify(logs)
			});

			if (response.status === 202) {
				console.log(`✅ Sent ${logs.length} log entries to Better Stack`);
			} else {
				console.error('Failed to send logs to Better Stack:', response.status, response.statusText);
				// Put logs back in queue for retry
				this.logQueue.unshift(...logs);
			}
		} catch (error) {
			console.error('Error sending logs to Better Stack:', error);
			// Put logs back in queue for retry
			this.logQueue.unshift(...logs);
		}
	}

	// Convenience methods
	info(message, labels = {}) {
		this.log('info', message, labels);
		console.info(`[INFO] ${message}`, labels);
	}

	warn(message, labels = {}) {
		this.log('warn', message, labels);
		console.warn(`[WARN] ${message}`, labels);
	}

	error(message, labels = {}) {
		this.log('error', message, labels);
		console.error(`[ERROR] ${message}`, labels);
	}

	debug(message, labels = {}) {
		this.log('debug', message, labels);
		console.debug(`[DEBUG] ${message}`, labels);
	}

	// Log user actions
	userAction(action, details = {}) {
		this.info(`User action: ${action}`, { 
			action_type: 'user_action',
			action: action,
			...details 
		});
	}

	// Log page views
	pageView(page) {
		this.info(`Page view: ${page}`, { 
			action_type: 'page_view',
			page: page,
			referrer: document.referrer || 'direct'
		});
	}

	// Log API calls
	apiCall(endpoint, method, status, duration) {
		this.info(`API call: ${method} ${endpoint}`, {
			action_type: 'api_call',
			endpoint: endpoint,
			method: method,
			status_code: status,
			duration_ms: duration
		});
	}
}

// Create global logger instance
const logger = new BetterStackLogger();