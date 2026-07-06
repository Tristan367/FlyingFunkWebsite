<script lang="ts">
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import ImageManager from '$lib/components/ImageManager.svelte';
	import MapPicker from '$lib/components/MapPicker.svelte';
	import { resolveImages } from '$lib/utils/images';

	let { data, form } = $props();

	let name = $state(data.member.name);
	let instrument = $state(data.member.instrument);
	let instruments = $state(data.member.instruments || data.member.instrument);
	let address = $state(data.member.address);
	let slug = $state(data.member.slug);
	let bio = $state(data.member.bio);
	let profilePic = $state(data.member.profilePic);
	let uploading = $state(false);
	let addrInput: HTMLInputElement | null = $state(null);
	let activeImages = $state<Array<{ id: string; filename: string; path: string }>>([]);

	let resolvedPreview = $derived(resolveImages(bio, activeImages));

	const PROFILE_TEMPLATE = `<div style="max-width:900px;margin:0 auto;padding:2rem 1.5rem;color:#e0e0e0;font-family:'Segoe UI',sans-serif">

<h1 style="font-size:2.5rem;color:#f7c948;margin:0 0 0.5rem">Hey, I'm {name || 'Your Name'}</h1>
<p style="font-size:1.1rem;color:#888;margin:0 0 2rem">{instrument || 'Your Instrument'}</p>

<div style="display:flex;flex-wrap:wrap;gap:2rem;margin-bottom:2rem">
  <div style="flex:1;min-width:250px">
    <h2 style="color:#63cdda;font-size:1.4rem;margin:0 0 1rem">About Me</h2>
    <p style="color:#a0a0a0;line-height:1.7;font-size:1.05rem">
      Write a paragraph or two about yourself — your background, what got you into music, your favorite artists.
    </p>
    <p style="color:#a0a0a0;line-height:1.7;font-size:1.05rem">
      You can add images using <code style="background:#ffffff15;color:#f7c948;padding:0.15em 0.4em;border-radius:3px">./images/filename.jpg</code> — just upload them first with the Images section above.
    </p>
  </div>
  <div style="flex:0 0 200px;text-align:center">
    <div style="width:180px;height:180px;border-radius:50%;background:linear-gradient(135deg,#ff6b3540,#63cdda40);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-size:4rem">🎸</div>
    <p style="color:#888;font-size:0.9rem">Replace me with <code style="background:#ffffff15;color:#f7c948;padding:0.15em 0.4em;border-radius:3px">./images/your-photo.jpg</code></p>
  </div>
</div>

<h2 style="color:#63cdda;font-size:1.4rem;margin:2rem 0 1rem">Fun Facts</h2>
<ul style="color:#a0a0a0;line-height:1.8;font-size:1.05rem">
  <li>I've been playing since I was ___ years old</li>
  <li>My dream gig would be ___</li>
  <li>Favorite song to perform: ___</li>
  <li>When I'm not playing music, I'm ___</li>
</ul>

<hr style="border:none;border-top:1px solid #ffffff15;margin:2rem 0">

<p style="text-align:center;color:#888;font-style:italic;font-size:0.95rem">
  This entire profile is raw HTML. Want animations? Games? A custom layout? Just write it in HTML mode.
</p>

</div>`;

	async function uploadProfilePic(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return; }
		uploading = true;
		try {
			const { uploadFile } = await import('$lib/utils/upload');
			const result = await uploadFile(file);
			if (result.url) profilePic = result.url;
			else alert(result.error || 'Upload failed');
		} catch { alert('Upload failed'); }
		uploading = false;
		input.value = '';
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">Edit Your Profile</h1>

{#if form?.success}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Profile saved!</p>
{/if}

<div class="mb-6 flex justify-end">
	<button type="submit" form="profile-form"
		class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20">
		Save Profile
	</button>
</div>

<form method="POST" action="?/save" class="space-y-6" id="profile-form" onkeydown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); }}>
	<!-- Profile Pic -->
	<div>
		<label class="mb-1 block text-sm text-zinc-400">Profile Picture</label>
		<div class="flex items-center gap-4">
			{#if profilePic}
				<img src={profilePic} alt="Profile" class="h-20 w-20 rounded-full border-2 border-zinc-700 object-cover" />
			{:else}
				<div class="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 text-zinc-600">
					<span class="text-2xl">{name[0] || '?'}</span>
				</div>
			{/if}
			<div>
				<label class="relative inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-amber-500 hover:text-amber-400">
					{uploading ? 'Uploading...' : 'Upload Photo'}
					<input type="file" accept="image/*" class="hidden" onchange={uploadProfilePic} disabled={uploading} />
				</label>
				<p class="mt-1 text-xs text-zinc-600">Square photos work best. Max 5MB.</p>
			</div>
		</div>
		<input type="hidden" name="profilePic" value={profilePic} />
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="name" class="mb-1 block text-sm text-zinc-400">Name</label>
			<input type="text" id="name" name="name" bind:value={name} required
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="instrument" class="mb-1 block text-sm text-zinc-400">Primary Instrument</label>
			<input type="text" id="instrument" name="instrument" bind:value={instrument}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
	</div>

	<div>
		<label for="instruments" class="mb-1 block text-sm text-zinc-400">All Instruments You Play</label>
		<input type="text" id="instruments" name="instruments" bind:value={instruments} placeholder="guitar, bass"
			class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
		<p class="mt-1 text-xs text-zinc-600">Comma-separated list of every instrument you can play. Used to determine if the band has enough coverage for a gig.</p>
	</div>

	<div>
		<label class="mb-1 block text-sm text-zinc-400">Your Location</label>
		<MapPicker address={address} onSelect={(_lat: number, _lng: number, addr: string) => { address = addr; if (addrInput) addrInput.value = addr; }} />
		<input type="hidden" name="address" value={address} bind:this={addrInput} />
		<p class="mt-1 text-xs text-zinc-600">Search for your city or neighborhood. Used to calculate how far you are from gigs.</p>
	</div>

	<div>
		<label for="slug" class="mb-1 block text-sm text-zinc-400">Profile Page Address</label>
		<div class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
			<span class="text-sm text-zinc-600">flyingfunk.com/</span>
			<input type="text" id="slug" name="slug" bind:value={slug} placeholder="your-name"
				class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none" />
		</div>
		<p class="mt-1 text-xs text-zinc-600">This becomes the web address for your profile. Use your first name. Leave blank to be unlisted.</p>
	</div>

	<div>
		<label class="mb-1 block text-sm text-zinc-400">Bio</label>
		<details class="mb-3">
			<summary class="cursor-pointer rounded border border-amber-700/50 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 list-none">📋 Profile Template</summary>
			<div class="mt-2 rounded-lg border border-zinc-700 bg-zinc-900 p-3">
				<p class="mb-2 text-xs text-zinc-400">Paste this in <strong class="text-amber-400">HTML mode</strong>, then customize:</p>
				<pre class="max-h-72 overflow-auto rounded bg-zinc-950 p-3 text-xs text-zinc-300 leading-relaxed"><code>{PROFILE_TEMPLATE}</code></pre>
				<button type="button" onclick={() => navigator.clipboard.writeText(PROFILE_TEMPLATE)}
					class="mt-2 rounded bg-amber-500 px-4 py-1.5 text-xs font-bold text-zinc-900 hover:bg-amber-400">
					Copy to Clipboard
				</button>
			</div>
		</details>
		<ImageManager scope={'profile-' + data.member.id} onImagesChanged={(imgs) => activeImages = imgs} />

		<div class="mt-4">
		<RichTextEditor content={bio} onUpdate={(html: string) => bio = html} galleryImages={activeImages} placeholder="Tell your story..." />
		<input type="hidden" name="bio" value={bio} />
		</div>
	</div>

</form>

{#if bio}
	<div class="mt-8 overflow-hidden border-y border-zinc-700" style="width:100vw;position:relative;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw">
		<div class="border-b border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs text-zinc-500">
			<span class="text-amber-400 font-bold">Preview</span>
			<span class="ml-2">flyingfunk.com/{data.member.slug || 'your-name'}</span>
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
		<div class="bg-zinc-950 pb-8 pt-4">
			<div class="prose prose-invert prose-amber max-w-none">{@html resolvedPreview}</div>
		</div>
	</div>
{/if}
