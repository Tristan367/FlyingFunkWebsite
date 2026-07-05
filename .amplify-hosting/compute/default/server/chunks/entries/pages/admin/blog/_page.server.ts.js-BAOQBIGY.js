import { d as db, f as blogPosts, a as eq, l as images, m as members, i as desc } from '../../../../chunks/db.js-zAe9iE3U.js';
import { z as redirect } from '../../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/admin/blog/+page.server.ts
async function load({ locals }) {
	return {
		posts: await db.select({
			id: blogPosts.id,
			title: blogPosts.title,
			slug: blogPosts.slug,
			publishedAt: blogPosts.publishedAt,
			createdAt: blogPosts.createdAt,
			archived: blogPosts.archived,
			authorName: members.name
		}).from(blogPosts).innerJoin(members, eq(blogPosts.authorId, members.id)).where(eq(blogPosts.archived, false)).orderBy(desc(blogPosts.createdAt)).all(),
		archivedPosts: await db.select({
			id: blogPosts.id,
			title: blogPosts.title,
			slug: blogPosts.slug,
			publishedAt: blogPosts.publishedAt,
			authorName: members.name
		}).from(blogPosts).innerJoin(members, eq(blogPosts.authorId, members.id)).where(eq(blogPosts.archived, true)).orderBy(desc(blogPosts.createdAt)).all(),
		user: locals.user
	};
}
var actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const title = data.get("title")?.toString();
		const content = data.get("content")?.toString() || "";
		const published = data.get("published") === "on";
		const slug = data.get("slug")?.toString() || title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "";
		if (!title || !slug) return { createError: "Title is required." };
		const newId = (await db.insert(blogPosts).values({
			authorId: locals.user.id,
			title,
			slug,
			content,
			publishedAt: published ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : ""
		}).returning({ id: blogPosts.id }))[0]?.id;
		if (newId) throw redirect(303, "/admin/blog/" + newId);
		return { createSuccess: true };
	},
	archive: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (id) await db.update(blogPosts).set({ archived: true }).where(eq(blogPosts.id, id));
		return { archiveSuccess: true };
	},
	unarchive: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (id) await db.update(blogPosts).set({ archived: false }).where(eq(blogPosts.id, id));
		return { archiveSuccess: true };
	},
	delete: async ({ request }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (id) {
			await db.delete(blogPosts).where(eq(blogPosts.id, id));
			await db.delete(images).where(eq(images.scope, "blog-" + id));
		}
		return { deleteSuccess: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BAOQBIGY.js.map
