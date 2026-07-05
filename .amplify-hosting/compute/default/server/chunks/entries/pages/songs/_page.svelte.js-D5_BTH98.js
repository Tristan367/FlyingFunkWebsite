import { _ as ensure_array_like, W as escape_html, V as attr } from '../../../chunks/server.js-D7jMOqOz.js';
import '../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/songs/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="mx-auto max-w-3xl px-4 py-20"><h1 class="mb-8 text-4xl font-bold text-amber-400">Music</h1> `);
		if (data.pinned.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<h2 class="mb-4 text-lg font-bold text-amber-400">Pinned</h2> <div class="mb-12 space-y-4"><!--[-->`);
			const each_array = ensure_array_like(data.pinned);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let song = each_array[$$index];
				$$renderer.push(`<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="flex items-start justify-between gap-2"><div><h3 class="font-bold">${escape_html(song.title)}</h3> <p class="text-xs text-zinc-400">${escape_html(new Date(song.uploadedAt).toLocaleDateString())}</p></div> <a${attr("href", song.path)} download="" class="shrink-0 rounded border border-zinc-700 px-3 py-1 text-xs text-amber-400 hover:border-amber-500 transition-colors">Download</a></div> `);
				if (song.description) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="mt-1 text-sm text-zinc-400">${escape_html(song.description)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <audio controls="" class="mt-2 w-full"${attr("src", song.path)}></audio></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2 class="mb-4 text-lg font-bold text-zinc-300">All Songs</h2> <div class="space-y-4"><!--[-->`);
		const each_array_1 = ensure_array_like(data.all);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let song = each_array_1[$$index_1];
			$$renderer.push(`<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="flex items-start justify-between gap-2"><div><h3 class="font-bold">${escape_html(song.title)}</h3> <p class="text-xs text-zinc-400">${escape_html(song.uploaderName)} · ${escape_html(new Date(song.uploadedAt).toLocaleDateString())}</p></div> <a${attr("href", song.path)} download="" class="shrink-0 rounded border border-zinc-700 px-3 py-1 text-xs text-amber-400 hover:border-amber-500 transition-colors">Download</a></div> `);
			if (song.description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="mt-1 text-sm text-zinc-400">${escape_html(song.description)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <audio controls="" class="mt-2 w-full"${attr("src", song.path)}></audio></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.all.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-zinc-400">No music yet. Check back soon!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-D5_BTH98.js.map
