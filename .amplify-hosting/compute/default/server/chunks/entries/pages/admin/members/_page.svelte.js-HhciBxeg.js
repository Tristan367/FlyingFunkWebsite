import { Z as attr_class, W as escape_html, _ as ensure_array_like, V as attr } from '../../../../chunks/server.js-D7jMOqOz.js';
import { i as instrumentEmoji } from '../../../../chunks/instruments.js-DnP6CFo9.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/members/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		function votesFor(memberId) {
			const v = data.voteCounts.find((vc) => vc.targetId === memberId);
			return v ? {
				count: v.count,
				proposerId: v.proposerId
			} : void 0;
		}
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Band Members</h1> `);
		if (form?.addSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Member added!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.removeSuccess || form?.removeError) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p${attr_class(`mb-6 rounded-lg border ${form?.removeError ? "border-red-700 bg-red-900/20 text-red-400" : "border-green-700 bg-green-900/20 text-green-400"} p-3 text-sm`)}>${escape_html(form?.removeError || "Vote recorded! If threshold is met, the member will be removed.")}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<button class="mb-8 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Add Member</button>`);
		$$renderer.push(`<!--]--> <div class="space-y-2"><!--[-->`);
		const each_array = ensure_array_like(data.members);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let member = each_array[$$index];
			const vt = votesFor(member.id);
			$$renderer.push(`<div class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3"><div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-amber-500/20 text-sm font-bold shrink-0">`);
			if (member.profilePic) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", member.profilePic)}${attr("alt", member.name)} class="h-full w-full object-cover"/>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(member.name[0])}`);
			}
			$$renderer.push(`<!--]--></div> <div class="min-w-0 flex-1"><p class="font-medium truncate">${escape_html(member.name)}</p> <p class="text-xs text-zinc-400 truncate">${escape_html(member.instrument)} ${escape_html(instrumentEmoji(member.instrument))}`);
			if (member.phone) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`· ${escape_html(member.phone)}`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></p></div> `);
			if (vt) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 shrink-0"><span class="text-xs text-zinc-400">${escape_html(vt.count)} vote${escape_html(vt.count !== 1 ? "s" : "")}</span> <form method="POST" action="?/undoRemoveVote" class="contents"><input type="hidden" name="targetId"${attr("value", member.id)}/> <button type="submit" class="text-xs text-zinc-400 hover:text-amber-400 transition-colors">Undo</button></form></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button type="button" class="text-xs text-red-400 hover:underline shrink-0">Remove</button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-HhciBxeg.js.map
