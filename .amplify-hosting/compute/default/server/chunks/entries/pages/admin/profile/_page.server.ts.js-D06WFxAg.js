import { d as db, m as members, a as eq } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/profile/+page.server.ts
async function load({ locals }) {
	return { member: await db.select().from(members).where(eq(members.id, locals.user.id)).get() };
}
var actions = { save: async ({ request, locals }) => {
	const data = await request.formData();
	const name = data.get("name")?.toString() || "";
	const address = data.get("address")?.toString() || "";
	const instrument = data.get("instrument")?.toString() || "";
	const instruments = data.get("instruments")?.toString() || instrument;
	const bio = data.get("bio")?.toString() || "";
	const slug = data.get("slug")?.toString() || "";
	const pic = data.get("profilePic")?.toString() || "";
	await db.update(members).set({
		name,
		address,
		instrument,
		instruments,
		bio,
		slug,
		profilePic: pic
	}).where(eq(members.id, locals.user.id));
	return { success: true };
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-D06WFxAg.js.map
