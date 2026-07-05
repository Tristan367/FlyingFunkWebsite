import { V as attr } from '../../../../chunks/server.js-D7jMOqOz.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/admin/notifications/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let notifyGigs = data.member.emailNotifyGigs;
		let notifyBlog = data.member.emailNotifyBlog;
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Notification Settings</h1> `);
		if (form?.success) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Saved!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <p class="mb-6 text-sm text-zinc-400">Choose which events you want to be notified about via email.</p> <form method="POST" action="?/save" class="space-y-4"><div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><h2 class="mb-3 text-sm font-medium text-zinc-400">Email Notifications</h2> <label class="mb-3 flex items-center gap-3 cursor-pointer"><input type="checkbox" name="notifyGigs"${attr("checked", notifyGigs, true)} class="accent-amber-500 h-5 w-5"/> <div><span class="text-zinc-300">New gig requests</span> <p class="text-xs text-zinc-400">When someone submits a booking request, you'll get an email with a link to view it.</p></div></label> <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="notifyBlog"${attr("checked", notifyBlog, true)} class="accent-amber-500 h-5 w-5"/> <div><span class="text-zinc-300">New blog posts &amp; song uploads</span> <p class="text-xs text-zinc-400">When a band member publishes a new blog post or uploads a song, you'll get an email with a link.</p></div></label></div> <button type="submit" class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400">Save Settings</button></form>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-mdtKVDRy.js.map
