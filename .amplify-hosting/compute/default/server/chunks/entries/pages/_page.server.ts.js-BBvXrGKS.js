import { d as db, j as siteConfig, m as members, c as gigs, b as and, n as ne, a as eq, g as gte, k as songs, f as blogPosts, h as sql, i as desc } from '../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/+page.server.ts
async function load() {
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const config = await db.select().from(siteConfig).get() || {
		heroTitle: "FLYING FUNK",
		heroSubtitle: "A funk cover band playing the best of the 70s, 80s, and beyond.",
		heroImage: "",
		instagram: "",
		facebook: "",
		youtube: "",
		spotify: ""
	};
	const members$1 = await db.select().from(members).all();
	for (let i = members$1.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[members$1[i], members$1[j]] = [members$1[j], members$1[i]];
	}
	const upcomingGigs = await db.select().from(gigs).where(and(gte(gigs.date, today), eq(gigs.private, false), ne(gigs.status, "cancelled"))).orderBy(gigs.date).all();
	const pinnedSongs = await db.select({
		title: songs.title,
		path: songs.path
	}).from(songs).where(eq(songs.pinned, true)).all();
	for (let i = pinnedSongs.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pinnedSongs[i], pinnedSongs[j]] = [pinnedSongs[j], pinnedSongs[i]];
	}
	return {
		config,
		members: members$1,
		upcomingGigs,
		pinnedSongs: pinnedSongs.slice(0, 3),
		blogPosts: await db.select({
			title: blogPosts.title,
			slug: blogPosts.slug,
			publishedAt: blogPosts.publishedAt,
			authorName: members.name
		}).from(blogPosts).innerJoin(members, eq(blogPosts.authorId, members.id)).where(sql`${blogPosts.publishedAt} != '' AND ${blogPosts.archived} = 0`).orderBy(desc(blogPosts.publishedAt)).limit(3).all()
	};
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BBvXrGKS.js.map
