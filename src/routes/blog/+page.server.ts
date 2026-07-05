import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, sql, eq, and } from 'drizzle-orm';

export async function load() {
	const posts = await db
		.select({
			id: schema.blogPosts.id,
			title: schema.blogPosts.title,
			slug: schema.blogPosts.slug,
			publishedAt: schema.blogPosts.publishedAt,
			authorName: schema.members.name,
			authorInstrument: schema.members.instrument
		})
		.from(schema.blogPosts)
		.innerJoin(schema.members, eq(schema.blogPosts.authorId, schema.members.id))
		.where(and(
			sql`${schema.blogPosts.publishedAt} != ''`,
			eq(schema.blogPosts.archived, false)
		))
		.orderBy(desc(schema.blogPosts.publishedAt))
		.all()
		.catch((e) => {
			console.error('Blog index query error:', e);
			throw e;
		});

	console.log('Blog posts found:', posts?.length);

	return { posts };
}
