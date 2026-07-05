import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { gte } from 'drizzle-orm';

export async function load() {
	const year = new Date().getFullYear();
	const start = `${year}-01-01`;

	const gigs = await db
		.select()
		.from(schema.gigs)
		.where(gte(schema.gigs.date, start))
		.orderBy(schema.gigs.date)
		.all();

	const confirmed = gigs.filter((g) => g.status === 'confirmed');
	const totalRevenue = confirmed.reduce((sum, g) => {
		const num = parseFloat(g.rate?.replace(/[^0-9.]/g, '') || '0');
		return sum + (isNaN(num) ? 0 : num);
	}, 0);

	const byMonth = new Map<string, { count: number; revenue: number }>();
	for (const g of confirmed) {
		const month = g.date.slice(0, 7);
		if (!byMonth.has(month)) byMonth.set(month, { count: 0, revenue: 0 });
		const m = byMonth.get(month)!;
		m.count++;
		m.revenue += parseFloat(g.rate?.replace(/[^0-9.]/g, '') || '0');
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
