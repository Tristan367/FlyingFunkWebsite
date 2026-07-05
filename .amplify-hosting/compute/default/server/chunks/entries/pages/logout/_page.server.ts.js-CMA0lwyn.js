import { i as invalidateSession } from '../../../chunks/auth.js-BVp1Xyq4.js';
import { z as redirect } from '../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/logout/+page.server.ts
var actions = { default: async ({ locals, cookies }) => {
	if (locals.session) await invalidateSession(locals.session.id);
	cookies.delete("session", { path: "/" });
	throw redirect(303, "/");
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-CMA0lwyn.js.map
