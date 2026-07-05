import { V as attr, $ as stringify, W as escape_html, a0 as html, M as derived } from '../../../../../chunks/server.js-D7jMOqOz.js';
import { R as RichTextEditor } from '../../../../../chunks/RichTextEditor.js-BU33-sq-.js';
import { I as ImageManager } from '../../../../../chunks/ImageManager.js-Cgil25TW.js';
import { r as resolveImages } from '../../../../../chunks/images.js-Drv2Xr4-.js';
import '../../../../../chunks/shared.js-CgP5r6wP.js';
import '@tiptap/starter-kit';
import '@tiptap/extensions';
import '@tiptap/extension-image';
import '@tiptap/extension-underline';
import '@tiptap/extension-link';
import '@tiptap/extension-text-style';
import '@tiptap/extension-color';
import '@tiptap/extension-highlight';
import '@tiptap/extension-text-align';

//#region src/routes/admin/blog/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let title = data.post.title;
		let slug = data.post.slug;
		let content = data.post.content;
		let publish = data.post.publishedAt !== "";
		let activeImages = [];
		let resolvedPreview = derived(() => resolveImages(content, activeImages));
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Post</h1> `);
		if (form?.saveSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Post saved!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-6 flex gap-3"><a${attr("href", `/blog/${stringify(data.post.slug)}`)} target="_blank" class="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:border-zinc-500">View Post ↗</a> <a href="/admin/blog" class="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:border-zinc-500">← All Posts</a></div> <form method="POST" action="?/save" class="space-y-4"><div><label for="title" class="mb-1 block text-sm text-zinc-400">Title</label> <input type="text" id="title" name="title" required=""${attr("value", title)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="slug" class="mb-1 block text-sm text-zinc-400">Page Address</label> <div class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3"><span class="text-sm text-zinc-600">flyingfunk.com/blog/</span> <input type="text" id="slug" name="slug"${attr("value", slug)} required="" class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-400 focus:outline-none"/></div></div> <div class="mb-6 rounded-lg border border-amber-700/30 bg-amber-500/5 p-3 text-xs text-zinc-400"><strong class="text-amber-400">Security note:</strong> Blog posts are raw HTML that anyone can inspect with browser dev tools. Don't include passwords, database credentials, or any sensitive information in here — even if it's not visible on the page, it's still viewable in the source.</div> <div><label for="content" class="mb-1 block text-sm text-zinc-400">Content</label> `);
		ImageManager($$renderer, {
			scope: "blog-" + data.post.id});
		$$renderer.push(`<!----> <div class="mt-4">`);
		RichTextEditor($$renderer, {
			content,
			onUpdate: (html) => content = html,
			galleryImages: activeImages,
			placeholder: "Write your post..."
		});
		$$renderer.push(`<!----> <input type="hidden" name="content"${attr("value", content)}/></div></div> <div class="flex items-center gap-2"><input type="checkbox" id="published" name="published"${attr("checked", publish, true)} class="accent-amber-500"/> <label for="published" class="text-sm text-zinc-400">Published `);
		if (data.post.publishedAt) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-zinc-600">(since ${escape_html(data.post.publishedAt)})</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></label></div> `);
		if (form?.saveError) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-red-400">${escape_html(form.saveError)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex gap-3"><button type="submit" class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Save</button> `);
		if (data.post.publishedAt) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="submit" formaction="?/unpublish" class="rounded-lg border border-zinc-700 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-red-500 hover:text-red-400">Unpublish</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mt-6 border-t border-zinc-800 pt-4"><button type="button" class="rounded border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">Delete Post</button></div></form> `);
		if (content) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-8 overflow-hidden border-y border-zinc-700" style="width:100vw;position:relative;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw"><div class="border-b border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs text-zinc-500"><span class="text-amber-400 font-bold">Preview</span> <span class="ml-2">flyingfunk.com/blog/${escape_html(data.post.slug)}</span></div> <div class="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4"><div class="mx-auto flex max-w-6xl items-center justify-between"><span class="font-display text-xl tracking-tight text-amber-400">FLYING FUNK</span> <div class="hidden gap-6 text-sm font-semibold text-zinc-400 sm:flex"><span>Home</span><span>Book Us</span><span>Blog</span><span>Music</span><span>Login</span></div> <span class="text-xl text-zinc-400 sm:hidden">☰</span></div></div> <div class="bg-zinc-950 pb-8 pt-4"><div class="prose prose-invert prose-amber max-w-none">${html(resolvedPreview())}</div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DWj4M3kX.js.map
