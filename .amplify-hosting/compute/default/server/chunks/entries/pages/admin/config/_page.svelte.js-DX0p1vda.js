import { X as store_get, V as attr, W as escape_html, Y as unsubscribe_stores } from '../../../../chunks/server.js-D7jMOqOz.js';
import { p as page } from '../../../../chunks/stores.js-c7rEAgAL.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '../../../../chunks/client.js-q5RwB46e.js';
import '../../../../chunks/exports.js-Bq66Su2C.js';
import '../../../../chunks/internal2.js-DHGs7jvM.js';
import '../../../../chunks/index-server.js-dMC7ajjs.js';
import '../../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import '../../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/admin/config/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { data, form } = $$props;
		let title = data.config.heroTitle;
		let subtitle = data.config.heroSubtitle;
		let heroImage = data.config.heroImage;
		let instagram = data.config.instagram || "";
		let facebook = data.config.facebook || "";
		let youtube = data.config.youtube || "";
		let spotify = data.config.spotify || "";
		let theme = store_get($$store_subs ??= {}, "$page", page).data.theme || "funk";
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Site Settings</h1> `);
		if (form?.success) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Saved!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST" action="?/save" class="space-y-6"><div><label for="heroTitle" class="mb-1 block text-sm text-zinc-400">Hero Title</label> <input type="text" id="heroTitle" name="heroTitle"${attr("value", title)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="heroSubtitle" class="mb-1 block text-sm text-zinc-400">Hero Subtitle</label> <textarea id="heroSubtitle" name="heroSubtitle" rows="3" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none">`);
		const $$body = escape_html(subtitle);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> <div><label class="mb-1 block text-sm text-zinc-400">Hero Background Image</label> <div class="flex items-center gap-3">`);
		if (heroImage) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", heroImage)} alt="Hero bg" class="h-16 w-24 rounded object-cover"/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label class="relative inline-flex cursor-pointer rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-400 hover:border-amber-500 hover:text-amber-400">${escape_html(heroImage ? "Change Image" : "Upload Image")} <input type="file" accept="image/*" class="absolute inset-0 opacity-0"/></label> `);
		if (heroImage) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="rounded border border-red-700 px-3 py-1 text-sm text-red-400 hover:bg-red-900/20">Remove</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <input type="hidden" name="heroImage"${attr("value", heroImage)}/> <p class="mt-1 text-xs text-zinc-500">Leave blank for the default gradient background.</p></div> <div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><h3 class="mb-3 text-sm font-medium text-zinc-400">Social Media Links</h3> <div class="grid gap-3 sm:grid-cols-2"><div><label for="instagram2" class="mb-1 block text-xs text-zinc-500">Instagram URL</label> <input type="text" id="instagram2" name="instagram"${attr("value", instagram)} placeholder="https://instagram.com/..." class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"/></div> <div><label for="facebook2" class="mb-1 block text-xs text-zinc-500">Facebook URL</label> <input type="text" id="facebook2" name="facebook"${attr("value", facebook)} placeholder="https://facebook.com/..." class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"/></div> <div><label for="youtube2" class="mb-1 block text-xs text-zinc-500">YouTube URL</label> <input type="text" id="youtube2" name="youtube"${attr("value", youtube)} placeholder="https://youtube.com/..." class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"/></div> <div><label for="spotify2" class="mb-1 block text-xs text-zinc-500">Spotify URL</label> <input type="text" id="spotify2" name="spotify"${attr("value", spotify)} placeholder="https://spotify.com/..." class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"/></div></div> <p class="mt-1 text-xs text-zinc-500">Leave blank to hide a link from the footer.</p></div> <button type="submit" class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400">Save Settings</button></form> <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4"><label class="mb-1 block text-sm text-zinc-400">Site Theme</label> <form method="POST" action="/theme" class="flex items-center gap-2 mt-2">`);
		$$renderer.select({
			name: "theme",
			value: theme,
			onchange: (e) => e.currentTarget.form?.submit(),
			class: "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500 focus:outline-none"
		}, ($$renderer) => {
			$$renderer.option({ value: "funk" }, ($$renderer) => {
				$$renderer.push(`🎷 70s Funk`);
			});
			$$renderer.option({ value: "christmas" }, ($$renderer) => {
				$$renderer.push(`🎄 Christmas`);
			});
			$$renderer.option({ value: "dark" }, ($$renderer) => {
				$$renderer.push(`🌙 Dark Mode`);
			});
		});
		$$renderer.push(`</form></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DX0p1vda.js.map
