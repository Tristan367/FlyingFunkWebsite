<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, getDate } from 'date-fns';
	import { ymd } from '$lib/utils/dates';

	let { data, form } = $props();

	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let currentMonth = $state(
		getDate(new Date()) > 25
			? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
			: new Date()
	);
	let rangeFrom = $state('');
	let rangeTo = $state('');
	let showWipeConfirm = $state(false);
	let currentHoliday = $state(data.unavailableOnHolidays);

	// Derive Sets directly from data — no stale $state snapshots
	let unavailable = $derived(data.myUnavailableDates);
	let recurring = $derived(data.recurringDays);
	let fullOK = $derived(data.bookableDates);
	let fiveOK = $derived(data.fivePieceBookable);

	function dateSet(hex: string): boolean {
		return unavailable.includes(hex);
	}
	function recSet(day: number): boolean {
		return recurring.includes(day);
	}
	function fullHas(hex: string): boolean {
		return fullOK.includes(hex);
	}
	function fiveHas(hex: string): boolean {
		return fiveOK.includes(hex);
	}

	// Check if a day has a recurring rule active
	function isDayBulkMarked(dayOfWeek: number): boolean {
		return recSet(dayOfWeek);
	}



	async function toggleDate(dateStr: string) {
		await fetch('?/toggle', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ date: dateStr })
		});
		invalidateAll();
	}

	function firstDayOfWeek(): number {
		return startOfMonth(currentMonth).getDay();
	}

	function isPastDay(date: Date): boolean {
		return isBefore(date, new Date(new Date().toDateString()));
	}

	function daysInMonth() {
		const start = startOfMonth(currentMonth);
		const end = endOfMonth(currentMonth);
		return eachDayOfInterval({ start, end });
	}

	function prevMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	async function toggleRecurring(day: number) {
		const mark = !isDayBulkMarked(day);
		await fetch('?/toggleRecurring', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ day: String(day), enabled: String(mark) })
		});
		invalidateAll();
	}

	async function toggleHolidays() {
		currentHoliday = !currentHoliday;
		await fetch('?/toggleHolidays', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ enabled: String(currentHoliday) })
		});
		invalidateAll();
	}
</script>

<h1 class="mb-8 text-3xl font-bold text-amber-400">My Availability</h1>

{#if form?.success}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Updated!</p>
{/if}
{#if form?.wiped}
	<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">All unavailabilities wiped!</p>
{/if}

<p class="mb-6 text-sm leading-relaxed text-zinc-400">
	By default you're <strong class="text-green-400">available every day</strong>. Mark dates you
	<strong class="text-red-400">can't play</strong> during gig hours (roughly 6–10pm). Use the tools
	below to bulk-set unavailability, then fine-tune individual dates by clicking the calendar.
</p>

<div class="mb-8 grid gap-6 sm:grid-cols-2">
	<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<h3 class="mb-3 text-sm font-medium text-zinc-400">Bulk Recurring Days</h3>
		<p class="mb-3 text-xs text-zinc-600">These are tools to bulk-mark (or un-mark) every occurrence of a day. You can still toggle individual dates after using them.</p>
		<div class="flex flex-wrap gap-2">
			{#each dayNames as dayName, i}
				{@const marked = isDayBulkMarked(i)}
				<button type="button" onclick={() => toggleRecurring(i)}
					class="w-[220px] rounded border border-zinc-700 px-3 py-1.5 text-xs text-left text-zinc-400 transition-colors hover:border-amber-500 hover:text-amber-400"
				>
					Mark all <strong class="text-zinc-200">{dayName}s</strong>
					{#if marked}
						<span class="text-green-400"> available</span>
					{:else}
						<span class="text-red-400"> unavailable</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<h3 class="mb-3 text-sm font-medium text-zinc-400">Holidays</h3>
		<label class="flex items-center gap-2 text-sm">
			<input type="checkbox" checked={currentHoliday} onchange={toggleHolidays} class="accent-red-500" />
			<span class={currentHoliday ? 'text-red-400' : 'text-zinc-300'}>Unavailable on all US federal holidays</span>
		</label>
		<p class="mt-2 text-xs text-zinc-600">New Year's, MLK Day, Presidents Day, Memorial Day, Juneteenth, July 4th, Labor Day, Columbus Day, Veterans Day, Thanksgiving, Christmas</p>
	</div>
</div>

<div class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
	<h3 class="mb-3 text-sm font-medium text-zinc-400">Bulk Date Range</h3>
	<p class="mb-3 text-xs text-zinc-600">Mark or clear a continuous range of dates all at once.</p>
	<form method="POST" action="?/setRange" class="flex flex-wrap items-end gap-3">
		<div>
			<label for="range-from" class="mb-1 block text-xs text-zinc-500">From</label>
			<input type="date" id="range-from" name="from" bind:value={rangeFrom}
				class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<div>
			<label for="range-to" class="mb-1 block text-xs text-zinc-500">To</label>
			<input type="date" id="range-to" name="to" bind:value={rangeTo}
				class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" />
		</div>
		<button type="submit"
			class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500">
			Mark Unavailable
		</button>
		<button type="submit" formaction="?/clearRange"
			class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500">
			Mark Available
		</button>
	</form>
</div>

<div class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
	<div class="mb-4 flex items-center justify-center gap-6">
		<button onclick={prevMonth}
			class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">&larr;</button>
		<h2 class="min-w-[160px] text-center text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
		<button onclick={nextMonth}
			class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">&rarr;</button>
	</div>

	<div class="mb-2 grid grid-cols-7 text-center text-xs font-medium text-zinc-500">
		<span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
	</div>

	<div class="grid grid-cols-7 gap-1">
		{#each daysInMonth() as day, i}
			{@const dateStr = ymd(day)}
			{@const past = isPastDay(day)}
			{@const out = dateSet(dateStr)}
			{@const fBook = fullHas(dateStr)}
			{@const pBook = fiveHas(dateStr)}
			<button
				onclick={() => toggleDate(dateStr)}
				disabled={past}
				style={i === 0 ? `grid-column-start: ${firstDayOfWeek() + 1}` : undefined}
				class="rounded-lg p-2 text-sm transition-colors
					{past ? 'text-zinc-500 ' : ''}
					{out && !past ? 'bg-red-600/30 text-red-400 hover:bg-red-600/40 ' : ''}
					{!out && !past ? 'bg-green-600/30 text-green-400 hover:bg-green-600/40 ' : ''}
					{fBook && !past ? 'ring-2 ring-amber-400 ring-inset' : ''}
					{pBook && !fBook && !past ? 'ring-1 ring-amber-400/50 ring-inset' : ''}
				"
			>
				{format(day, 'd')}
			</button>
		{/each}
	</div>

	<div class="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
		<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-green-600/30"></span> Available</span>
		<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-red-600/30"></span> Unavailable</span>
		<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded ring-2 ring-amber-400 ring-inset"></span> Full band bookable</span>
		<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded ring-1 ring-amber-400/50 ring-inset"></span> 5-piece bookable</span>
	</div>
</div>

{#if data.explicitUnavailable.length > 0}
	<div class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
		<div class="mb-3 flex items-center justify-between">
			<h3 class="text-sm font-medium text-zinc-400">Your Unavailable Dates</h3>
			{#if !showWipeConfirm}
				<button type="button" onclick={() => (showWipeConfirm = true)} class="text-xs text-red-400 hover:underline">Wipe all</button>
			{:else}
				<div class="flex items-center gap-2 text-xs">
					<span class="text-red-400">Clear everything?</span>
					<form method="POST" action="?/wipeAll" class="contents">
						<button type="submit" class="font-bold text-red-400 hover:underline">Yes, wipe all</button>
					</form>
					<button type="button" onclick={() => (showWipeConfirm = false)} class="text-zinc-500 hover:text-zinc-300">Cancel</button>
				</div>
			{/if}
		</div>
		<div class="flex flex-wrap gap-2">
			{#each data.explicitUnavailable as entry}
				<form method="POST" action="?/removeUnavailability" class="contents">
					<input type="hidden" name="id" value={entry.id} />
					<button type="submit"
						class="flex items-center gap-1 rounded-full bg-red-600/20 px-3 py-1 text-xs text-red-400 hover:bg-red-600/30">
						{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{new Date(entry.date).getFullYear() !== new Date().getFullYear() ? ', ' + new Date(entry.date).getFullYear() : ''}
						<span class="ml-1">&times;</span>
					</button>
				</form>
			{/each}
		</div>
	</div>
{/if}
