import { z as redirect } from '../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/admin/+layout.server.ts
async function load({ locals }) {
	if (!locals.user) throw redirect(303, "/login");
	return { user: locals.user };
}

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _layout_server_ts as _ };
//# sourceMappingURL=_layout.server.ts.js-BYhMoL9s.js.map
