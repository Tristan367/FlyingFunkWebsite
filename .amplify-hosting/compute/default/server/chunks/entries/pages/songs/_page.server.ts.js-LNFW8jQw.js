import { d as db, m as members, k as songs, a as eq, i as desc } from '../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/songs/+page.server.ts
async function load() {
	const allSongs = await db.select({
		id: songs.id,
		title: songs.title,
		description: songs.description,
		path: songs.path,
		pinned: songs.pinned,
		uploadedAt: songs.uploadedAt,
		uploaderName: members.name
	}).from(songs).innerJoin(members, eq(songs.uploaderId, members.id)).orderBy(desc(songs.uploadedAt)).all();
	return {
		pinned: allSongs.filter((s) => s.pinned),
		all: allSongs
	};
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-LNFW8jQw.js.map
