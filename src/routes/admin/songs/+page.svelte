<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { uploadFile } from '$lib/utils/upload';

	let { data, form } = $props();
	let showUpload = $state(false);
	let songTitle = $state('');
	let songDesc = $state('');
	let deleteId = $state<string | null>(null);
	let editId = $state<string | null>(null);
	let editTitle = $state('');
	let editDesc = $state('');
	let uploading = $state(false);
	let uploadError = $state('');

	async function handleUpload(e: Event) {
		e.preventDefault();
		const formEl = e.target as HTMLFormElement;
		const fileInput = formEl.querySelector<HTMLInputElement>('input[type="file"]');
		const file = fileInput?.files?.[0];
		if (!file) return;

		uploading = true;
		uploadError = '';
		const result = await uploadFile(file);
		if (!result.url) {
			uploadError = result.error || 'Upload failed';
			uploading = false;
			return;
		}

		const data = new FormData();
		data.append('title', songTitle);
		data.append('description', songDesc);
		data.append('fileUrl', result.url);
		data.append('filename', file.name);

		const res = await fetch('?/upload', { method: 'POST', body: data });
		if (res.ok) {
			songTitle = '';
			songDesc = '';
			fileInput.value = '';
			showUpload = false;
			await invalidateAll();
		} else {
			uploadError = 'Upload failed';
		}
		uploading = false;
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Songs &amp; Recordings</h1>

{#if form?.uploadSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Song uploaded!</p>
{/if}
{#if form?.deleteSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Song deleted.</p>
{/if}
{#if form?.pinSuccess}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Updated.</p>
{/if}

{#if !showUpload}
	<button onclick={() => showUpload = true}
		class="mb-8 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Upload Song</button>
{:else}
	<form onsubmit={handleUpload} class="mb-8 space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<h2 class="text-sm font-medium text-zinc-400">Upload a Recording</h2>
		<div>
			<label for="stitle" class="mb-1 block text-xs text-zinc-400">Title</label>
			<input type="text" id="stitle" name="title" required bind:value={songTitle}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="sdesc" class="mb-1 block text-xs text-zinc-400">Description (optional)</label>
			<input type="text" id="sdesc" name="description" bind:value={songDesc}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="sfile" class="mb-1 block text-xs text-zinc-400">Audio File (MP3, WAV)</label>
			<input type="file" id="sfile" name="file" accept="audio/*" required
				class="w-full text-sm text-zinc-400 file:mr-3 file:rounded file:border-0 file:bg-zinc-700 file:px-3 file:py-1 file:text-xs file:text-zinc-200" />
		</div>
		{#if uploadError}
			<p class="text-sm text-red-400">{uploadError}</p>
		{/if}
		<div class="flex gap-2">
			<button type="submit" disabled={uploading} class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-400 disabled:opacity-50">
				{uploading ? 'Uploading...' : 'Upload'}
			</button>
			<button type="button" onclick={() => showUpload = false}
				class="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500">Cancel</button>
		</div>
	</form>
{/if}

<div class="space-y-3">
	{#each data.songs as song}
		<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
			<div class="flex items-start gap-3">
				<div class="min-w-0 flex-1">
					<h3 class="font-bold truncate" title={song.title}>{song.title}{#if song.pinned} <span class="text-xs font-normal text-amber-400">📌 Pinned</span>{/if}</h3>
					<p class="text-xs text-zinc-400">{song.uploaderName} &middot; {new Date(song.uploadedAt).toLocaleDateString()}{#if song.plays != null} &middot; {song.plays} play{song.plays !== 1 ? 's' : ''}{/if}</p>
				</div>
				<button type="button" onclick={() => { editId = song.id; editTitle = song.title; editDesc = song.description || ''; }}
					class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500 shrink-0">Edit</button>
			</div>
			<audio controls class="mt-2 w-full" src={song.path}></audio>
		</div>
	{/each}
	{#if data.songs.length === 0}
		<p class="text-zinc-400">No songs yet. Upload one!</p>
	{/if}
</div>

{#if editId}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" onclick={() => editId = null}>
		<div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<h3 class="mb-4 text-lg font-bold text-amber-400">Edit Song</h3>
			<form method="POST" action="?/edit" class="space-y-4">
				<input type="hidden" name="id" value={editId} />
				<div>
					<label for="etitle" class="mb-1 block text-xs text-zinc-400">Title</label>
					<input type="text" id="etitle" name="title" required bind:value={editTitle}
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
				</div>
				<div>
					<label for="edesc" class="mb-1 block text-xs text-zinc-400">Description</label>
					<input type="text" id="edesc" name="description" bind:value={editDesc}
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
				</div>
				<div class="flex items-center gap-3 pt-2 border-t border-zinc-800">
					<a href={data.songs.find((s: any) => s.id === editId)?.path} download class="rounded border border-zinc-700 px-3 py-1 text-xs text-amber-400 hover:border-amber-500">Download</a>
					<button type="submit" formaction="?/togglePin" name="id" value={editId}
						class="rounded border px-3 py-1 text-xs {data.songs.find((s2: any) => s2.id === editId)?.pinned ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}">{data.songs.find((s2: any) => s2.id === editId)?.pinned ? 'Unpin' : 'Pin'}</button>
					<button type="button" onclick={() => { deleteId = editId; editId = null; }}
						class="rounded border border-red-700 px-3 py-1 text-xs text-red-400 hover:bg-red-900/20">Delete</button>
				</div>
				<div class="flex gap-3">
					<button type="submit" class="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-bold text-zinc-900 hover:bg-amber-400">Save</button>
					<button type="button" onclick={() => editId = null}
						class="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-500">Cancel</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if deleteId}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" onclick={() => deleteId = null}>
		<div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<h3 class="mb-2 text-lg font-bold text-red-400">Delete Song?</h3>
			<p class="mb-4 text-sm text-zinc-400">This permanently removes the song and its audio file.</p>
			<div class="flex gap-3">
				<form method="POST" action="?/delete" class="contents">
					<input type="hidden" name="id" value={deleteId} />
					<button type="submit" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-500">Delete</button>
				</form>
				<button type="button" onclick={() => deleteId = null}
					class="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-500">Cancel</button>
			</div>
		</div>
	</div>
{/if}
