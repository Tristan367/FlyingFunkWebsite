import { d as db, j as siteConfig, a as eq } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/config/+page.server.ts
async function load() {
	let config = await db.select().from(siteConfig).get();
	if (!config) config = {
		id: 1,
		heroTitle: "FLYING FUNK",
		heroSubtitle: "A funk cover band playing the best...",
		heroImage: "",
		instagram: "",
		facebook: "",
		youtube: "",
		spotify: ""
	};
	return { config };
}
var actions = { save: async ({ request }) => {
	const data = await request.formData();
	const heroTitle = data.get("heroTitle")?.toString() || "FLYING FUNK";
	const heroSubtitle = data.get("heroSubtitle")?.toString() || "";
	const heroImage = data.get("heroImage")?.toString() || "";
	const instagram = data.get("instagram")?.toString() || "";
	const facebook = data.get("facebook")?.toString() || "";
	const youtube = data.get("youtube")?.toString() || "";
	const spotify = data.get("spotify")?.toString() || "";
	if (await db.select().from(siteConfig).get()) await db.update(siteConfig).set({
		heroTitle,
		heroSubtitle,
		heroImage,
		instagram,
		facebook,
		youtube,
		spotify
	}).where(eq(siteConfig.id, 1));
	else await db.insert(siteConfig).values({
		id: 1,
		heroTitle,
		heroSubtitle,
		heroImage
	});
	return { success: true };
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-5Pz2K7NG.js.map
