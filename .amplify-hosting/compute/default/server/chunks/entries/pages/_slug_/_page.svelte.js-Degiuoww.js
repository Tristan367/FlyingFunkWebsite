import { a0 as html } from '../../../chunks/server.js-D7jMOqOz.js';
import '../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="mx-auto max-w-3xl px-4 pt-20 pb-10"><a href="/" class="mb-8 inline-block text-sm text-amber-400 hover:underline">← Back to the Band</a> <article class="prose prose-invert prose-amber max-w-none">${html(data.member.bio)}</article></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-Degiuoww.js.map
