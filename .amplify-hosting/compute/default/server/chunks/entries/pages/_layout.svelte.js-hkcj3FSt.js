import { U as head, V as attr, W as escape_html } from '../../chunks/server.js-D7jMOqOz.js';
import '../../chunks/shared.js-CgP5r6wP.js';

//#region src/lib/components/SocialIcon.svelte
function SocialIcon($$renderer, $$props) {
	let { platform } = $$props;
	if (platform === "instagram") {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="5"></circle><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`);
	} else if (platform === "facebook") {
		$$renderer.push("<!--[1-->");
		$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`);
	} else if (platform === "youtube") {
		$$renderer.push("<!--[2-->");
		$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"></path></svg>`);
	} else if (platform === "spotify") {
		$$renderer.push("<!--[3-->");
		$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 11.5c3-1 6-1 8.5 0"></path><path d="M8.5 14.5c2.5-.8 5-.8 7 0"></path><path d="M9 17.5c1.5-.5 3.5-.5 5.5 0"></path></svg>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, data } = $$props;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Flying Funk — 70s Funk Cover Band</title>`);
			});
			$$renderer.push(`<meta name="description" content="Flying Funk — Bringing the groove of 70s funk to your event. Available for bookings!"/>`);
		});
		$$renderer.push(`<div${attr("data-theme", data.theme)} class="flex min-h-screen flex-col bg-zinc-950 text-zinc-200"><nav class="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur"><div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><a href="/" class="font-display text-xl sm:text-2xl tracking-tight text-amber-400">FLYING FUNK</a> <div class="hidden items-center gap-6 text-sm font-semibold sm:flex"><a href="/" class="transition-colors hover:text-amber-400">Home</a> <a href="/book" class="transition-colors hover:text-amber-400">Book Us</a> <a href="/blog" class="transition-colors hover:text-amber-400">Blog</a> <a href="/songs" class="transition-colors hover:text-amber-400">Music</a> `);
		if (data.user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a href="/admin" class="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-md">Admin</a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<a href="/login" class="transition-colors hover:text-amber-400">Login</a>`);
		}
		$$renderer.push(`<!--]--></div> <button class="text-3xl text-zinc-300 sm:hidden">${escape_html("☰")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></nav> <main class="flex-1">`);
		children($$renderer);
		$$renderer.push(`<!----></main> <footer class="border-t border-zinc-800 bg-zinc-950 py-8"><div class="mx-auto max-w-6xl px-4 text-center"><p class="text-sm text-zinc-500">Flying Funk © ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} — Bringing the funk. Built by <span class="text-zinc-400">Tristan Johnson</span>.</p> `);
		if (data.social?.instagram || data.social?.facebook || data.social?.youtube || data.social?.spotify) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-3 flex justify-center gap-4">`);
			if (data.social?.instagram) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", data.social.instagram)} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="Instagram">`);
				SocialIcon($$renderer, { platform: "instagram" });
				$$renderer.push(`<!----></a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.social?.facebook) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", data.social.facebook)} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="Facebook">`);
				SocialIcon($$renderer, { platform: "facebook" });
				$$renderer.push(`<!----></a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.social?.youtube) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", data.social.youtube)} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="YouTube">`);
				SocialIcon($$renderer, { platform: "youtube" });
				$$renderer.push(`<!----></a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.social?.spotify) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", data.social.spotify)} target="_blank" class="text-zinc-400 hover:text-amber-400 transition-colors" title="Spotify">`);
				SocialIcon($$renderer, { platform: "spotify" });
				$$renderer.push(`<!----></a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></footer></div>`);
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte.js-hkcj3FSt.js.map
