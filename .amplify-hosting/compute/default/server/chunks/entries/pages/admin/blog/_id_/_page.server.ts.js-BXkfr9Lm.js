import { d as db, f as blogPosts, a as eq } from '../../../../../chunks/db.js-zAe9iE3U.js';
import { x as error } from '../../../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/admin/blog/[id]/+page.server.ts
async function load({ params, locals }) {
	const post = await db.select().from(blogPosts).where(eq(blogPosts.id, params.id)).get();
	if (!post) throw error(404, "Post not found");
	return { post };
}
var actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();
		const title = data.get("title")?.toString();
		const content = data.get("content")?.toString() || "";
		const slug = data.get("slug")?.toString();
		const published = data.get("published") === "on";
		const publishNow = data.get("publishNow") === "on";
		if (!title || !slug) return { saveError: "Title and slug are required." };
		const currentPost = await db.select().from(blogPosts).where(eq(blogPosts.id, params.id)).get();
		const publishedAt = publishNow ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : published ? currentPost?.publishedAt || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "";
		await db.update(blogPosts).set({
			title,
			slug,
			content,
			publishedAt,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).where(eq(blogPosts.id, params.id));
		return { saveSuccess: true };
	},
	unpublish: async ({ params }) => {
		await db.update(blogPosts).set({
			publishedAt: "",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).where(eq(blogPosts.id, params.id));
		return { saveSuccess: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BXkfr9Lm.js.map
