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
		.limit(10)
		.catch((e) => {
			console.error('Gigs query error:', e);
			throw e;
		});

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
		.catch((e) => {
			console.error('Blog query error:', e);
			throw e;
		});

	const theme = cookies.get('theme') || 'funk';

	const configRows = await db
		.select({
			instagram: schema.siteConfig.instagram,
			facebook: schema.siteConfig.facebook,
			youtube: schema.siteConfig.youtube,
			spotify: schema.siteConfig.spotify
		})
		.from(schema.siteConfig)
		.limit(1);

	return {
		user: locals.user,
		upcomingGigs,
		blogPosts,
		theme,
		social: configRows[0] || {}
	};
}
