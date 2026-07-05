import { Z as attr_class, V as attr, W as escape_html, _ as ensure_array_like, $ as stringify } from '../../chunks/server.js-D7jMOqOz.js';
import { i as instrumentEmoji } from '../../chunks/instruments.js-DnP6CFo9.js';
import '../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let copiedGig = null;
		$$renderer.push(`<section${attr_class(`relative overflow-hidden ${data.config.heroImage ? "bg-zinc-950" : "bg-gradient-to-b from-amber-500/10 to-zinc-950"} py-32 sm:py-48`)}>`);
		if (data.config.heroImage) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute inset-0 flex items-center justify-center"><div style="width:1200px;height:100%;position:relative"><img${attr("src", data.config.heroImage)} alt="" style="width:1200px;height:100%;object-fit:cover;display:block"/> <div style="position:absolute;inset:0;background:radial-gradient(ellipse 50% 50% at 50% 50%,transparent 0%,var(--bg-color,#09090b) 100%)"></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="relative mx-auto max-w-4xl px-4 text-center"><h1 class="mb-4 text-6xl font-black tracking-tight text-amber-400" style="text-shadow:0 0 16px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)">${escape_html(data.config.heroTitle)}</h1> <p class="mb-10 max-w-xl mx-auto text-base leading-relaxed text-zinc-300" style="text-shadow:0 0 8px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)">${escape_html(data.config.heroSubtitle)}</p> <div class="flex justify-center"><a href="/book" class="rounded-lg bg-amber-500 px-8 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400 shadow-lg shadow-black/60">Book Us</a></div></div></section> `);
		if (data.pinnedSongs.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mx-auto max-w-4xl px-4 py-16"><h2 class="mb-8 text-center text-3xl font-bold text-amber-400">Music</h2> <div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(data.pinnedSongs);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let song = each_array[$$index];
				$$renderer.push(`<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><h3 class="font-bold mb-2">${escape_html(song.title)}</h3> <audio controls="" class="w-full"${attr("src", song.path)}></audio></div>`);
			}
			$$renderer.push(`<!--]--></div> <a href="/songs" class="mt-4 inline-block text-sm text-amber-400 hover:underline">All songs →</a></section>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<section class="mx-auto max-w-4xl px-4 py-16"><div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center"><h2 class="mb-2 text-3xl font-bold text-amber-400">Music</h2> <p class="mb-4 text-zinc-400">Check out our recordings and live performances.</p> <a href="/songs" class="inline-block rounded-lg bg-amber-500 px-8 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Listen</a></div></section>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.upcomingGigs.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mx-auto max-w-4xl px-4 py-16"><h2 class="mb-8 text-center text-3xl font-bold text-amber-400">Upcoming Gigs</h2> <div class="space-y-4"><!--[-->`);
			const each_array_1 = ensure_array_like(data.upcomingGigs);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let gig = each_array_1[$$index_1];
				$$renderer.push(`<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-6"><div class="mb-2"><h3 class="text-lg font-bold">${escape_html(gig.venue)}</h3> <p class="text-sm font-bold text-amber-400">${escape_html((/* @__PURE__ */ new Date(gig.date + "T00:00:00")).toLocaleDateString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric"
				}))} `);
				if (gig.time) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`· ${escape_html(gig.time)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (!gig.withHorns) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`· rhythm section`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div> `);
				if (gig.description) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-zinc-400">${escape_html(gig.description)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (gig.venueAddress) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><span class="text-sm text-zinc-400">${escape_html(gig.venueAddress)}</span> <div class="flex items-center justify-end gap-2 sm:justify-start"><button type="button" class="rounded border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors">${escape_html(copiedGig === gig.id ? "Copied!" : "Copy Address")}</button> <a${attr("href", "https://www.google.com/maps/search/" + encodeURIComponent(gig.venueAddress))} target="_blank" class="rounded border border-zinc-700 px-4 py-2 text-sm text-amber-400 hover:border-amber-500 transition-colors">Map</a></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section class="mx-auto max-w-6xl px-4 py-16"><h2 class="mb-8 text-center text-3xl font-bold text-amber-400">The Band</h2> <div class="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"><!--[-->`);
		const each_array_2 = ensure_array_like(data.members);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let member = each_array_2[$$index_2];
			const hasProfile = member.slug && member.bio;
			$$renderer.push(`<a${attr("href", hasProfile ? "/" + member.slug : "#")}${attr_class(`rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center transition-colors ${hasProfile ? "hover:border-amber-500/50" : "cursor-default"}`)}><div class="mx-auto mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-amber-500/20">`);
			if (member.profilePic) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", member.profilePic)}${attr("alt", member.name)} class="h-full w-full object-cover"/>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="text-2xl">${escape_html(member.name[0])}</span>`);
			}
			$$renderer.push(`<!--]--></div> <p class="font-semibold">${escape_html(member.name)}</p> <p class="text-xs text-zinc-500">${escape_html(member.instrument)} ${escape_html(instrumentEmoji(member.instrument))}</p></a>`);
		}
		$$renderer.push(`<!--]--></div></section> `);
		if (data.blogPosts.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mx-auto max-w-4xl px-4 py-16"><div class="mb-8"><h2 class="text-3xl font-bold text-amber-400">Latest from the Blog</h2> <a href="/blog" class="mt-2 inline-block text-sm text-amber-400 hover:underline">View all posts →</a></div> <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
			const each_array_3 = ensure_array_like(data.blogPosts);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let post = each_array_3[$$index_3];
				$$renderer.push(`<a${attr("href", `/blog/${stringify(post.slug)}`)} class="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-amber-500/50"><h3 class="mb-2 font-bold text-amber-400">${escape_html(post.title)}</h3> <p class="text-sm text-zinc-500">by ${escape_html(post.authorName)} ·
						${escape_html((/* @__PURE__ */ new Date(post.publishedAt + "T00:00:00")).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric"
				}))}</p></a>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-Dj9n9qL2.js.map
