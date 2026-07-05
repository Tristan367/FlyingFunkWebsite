import { a0 as html } from '../../../../chunks/server.js-D7jMOqOz.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/blog/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="pb-8"><article class="prose prose-invert prose-amber max-w-none">${html(data.post.content)}</article></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-Bwklyjjj.js.map
