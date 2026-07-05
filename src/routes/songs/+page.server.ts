import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function load() {
	const allSongs = await db
		.select({
			id: schema.songs.id,
			title: schema.songs.title,
			description: schema.songs.description,
			path: schema.songs.path,
			pinned: schema.songs.pinned,
			uploadedAt: schema.songs.uploadedAt,
			uploaderName: schema.members.name
		})
		.from(schema.songs)
		.innerJoin(schema.members, eq(schema.songs.uploaderId, schema.members.id))
		.orderBy(desc(schema.songs.uploadedAt))
		.all();

	return {
		pinned: allSongs.filter((s) => s.pinned),
		all: allSongs
	};
}
