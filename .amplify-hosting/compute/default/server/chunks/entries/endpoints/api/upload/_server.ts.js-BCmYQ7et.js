import { d as db, l as images } from '../../../../chunks/db.js-zAe9iE3U.js';
import { v as validateSessionToken } from '../../../../chunks/auth.js-BVp1Xyq4.js';
import { a as getStorage } from '../../../../chunks/adapters.js-CyCRUHV3.js';
import { j as json } from '../../../../chunks/utils.js-DU29Pc2z.js';
import '../../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import 'node:fs/promises';
import 'node:path';
import 'node:fs';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/api/upload/+server.ts
async function POST({ request, cookies }) {
	const formData = await request.formData();
	const file = formData.get("file");
	const scope = formData.get("scope")?.toString() || "";
	if (!file) return json({ error: "No file provided" }, { status: 400 });
	if (![
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		"audio/mpeg",
		"audio/wav",
		"audio/ogg",
		"audio/mp3",
		"audio/x-m4a"
	].includes(file.type)) return json({ error: "File type not allowed" }, { status: 400 });
	if (file.size > 50 * 1024 * 1024) return json({ error: "File too large (max 50MB)" }, { status: 400 });
	const token = cookies.get("session");
	let memberId = "anonymous";
	if (token) {
		const result = await validateSessionToken(token);
		if (result) memberId = result.member.id;
	}
	const { url, filename } = await getStorage().saveFile(file, memberId);
	await db.insert(images).values({
		filename,
		path: url,
		scope,
		uploaderId: memberId === "anonymous" ? null : memberId
	});
	return json({
		url,
		filename
	});
}

export { POST };
//# sourceMappingURL=_server.ts.js-BCmYQ7et.js.map
