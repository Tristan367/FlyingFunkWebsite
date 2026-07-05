<script lang="ts">
	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl px-4 py-20">
	<h1 class="mb-10 text-4xl font-bold text-amber-400">Blog</h1>

	<div class="space-y-6">
		{#each data.posts as post}
			<a
				href="/blog/{post.slug}"
				class="block rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-amber-500/50"
			>
				<h2 class="mb-2 text-xl font-bold text-amber-400">{post.title}</h2>
				<p class="text-sm text-zinc-500">
					by {post.authorName} ({post.authorInstrument}) &middot;
					{new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					})}
				</p>
			</a>
		{/each}
	</div>

	{#if data.posts.length === 0}
		<p class="text-zinc-500">No posts yet. Check back soon!</p>
	{/if}
</div>
