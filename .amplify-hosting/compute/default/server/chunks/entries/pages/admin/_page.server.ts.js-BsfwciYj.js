import { d as db, c as gigs, b as and, a as eq, n as ne, g as gte } from '../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/+page.server.ts
async function load() {
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	return {
		pending: await db.select().from(gigs).where(and(gte(gigs.date, today), eq(gigs.status, "pending"))).orderBy(gigs.date).limit(3).all(),
		upcoming: await db.select().from(gigs).where(and(gte(gigs.date, today), ne(gigs.status, "cancelled"), eq(gigs.status, "confirmed"))).orderBy(gigs.date).limit(3).all()
	};
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BsfwciYj.js.map
