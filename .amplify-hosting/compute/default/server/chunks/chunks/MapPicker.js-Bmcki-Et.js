//#region src/lib/components/MapPicker.svelte
function MapPicker($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { address = "", lat = 47.6588, lng = -117.426, onSelect } = $$props;
		$$renderer.push(`<div><div class="relative"><input type="text" placeholder="Search for a venue or address..." class="w-full rounded-t-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"/> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="h-72 w-full rounded-b-lg border border-t-0 border-zinc-700"></div></div>`);
	});
}

export { MapPicker as M };
//# sourceMappingURL=MapPicker.js-Bmcki-Et.js.map
