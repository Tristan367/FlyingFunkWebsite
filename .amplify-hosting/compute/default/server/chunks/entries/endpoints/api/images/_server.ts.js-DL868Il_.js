import { d as db, l as images, a as eq, i as desc } from '../../../../chunks/db.js-zAe9iE3U.js';
import { j as json } from '../../../../chunks/utils.js-DU29Pc2z.js';
import '../../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/api/images/+server.ts
async function GET({ url }) {
	const scope = url.searchParams.get("scope") || "";
	return json({ images: scope ? await db.select({
		id: images.id,
		filename: images.filename,
		path: images.path
	}).from(images).where(eq(images.scope, scope)).orderBy(desc(images.uploadedAt)).all() : await db.select({
		id: images.id,
		filename: images.filename,
		path: images.path
	}).from(images).orderBy(desc(images.uploadedAt)).all() });
}
async function DELETE({ request }) {
	const id = (await request.formData()).get("id")?.toString();
	if (id) await db.delete(images).where(eq(images.id, id));
	return json({ ok: true });
}

export { DELETE, GET };
//# sourceMappingURL=_server.ts.js-DL868Il_.js.map
