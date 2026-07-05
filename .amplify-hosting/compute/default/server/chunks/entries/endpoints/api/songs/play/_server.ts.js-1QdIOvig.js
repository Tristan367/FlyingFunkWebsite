import { d as db, k as songs, h as sql, a as eq } from '../../../../../chunks/db.js-zAe9iE3U.js';
import { j as json } from '../../../../../chunks/utils.js-DU29Pc2z.js';
import '../../../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import '../../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/api/songs/play/+server.ts
async function POST({ request }) {
	const id = (await request.formData()).get("id")?.toString();
	if (!id) return json({ ok: false });
	await db.update(songs).set({ plays: sql`${songs.plays} + 1` }).where(eq(songs.id, id));
	return json({ ok: true });
}

export { POST };
//# sourceMappingURL=_server.ts.js-1QdIOvig.js.map
