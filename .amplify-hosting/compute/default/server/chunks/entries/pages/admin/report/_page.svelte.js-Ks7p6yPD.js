import { W as escape_html, _ as ensure_array_like, V as attr, $ as stringify } from '../../../../chunks/server.js-D7jMOqOz.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/report/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">${escape_html(data.year)} Report</h1> <div class="mb-10 grid gap-4 sm:grid-cols-2"><div class="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"><p class="text-sm text-zinc-400">Total Gigs</p> <p class="text-3xl font-black text-amber-400">${escape_html(data.totalGigs)}</p></div> <div class="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"><p class="text-sm text-zinc-400">Total Revenue</p> <p class="text-3xl font-black text-green-400">$${escape_html(data.totalRevenue.toLocaleString())}</p></div></div> `);
		if (data.byMonth.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<h2 class="mb-4 text-lg font-bold text-zinc-300">By Month</h2> <div class="mb-10 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-zinc-800 text-zinc-400"><th class="py-2 pr-4">Month</th><th class="py-2 pr-4 text-right">Gigs</th><th class="py-2 text-right">Revenue</th></tr></thead><tbody><!--[-->`);
			const each_array = ensure_array_like(data.byMonth);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let m = each_array[$$index];
				$$renderer.push(`<tr class="border-b border-zinc-800/50"><td class="py-2 pr-4">${escape_html((/* @__PURE__ */ new Date(m.month + "-01")).toLocaleDateString("en-US", {
					month: "long",
					year: "numeric"
				}))}</td><td class="py-2 pr-4 text-right">${escape_html(m.count)}</td><td class="py-2 text-right">$${escape_html(m.revenue.toLocaleString())}</td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2 class="mb-4 text-lg font-bold text-zinc-300">All Gigs</h2> <div class="space-y-2"><!--[-->`);
		const each_array_1 = ensure_array_like(data.gigs);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let gig = each_array_1[$$index_1];
			$$renderer.push(`<a${attr("href", `/admin/gigs/${stringify(gig.id)}`)} class="block rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-amber-500/50"><div class="flex items-center justify-between"><div><span class="font-medium">${escape_html(gig.venue)}</span> <span class="ml-2 text-xs text-zinc-400">${escape_html((/* @__PURE__ */ new Date(gig.date + "T00:00:00")).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric"
			}))}</span></div> <span class="text-sm text-amber-400">${escape_html(gig.rate)}</span></div></a>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.gigs.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-zinc-400">No gigs this year yet.</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-Ks7p6yPD.js.map
