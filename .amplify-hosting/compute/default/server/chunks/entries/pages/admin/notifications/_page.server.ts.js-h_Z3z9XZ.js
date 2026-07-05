import { d as db, m as members, a as eq } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/notifications/+page.server.ts
async function load({ locals }) {
	return { member: await db.select().from(members).where(eq(members.id, locals.user.id)).get() };
}
var actions = { save: async ({ request, locals }) => {
	const data = await request.formData();
	const notifyGigs = data.get("notifyGigs") === "on";
	const notifyBlog = data.get("notifyBlog") === "on";
	await db.update(members).set({
		emailNotifyGigs: notifyGigs,
		emailNotifyBlog: notifyBlog
	}).where(eq(members.id, locals.user.id));
	return { success: true };
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-h_Z3z9XZ.js.map
