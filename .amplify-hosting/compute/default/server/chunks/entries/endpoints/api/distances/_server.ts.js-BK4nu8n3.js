import { d as db, c as gigs, a as eq, m as members } from '../../../../chunks/db.js-zAe9iE3U.js';
import { j as json } from '../../../../chunks/utils.js-DU29Pc2z.js';
import '../../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/lib/server/geo.ts
var geocodeCache = /* @__PURE__ */ new Map();
async function geocode(address) {
	const key = address.toLowerCase().trim();
	if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;
	const coordMatch = key.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
	if (coordMatch) {
		const result = {
			lat: parseFloat(coordMatch[1]),
			lng: parseFloat(coordMatch[2])
		};
		geocodeCache.set(key, result);
		return result;
	}
	try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&bounded=1&viewbox=-118.5,47.3,-116.0,48.1`;
		const data = await (await fetch(url, { headers: { "User-Agent": "FlyingFunkWebsite/1.0" } })).json();
		if (data.length > 0) {
			const result = {
				lat: parseFloat(data[0].lat),
				lng: parseFloat(data[0].lon)
			};
			geocodeCache.set(key, result);
			return result;
		}
		geocodeCache.set(key, null);
	} catch {
		geocodeCache.set(key, null);
	}
	return null;
}
function haversineDistance(a, b) {
	const R = 3958.8;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLng = (b.lng - a.lng) * Math.PI / 180;
	const sinLat = Math.sin(dLat / 2);
	const sinLng = Math.sin(dLng / 2);
	const aVal = sinLat * sinLat + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinLng * sinLng;
	return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}
//#endregion
//#region src/routes/api/distances/+server.ts
async function GET({ url }) {
	const gigId = url.searchParams.get("gigId");
	const overrideAddress = url.searchParams.get("address");
	if (!gigId) return json({ distances: [] });
	let venueAddr = "";
	if (overrideAddress) venueAddr = overrideAddress;
	else {
		const gig = await db.select().from(gigs).where(eq(gigs.id, gigId)).get();
		if (!gig) return json({ distances: [] });
		venueAddr = gig.venueAddress || gig.venue;
	}
	if (!venueAddr) return json({ distances: [] });
	const members$1 = await db.select().from(members).all();
	const distances = [];
	const gigCoords = await geocode(venueAddr);
	if (!gigCoords) return json({ distances: [] });
	for (const member of members$1) {
		if (!member.address) {
			distances.push({
				name: member.name,
				address: "",
				miles: null,
				minutes: null
			});
			continue;
		}
		const memberCoords = await geocode(member.address);
		if (memberCoords) {
			const miles = Math.round(haversineDistance(gigCoords, memberCoords) * 10) / 10;
			distances.push({
				name: member.name,
				address: member.address,
				miles,
				minutes: Math.round(miles * 1.3 / 50 * 60)
			});
		} else distances.push({
			name: member.name,
			address: member.address,
			miles: null,
			minutes: null
		});
	}
	return json({ distances });
}

export { GET };
//# sourceMappingURL=_server.ts.js-BK4nu8n3.js.map
