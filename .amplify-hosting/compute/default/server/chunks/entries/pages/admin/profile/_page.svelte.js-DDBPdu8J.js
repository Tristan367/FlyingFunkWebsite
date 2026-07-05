import { V as attr, W as escape_html } from '../../../../chunks/server.js-D7jMOqOz.js';
import { R as RichTextEditor } from '../../../../chunks/RichTextEditor.js-BU33-sq-.js';
import { M as MapPicker } from '../../../../chunks/MapPicker.js-Bmcki-Et.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '@tiptap/starter-kit';
import '@tiptap/extensions';
import '@tiptap/extension-image';
import '@tiptap/extension-underline';
import '@tiptap/extension-link';
import '@tiptap/extension-text-style';
import '@tiptap/extension-color';
import '@tiptap/extension-highlight';
import '@tiptap/extension-text-align';

//#region src/routes/admin/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let name = data.member.name;
		let instrument = data.member.instrument;
		let instruments = data.member.instruments || data.member.instrument;
		let address = data.member.address;
		let slug = data.member.slug;
		let bio = data.member.bio;
		let profilePic = data.member.profilePic;
		let uploading = false;
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Your Profile</h1> `);
		if (form?.success) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Profile saved!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-6 flex justify-end"><button type="submit" form="profile-form" class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20">Save Profile</button></div> <form method="POST" action="?/save" class="space-y-6" id="profile-form"><div><label class="mb-1 block text-sm text-zinc-400">Profile Picture</label> <div class="flex items-center gap-4">`);
		if (profilePic) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", profilePic)} alt="Profile" class="h-20 w-20 rounded-full border-2 border-zinc-700 object-cover"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 text-zinc-600"><span class="text-2xl">${escape_html(name[0] || "?")}</span></div>`);
		}
		$$renderer.push(`<!--]--> <div><label class="relative inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-amber-500 hover:text-amber-400">${escape_html("Upload Photo")} <input type="file" accept="image/*" class="hidden"${attr("disabled", uploading, true)}/></label> <p class="mt-1 text-xs text-zinc-600">Square photos work best. Max 5MB.</p></div></div> <input type="hidden" name="profilePic"${attr("value", profilePic)}/></div> <div class="grid gap-4 sm:grid-cols-2"><div><label for="name" class="mb-1 block text-sm text-zinc-400">Name</label> <input type="text" id="name" name="name"${attr("value", name)} required="" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="instrument" class="mb-1 block text-sm text-zinc-400">Primary Instrument</label> <input type="text" id="instrument" name="instrument"${attr("value", instrument)} class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div></div> <div><label for="instruments" class="mb-1 block text-sm text-zinc-400">All Instruments You Play</label> <input type="text" id="instruments" name="instruments"${attr("value", instruments)} placeholder="guitar, bass" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"/> <p class="mt-1 text-xs text-zinc-600">Comma-separated list of every instrument you can play. Used to determine if the band has enough coverage for a gig.</p></div> <div><label class="mb-1 block text-sm text-zinc-400">Your Location</label> `);
		MapPicker($$renderer, {
			address,
			onSelect: (_lat, _lng, addr) => {
				address = addr;
			}
		});
		$$renderer.push(`<!----> <input type="hidden" name="address"${attr("value", address)}/> <p class="mt-1 text-xs text-zinc-600">Search for your city or neighborhood. Used to calculate how far you are from gigs.</p></div> <div><label for="slug" class="mb-1 block text-sm text-zinc-400">Profile Page Address</label> <div class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3"><span class="text-sm text-zinc-600">flyingfunk.com/</span> <input type="text" id="slug" name="slug"${attr("value", slug)} placeholder="your-name" class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"/></div> <p class="mt-1 text-xs text-zinc-600">This becomes the web address for your profile. Use your first name. Leave blank to be unlisted.</p></div> <div><label class="mb-1 block text-sm text-zinc-400">Bio</label> `);
		RichTextEditor($$renderer, {
			content: bio,
			onUpdate: (html) => bio = html,
			placeholder: "Tell your story..."
		});
		$$renderer.push(`<!----> <input type="hidden" name="bio"${attr("value", bio)}/></div></form>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DDBPdu8J.js.map
