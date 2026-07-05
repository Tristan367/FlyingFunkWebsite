import { W as escape_html, _ as ensure_array_like, V as attr, $ as stringify, M as derived } from '../../../../chunks/server.js-D7jMOqOz.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/gigs/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let expandedVote = null;
		let pendingGigs = derived(() => data.gigs.filter((g) => g.status === "pending"));
		let confirmedGigs = derived(() => data.gigs.filter((g) => g.status === "confirmed"));
		let cancelledGigs = derived(() => data.gigs.filter((g) => g.status === "cancelled"));
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Manage Gigs</h1> `);
		if (form?.voteSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Vote recorded!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<button class="mb-8 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Add Gig</button>`);
		$$renderer.push(`<!--]--> `);
		if (pendingGigs().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mb-8"><h2 class="mb-4 text-xl font-bold text-yellow-400">Pending Requests (${escape_html(pendingGigs().length)})</h2> <div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(pendingGigs());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let gig = each_array[$$index];
				$$renderer.push(`<div class="rounded-lg border border-yellow-700/50 bg-zinc-900 transition-colors hover:border-yellow-500/50"><a${attr("href", `/admin/gigs/${stringify(gig.id)}`)} class="block cursor-pointer p-4"><div><h3 class="font-bold">${escape_html(gig.venue)}</h3> <p class="text-sm text-zinc-400">${escape_html((/* @__PURE__ */ new Date(gig.date + "T00:00:00")).toLocaleDateString("en-US", {
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
					$$renderer.push(`<span class="ml-1 text-xs text-zinc-600">(no horns)</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div> `);
				if (gig.customerName) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-sm text-zinc-500">Requested by: ${escape_html(gig.customerName)} (${escape_html(gig.customerEmail)})</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <p class="mt-1 text-right text-sm text-yellow-400">${escape_html(gig.rate.startsWith("$") ? gig.rate : "$" + gig.rate)}</p></a> <div class="border-t border-zinc-800 px-4 py-3"><button type="button" class="text-xs text-amber-400 hover:underline">${escape_html(gig.votes.approve + gig.votes.reject + gig.votes.abstain)} votes
							(${escape_html(gig.votes.approve)} approve, ${escape_html(gig.votes.reject)} reject) `);
				if (gig.votes.myVote) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`— You voted: ${escape_html(gig.votes.myVote)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button> `);
				if (expandedVote === gig.id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="mt-3 space-y-2 rounded-lg border border-zinc-800 p-3"><div class="flex gap-2"><button type="button" class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Approve</button> <button type="button" class="rounded bg-zinc-600 px-3 py-1 text-xs text-white hover:bg-zinc-500">Abstain</button> <button type="button" class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500">Reject</button></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section class="mb-8"><h2 class="mb-4 text-xl font-bold text-green-400">Confirmed (${escape_html(confirmedGigs().length)})</h2> <div class="space-y-3"><!--[-->`);
		const each_array_1 = ensure_array_like(confirmedGigs());
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let gig = each_array_1[$$index_1];
			$$renderer.push(`<a${attr("href", `/admin/gigs/${stringify(gig.id)}`)} class="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-amber-500/50"><div><h3 class="font-bold">${escape_html(gig.venue)}</h3> <p class="text-sm text-zinc-400">${escape_html((/* @__PURE__ */ new Date(gig.date + "T00:00:00")).toLocaleDateString("en-US", {
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
				$$renderer.push(`<span class="ml-1 text-xs text-zinc-600">(no horns)</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></p></div> `);
			if (gig.customerName) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="mt-1 text-sm text-zinc-500">Booked by: ${escape_html(gig.customerName)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <p class="mt-2 text-right text-sm text-green-400">${escape_html(gig.rate.startsWith("$") ? gig.rate : "$" + gig.rate)}</p></a>`);
		}
		$$renderer.push(`<!--]--> `);
		if (confirmedGigs().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-zinc-500">No confirmed gigs.</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></section> `);
		if (cancelledGigs().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section><h2 class="mb-4 text-xl font-bold text-red-400">Cancelled (${escape_html(cancelledGigs().length)})</h2> <div class="space-y-3"><!--[-->`);
			const each_array_2 = ensure_array_like(cancelledGigs());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let gig = each_array_2[$$index_2];
				$$renderer.push(`<a${attr("href", `/admin/gigs/${stringify(gig.id)}`)} class="block rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"><div class="flex flex-wrap items-center justify-between gap-2"><div><h3 class="font-bold text-zinc-500 line-through">${escape_html(gig.venue)}</h3> <p class="text-sm text-zinc-600">${escape_html((/* @__PURE__ */ new Date(gig.date + "T00:00:00")).toLocaleDateString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric"
				}))}</p></div> <span class="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">cancelled</span></div></a>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DQm7PIE2.js.map
