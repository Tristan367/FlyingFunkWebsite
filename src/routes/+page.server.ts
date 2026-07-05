import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, desc, gte, ne, sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export async function load() {
	const today = new Date().toISOString().split('T')[0];

	const config = await db.select().from(schema.siteConfig).get() || {
		heroTitle: 'FLYING FUNK',
		heroSubtitle: 'A funk cover band playing the best of the 70s, 80s, and beyond.',
		heroImage: '',
		instagram: '',
		facebook: '',
		youtube: '',
		spotify: ''
	};

	const members = await db.select().from(schema.members).all();
	for (let i = members.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[members[i], members[j]] = [members[j], members[i]];
	}

	const upcomingGigs = await db
		.select()
		.from(schema.gigs)
		.where(and(gte(schema.gigs.date, today), eq(schema.gigs.private, false), ne(schema.gigs.status, 'cancelled')))
		.orderBy(schema.gigs.date)
		.all();

	const pinnedSongs = await db
		.select({
			title: schema.songs.title,
			path: schema.songs.path
		})
		.from(schema.songs)
		.where(eq(schema.songs.pinned, true))
		.all();

	// Shuffle and pick 3
	for (let i = pinnedSongs.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pinnedSongs[i], pinnedSongs[j]] = [pinnedSongs[j], pinnedSongs[i]];
	}
	const displayedSongs = pinnedSongs.slice(0, 3);

	const blogPosts = await db
		.select({
			title: schema.blogPosts.title,
			slug: schema.blogPosts.slug,
			publishedAt: schema.blogPosts.publishedAt,
			authorName: schema.members.name
		})
		.from(schema.blogPosts)
		.innerJoin(schema.members, eq(schema.blogPosts.authorId, schema.members.id))
		.where(
			and(
				sql`${schema.blogPosts.publishedAt} != ''`,
				eq(schema.blogPosts.archived, false)
			)
		)
		.orderBy(desc(schema.blogPosts.publishedAt))
		.limit(3)
		.all();

	return { config, members, upcomingGigs, pinnedSongs: displayedSongs, blogPosts };
}
