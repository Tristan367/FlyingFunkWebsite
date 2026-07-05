<script lang="ts">
	let { data } = $props();

	function trackPlay(id: string) {
		fetch('/api/songs/play', { method: 'POST', body: new URLSearchParams({ id }) });
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-20">
	<h1 class="mb-8 text-4xl font-bold text-amber-400">Music</h1>

	{#if data.pinned.length > 0}
		<h2 class="mb-4 text-lg font-bold text-amber-400">Pinned</h2>
		<div class="mb-12 space-y-4">
			{#each data.pinned as song}
				<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
					<div class="flex items-start justify-between gap-2">
						<div>
							<h3 class="font-bold">{song.title}</h3>
							<p class="text-xs text-zinc-400">{new Date(song.uploadedAt).toLocaleDateString()}</p>
						</div>
						<a href={song.path} download class="shrink-0 rounded border border-zinc-700 px-3 py-1 text-xs text-amber-400 hover:border-amber-500 transition-colors">Download</a>
					</div>
					{#if song.description}
						<p class="mt-1 text-sm text-zinc-400">{song.description}</p>
					{/if}
					<audio controls class="mt-2 w-full" src={song.path} onplay={() => trackPlay(song.id)}></audio>
				</div>
			{/each}
		</div>
	{/if}

	<h2 class="mb-4 text-lg font-bold text-zinc-300">All Songs</h2>
	<div class="space-y-4">
		{#each data.all as song}
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
				<div class="flex items-start justify-between gap-2">
					<div>
						<h3 class="font-bold">{song.title}</h3>
						<p class="text-xs text-zinc-400">{song.uploaderName} &middot; {new Date(song.uploadedAt).toLocaleDateString()}</p>
					</div>
					<a href={song.path} download class="shrink-0 rounded border border-zinc-700 px-3 py-1 text-xs text-amber-400 hover:border-amber-500 transition-colors">Download</a>
				</div>
				{#if song.description}
					<p class="mt-1 text-sm text-zinc-400">{song.description}</p>
				{/if}
				<audio controls class="mt-2 w-full" src={song.path}></audio>
			</div>
		{/each}
		{#if data.all.length === 0}
			<p class="text-zinc-400">No music yet. Check back soon!</p>
		{/if}
	</div>
</div>
