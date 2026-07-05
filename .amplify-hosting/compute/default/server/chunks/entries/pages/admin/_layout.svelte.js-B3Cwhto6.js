import { X as store_get, Y as unsubscribe_stores } from '../../../chunks/server.js-D7jMOqOz.js';
import { p as page } from '../../../chunks/stores.js-c7rEAgAL.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/client.js-q5RwB46e.js';
import '../../../chunks/exports.js-Bq66Su2C.js';
import '../../../chunks/internal2.js-DHGs7jvM.js';
import '../../../chunks/index-server.js-dMC7ajjs.js';
import '../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import '../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/admin/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children, data } = $$props;
		$$renderer.push(`<div class="mx-auto max-w-4xl px-4 py-6 lg:py-10">`);
		if (store_get($$store_subs ??= {}, "$page", page).route.id !== "/admin") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a href="/admin" class="mb-6 inline-block text-sm text-amber-400 hover:underline">← Back to Dashboard</a>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <main>`);
		children($$renderer);
		$$renderer.push(`<!----></main></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte.js-B3Cwhto6.js.map
