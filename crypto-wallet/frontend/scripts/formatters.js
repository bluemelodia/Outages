function formatLargeNumber(num) {
	if (num === null || num === undefined) return '—';
	if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
	return num.toLocaleString('en-US');
}

function formatTransactionDate(xactionDate) {
	const date = { seconds: xactionDate.seconds, nanoseconds: xactionDate.nanoseconds };

	// Convert Firestore timestamp → JavaScript Date
	const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1e6);

	// Format the date (MM/DD/YY)
	return jsDate.toLocaleString('en-US', {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export {
	formatLargeNumber,
	formatTransactionDate
};