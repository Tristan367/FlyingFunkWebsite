import { v as validateSessionToken } from '../chunks/auth.js-BVp1Xyq4.js';
import '../chunks/db.js-zAe9iE3U.js';
import '../chunks/rolldown-runtime.js-BBx_TEkp.js';

//#region src/hooks.server.ts
var handle = async ({ event, resolve }) => {
	const token = event.cookies.get("session");
	if (token) {
		const result = await validateSessionToken(token);
		if (result) {
			event.locals.user = result.member;
			event.locals.session = result.session;
		} else event.cookies.delete("session", { path: "/" });
	}
	return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server.js-D8rO8V73.js.map
