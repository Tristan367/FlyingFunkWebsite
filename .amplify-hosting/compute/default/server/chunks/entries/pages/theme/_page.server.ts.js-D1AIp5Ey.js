import { z as redirect } from '../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/theme/+page.server.ts
var actions = { default: async ({ request, cookies }) => {
	const theme = (await request.formData()).get("theme")?.toString();
	if (theme && [
		"funk",
		"christmas",
		"dark"
	].includes(theme)) cookies.set("theme", theme, {
		path: "/",
		maxAge: 3600 * 24 * 365
	});
	throw redirect(303, request.headers.get("referer") || "/");
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-D1AIp5Ey.js.map
