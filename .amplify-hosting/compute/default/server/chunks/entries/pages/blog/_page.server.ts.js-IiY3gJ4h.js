import { d as db, m as members, f as blogPosts, a as eq, b as and, h as sql, i as desc } from '../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/blog/+page.server.ts
async function load() {
	return { posts: await db.select({
		id: blogPosts.id,
		title: blogPosts.title,
		slug: blogPosts.slug,
		publishedAt: blogPosts.publishedAt,
		authorName: members.name,
		authorInstrument: members.instrument
	}).from(blogPosts).innerJoin(members, eq(blogPosts.authorId, members.id)).where(and(sql`${blogPosts.publishedAt} != ''`, eq(blogPosts.archived, false))).orderBy(desc(blogPosts.publishedAt)).all() };
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-IiY3gJ4h.js.map
