<script lang="ts">
	let { form } = $props();

	let email = $state(form?.email || '');
	let code = $state('');
</script>

<div class="mx-auto max-w-md px-4 py-20">
	<h1 class="mb-8 text-3xl font-bold text-amber-400">Band Member Login</h1>

	{#if !form?.step || form.step === 'email'}
		<!-- Step 1: Enter email -->
		<form method="POST" action="?/sendCode" class="space-y-4">
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

			{#if form?.error}
				<p class="text-sm text-red-400">{form.error}</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
			>
				Send Verification Code
			</button>
		</form>
	{:else}
		<!-- Step 2: Enter verification code -->
		<form method="POST" action="?/verifyCode" class="space-y-4">
			<input type="hidden" name="email" value={form.email} />

			<p class="text-sm text-zinc-400">
				We sent a verification code to <strong class="text-amber-400">{form.email}</strong>.
			</p>

			{#if form.code}
				<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
					<p class="text-xs text-zinc-500">Dev mode — your code is:</p>
					<p class="text-2xl font-mono font-bold tracking-widest text-amber-400">{form.code}</p>
				</div>
			{/if}

			<div>
				<label for="code" class="mb-1 block text-sm font-medium text-zinc-400">Verification Code</label>
				<input
					type="text"
					id="code"
					name="code"
					required
					bind:value={code}
					maxlength="6"
					placeholder="000000"
					class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-center text-2xl tracking-widest text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
				/>
			</div>

			{#if form?.error}
				<p class="text-sm text-red-400">{form.error}</p>
			{/if}

			<div class="flex gap-3">
				<button
					type="submit"
					class="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
				>
					Log In
				</button>
				<button
					type="submit"
					formaction="?/sendCode"
					formmethod="POST"
					class="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-500"
				>
					Resend Code
				</button>
			</div>
		</form>
	{/if}
</div>
