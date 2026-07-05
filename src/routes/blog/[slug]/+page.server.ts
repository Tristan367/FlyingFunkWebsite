import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { resolveImages } from '$lib/utils/images';

export async function load({ params }) {
	const post = await db
		.select({
			title: schema.blogPosts.title,
			slug: schema.blogPosts.slug,
			content: schema.blogPosts.content,
			publishedAt: schema.blogPosts.publishedAt
		})
		.from(schema.blogPosts)
		.where(eq(schema.blogPosts.slug, params.slug))
		.get();

	if (!post) throw error(404, 'Post not found');

	// Resolve ./images/filename references to actual upload URLs
	const images = await db
		.select({ filename: schema.images.filename, path: schema.images.path })
		.from(schema.images)
		.all();

	post.content = resolveImages(post.content, images);

	// Increment view count
	if (post.publishedAt) {
		await db
			.update(schema.blogPosts)
			.set({ views: sql`${schema.blogPosts.views} + 1` })
			.where(eq(schema.blogPosts.slug, post.slug));
	}

	return { post };
}
