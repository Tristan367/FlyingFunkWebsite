import { _ as ensure_array_like, V as attr, W as escape_html } from '../../../../chunks/server.js-D7jMOqOz.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/songs/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Songs &amp; Recordings</h1> `);
		if (form?.uploadSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Song uploaded!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.deleteSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Song deleted.</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.pinSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Updated.</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<button class="mb-8 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Upload Song</button>`);
		$$renderer.push(`<!--]--> <div class="space-y-3"><!--[-->`);
		const each_array = ensure_array_like(data.songs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let song = each_array[$$index];
			$$renderer.push(`<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="flex items-start gap-3"><div class="min-w-0 flex-1"><h3 class="font-bold truncate"${attr("title", song.title)}>${escape_html(song.title)}`);
			if (song.pinned) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-xs font-normal text-amber-400">📌 Pinned</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></h3> <p class="text-xs text-zinc-400">${escape_html(song.uploaderName)} · ${escape_html(new Date(song.uploadedAt).toLocaleDateString())}`);
			if (song.plays != null) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`· ${escape_html(song.plays)} play${escape_html(song.plays !== 1 ? "s" : "")}`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></p></div> <button type="button" class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500 shrink-0">Edit</button></div> <audio controls="" class="mt-2 w-full"${attr("src", song.path)}></audio></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.songs.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-zinc-400">No songs yet. Upload one!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BCHQz7-Y.js.map
