function formatLargeNumber(num) {
	if (num === null || num === undefined) return '—';
	if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
	return num.toLocaleString('en-US');
}

function formatTransactionDate(date) {
	const now = new Date();
	const diff = now - date;
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days === 0) {
		const hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours === 0) {
			const minutes = Math.floor(diff / (1000 * 60));
			return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
		}
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	} else if (days === 1) {
		return 'Yesterday';
	} else if (days < 7) {
		return `${days} days ago`;
	} else {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
}

export {
	formatLargeNumber,
	formatTransactionDate
};