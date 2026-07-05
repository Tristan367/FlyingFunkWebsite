<script lang="ts">
	import { untrack } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import { Placeholder } from '@tiptap/extensions';
	import Image from '@tiptap/extension-image';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import { TextStyle } from '@tiptap/extension-text-style';
	import { Color } from '@tiptap/extension-color';
	import { Highlight } from '@tiptap/extension-highlight';
	import { TextAlign } from '@tiptap/extension-text-align';

	interface Props {
		content?: string;
		placeholder?: string;
		onUpdate?: (html: string) => void;
		galleryImages?: Array<{ filename: string; path: string }>;
	}

	let { content = '', placeholder = 'Write something...', onUpdate, galleryImages = [] }: Props = $props();

	let editorElement: HTMLDivElement | null = $state(null);
	let editorInstance: Editor | null = null;
	let mode = $state<'rich' | 'html'>('rich');
	let htmlValue = $state(content);
	let internalUpdate = false;
	let linkUrl = $state('');
	let fileUploading = $state(false);

	async function insertImage(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		fileUploading = true;
		const form = new FormData();
		form.append('file', file);
		try {
			const res = await fetch('/api/upload', { method: 'POST', body: form });
			const data = await res.json();
			if (data.url) {
				editorInstance?.chain().focus().setImage({ src: data.url }).run();
			}
		} catch {}
		fileUploading = false;
		input.value = '';
	}

	function onRichUpdate(html: string) {
		internalUpdate = true;
		htmlValue = html;
		if (onUpdate) onUpdate(html);
	}

	$effect(() => {
		const el = editorElement;
		if (!el || mode !== 'rich') return;
		editorInstance?.destroy();
		const initial = untrack(() => htmlValue);
		const ed = new Editor({
			element: el,
			extensions: [
				StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: { HTMLAttributes: { class: 'bg-zinc-950 rounded-lg p-3 text-sm' } } }),
				Placeholder.configure({ placeholder }),
				Image.configure({ allowBase64: false, HTMLAttributes: { class: 'rounded-lg max-w-full' } }),
				Underline, Link.configure({ openOnClick: false }), TextStyle, Color,
				Highlight.configure({ multicolor: true }), TextAlign.configure({ types: ['heading', 'paragraph'] })
			],
			content: initial,
			editorProps: { attributes: { class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3' } }
		});
		ed.on('update', () => onRichUpdate(ed.getHTML()));
		editorInstance = ed;
		return () => { editorInstance = null; ed.destroy(); };
	});

	$effect(() => {
		const _ = htmlValue;
		if (internalUpdate) { internalUpdate = false; return; }
		if (!editorInstance || mode !== 'rich') return;
		const current = untrack(() => editorInstance?.getHTML() ?? '');
		if (current !== htmlValue) editorInstance.commands.setContent(htmlValue);
	});

	function switchMode(m: 'rich' | 'html') { mode = m; }
	function isActive(name: string | Record<string, unknown>, a?: Record<string, unknown>) {
		return (
			(typeof name === 'string'
				? editorInstance?.isActive(name, a)
				: editorInstance?.isActive(name)) ?? false
		);
	}
	function toggleBold() { editorInstance?.chain().toggleBold().run(); }
	function toggleItalic() { editorInstance?.chain().toggleItalic().run(); }
	function toggleUnderline() { editorInstance?.chain().toggleUnderline().run(); }
	function toggleStrike() { editorInstance?.chain().toggleStrike().run(); }
	function toggleHeading(l: 1 | 2 | 3) { editorInstance?.chain().toggleHeading({ level: l }).run(); }
	function toggleBulletList() { editorInstance?.chain().toggleBulletList().run(); }
	function toggleOrderedList() { editorInstance?.chain().toggleOrderedList().run(); }
	function toggleBlockquote() { editorInstance?.chain().toggleBlockquote().run(); }
	function toggleCodeBlock() { editorInstance?.chain().toggleCodeBlock().run(); }
	function setHorizontalRule() { editorInstance?.chain().setHorizontalRule().run(); }
	function alignLeft() { editorInstance?.chain().setTextAlign('left').run(); }
	function alignCenter() { editorInstance?.chain().setTextAlign('center').run(); }
	function alignRight() { editorInstance?.chain().setTextAlign('right').run(); }

	function setLink() {
		if (!linkUrl) return;
		editorInstance?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
		linkUrl = '';
	}
	function unsetLink() { editorInstance?.chain().focus().extendMarkRange('link').unsetLink().run(); }
	function setColor(color: string) { editorInstance?.chain().focus().setColor(color).run(); }
	function unsetColor() { editorInstance?.chain().focus().unsetColor().run(); }
	function setHighlight(color: string) { editorInstance?.chain().focus().setHighlight({ color }).run(); }
	function unsetHighlight() { editorInstance?.chain().focus().unsetHighlight().run(); }

	async function insertFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		fileUploading = true;
		const form = new FormData(); form.append('file', file);
		try {
			const res = await fetch('/api/upload', { method: 'POST', body: form });
			const data = await res.json();
			if (data.url) {
				const link = `<a href="${data.url}" download="${file.name}" class="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-sm text-amber-400 hover:underline">&#128206; ${file.name}</a>`;
				editorInstance?.chain().focus().insertContent(link + ' ').run();
			}
		} catch {}
		fileUploading = false;
		input.value = '';
	}

	const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899'];
	const highlights = ['#ef444440','#f9731640','#eab30840','#22c55e40','#3b82f640','#a855f740'];
</script>

<div class="rounded-lg border border-zinc-700 bg-zinc-900">
	<div class="flex items-center border-b border-zinc-700 px-3 py-1">
		<span class="text-xs text-zinc-400">{mode === 'rich' ? 'Rich Text' : 'HTML'}</span>
		<div class="ml-auto flex items-center gap-1">
			<button type="button" onclick={() => switchMode('rich')} class="rounded px-2 py-1 text-xs {mode === 'rich' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-400 hover:text-zinc-300'}">Rich</button>
			<button type="button" onclick={() => switchMode('html')} class="rounded px-2 py-1 text-xs {mode === 'html' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-400 hover:text-zinc-300'}">HTML</button>
		</div>
	</div>

	{#if mode === 'rich'}
	<div class="flex flex-wrap items-center gap-0.5 border-b border-zinc-700 px-2 py-1.5">
		<button type="button" onclick={toggleBold} class="rounded px-2 py-1 text-sm font-bold {isActive('bold') ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Bold"><b>B</b></button>
		<button type="button" onclick={toggleItalic} class="rounded px-2 py-1 text-sm italic font-serif {isActive('italic') ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Italic"><i>I</i></button>
		<button type="button" onclick={toggleUnderline} class="rounded px-2 py-1 text-sm underline {isActive('underline') ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Underline"><u>U</u></button>
		<button type="button" onclick={toggleStrike} class="rounded px-2 py-1 text-sm line-through {isActive('strike') ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Strikethrough"><s>S</s></button>
		<span class="mx-0.5 text-zinc-700">|</span>
		<button type="button" onclick={() => toggleHeading(1)} class="rounded px-2 py-1 text-sm font-bold {isActive('heading',{level:1}) ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Heading 1">H1</button>
		<button type="button" onclick={() => toggleHeading(2)} class="rounded px-2 py-1 text-sm font-bold {isActive('heading',{level:2}) ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Heading 2">H2</button>
		<button type="button" onclick={() => toggleHeading(3)} class="rounded px-2 py-1 text-sm font-bold {isActive('heading',{level:3}) ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'}" title="Heading 3">H3</button>
		<span class="mx-0.5 text-zinc-700">|</span>
		<button type="button" onclick={alignLeft} class="rounded px-2 py-1 text-sm {isActive({textAlign:'left'})?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Align Left">&larr;</button>
		<button type="button" onclick={alignCenter} class="rounded px-2 py-1 text-sm {isActive({textAlign:'center'})?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Align Center">&harr;</button>
		<button type="button" onclick={alignRight} class="rounded px-2 py-1 text-sm {isActive({textAlign:'right'})?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Align Right">&rarr;</button>
		<span class="mx-0.5 text-zinc-700">|</span>
		<button type="button" onclick={toggleBulletList} class="rounded px-2 py-1 text-sm {isActive('bulletList')?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Bullet List">&bull;</button>
		<button type="button" onclick={toggleOrderedList} class="rounded px-2 py-1 text-sm {isActive('orderedList')?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Numbered List">1.</button>
		<button type="button" onclick={toggleBlockquote} class="rounded px-2 py-1 text-sm {isActive('blockquote')?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Quote">&ldquo;</button>
		<button type="button" onclick={toggleCodeBlock} class="rounded px-2 py-1 text-sm {isActive('codeBlock')?'bg-amber-500/20 text-amber-400':'text-zinc-400 hover:bg-zinc-800'}" title="Code Block">&lt;/&gt;</button>
		<button type="button" onclick={setHorizontalRule} class="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Horizontal Rule">&mdash;</button>
		<span class="mx-0.5 text-zinc-700">|</span>
		{#if isActive('link')}
		<button type="button" onclick={unsetLink} class="rounded px-2 py-1 text-sm bg-amber-500/20 text-amber-400" title="Remove Link">&#x1f517;</button>
		{:else}
		<div class="flex items-center gap-0.5">
			<button type="button" onclick={setLink} class="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Add Link">&#x1f517;</button>
			<input type="text" placeholder="https://..." bind:value={linkUrl} class="w-24 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none" />
		</div>
		{/if}
		<span class="mx-0.5 text-zinc-700">|</span>
		{#each colors as c}<button type="button" onclick={() => setColor(c)} class="h-5 w-5 rounded-full border border-zinc-600" style="background:{c}" title="Text color"></button>{/each}
		<button type="button" onclick={unsetColor} class="rounded px-1 text-sm text-zinc-400 hover:text-zinc-300" title="Remove color">&times;</button>
		<span class="mx-0.5 text-zinc-700">|</span>
		{#each highlights as h, i}<button type="button" onclick={() => setHighlight(colors[i])} class="h-5 w-5 rounded border border-zinc-600" style="background:{h}" title="Highlight"></button>{/each}
		<button type="button" onclick={unsetHighlight} class="rounded px-1 text-sm text-zinc-400 hover:text-zinc-300" title="Remove highlight">&times;</button>
		<span class="mx-0.5 text-zinc-700">|</span>
		<label class="relative inline-flex cursor-pointer items-center rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Insert Image">
			{fileUploading ? '...' : 'Img'}
			<input type="file" accept="image/*" class="absolute inset-0 opacity-0" onchange={insertImage} />
		</label>
		<label class="relative inline-flex cursor-pointer items-center rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800" title="Attach File">
			{fileUploading ? '...' : 'File'}
			<input type="file" class="absolute inset-0 opacity-0" onchange={insertFile} />
		</label>
	</div>
	{/if}

	{#if mode === 'rich'}
	<div bind:this={editorElement}></div>
	{:else}
	<textarea bind:value={htmlValue} oninput={() => { if (onUpdate) onUpdate(htmlValue); }} rows="14"
		class="w-full bg-zinc-900 px-4 py-3 font-mono text-xs text-zinc-200 focus:outline-none"
		style="white-space: pre-wrap; word-break: break-word;"></textarea>
	{/if}
</div>
