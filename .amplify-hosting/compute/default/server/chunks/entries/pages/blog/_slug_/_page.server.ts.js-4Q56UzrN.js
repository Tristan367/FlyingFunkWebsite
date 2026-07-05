import { d as db, f as blogPosts, a as eq, l as images, h as sql } from '../../../../chunks/db.js-zAe9iE3U.js';
import { r as resolveImages } from '../../../../chunks/images.js-Drv2Xr4-.js';
import { x as error } from '../../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/blog/[slug]/+page.server.ts
async function load({ params }) {
	const post = await db.select({
		title: blogPosts.title,
		slug: blogPosts.slug,
		content: blogPosts.content,
		publishedAt: blogPosts.publishedAt
	}).from(blogPosts).where(eq(blogPosts.slug, params.slug)).get();
	if (!post) throw error(404, "Post not found");
	const images$1 = await db.select({
		filename: images.filename,
		path: images.path
	}).from(images).all();
	post.content = resolveImages(post.content, images$1);
	if (post.publishedAt) await db.update(blogPosts).set({ views: sql`${blogPosts.views} + 1` }).where(eq(blogPosts.slug, post.slug));
	return { post };
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-4Q56UzrN.js.map
