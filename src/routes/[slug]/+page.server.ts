import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const member = await db
		.select()
		.from(schema.members)
		.where(eq(schema.members.slug, params.slug))
		.get();

	if (!member || !member.bio) throw error(404, 'No profile found');

	return { member };
}
