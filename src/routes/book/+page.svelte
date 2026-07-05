<script lang="ts">
	import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, getDate } from 'date-fns';
	import { ymd } from '$lib/utils/dates';

	let { data, form } = $props();

	let today = new Date();
	let currentMonth = $state(
		getDate(today) > 25
			? new Date(today.getFullYear(), today.getMonth() + 1, 1)
			: today
	);
	let selectedDate = $state<string | null>(null);
	let withHorns = $state(true);
	let bookTime = $state('7-10');
	let customerName = $state('');
	let customerEmail = $state('');
	let venue = $state('');
	let notes = $state('');
	let budget = $state('');
	let isPrivate = $state(false);
	let showConfirm = $state(false);

	let bookableDates = $derived(withHorns ? data.fullBandDates : data.rhythmSectionDates);
	let otherBookable = $derived(withHorns ? data.rhythmSectionDates : data.fullBandDates);
	let otherLineup = $derived(withHorns ? 'Rhythm Section' : 'Full Band');
	let bandType = $derived(withHorns ? 'Full band with horns' : '5-piece rhythm section');

	let isConflict = $derived(
		selectedDate !== null && !bookableDates.includes(selectedDate)
	);
	let isAvailableInOther = $derived(
		isConflict && otherBookable.includes(selectedDate!)
	);

	const timeOptions = [
		'12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
		'3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
		'6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM',
		'9:00 PM','9:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM'
	];

	function daysInMonth() {
		const start = startOfMonth(currentMonth);
		const end = endOfMonth(currentMonth);
		return eachDayOfInterval({ start, end });
	}

	function isBookable(date: Date): boolean {
		return bookableDates.includes(ymd(date));
	}

	function firstDayOfWeek(): number {
		return startOfMonth(currentMonth).getDay();
	}

	function isPast(date: Date): boolean {
		return isBefore(date, new Date(new Date().toDateString()));
	}

	function prevMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	function selectDate(dateStr: string) {
		if (selectedDate === dateStr) {
			selectedDate = null;
			return;
		}
		if (!bookableDates.includes(dateStr)) return;
		selectedDate = dateStr;
	}

	function switchTo(hasHorns: boolean) {
		withHorns = hasHorns;
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-20">
	<h1 class="mb-4 text-5xl font-black tracking-tight text-amber-400">Book Flying Funk</h1>
	<p class="mb-8 text-lg text-zinc-400">
		Pick your lineup, click a green date, and tell us about your event.
	</p>

	{#if form?.bookSuccess}
		<div class="mb-12 rounded-lg border border-green-700 bg-green-900/20 p-6 text-center">
			<h2 class="mb-2 text-xl font-bold text-green-400">Booking Request Submitted!</h2>
			<p class="text-zinc-400">The band has been notified and will get back to you soon.</p>
		</div>
	{/if}

	<!-- Lineup toggle -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2">
		<button
			onclick={() => switchTo(true)}
			class="rounded-xl border-2 p-5 text-left transition-all
				{withHorns ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}"
		>
			<div>
				<h3 class="text-lg font-bold {withHorns ? 'text-amber-400' : 'text-zinc-200'}">Full Band</h3>
					<p class="text-xs text-zinc-500">Guitar, bass, drums, vocals, keys + horns</p>
			</div>
		</button>

		<button
			onclick={() => switchTo(false)}
			class="rounded-xl border-2 p-5 text-left transition-all
				{!withHorns ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}"
		>
			<div>
				<h3 class="text-lg font-bold {!withHorns ? 'text-amber-400' : 'text-zinc-200'}">Rhythm Section</h3>
					<p class="text-xs text-zinc-500">Guitar, bass, drums, vocals, keys</p>
			</div>
		</button>
	</div>

	<!-- Conflict warning -->
	{#if isConflict && isAvailableInOther}
		<div class="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
			<p class="text-sm text-amber-400">
				This date isn't available for the <strong>{bandType}</strong>, but it
				<strong>is</strong> available for the {otherLineup} lineup.
				Click the date again to deselect it.
			</p>
		</div>
	{:else if isConflict}
		<div class="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
			<p class="text-sm text-red-400">
				This date isn't available for the <strong>{bandType}</strong>.
				Click the date again to deselect it.
			</p>
		</div>
	{/if}

	<div class="grid gap-12 lg:grid-cols-5">
		<!-- Calendar -->
		<div class="lg:col-span-3">
			<div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
				<div class="mb-4 flex items-center justify-center gap-6">
					<button onclick={prevMonth}
						class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">
						&larr;
					</button>
					<h2 class="min-w-[160px] text-center text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
					<button onclick={nextMonth}
						class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">
						&rarr;
					</button>
				</div>

				<div class="mb-2 grid grid-cols-7 text-center text-xs font-medium text-zinc-500">
					<span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
				</div>

				<div class="grid grid-cols-7 gap-1">
					{#each daysInMonth() as day, i}
						{@const dateStr = ymd(day)}
						{@const avail = isBookable(day)}
						{@const past = isPast(day)}
						{@const selected = selectedDate === dateStr}
						<button
							onclick={() => selectDate(dateStr)}
							disabled={past || (!avail && !selected)}
							style={i === 0 ? `grid-column-start: ${firstDayOfWeek() + 1}` : undefined}
							class="rounded-lg p-2 text-sm transition-colors
								{selected ? 'bg-amber-500 text-zinc-900 font-bold ' : ''}
								{!selected && avail ? 'bg-green-600/30 text-green-400 hover:bg-green-600/40 ' : ''}
								{!selected && !avail && !past ? 'bg-red-600/20 text-red-400 ' : ''}
								{past ? 'text-zinc-500 ' : ''}
							"
						>{format(day, 'd')}</button>
					{/each}
				</div>

				<div class="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
					<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-green-600/30"></span> Available</span>
					<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-red-600/20"></span> Unavailable</span>
					<span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-amber-500"></span> Selected</span>
				</div>
			</div>
		</div>

		<!-- Booking Form -->
		<div class="lg:col-span-2">
			<div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
				<h2 class="mb-2 text-lg font-bold text-amber-400">Request a Booking</h2>
				<p class="mb-4 text-sm text-zinc-500">{bandType}</p>

				{#if selectedDate && !isConflict}
					<form method="POST" action="?/book" class="space-y-4" onkeydown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault(); }}>
						<input type="hidden" name="dates" value={selectedDate} />
						<input type="hidden" name="withHorns" value={String(withHorns)} />

						<div>
							<p class="mb-1 text-sm text-zinc-400">Selected Date</p>
							<input type="text" disabled
								value={format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-300" />
						</div>

						<div>
							<label for="time" class="mb-1 block text-sm text-zinc-400">Time</label>
							<input type="text" id="time" name="time" bind:value={bookTime} placeholder="e.g. 7–10 PM"
								class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
						</div>

						<div>
							<label for="customerName" class="mb-1 block text-sm text-zinc-400">Your Name</label>
							<input type="text" id="customerName" name="customerName" required bind:value={customerName}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none" />
						</div>

						<div>
							<label for="customerEmail" class="mb-1 block text-sm text-zinc-400">Email / Phone</label>
							<input type="text" id="customerEmail" name="customerEmail" bind:value={customerEmail} placeholder="you@example.com or 555-0123"
								class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
						</div>

						<div>
							<label for="venue" class="mb-1 block text-sm text-zinc-400">Venue / Location</label>
							<input type="text" id="venue" name="venue" required bind:value={venue}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
								placeholder="e.g. Old Hank's Bar, Hayden ID" />
						</div>

						<div>
							<label for="budget" class="mb-1 block text-sm text-zinc-400">Your Budget / Offer</label>
							<input type="text" id="budget" name="budget" bind:value={budget} placeholder="$"
								class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none" />
						</div>

						<div>
							<label for="notes" class="mb-1 block text-sm text-zinc-400">Notes (optional)</label>
							<textarea id="notes" name="description" rows="3" bind:value={notes}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"></textarea>
						</div>

						<div class="py-2">
							<label class="flex items-center gap-3 text-sm cursor-pointer">
								<input type="checkbox" name="private" bind:checked={isPrivate} class="h-5 w-5 accent-amber-500" />
								<div>
									<span class="text-zinc-300">Private event</span>
									<p class="text-xs text-zinc-600">Check this box if you do NOT want Flying Funk to advertise your event on their site and social media.</p>
								</div>
							</label>
						</div>

						{#if form?.bookError}
							<p class="text-sm text-red-400">{form.bookError}</p>
						{/if}

						<button type="button" onclick={() => showConfirm = true}
							class="w-full rounded-xl bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20">
							Submit Booking Request
						</button>

						<!-- Confirmation modal -->
						{#if showConfirm}
							<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" onclick={() => showConfirm = false}>
								<div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
									<h3 class="mb-2 text-lg font-bold text-amber-400">Confirm Booking</h3>
									<p class="mb-4 text-sm text-zinc-400">
										Submit a booking request for <strong class="text-zinc-200">{bandType}</strong> on <strong class="text-zinc-200">{format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM d')}</strong>?
									</p>
									<div class="flex gap-3">
										<button type="submit"
											class="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-bold text-zinc-900 hover:bg-amber-400">
											Confirm
										</button>
										<button type="button" onclick={() => showConfirm = false}
											class="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-500">
											Cancel
										</button>
									</div>
								</div>
							</div>
						{/if}
					</form>
				{:else if isConflict}
					<p class="text-zinc-500">The date you selected isn't available for this lineup. Switch lineups or click the date to deselect.</p>
				{:else}
					<p class="text-zinc-500">Click an available date (green) on the calendar to select it.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
