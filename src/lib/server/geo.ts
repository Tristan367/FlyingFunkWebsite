interface LatLng {
	lat: number;
	lng: number;
}

const geocodeCache = new Map<string, LatLng | null>();

export async function geocode(address: string): Promise<LatLng | null> {
	const key = address.toLowerCase().trim();
	if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

	// Parse coordinate strings like "47.65880, -117.42600"
	const coordMatch = key.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
	if (coordMatch) {
		const result = { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) };
		geocodeCache.set(key, result);
		return result;
	}

	try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&bounded=1&viewbox=-118.5,47.3,-116.0,48.1`;
		const res = await fetch(url, {
			headers: { 'User-Agent': 'FlyingFunkWebsite/1.0' }
		});
		const data = await res.json();
		if (data.length > 0) {
			const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
			geocodeCache.set(key, result);
			return result;
		}
		geocodeCache.set(key, null);
	} catch {
		geocodeCache.set(key, null);
	}
	return null;
}

// Haversine distance in miles
export function haversineDistance(a: LatLng, b: LatLng): number {
	const R = 3958.8; // Earth radius in miles
	const dLat = ((b.lat - a.lat) * Math.PI) / 180;
	const dLng = ((b.lng - a.lng) * Math.PI) / 180;
	const sinLat = Math.sin(dLat / 2);
	const sinLng = Math.sin(dLng / 2);
	const aVal =
		sinLat * sinLat +
		Math.cos((a.lat * Math.PI) / 180) *
			Math.cos((b.lat * Math.PI) / 180) *
			sinLng * sinLng;
	return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}

// Approximate drive time in minutes (assumes 50mph average, 1.3x road factor)
export function estimatedDriveTime(miles: number): number {
	return Math.round((miles * 1.3) / 50 * 60);
}
