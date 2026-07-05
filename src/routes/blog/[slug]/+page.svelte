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

<div class="pb-8">
	<article use:executeScripts class="prose prose-invert prose-amber max-w-none">
		{@html data.post.content}
	</article>
</div>
