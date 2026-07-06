<script lang="ts">
	let { form } = $props();

	let email = $state(form?.email || '');
	let password = $state('');
</script>

<div class="mx-auto max-w-md px-4 py-20">
	<h1 class="mb-8 text-3xl font-bold text-amber-400">Band Member Login</h1>

	<form method="POST" class="space-y-4">
		<div>
			<label for="email" class="mb-1 block text-sm font-medium text-zinc-400">Email</label>
			<input
				type="text"
				id="email"
				name="email"
				required
				bind:value={email}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
				placeholder="you@flyingfunk.com"
			/>
		</div>

		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-zinc-400">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				required
				bind:value={password}
				class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
				placeholder="••••••••"
			/>
		</div>

		{#if form?.error}
			<p class="text-sm text-red-400">{form.error}</p>
		{/if}

		<button
			type="submit"
			class="w-full rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
		>
			Log In
		</button>
	</form>
</div>
