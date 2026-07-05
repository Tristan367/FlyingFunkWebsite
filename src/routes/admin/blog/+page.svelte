<script lang="ts">
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import ImageManager from '$lib/components/ImageManager.svelte';
	import { resolveImages } from '$lib/utils/images';

	let { data, form } = $props();

	let editing = $state(false);
	let title = $state('');
	let slug = $state('');
	let slugManual = $state(false);
	let content = $state('');
	let publish = $state(false);
	let uploading = $state(false);
	let activeImages = $state<Array<{ id: string; filename: string; path: string }>>([]);

	let resolvedPreview = $derived(resolveImages(content, activeImages));

	let copied = $state(false);

	async function copyTemplate() {
		await navigator.clipboard.writeText(blogTemplate);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}

	const blogTemplate = `<div class="mx-auto max-w-3xl">

<h2>Your Catchy Title Here</h2>

<p>Start with an engaging opening paragraph that hooks the reader.
What's this post about?</p>

<img src="./images/your-image.jpg" alt="Description" style="max-width:100%;border-radius:8px" />

<blockquote>
  <p>A memorable quote from your bandmate.</p>
</blockquote>

<h3>Section Heading</h3>

<p>Dive deeper. Tell a story about a gig, rehearsal, or gear you love.</p>

<ul>
  <li><strong>Bullet points</strong> for lists</li>
  <li>Like your top 5 albums or favorite venues</li>
</ul>

<hr />

<p><em>Thanks for reading! Come see us at our next show.</em></p>

</div>`;

	function startNew() {
		editing = true;
		title = '';
		slug = '';
		slugManual = false;
		content = '';
		publish = false;
	}

	function generateSlug() {
		if (slugManual) return;
		if (title) {
			slug = title
				.toLowerCase()
				.replace(/'/g, '')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
		} else {
			slug = '';
		}
	}

	async function uploadImage(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		const form = new FormData();
		form.append('file', file);

		try {
			const res = await fetch('/api/upload', { method: 'POST', body: form });
			const data = await res.json();
			if (data.url) {
				content += `\n<img src="${data.url}" alt="${file.name}" />\n`;
			} else {
				alert(data.error || 'Upload failed');
			}
		} catch {
			alert('Upload failed');
		}
		uploading = false;
		input.value = '';
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Blog Posts</h1>

{#if form?.createSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">
		Post created successfully!
	</p>
{/if}
{#if form?.archiveSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">
		Post archived.
	</p>
{/if}

{#if !editing}
	<div class="mb-8">
		<button
			onclick={startNew}
			class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
		>
			New Post
		</button>
	</div>

	<!-- HTML Template -->
	<details class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900">
		<summary class="flex cursor-pointer items-center justify-between p-4">
			<span class="text-sm font-medium text-zinc-400">Blog post HTML template</span>
			<button type="button" onclick={(e) => { e.preventDefault(); copyTemplate(); }}
				class="rounded bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200">
				{copied ? 'Copied!' : 'Copy'}
			</button>
		</summary>
		<pre class="max-h-64 overflow-auto bg-zinc-950 px-4 pb-4 text-xs text-zinc-400"><code>{blogTemplate}</code></pre>
		<p class="px-4 pb-4 text-xs text-zinc-600">Copy this template, fill it in with your content, then paste the result into the blog editor.</p>
	</details>

	{@const drafts = data.posts.filter((p: any) => !p.publishedAt)}
	{@const published = data.posts.filter((p: any) => p.publishedAt)}

	{#if drafts.length > 0}
		<h2 class="mb-3 text-sm font-medium text-yellow-400">Drafts</h2>
		<div class="mb-6 space-y-2">
			{#each drafts as post}
				<div class="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
					<div class="min-w-0 flex-1">
						<a href={'/blog/' + post.slug} target="_blank" class="font-medium text-amber-400 hover:underline">
							{post.title || '(Untitled)'}
						</a>
						<p class="text-xs text-zinc-400">
							{post.authorName} &middot;
							{post.publishedAt
								? 'Published ' + post.publishedAt
								: 'Draft'}
						</p>
					</div>
					<div class="flex items-center gap-2 shrink-0 ml-3">
						<a href={'/admin/blog/' + post.id} class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500">Edit</a>
					</div>
				</div>
			{/each}
		</div>
		<hr class="mb-6 border-zinc-800" />
	{/if}

	<h2 class="mb-3 text-sm font-medium text-green-400">Published</h2>
	<div class="space-y-2">
		{#each published as post}
			<div class="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
				<div class="min-w-0 flex-1">
					<a href={'/blog/' + post.slug} target="_blank" class="font-medium text-amber-400 hover:underline">
						{post.title || '(Untitled)'}
					</a>
					<p class="text-xs text-zinc-400">
						{post.authorName} &middot;
						{post.publishedAt
							? 'Published ' + post.publishedAt
							: 'Draft'}
					</p>
				</div>
				<div class="flex items-center gap-2 shrink-0 ml-3">
					<a href={'/admin/blog/' + post.id} class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500">Edit</a>
				</div>
			</div>
		{/each}

		{#if published.length === 0 && drafts.length === 0}
			<p class="text-zinc-500">No posts yet. Create your first one!</p>
		{/if}
	</div>

	<!-- Archived Posts -->
	{#if data.archivedPosts.length > 0}
		<div class="mt-10">
			<h2 class="mb-3 text-sm font-medium text-zinc-500">Archived Posts</h2>
			<div class="space-y-2">
				{#each data.archivedPosts as post}
					<div class="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-3">
						<div class="min-w-0 flex-1">
							<span class="text-sm text-zinc-500">{post.title || '(Untitled)'}</span>
							<span class="ml-2 text-xs text-zinc-600">{post.authorName}</span>
						</div>
						<form method="POST" action="?/unarchive">
							<input type="hidden" name="id" value={post.id} />
							<button type="submit" class="text-xs text-amber-400 hover:underline">Restore</button>
						</form>
					</div>
				{/each}
			</div>
		</div>
	{/if}
{:else}
	<form method="POST" action="?/create" class="space-y-4" onkeydown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); }}>
		<div>
			<label for="title" class="mb-1 block text-sm text-zinc-400">Title</label>
			<input
				type="text"
				id="title"
				name="title"
				required
				bind:value={title}
				oninput={generateSlug}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="slug" class="mb-1 block text-sm text-zinc-400">Page Address</label>
			<div class="flex items-center gap-0 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
				<span class="text-sm text-zinc-600">flyingfunk.com/blog/</span>
				<input type="text" id="slug" name="slug" bind:value={slug} oninput={() => slugManual = true}
					class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-400 focus:outline-none" />
			</div>
			<p class="mt-1 text-xs text-zinc-600">This becomes the web address for your blog post. Update the title to regenerate it, or type your own.</p>
		</div>

		<div>
			<label for="content" class="mb-1 block text-sm text-zinc-400">Content</label>
			<ImageManager scope="blog-new" onImagesChanged={(imgs) => activeImages = imgs} />

		<div class="mt-4">
		<RichTextEditor {content} onUpdate={(html: string) => content = html} galleryImages={activeImages} placeholder="Write your post..." />
		<input type="hidden" name="content" value={content} />
		</div>
	</div>

		<div class="flex items-center gap-2">
			<input type="checkbox" id="published" name="published" bind:checked={publish} class="accent-amber-500" />
			<label for="published" class="text-sm text-zinc-400">Publish immediately</label>
		</div>

		{#if form?.createError}
			<p class="text-sm text-red-400">{form.createError}</p>
		{/if}

		<div class="flex gap-3">
			<button
				type="submit"
				class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
			>
				Save Post
			</button>
			<button
				type="button"
				onclick={() => (editing = false)}
				class="rounded-lg border border-zinc-700 px-6 py-3 text-sm transition-colors hover:border-zinc-500"
			>
				Cancel
			</button>
		</div>
	</form>

	{#if content}
	<div class="mt-8 overflow-hidden border-y border-zinc-700" style="width:100vw;position:relative;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw">
		<div class="border-b border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs text-zinc-500">
			<div class="flex items-center justify-between">
				<span class="text-amber-400 font-bold">Preview</span>
				<span>{slug ? 'flyingfunk.com/blog/' + slug : 'flyingfunk.com/blog/...'}</span>
			</div>
		</div>
		<div class="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4">
			<div class="mx-auto flex max-w-6xl items-center justify-between">
				<span class="font-display text-xl tracking-tight text-amber-400">FLYING FUNK</span>
				<div class="hidden gap-6 text-sm font-semibold text-zinc-400 sm:flex">
					<span>Home</span><span>Book Us</span><span>Blog</span><span>Music</span><span>Login</span>
				</div>
				<span class="text-xl text-zinc-400 sm:hidden">☰</span>
			</div>
		</div>
		<div class="bg-zinc-950 pb-8">
			<div class="prose prose-invert prose-amber max-w-none">{@html resolvedPreview}</div>
		</div>
	</div>
	{/if}
{/if}
