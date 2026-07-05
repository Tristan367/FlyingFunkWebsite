import { Z as attr_class, W as escape_html, _ as ensure_array_like, V as attr, a2 as attr_style, M as derived } from '../../../chunks/server.js-D7jMOqOz.js';
import { y as ymd } from '../../../chunks/dates.js-WhQLpw1q.js';
import { getDate, format, eachDayOfInterval, endOfMonth, startOfMonth, isBefore } from 'date-fns';
import '../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/book/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let today = /* @__PURE__ */ new Date();
		let currentMonth = getDate(today) > 25 ? new Date(today.getFullYear(), today.getMonth() + 1, 1) : today;
		let selectedDate = null;
		let bookableDates = derived(() => data.fullBandDates);
		let otherBookable = derived(() => data.rhythmSectionDates);
		let otherLineup = derived(() => "Rhythm Section");
		let bandType = derived(() => "Full band with horns");
		let isConflict = derived(() => false);
		let isAvailableInOther = derived(() => isConflict() && otherBookable().includes(selectedDate));
		function daysInMonth() {
			return eachDayOfInterval({
				start: startOfMonth(currentMonth),
				end: endOfMonth(currentMonth)
			});
		}
		function isBookable(date) {
			return bookableDates().includes(ymd(date));
		}
		function firstDayOfWeek() {
			return startOfMonth(currentMonth).getDay();
		}
		function isPast(date) {
			return isBefore(date, new Date((/* @__PURE__ */ new Date()).toDateString()));
		}
		$$renderer.push(`<div class="mx-auto max-w-4xl px-4 py-20"><h1 class="mb-4 text-5xl font-black tracking-tight text-amber-400">Book Flying Funk</h1> <p class="mb-8 text-lg text-zinc-400">Pick your lineup, click a green date, and tell us about your event.</p> `);
		if (form?.bookSuccess) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-12 rounded-lg border border-green-700 bg-green-900/20 p-6 text-center"><h2 class="mb-2 text-xl font-bold text-green-400">Booking Request Submitted!</h2> <p class="text-zinc-400">The band has been notified and will get back to you soon.</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-8 grid gap-4 sm:grid-cols-2"><button${attr_class(`rounded-xl border-2 p-5 text-left transition-all border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10`)}><div><h3${attr_class(`text-lg font-bold text-amber-400`)}>Full Band</h3> <p class="text-xs text-zinc-500">Guitar, bass, drums, vocals, keys + horns</p></div></button> <button${attr_class(`rounded-xl border-2 p-5 text-left transition-all border-zinc-700 bg-zinc-900 hover:border-zinc-500`)}><div><h3${attr_class(`text-lg font-bold text-zinc-200`)}>Rhythm Section</h3> <p class="text-xs text-zinc-500">Guitar, bass, drums, vocals, keys</p></div></button></div> `);
		if (isConflict() && isAvailableInOther()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center"><p class="text-sm text-amber-400">This date isn't available for the <strong>${escape_html(bandType())}</strong>, but it <strong>is</strong> available for the ${escape_html(otherLineup())} lineup.
				Click the date again to deselect it.</p></div>`);
		} else if (isConflict()) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center"><p class="text-sm text-red-400">This date isn't available for the <strong>${escape_html(bandType())}</strong>.
				Click the date again to deselect it.</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid gap-12 lg:grid-cols-5"><div class="lg:col-span-3"><div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6"><div class="mb-4 flex items-center justify-center gap-6"><button class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">←</button> <h2 class="min-w-[160px] text-center text-lg font-bold">${escape_html(format(currentMonth, "MMMM yyyy"))}</h2> <button class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">→</button></div> <div class="mb-2 grid grid-cols-7 text-center text-xs font-medium text-zinc-500"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div> <div class="grid grid-cols-7 gap-1"><!--[-->`);
		const each_array = ensure_array_like(daysInMonth());
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let day = each_array[i];
			const dateStr = ymd(day);
			const avail = isBookable(day);
			const past = isPast(day);
			const selected = selectedDate === dateStr;
			$$renderer.push(`<button${attr("disabled", past || !avail && !selected, true)}${attr_style(i === 0 ? `grid-column-start: ${firstDayOfWeek() + 1}` : void 0)}${attr_class(`rounded-lg p-2 text-sm transition-colors ${selected ? "bg-amber-500 text-zinc-900 font-bold " : ""} ${!selected && avail ? "bg-green-600/30 text-green-400 hover:bg-green-600/40 " : ""} ${!selected && !avail && !past ? "bg-red-600/20 text-red-400 " : ""} ${past ? "text-zinc-500 " : ""} `)}>${escape_html(format(day, "d"))}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500"><span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-green-600/30"></span> Available</span> <span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-red-600/20"></span> Unavailable</span> <span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-amber-500"></span> Selected</span></div></div></div> <div class="lg:col-span-2"><div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6"><h2 class="mb-2 text-lg font-bold text-amber-400">Request a Booking</h2> <p class="mb-4 text-sm text-zinc-500">${escape_html(bandType())}</p> `);
		if (isConflict()) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<p class="text-zinc-500">The date you selected isn't available for this lineup. Switch lineups or click the date to deselect.</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="text-zinc-500">Click an available date (green) on the calendar to select it.</p>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DjLr1V1h.js.map
