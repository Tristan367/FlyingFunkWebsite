import { _ as ensure_array_like, W as escape_html, V as attr, Z as attr_class, a1 as clsx$1, a2 as attr_style, M as derived } from '../../../../chunks/server.js-D7jMOqOz.js';
import '../../../../chunks/client.js-q5RwB46e.js';
import { y as ymd } from '../../../../chunks/dates.js-WhQLpw1q.js';
import { getDate, format, eachDayOfInterval, endOfMonth, startOfMonth, isBefore } from 'date-fns';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '../../../../chunks/exports.js-Bq66Su2C.js';
import '../../../../chunks/internal2.js-DHGs7jvM.js';
import '../../../../chunks/index-server.js-dMC7ajjs.js';
import '../../../../chunks/rolldown-runtime.js-BBx_TEkp.js';
import '../../../../chunks/utils.js-DU29Pc2z.js';

//#region src/routes/admin/availability/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const dayNames = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		];
		let currentMonth = getDate(/* @__PURE__ */ new Date()) > 25 ? new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 1) : /* @__PURE__ */ new Date();
		let rangeFrom = "";
		let rangeTo = "";
		let currentHoliday = data.unavailableOnHolidays;
		let unavailable = derived(() => data.myUnavailableDates);
		let recurring = derived(() => data.recurringDays);
		let fullOK = derived(() => data.bookableDates);
		let fiveOK = derived(() => data.fivePieceBookable);
		function dateSet(hex) {
			return unavailable().includes(hex);
		}
		function recSet(day) {
			return recurring().includes(day);
		}
		function fullHas(hex) {
			return fullOK().includes(hex);
		}
		function fiveHas(hex) {
			return fiveOK().includes(hex);
		}
		function isDayBulkMarked(dayOfWeek) {
			return recSet(dayOfWeek);
		}
		function firstDayOfWeek() {
			return startOfMonth(currentMonth).getDay();
		}
		function isPastDay(date) {
			return isBefore(date, new Date((/* @__PURE__ */ new Date()).toDateString()));
		}
		function daysInMonth() {
			return eachDayOfInterval({
				start: startOfMonth(currentMonth),
				end: endOfMonth(currentMonth)
			});
		}
		$$renderer.push(`<h1 class="mb-8 text-3xl font-bold text-amber-400">My Availability</h1> `);
		if (form?.success) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Updated!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.wiped) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">All unavailabilities wiped!</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <p class="mb-6 text-sm leading-relaxed text-zinc-400">By default you're <strong class="text-green-400">available every day</strong>. Mark dates you <strong class="text-red-400">can't play</strong> during gig hours (roughly 6–10pm). Use the tools
	below to bulk-set unavailability, then fine-tune individual dates by clicking the calendar.</p> <div class="mb-8 grid gap-6 sm:grid-cols-2"><div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><h3 class="mb-3 text-sm font-medium text-zinc-400">Bulk Recurring Days</h3> <p class="mb-3 text-xs text-zinc-600">These are tools to bulk-mark (or un-mark) every occurrence of a day. You can still toggle individual dates after using them.</p> <div class="flex flex-wrap gap-2"><!--[-->`);
		const each_array = ensure_array_like(dayNames);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let dayName = each_array[i];
			const marked = isDayBulkMarked(i);
			$$renderer.push(`<button type="button" class="w-[220px] rounded border border-zinc-700 px-3 py-1.5 text-xs text-left text-zinc-400 transition-colors hover:border-amber-500 hover:text-amber-400">Mark all <strong class="text-zinc-200">${escape_html(dayName)}s</strong> `);
			if (marked) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-green-400">available</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="text-red-400">unavailable</span>`);
			}
			$$renderer.push(`<!--]--></button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><h3 class="mb-3 text-sm font-medium text-zinc-400">Holidays</h3> <label class="flex items-center gap-2 text-sm"><input type="checkbox"${attr("checked", currentHoliday, true)} class="accent-red-500"/> <span${attr_class(clsx$1(currentHoliday ? "text-red-400" : "text-zinc-300"))}>Unavailable on all US federal holidays</span></label> <p class="mt-2 text-xs text-zinc-600">New Year's, MLK Day, Presidents Day, Memorial Day, Juneteenth, July 4th, Labor Day, Columbus Day, Veterans Day, Thanksgiving, Christmas</p></div></div> <div class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4"><h3 class="mb-3 text-sm font-medium text-zinc-400">Bulk Date Range</h3> <p class="mb-3 text-xs text-zinc-600">Mark or clear a continuous range of dates all at once.</p> <form method="POST" action="?/setRange" class="flex flex-wrap items-end gap-3"><div><label for="range-from" class="mb-1 block text-xs text-zinc-500">From</label> <input type="date" id="range-from" name="from"${attr("value", rangeFrom)} class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="range-to" class="mb-1 block text-xs text-zinc-500">To</label> <input type="date" id="range-to" name="to"${attr("value", rangeTo)} class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <button type="submit" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500">Mark Unavailable</button> <button type="submit" formaction="?/clearRange" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500">Mark Available</button></form></div> <div class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6"><div class="mb-4 flex items-center justify-center gap-6"><button class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">←</button> <h2 class="min-w-[160px] text-center text-lg font-bold">${escape_html(format(currentMonth, "MMMM yyyy"))}</h2> <button class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400">→</button></div> <div class="mb-2 grid grid-cols-7 text-center text-xs font-medium text-zinc-500"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div> <div class="grid grid-cols-7 gap-1"><!--[-->`);
		const each_array_1 = ensure_array_like(daysInMonth());
		for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
			let day = each_array_1[i];
			const dateStr = ymd(day);
			const past = isPastDay(day);
			const out = dateSet(dateStr);
			const fBook = fullHas(dateStr);
			const pBook = fiveHas(dateStr);
			$$renderer.push(`<button${attr("disabled", past, true)}${attr_style(i === 0 ? `grid-column-start: ${firstDayOfWeek() + 1}` : void 0)}${attr_class(`rounded-lg p-2 text-sm transition-colors ${past ? "text-zinc-500 " : ""} ${out && !past ? "bg-red-600/30 text-red-400 hover:bg-red-600/40 " : ""} ${!out && !past ? "bg-green-600/30 text-green-400 hover:bg-green-600/40 " : ""} ${fBook && !past ? "ring-2 ring-amber-400 ring-inset" : ""} ${pBook && !fBook && !past ? "ring-1 ring-amber-400/50 ring-inset" : ""} `)}>${escape_html(format(day, "d"))}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500"><span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-green-600/30"></span> Available</span> <span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded bg-red-600/30"></span> Unavailable</span> <span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded ring-2 ring-amber-400 ring-inset"></span> Full band bookable</span> <span class="flex items-center gap-1"><span class="inline-block h-3 w-3 rounded ring-1 ring-amber-400/50 ring-inset"></span> 5-piece bookable</span></div></div> `);
		if (data.explicitUnavailable.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-medium text-zinc-400">Your Unavailable Dates</h3> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="text-xs text-red-400 hover:underline">Wipe all</button>`);
			$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_2 = ensure_array_like(data.explicitUnavailable);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let entry = each_array_2[$$index_2];
				$$renderer.push(`<form method="POST" action="?/removeUnavailability" class="contents"><input type="hidden" name="id"${attr("value", entry.id)}/> <button type="submit" class="flex items-center gap-1 rounded-full bg-red-600/20 px-3 py-1 text-xs text-red-400 hover:bg-red-600/30">${escape_html((/* @__PURE__ */ new Date(entry.date + "T00:00:00")).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric"
				}))}${escape_html(new Date(entry.date).getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? ", " + new Date(entry.date).getFullYear() : "")} <span class="ml-1">×</span></button></form>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-CRQOb-fG.js.map
