import { W as escape_html, _ as ensure_array_like, V as attr } from './server.js-D7jMOqOz.js';

//#region src/lib/components/ImageManager.svelte
function ImageManager($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let images = [];
		$$renderer.push(`<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-medium text-zinc-400">Images</h3> <label class="relative inline-flex cursor-pointer rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-amber-500 hover:text-amber-400">${escape_html("Upload Images")} <input type="file" accept="image/*" multiple="" class="absolute inset-0 opacity-0"/></label></div> <p class="mb-3 text-xs text-zinc-400">Upload images, then reference them in your HTML as <code class="text-amber-400">./images/filename.jpg</code>. They will resolve automatically.</p> `);
		if (images.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-zinc-500">No images yet.</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-5 gap-1.5 sm:grid-cols-6 md:grid-cols-8"><!--[-->`);
			const each_array = ensure_array_like(images);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let img = each_array[$$index];
				$$renderer.push(`<div class="rounded border border-zinc-800 bg-zinc-950 p-1"><div class="mb-1 flex aspect-square items-center justify-center overflow-hidden rounded"><img${attr("src", img.path)}${attr("alt", img.filename)} class="h-full w-full object-cover"/></div> <p class="mb-1 truncate text-[9px] text-zinc-400"${attr("title", img.filename)}>${escape_html(img.filename)}</p> <button type="button" class="w-full rounded border border-zinc-700 py-0.5 text-[9px] text-red-400 hover:border-red-700">✕</button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { ImageManager as I };
//# sourceMappingURL=ImageManager.js-Cgil25TW.js.map
