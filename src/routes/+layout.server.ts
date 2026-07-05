import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, desc, gte, ne, sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export async function load({ locals, cookies }) {
	const today = new Date().toISOString().split('T')[0];

	const upcomingGigs = await db
		.select()
		.from(schema.gigs)
		.where(
			and(
				gte(schema.gigs.date, today),
				eq(schema.gigs.private, false),
				ne(schema.gigs.status, 'cancelled')
			)
		)
		.orderBy(schema.gigs.date)
		.all();

	const blogPosts = await db
		.select({
			title: schema.blogPosts.title,
			slug: schema.blogPosts.slug,
			publishedAt: schema.blogPosts.publishedAt,
			authorName: schema.members.name
		})
		.from(schema.blogPosts)
		.innerJoin(schema.members, eq(schema.blogPosts.authorId, schema.members.id))
		.where(sql`${schema.blogPosts.publishedAt} != '' AND ${schema.blogPosts.archived} = 0`)
		.orderBy(desc(schema.blogPosts.publishedAt))
		.limit(3)
		.all();

	const theme = cookies.get('theme') || 'funk';

	const config = await db
		.select({
			instagram: schema.siteConfig.instagram,
			facebook: schema.siteConfig.facebook,
			youtube: schema.siteConfig.youtube,
			spotify: schema.siteConfig.spotify
		})
		.from(schema.siteConfig)
		.get();

	return {
		user: locals.user,
		upcomingGigs,
		blogPosts,
		theme,
		social: config || {}
	};
}
