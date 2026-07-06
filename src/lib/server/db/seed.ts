import { db } from './index';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

const defaultPassword = await hash('funk2026');

const members = [
	{ id: 'm1', name: '', email: 't_johnson367@outlook.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm2', name: '', email: 'mjcmusic87@gmail.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm3', name: '', email: 'mattfate@gmail.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm4', name: '', email: 'typicaljohnnyboy@gmail.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm5', name: '', email: 'stefan@flyingfunk.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm6', name: '', email: 'robert@flyingfunk.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm7', name: '', email: 'mike.keepe@gmail.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm8', name: '', email: 'Msakakeeny@gmail.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' },
	{ id: 'm9', name: '', email: 'jwp3coug@hotmail.com', phone: '', instrument: '', instruments: '', password: defaultPassword, unavailableOnHolidays: false, address: '', slug: '' }
];

await db.delete(schema.gigVotes);
await db.delete(schema.removalVotes);
await db.delete(schema.sessions);
await db.delete(schema.verificationCodes);
await db.delete(schema.images);
await db.delete(schema.blogPosts);
await db.delete(schema.recurringUnavailability);
await db.delete(schema.unavailability);
await db.delete(schema.gigs);
await db.delete(schema.members);

const cfg = await db.select().from(schema.siteConfig).get();
if (!cfg) await db.insert(schema.siteConfig).values({ id: 1 });

await db.insert(schema.members).values(members);

function daysFromNow(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().split('T')[0];
}

// Matt: unavailable on Sundays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm3', dayOfWeek: 0 }, // Sunday
]);
// Johnny: unavailable on Thursdays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm4', dayOfWeek: 4 }, // Thursday
]);
// Mike: unavailable on Mondays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm7', dayOfWeek: 1 }, // Monday
]);
// Mik: unavailable on Tuesdays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm8', dayOfWeek: 2 }, // Tuesday
]);
// Jim: unavailable on Wednesdays + holidays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm9', dayOfWeek: 3 }, // Wednesday
]);
await db.update(schema.members).set({ unavailableOnHolidays: true }).where(eq(schema.members.id, 'm9'));

// Sample gigs
await db.insert(schema.gigs).values([
	{ date: daysFromNow(3), time: '9:00 PM', venue: "O'Malley's Pub", venueAddress: "110 S Madison St, Spokane, WA", description: 'Friday night funk party!', rate: '$1000', withHorns: true, status: 'confirmed' },
	{ date: daysFromNow(10), time: '8:00 PM', venue: 'The Blue Note', venueAddress: "1011 W 1st Ave, Spokane, WA", description: 'An evening of classic 70s funk covers.', rate: '$1200', withHorns: true, status: 'confirmed' },
	{ date: daysFromNow(17), time: '7:00 PM', venue: 'Wedding Reception', description: 'Private wedding — rhythm section only.', rate: '$500', withHorns: false, private: true, status: 'confirmed' },
]);

console.log('Seed complete! 9 blank member accounts. Password: funk2026');
process.exit(0);
