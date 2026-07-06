import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { resolveImages } from '$lib/utils/images';

export async function load({ params }) {
	const member = await db
		.select()
		.from(schema.members)
		.where(eq(schema.members.slug, params.slug))
		.get();

	if (!member || !member.bio) throw error(404, 'No profile found');

	const images = await db
		.select({ filename: schema.images.filename, path: schema.images.path })
		.from(schema.images)
		.all();

	member.bio = resolveImages(member.bio, images);

	return { member };
}
