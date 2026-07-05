<script lang="ts">
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import ImageManager from '$lib/components/ImageManager.svelte';
	import { resolveImages } from '$lib/utils/images';

	let { data, form } = $props();

	let title = $state(data.post.title);
	let slug = $state(data.post.slug);
	let content = $state(data.post.content);
	let publish = $state(data.post.publishedAt !== '');
	let activeImages = $state<Array<{ id: string; filename: string; path: string }>>([]);
	let showDelete = $state(false);

	let resolvedPreview = $derived(resolveImages(content, activeImages));



</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Post</h1>

{#if form?.saveSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">
		Post saved!
	</p>
{/if}

<div class="mb-6 flex gap-3">
	<a href="/blog/{data.post.slug}" target="_blank" class="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:border-zinc-500">
		View Post &nearr;
	</a>
	<a href="/admin/blog" class="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:border-zinc-500">
		&larr; All Posts
	</a>
</div>

<form method="POST" action="?/save" class="space-y-4" onkeydown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); }}>
	<div>
		<label for="title" class="mb-1 block text-sm text-zinc-400">Title</label>
		<input
			type="text"
			id="title"
			name="title"
			required
			bind:value={title}
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"
		/>
	</div>
	<div>
		<label for="slug" class="mb-1 block text-sm text-zinc-400">Page Address</label>
		<div class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
			<span class="text-sm text-zinc-600">flyingfunk.com/blog/</span>
			<input type="text" id="slug" name="slug" bind:value={slug} required
				class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-400 focus:outline-none" />
		</div>
</div>

<div class="mb-6 rounded-lg border border-amber-700/30 bg-amber-500/5 p-3 text-xs text-zinc-400">
	<strong class="text-amber-400">Security note:</strong> Blog posts are raw HTML that anyone can inspect with browser dev tools. Don't include passwords, database credentials, or any sensitive information in here — even if it's not visible on the page, it's still viewable in the source.
</div>

<div>
		<label for="content" class="mb-1 block text-sm text-zinc-400">Content</label>
		<ImageManager scope={'blog-' + data.post.id} onImagesChanged={(imgs) => activeImages = imgs} />

		<div class="mt-4">
		<RichTextEditor {content} onUpdate={(html: string) => content = html} galleryImages={activeImages} placeholder="Write your post..." />
		<input type="hidden" name="content" value={content} />
		</div>
	</div>

	<div class="flex items-center gap-2">
		<input type="checkbox" id="published" name="published" bind:checked={publish} class="accent-amber-500" />
		<label for="published" class="text-sm text-zinc-400">
			Published
			{#if data.post.publishedAt}
				<span class="text-zinc-600">(since {data.post.publishedAt})</span>
			{/if}
		</label>
	</div>

	{#if form?.saveError}
		<p class="text-sm text-red-400">{form.saveError}</p>
	{/if}

	<div class="flex gap-3">
		<button
			type="submit"
			class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
		>
			Save
		</button>
		{#if data.post.publishedAt}
			<button
				type="submit"
				formaction="?/unpublish"
				class="rounded-lg border border-zinc-700 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-red-500 hover:text-red-400"
			>
				Unpublish
			</button>
		{/if}
	</div>

	<div class="mt-6 border-t border-zinc-800 pt-4">
		<button type="button" onclick={() => showDelete = true}
			class="rounded border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">Delete Post</button>
	</div>
</form>

{#if content}
	<div class="mt-8 overflow-hidden border-y border-zinc-700" style="width:100vw;position:relative;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw">
		<!-- Preview label -->
		<div class="border-b border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs text-zinc-500">
			<span class="text-amber-400 font-bold">Preview</span>
			<span class="ml-2">flyingfunk.com/blog/{data.post.slug}</span>
		</div>
		<!-- Navbar -->
		<div class="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4">
			<div class="mx-auto flex max-w-6xl items-center justify-between">
				<span class="font-display text-xl tracking-tight text-amber-400">FLYING FUNK</span>
				<!-- Desktop nav -->
				<div class="hidden gap-6 text-sm font-semibold text-zinc-400 sm:flex">
					<span>Home</span><span>Book Us</span><span>Blog</span><span>Music</span><span>Login</span>
				</div>
				<!-- Mobile hamburger -->
				<span class="text-xl text-zinc-400 sm:hidden">☰</span>
			</div>
		</div>
		<div class="bg-zinc-950 pb-8 pt-4">
			<div class="prose prose-invert prose-amber max-w-none">{@html resolvedPreview}</div>
		</div>
	</div>
{/if}

{#if showDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" onclick={() => showDelete = false}>
		<div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<h3 class="mb-2 text-lg font-bold text-red-400">Delete Post?</h3>
			<p class="mb-4 text-sm text-zinc-400">This permanently deletes the blog post and its images.</p>
			<div class="flex gap-3">
				<form method="POST" action="/admin/blog?/delete" class="contents">
					<input type="hidden" name="id" value={data.post.id} />
					<button type="submit" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-500">Delete</button>
				</form>
				<button type="button" onclick={() => showDelete = false}
					class="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-500">Cancel</button>
			</div>
		</div>
	</div>
{/if}
