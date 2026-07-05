import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { geocode, haversineDistance } from '$lib/server/geo';
import { eq } from 'drizzle-orm';

export async function GET({ url }) {
	const gigId = url.searchParams.get('gigId');
	const overrideAddress = url.searchParams.get('address');
	if (!gigId) return json({ distances: [] });

	let venueAddr = '';

	if (overrideAddress) {
		venueAddr = overrideAddress;
	} else {
		const gig = await db
			.select()
			.from(schema.gigs)
			.where(eq(schema.gigs.id, gigId))
			.get();
		if (!gig) return json({ distances: [] });
		venueAddr = gig.venueAddress || gig.venue;
	}

	if (!venueAddr) return json({ distances: [] });

	const members = await db.select().from(schema.members).all();
	const distances: Array<{ name: string; address: string; miles: number | null; minutes: number | null }> = [];
	const gigCoords = await geocode(venueAddr);

	if (!gigCoords) return json({ distances: [] });

	for (const member of members) {
		if (!member.address) {
			distances.push({ name: member.name, address: '', miles: null, minutes: null });
			continue;
		}
		const memberCoords = await geocode(member.address);
		if (memberCoords) {
			const miles = Math.round(haversineDistance(gigCoords, memberCoords) * 10) / 10;
			distances.push({
				name: member.name,
				address: member.address,
				miles,
				minutes: Math.round((miles * 1.3) / 50 * 60)
			});
		} else {
			distances.push({ name: member.name, address: member.address, miles: null, minutes: null });
		}
	}

	return json({ distances });
}
