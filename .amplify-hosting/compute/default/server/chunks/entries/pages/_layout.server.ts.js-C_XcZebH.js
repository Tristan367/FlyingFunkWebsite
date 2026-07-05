import { d as db, c as gigs, b as and, n as ne, a as eq, g as gte, m as members, f as blogPosts, h as sql, i as desc, j as siteConfig } from '../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/+layout.server.ts
async function load({ locals, cookies }) {
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const upcomingGigs = await db.select().from(gigs).where(and(gte(gigs.date, today), eq(gigs.private, false), ne(gigs.status, "cancelled"))).orderBy(gigs.date).all();
	const blogPosts$1 = await db.select({
		title: blogPosts.title,
		slug: blogPosts.slug,
		publishedAt: blogPosts.publishedAt,
		authorName: members.name
	}).from(blogPosts).innerJoin(members, eq(blogPosts.authorId, members.id)).where(sql`${blogPosts.publishedAt} != '' AND ${blogPosts.archived} = 0`).orderBy(desc(blogPosts.publishedAt)).limit(3).all();
	const theme = cookies.get("theme") || "funk";
	const config = await db.select({
		instagram: siteConfig.instagram,
		facebook: siteConfig.facebook,
		youtube: siteConfig.youtube,
		spotify: siteConfig.spotify
	}).from(siteConfig).get();
	return {
		user: locals.user,
		upcomingGigs,
		blogPosts: blogPosts$1,
		theme,
		social: config || {}
	};
}

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _layout_server_ts as _ };
//# sourceMappingURL=_layout.server.ts.js-C_XcZebH.js.map
