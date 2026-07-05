import { _ as ensure_array_like, V as attr, $ as stringify, W as escape_html } from '../../../chunks/server.js-D7jMOqOz.js';
import '../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/blog/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="mx-auto max-w-4xl px-4 py-20"><h1 class="mb-10 text-4xl font-bold text-amber-400">Blog</h1> <div class="space-y-6"><!--[-->`);
		const each_array = ensure_array_like(data.posts);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let post = each_array[$$index];
			$$renderer.push(`<a${attr("href", `/blog/${stringify(post.slug)}`)} class="block rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-amber-500/50"><h2 class="mb-2 text-xl font-bold text-amber-400">${escape_html(post.title)}</h2> <p class="text-sm text-zinc-500">by ${escape_html(post.authorName)} (${escape_html(post.authorInstrument)}) ·
					${escape_html((/* @__PURE__ */ new Date(post.publishedAt + "T00:00:00")).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric"
			}))}</p></a>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (data.posts.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-zinc-500">No posts yet. Check back soon!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-CvkLkekT.js.map
