import { d as db, m as members, a as eq } from '../../../chunks/db.js-zAe9iE3U.js';
import { x as error } from '../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/[slug]/+page.server.ts
async function load({ params }) {
	const member = await db.select().from(members).where(eq(members.slug, params.slug)).get();
	if (!member || !member.bio) throw error(404, "No profile found");
	return { member };
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-Cvt28fXL.js.map
