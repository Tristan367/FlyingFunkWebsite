<script lang="ts">
	import { executeScripts } from '$lib/actions/scripts';
	import { browser } from '$app/environment';

	let { data } = $props();

	$effect(() => {
		if (!browser) return;
		const slug = data.post.slug;
		const ch = new BroadcastChannel('blog-save');
		ch.onmessage = (e) => {
			if (e.data?.slug === slug) window.location.reload();
		};
		return () => ch.close();
	});
</script>

<div class="mx-auto max-w-4xl px-4 py-16">
	<a href="/blog" class="mb-6 inline-block text-sm text-amber-400 hover:underline">&larr; Back to Blog</a>

	<h1 class="mb-2 text-4xl font-bold text-amber-400">{data.post.title}</h1>

	{#if data.post.publishedAt}
		<p class="mb-8 text-sm text-zinc-500">
			Published {new Date(data.post.publishedAt + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
		</p>
	{/if}

	<article use:executeScripts class="prose prose-invert prose-amber max-w-none">
		{@html data.post.content}
	</article>
</div>
