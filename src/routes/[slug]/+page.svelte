<script lang="ts">
	import { executeScripts } from '$lib/actions/scripts';

	let { data } = $props();
</script>

<div class="mx-auto max-w-3xl px-4 pt-20 pb-10">
	<a href="/" class="mb-8 inline-block text-sm text-amber-400 hover:underline">&larr; Back to the Band</a>

	<article use:executeScripts class="prose prose-invert prose-amber max-w-none">
		{@html data.member.bio}
	</article>
</div>
