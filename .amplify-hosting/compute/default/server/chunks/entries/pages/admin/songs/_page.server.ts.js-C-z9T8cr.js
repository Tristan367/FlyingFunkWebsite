import { d as db, k as songs, a as eq, m as members, i as desc } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/songs/+page.server.ts
async function load({ locals }) {
	return {
		songs: await db.select({
			id: songs.id,
			title: songs.title,
			description: songs.description,
			pinned: songs.pinned,
			plays: songs.plays,
			path: songs.path,
			uploadedAt: songs.uploadedAt,
			uploaderName: members.name
		}).from(songs).innerJoin(members, eq(songs.uploaderId, members.id)).orderBy(desc(songs.uploadedAt)).all(),
		user: locals.user
	};
}
var actions = {
	upload: async ({ request, locals }) => {
		const data = await request.formData();
		const title = data.get("title")?.toString();
		const description = data.get("description")?.toString() || "";
		const file = data.get("file");
		if (!title || !file) return { uploadError: "Title and file are required." };
		if (!file.type.startsWith("audio/")) return { uploadError: "Please upload an audio file." };
		const filename = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
		const { mkdirSync, existsSync } = await import('node:fs');
		const { writeFile } = await import('node:fs/promises');
		if (!existsSync("static/uploads")) mkdirSync("static/uploads", { recursive: true });
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile("static/uploads/" + filename, buffer);
		await db.insert(songs).values({
			uploaderId: locals.user.id,
			title,
			description,
			filename,
			path: "/uploads/" + filename
		});
		return { uploadSuccess: true };
	},
	delete: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (id) await db.delete(songs).where(eq(songs.id, id));
		return { deleteSuccess: true };
	},
	togglePin: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return { pinSuccess: true };
		const song = await db.select().from(songs).where(eq(songs.id, id)).get();
		if (song) await db.update(songs).set({ pinned: !song.pinned }).where(eq(songs.id, id));
		return { pinSuccess: true };
	},
	edit: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString();
		const title = data.get("title")?.toString();
		const description = data.get("description")?.toString() || "";
		if (!id || !title) return { editError: "Title is required." };
		await db.update(songs).set({
			title,
			description
		}).where(eq(songs.id, id));
		return { editSuccess: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-C-z9T8cr.js.map
