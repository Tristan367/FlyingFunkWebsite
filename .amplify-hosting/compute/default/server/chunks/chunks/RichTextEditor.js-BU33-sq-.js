import { W as escape_html, Z as attr_class, V as attr, _ as ensure_array_like, a2 as attr_style, $ as stringify } from './server.js-D7jMOqOz.js';
import '@tiptap/starter-kit';
import '@tiptap/extensions';
import '@tiptap/extension-image';
import '@tiptap/extension-underline';
import '@tiptap/extension-link';
import '@tiptap/extension-text-style';
import '@tiptap/extension-color';
import '@tiptap/extension-highlight';
import '@tiptap/extension-text-align';

//#region src/lib/components/RichTextEditor.svelte
function RichTextEditor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content = "", placeholder = "Write something...", onUpdate, galleryImages = [] } = $$props;
		let linkUrl = "";
		const colors = [
			"#ef4444",
			"#f97316",
			"#eab308",
			"#22c55e",
			"#3b82f6",
			"#a855f7",
			"#ec4899"
		];
		const highlights = [
			"#ef444440",
			"#f9731640",
			"#eab30840",
			"#22c55e40",
			"#3b82f640",
			"#a855f740"
		];
		$$renderer.push(`<div class="rounded-lg border border-zinc-700 bg-zinc-900"><div class="flex items-center border-b border-zinc-700 px-3 py-1"><span class="text-xs text-zinc-400">${escape_html("Rich Text")}</span> <div class="ml-auto flex items-center gap-1"><button type="button"${attr_class(`rounded px-2 py-1 text-xs bg-zinc-700 text-zinc-200`)}>Rich</button> <button type="button"${attr_class(`rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-300`)}>HTML</button></div></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap items-center gap-0.5 border-b border-zinc-700 px-2 py-1.5"><button type="button"${attr_class(`rounded px-2 py-1 text-sm font-bold ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Bold"><b>B</b></button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm italic font-serif ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Italic"><i>I</i></button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm underline ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Underline"><u>U</u></button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm line-through ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Strikethrough"><s>S</s></button> <span class="mx-0.5 text-zinc-700">|</span> <button type="button"${attr_class(`rounded px-2 py-1 text-sm font-bold ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Heading 1">H1</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm font-bold ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Heading 2">H2</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm font-bold ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Heading 3">H3</button> <span class="mx-0.5 text-zinc-700">|</span> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Align Left">←</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Align Center">↔</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Align Right">→</button> <span class="mx-0.5 text-zinc-700">|</span> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Bullet List">•</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Numbered List">1.</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Quote">“</button> <button type="button"${attr_class(`rounded px-2 py-1 text-sm ${"text-zinc-400 hover:bg-zinc-800"}`)} title="Code Block">&lt;/></button> <button type="button" class="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Horizontal Rule">—</button> <span class="mx-0.5 text-zinc-700">|</span> `);
			{
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex items-center gap-0.5"><button type="button" class="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Add Link">🔗</button> <input type="text" placeholder="https://..."${attr("value", linkUrl)} class="w-24 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"/></div>`);
			}
			$$renderer.push(`<!--]--> <span class="mx-0.5 text-zinc-700">|</span> <!--[-->`);
			const each_array = ensure_array_like(colors);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let c = each_array[$$index];
				$$renderer.push(`<button type="button" class="h-5 w-5 rounded-full border border-zinc-600"${attr_style(`background:${stringify(c)}`)} title="Text color"></button>`);
			}
			$$renderer.push(`<!--]--> <button type="button" class="rounded px-1 text-sm text-zinc-400 hover:text-zinc-300" title="Remove color">×</button> <span class="mx-0.5 text-zinc-700">|</span> <!--[-->`);
			const each_array_1 = ensure_array_like(highlights);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let h = each_array_1[i];
				$$renderer.push(`<button type="button" class="h-5 w-5 rounded border border-zinc-600"${attr_style(`background:${stringify(h)}`)} title="Highlight"></button>`);
			}
			$$renderer.push(`<!--]--> <button type="button" class="rounded px-1 text-sm text-zinc-400 hover:text-zinc-300" title="Remove highlight">×</button> <span class="mx-0.5 text-zinc-700">|</span> <label class="relative inline-flex cursor-pointer items-center rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Insert Image">${escape_html("Img")} <input type="file" accept="image/*" class="absolute inset-0 opacity-0"/></label> <label class="relative inline-flex cursor-pointer items-center rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Attach File">${escape_html("File")} <input type="file" class="absolute inset-0 opacity-0"/></label></div>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}

export { RichTextEditor as R };
//# sourceMappingURL=RichTextEditor.js-BU33-sq-.js.map
