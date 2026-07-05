import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq, gte, ne } from 'drizzle-orm';

export async function load() {
	const today = new Date().toISOString().split('T')[0];

	const pending = await db
		.select()
		.from(schema.gigs)
		.where(and(gte(schema.gigs.date, today), eq(schema.gigs.status, 'pending')))
		.orderBy(schema.gigs.date)
		.limit(3)
		.all();

	const upcoming = await db
		.select()
		.from(schema.gigs)
		.where(and(gte(schema.gigs.date, today), ne(schema.gigs.status, 'cancelled'), eq(schema.gigs.status, 'confirmed')))
		.orderBy(schema.gigs.date)
		.limit(3)
		.all();

	return { pending, upcoming };
}
