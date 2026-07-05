import { W as escape_html, _ as ensure_array_like, V as attr } from '../../../../chunks/server.js-D7jMOqOz.js';
import '@tiptap/starter-kit';
import '@tiptap/extensions';
import '@tiptap/extension-image';
import '@tiptap/extension-underline';
import '@tiptap/extension-link';
import '@tiptap/extension-text-style';
import '@tiptap/extension-color';
import '@tiptap/extension-highlight';
import '@tiptap/extension-text-align';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/blog/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Blog Posts</h1> `);
		if (form?.createSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Post created successfully!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.archiveSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Post archived.</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		{
			$$renderer.push("<!--[0-->");
			const drafts = data.posts.filter((p) => !p.publishedAt);
			const published = data.posts.filter((p) => p.publishedAt);
			$$renderer.push(`<div class="mb-8"><button class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">New Post</button></div> <details class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900"><summary class="flex cursor-pointer items-center justify-between p-4"><span class="text-sm font-medium text-zinc-400">Blog post HTML template</span> <button type="button" class="rounded bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200">${escape_html("Copy")}</button></summary> <pre class="max-h-64 overflow-auto bg-zinc-950 px-4 pb-4 text-xs text-zinc-400"><code>&lt;div class="mx-auto max-w-3xl">

&lt;h2>Your Catchy Title Here&lt;/h2>

&lt;p>Start with an engaging opening paragraph that hooks the reader.
What's this post about?&lt;/p>

&lt;img src="./images/your-image.jpg" alt="Description" style="max-width:100%;border-radius:8px" />

&lt;blockquote>
  &lt;p>A memorable quote from your bandmate.&lt;/p>
&lt;/blockquote>

&lt;h3>Section Heading&lt;/h3>

&lt;p>Dive deeper. Tell a story about a gig, rehearsal, or gear you love.&lt;/p>

&lt;ul>
  &lt;li>&lt;strong>Bullet points&lt;/strong> for lists&lt;/li>
  &lt;li>Like your top 5 albums or favorite venues&lt;/li>
&lt;/ul>

&lt;hr />

&lt;p>&lt;em>Thanks for reading! Come see us at our next show.&lt;/em>&lt;/p>

&lt;/div></code></pre> <p class="px-4 pb-4 text-xs text-zinc-600">Copy this template, fill it in with your content, then paste the result into the blog editor.</p></details>  `);
			if (drafts.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<h2 class="mb-3 text-sm font-medium text-yellow-400">Drafts</h2> <div class="mb-6 space-y-2"><!--[-->`);
				const each_array = ensure_array_like(drafts);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let post = each_array[$$index];
					$$renderer.push(`<div class="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="min-w-0 flex-1"><a${attr("href", "/blog/" + post.slug)} target="_blank" class="font-medium text-amber-400 hover:underline">${escape_html(post.title || "(Untitled)")}</a> <p class="text-xs text-zinc-400">${escape_html(post.authorName)} ·
							${escape_html(post.publishedAt ? "Published " + post.publishedAt : "Draft")}</p></div> <div class="flex items-center gap-2 shrink-0 ml-3"><a${attr("href", "/admin/blog/" + post.id)} class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500">Edit</a></div></div>`);
				}
				$$renderer.push(`<!--]--></div> <hr class="mb-6 border-zinc-800"/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <h2 class="mb-3 text-sm font-medium text-green-400">Published</h2> <div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(published);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let post = each_array_1[$$index_1];
				$$renderer.push(`<div class="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="min-w-0 flex-1"><a${attr("href", "/blog/" + post.slug)} target="_blank" class="font-medium text-amber-400 hover:underline">${escape_html(post.title || "(Untitled)")}</a> <p class="text-xs text-zinc-400">${escape_html(post.authorName)} ·
						${escape_html(post.publishedAt ? "Published " + post.publishedAt : "Draft")}</p></div> <div class="flex items-center gap-2 shrink-0 ml-3"><a${attr("href", "/admin/blog/" + post.id)} class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500">Edit</a></div></div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (published.length === 0 && drafts.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-zinc-500">No posts yet. Create your first one!</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (data.archivedPosts.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-10"><h2 class="mb-3 text-sm font-medium text-zinc-500">Archived Posts</h2> <div class="space-y-2"><!--[-->`);
				const each_array_2 = ensure_array_like(data.archivedPosts);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let post = each_array_2[$$index_2];
					$$renderer.push(`<div class="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-3"><div class="min-w-0 flex-1"><span class="text-sm text-zinc-500">${escape_html(post.title || "(Untitled)")}</span> <span class="ml-2 text-xs text-zinc-600">${escape_html(post.authorName)}</span></div> <form method="POST" action="?/unarchive"><input type="hidden" name="id"${attr("value", post.id)}/> <button type="submit" class="text-xs text-amber-400 hover:underline">Restore</button></form></div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BTY83XH7.js.map
