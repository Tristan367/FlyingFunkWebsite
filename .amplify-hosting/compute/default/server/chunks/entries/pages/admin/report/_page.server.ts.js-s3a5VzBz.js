import { d as db, c as gigs, g as gte } from '../../../../chunks/db.js-zAe9iE3U.js';

//#region src/routes/admin/report/+page.server.ts
async function load() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const start = `${year}-01-01`;
	const confirmed = (await db.select().from(gigs).where(gte(gigs.date, start)).orderBy(gigs.date).all()).filter((g) => g.status === "confirmed");
	const totalRevenue = confirmed.reduce((sum, g) => {
		const num = parseFloat(g.rate?.replace(/[^0-9.]/g, "") || "0");
		return sum + (isNaN(num) ? 0 : num);
	}, 0);
	const byMonth = /* @__PURE__ */ new Map();
	for (const g of confirmed) {
		const month = g.date.slice(0, 7);
		if (!byMonth.has(month)) byMonth.set(month, {
			count: 0,
			revenue: 0
		});
		const m = byMonth.get(month);
		m.count++;
		m.revenue += parseFloat(g.rate?.replace(/[^0-9.]/g, "") || "0");
	}
	return {
		year,
		totalGigs: confirmed.length,
		totalRevenue,
		byMonth: Array.from(byMonth.entries()).map(([month, data]) => ({
			month,
			count: data.count,
			revenue: data.revenue
		})),
		gigs: confirmed
	};
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-s3a5VzBz.js.map
