import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST({ request }) {
	const data = await request.formData();
	const id = data.get('id')?.toString();
	if (!id) return json({ ok: false });

	await db
		.update(schema.songs)
		.set({ plays: sql`${schema.songs.plays} + 1` })
		.where(eq(schema.songs.id, id));

	return json({ ok: true });
}
