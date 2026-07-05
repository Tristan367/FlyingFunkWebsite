export function ymd(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function rangeEnd(): Date {
	return new Date(new Date().getFullYear() + 1, 11, 31);
}

export function rangeEndStr(): string {
	return ymd(rangeEnd());
}

export function formatGigDate(dateStr: string): string {
	return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});
}
