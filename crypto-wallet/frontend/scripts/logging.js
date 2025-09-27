// grafana-logger.js - Simple logging to Grafana

class GrafanaLogger {
	constructor() {
		console.log("Initializing Grafana Logger...");
		this.config = window.config?.grafana || config?.grafana;
		
		if (!this.config) {
			console.error('Grafana config not found. Make sure config.js is loaded.');
			return;
		}

		this.baseLabels = {
			app: 'webapp',
			environment: this.config.environment || 'development',
			url: window.location?.href || 'unknown'
		};

		this.logQueue = [];
		this.batchSize = 5;
		this.flushInterval = 3000; // 3 seconds

		// Auto-flush logs periodically
		setInterval(() => this.flush(), this.flushInterval);
	}

	formatLabels(labels) {
		const combined = { ...this.baseLabels, ...labels };
		return '{' + Object.entries(combined)
			.map(([key, value]) => `${key}="${value}"`)
			.join(',') + '}';
	}

	log(level, message, labels = {}) {
		if (!this.config) return;

		const timestamp = Date.now();
		const logEntry = {
			stream: this.formatLabels({ level, ...labels }),
			values: [
				[
					(timestamp * 1000000).toString(), // Loki expects nanoseconds
					JSON.stringify({
						level,
						message,
						timestamp: new Date(timestamp).toISOString(),
						...labels
					})
				]
			]
		};

		this.logQueue.push(logEntry);

		// Flush if queue is full
		if (this.logQueue.length >= this.batchSize) {
			this.flush();
		}
	}

	async flush() {
		if (this.logQueue.length === 0 || !this.config) return;

		const streams = [...this.logQueue];
		this.logQueue = []; // Clear queue

		// Prepare Basic auth credentials
		const b64Credentials = btoa(this.config.username + ':' + this.config.apiKey);

		try {
			const response = await fetch(this.config.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + b64Credentials
				},
				body: JSON.stringify({ streams })
			});

			if (!response.ok) {
				console.error('Failed to send logs to Grafana:', response.status, response.statusText);
				// Put logs back in queue for retry
				this.logQueue.unshift(...streams);
			} else {
				console.log(`✅ Sent ${streams.length} log entries to Grafana`);
			}
		} catch (error) {
			console.error('Error sending logs to Grafana:', error);
			// Put logs back in queue for retry
			this.logQueue.unshift(...streams);
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
const logger = new GrafanaLogger();
