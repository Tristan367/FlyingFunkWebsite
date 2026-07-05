import { V as attr, W as escape_html, _ as ensure_array_like, Z as attr_class, a1 as clsx$1, M as derived } from '../../../../../chunks/server.js-D7jMOqOz.js';
import { M as MapPicker } from '../../../../../chunks/MapPicker.js-Bmcki-Et.js';
import '../../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/gigs/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let date = data.gig.date;
		let time = data.gig.time;
		let venue = data.gig.venue;
		let venueAddress = data.gig.venueAddress;
		let description = data.gig.description;
		let customerName = data.gig.customerName;
		let customerEmail = data.gig.customerEmail;
		let customerPhone = data.gig.customerPhone;
		let rate = data.gig.rate;
		let notes = data.gig.notes;
		let withHorns = data.gig.withHorns;
		let isPrivate = data.gig.private;
		let distances = [];
		let mapQuery = derived(() => venueAddress || venue);
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Gig</h1> `);
		if (form?.saveSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Saved!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-6 flex items-center justify-between gap-2"><a href="/admin/gigs" class="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:border-zinc-500">← All Gigs</a> <button type="submit" form="gig-edit-form" class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20">Save Changes</button></div> <form method="POST" action="?/save" class="space-y-4" id="gig-edit-form"><div class="grid gap-4 sm:grid-cols-4"><div><label for="edit-date" class="mb-1 block text-sm text-zinc-400">Date</label> <input type="date" id="edit-date" name="date"${attr("value", date)} required="" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="edit-time" class="mb-1 block text-sm text-zinc-400">Time</label> <input type="text" id="edit-time" name="time"${attr("value", time)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="edit-rate" class="mb-1 block text-sm text-zinc-400">Rate</label> <input type="text" id="edit-rate" name="rate"${attr("value", rate)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div class="flex items-end gap-4"><label class="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" name="withHorns"${attr("checked", withHorns, true)} class="accent-amber-500"/> <span class="text-zinc-400">With horns</span></label> <label class="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" name="private"${attr("checked", isPrivate, true)} class="accent-amber-500"/> <span class="text-zinc-400">Private</span></label></div></div> <div class="grid gap-4 sm:grid-cols-2"><div><label for="edit-venue" class="mb-1 block text-sm text-zinc-400">Venue</label> <input type="text" id="edit-venue" name="venue"${attr("value", venue)} required="" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label class="mb-1 block text-sm text-zinc-400">Venue Location</label> `);
		MapPicker($$renderer, {
			address: mapQuery(),
			onSelect: (_lat, _lng, addr) => {
				venueAddress = addr;
			}
		});
		$$renderer.push(`<!----> <input type="hidden" name="venueAddress"${attr("value", venueAddress)}/> <div class="mt-2 flex flex-wrap items-center gap-2"><button type="button" class="rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-amber-500 hover:text-amber-400">${escape_html("⌖ Calculate Drive Times")}</button> `);
		if (distances.length > 0) {
			$$renderer.push("<!--[1-->");
			const withMiles = distances.filter((d) => d.miles != null);
			const avgMiles = withMiles.length > 0 ? Math.round(withMiles.reduce((s, d) => s + d.miles, 0) / withMiles.length) : 0;
			const avgMins = withMiles.length > 0 ? Math.round(withMiles.reduce((s, d) => s + d.minutes, 0) / withMiles.length) : 0;
			$$renderer.push(`<span class="text-xs text-zinc-400">Avg: ${escape_html(avgMiles)} mi · ~${escape_html(avgMins)} min
						· Closest: ${escape_html(withMiles.reduce((a, b) => a.miles < b.miles ? a : b)?.name || "n/a")}
						· Furthest: ${escape_html(withMiles.reduce((a, b) => a.miles > b.miles ? a : b)?.name || "n/a")}</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-xs text-zinc-400">Set a location on the map, then click to calculate.</span>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-6 border-t border-zinc-800 pt-4"><button type="button" class="rounded border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">Delete Gig</button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="edit-desc" class="mb-1 block text-sm text-zinc-400">Description</label> <textarea id="edit-desc" name="description" rows="3" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> <div class="grid gap-4 sm:grid-cols-2"><div><label for="edit-customer" class="mb-1 block text-sm text-zinc-400">Customer Name</label> <input type="text" id="edit-customer" name="customerName"${attr("value", customerName)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="edit-email" class="mb-1 block text-sm text-zinc-400">Customer Email</label> <input type="email" id="edit-email" name="customerEmail"${attr("value", customerEmail)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div></div> <div><label for="edit-phone" class="mb-1 block text-sm text-zinc-400">Customer Phone</label> <input type="tel" id="edit-phone" name="customerPhone"${attr("value", customerPhone)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="edit-notes" class="mb-1 block text-sm text-zinc-400">Internal Notes</label> <textarea id="edit-notes" name="notes" rows="2" placeholder="Notes for the band..." class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none">`);
		const $$body_1 = escape_html(notes);
		if ($$body_1) $$renderer.push(`${$$body_1}`);
		$$renderer.push(`</textarea></div></form> <div class="mt-10 rounded-lg border border-zinc-800 bg-zinc-900 p-6"><h2 class="mb-4 text-lg font-bold">Lineup${escape_html(data.lineupCount ? ` (${data.lineupCount} needed)` : "")}</h2> <div class="grid grid-cols-1 gap-2 sm:grid-cols-2"><!--[-->`);
		const each_array = ensure_array_like(data.lineup);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let l = each_array[$$index];
			$$renderer.push(`<div class="flex items-center gap-3 rounded border border-zinc-800 p-2 text-sm"><span class="text-zinc-400 w-20 shrink-0 capitalize">${escape_html(l.instrument)}</span> <span${attr_class(clsx$1(l.members.length > 0 ? "text-zinc-200" : "text-red-400"))}>${escape_html(l.members.length > 0 ? l.members.join(" / ") : "Unfilled")}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6"><h2 class="mb-4 text-lg font-bold">Status &amp; Voting</h2> <div class="mb-6 flex flex-wrap items-center gap-4"><span${attr_class(`rounded-full px-3 py-1 text-xs font-medium ${data.gig.status === "confirmed" ? "bg-green-500/20 text-green-400" : ""} ${data.gig.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : ""} ${data.gig.status === "cancelled" ? "bg-red-500/20 text-red-400" : ""} `)}>${escape_html(data.gig.status)}</span> <form method="POST" action="?/status" class="contents"><input type="hidden" name="status" value="confirmed"/> <button type="submit" class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Confirm</button></form> <form method="POST" action="?/status" class="contents">`);
		if (data.gig.status === "cancelled") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input type="hidden" name="status" value="confirmed"/> <button type="submit" class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Uncancel</button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input type="hidden" name="status" value="cancelled"/> <button type="submit" class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500">Cancel</button>`);
		}
		$$renderer.push(`<!--]--></form></div> `);
		if (data.gig.status === "pending") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-6 border-t border-zinc-800 pt-4"><p class="mb-2 text-sm text-zinc-400">Cast your vote:</p> <div class="flex gap-2"><button type="button" class="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-500">Approve</button> <button type="button" class="rounded bg-zinc-600 px-3 py-1 text-xs text-white hover:bg-zinc-500">Abstain</button> <button type="button" class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500">Reject</button></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-6 border-t border-zinc-800 pt-4">`);
		if (data.allMarkedOff) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<form method="POST" action="?/undoAllUnavailable" class="contents"><button type="submit" class="rounded-lg border border-green-700 px-4 py-2 text-sm text-green-400 hover:bg-green-900/20">Undo: Remove auto-unavailability for all members on this date</button></form> <p class="mt-1 text-xs text-zinc-600">All members are currently marked unavailable for ${escape_html(data.gig.date)} (from this gig).</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<form method="POST" action="?/markAllUnavailable" class="contents"><button type="submit" class="rounded-lg border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">Mark all members unavailable for this gig date</button></form> <p class="mt-1 text-xs text-zinc-600">This blocks ${escape_html(data.gig.date)} on everyone's calendar — prevents double-booking.</p>`);
		}
		$$renderer.push(`<!--]--></div> <h3 class="mb-3 text-sm font-medium text-zinc-400">Member Votes`);
		if (distances.length) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`&amp; Distances`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></h3> <div class="space-y-2"><!--[-->`);
		const each_array_1 = ensure_array_like(data.members);
		for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
			let member = each_array_1[i];
			const vote = data.memberVotes.get(member.id);
			const dist = distances[i];
			$$renderer.push(`<div class="flex items-center gap-2 rounded-lg border border-zinc-800 p-2 text-sm"><span class="w-24 shrink-0 text-zinc-300">${escape_html(member.name)}</span> `);
			if (vote) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span${attr_class(`rounded-full px-2 py-0.5 text-xs ${vote.vote === "approve" ? "bg-green-500/20 text-green-400" : ""} ${vote.vote === "reject" ? "bg-red-500/20 text-red-400" : ""} ${vote.vote === "abstain" ? "bg-zinc-500/20 text-zinc-400" : ""} `)}>${escape_html(vote.vote)}</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="text-xs text-zinc-600">No vote</span>`);
			}
			$$renderer.push(`<!--]--> `);
			if (dist?.miles != null) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="ml-auto text-xs text-zinc-400">${escape_html(dist.miles)} mi · ~${escape_html(dist.minutes)} min</span>`);
			} else if (member.address) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<span class="ml-auto text-xs text-zinc-500">${escape_html(member.address)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-CUWq3Zyo.js.map
