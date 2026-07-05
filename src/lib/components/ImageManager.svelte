<script lang="ts">
	interface Props {
		scope?: string;
		onImagesChanged?: (images: Array<{ id: string; filename: string; path: string }>) => void;
	}

	let { scope = '', onImagesChanged }: Props = $props();

	let images = $state<Array<{ id: string; filename: string; path: string }>>([]);
	let uploading = $state(false);

	async function load() {
		try {
			const url = scope ? `/api/images?scope=${encodeURIComponent(scope)}` : '/api/images';
			const res = await fetch(url);
			const data = await res.json();
			images = data.images || [];
			onImagesChanged?.(images);
		} catch {}
	}

	$effect(() => { load(); });

	async function handleFiles(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (!files || files.length === 0) return;
		uploading = true;
		for (let i = 0; i < files.length; i++) {
			const form = new FormData();
			form.append('file', files[i]);
			if (scope) form.append('scope', scope);
			try { await fetch('/api/upload', { method: 'POST', body: form }); } catch {}
		}
		uploading = false;
		input.value = '';
		load();
	}

	async function removeImg(id: string) {
		await fetch('/api/images', { method: 'DELETE', body: new URLSearchParams({ id }) });
		load();
	}
</script>

<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
	<div class="mb-3 flex items-center justify-between">
		<h3 class="text-sm font-medium text-zinc-400">Images</h3>
		<label class="relative inline-flex cursor-pointer rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-amber-500 hover:text-amber-400">
			{uploading ? 'Uploading...' : 'Upload Images'}
			<input type="file" accept="image/*" multiple class="absolute inset-0 opacity-0" onchange={handleFiles} />
		</label>
	</div>
	<p class="mb-3 text-xs text-zinc-400">Upload images, then reference them in your HTML as <code class="text-amber-400">./images/filename.jpg</code>. They will resolve automatically.</p>
	{#if images.length === 0}
	<p class="text-sm text-zinc-500">No images yet.</p>
	{:else}
	<div class="grid grid-cols-5 gap-1.5 sm:grid-cols-6 md:grid-cols-8">
		{#each images as img}
		<div class="rounded border border-zinc-800 bg-zinc-950 p-1">
			<div class="mb-1 flex aspect-square items-center justify-center overflow-hidden rounded">
				<img src={img.path} alt={img.filename} class="h-full w-full object-cover" />
			</div>
			<p class="mb-1 truncate text-[9px] text-zinc-400" title={img.filename}>{img.filename}</p>
			<button type="button" onclick={() => removeImg(img.id)}
				class="w-full rounded border border-zinc-700 py-0.5 text-[9px] text-red-400 hover:border-red-700">✕</button>
		</div>
		{/each}
	</div>
	{/if}
</div>
