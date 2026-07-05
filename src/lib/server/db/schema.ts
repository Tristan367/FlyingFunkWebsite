import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const members = pgTable('members', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone').notNull().default(''),
	instrument: text('instrument').notNull().default(''),
	instruments: text('instruments').notNull().default(''),
	address: text('address').notNull().default(''),
	profilePic: text('profile_pic').notNull().default(''),
	bio: text('bio').notNull().default(''),
	slug: text('slug').notNull().default(''),
	unavailableOnHolidays: boolean('unavailable_on_holidays')
		.notNull()
		.default(false),
	emailNotifyGigs: boolean('email_notify_gigs').notNull().default(true),
	emailNotifyBlog: boolean('email_notify_blog').notNull().default(true),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull()
});

export const verificationCodes = pgTable('verification_codes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull(),
	code: text('code').notNull(),
	expiresAt: integer('expires_at').notNull()
});

export const unavailability = pgTable('unavailability', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	memberId: text('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	date: text('date').notNull(),
	isAvailable: boolean('is_available').notNull().default(false)
});

export const recurringUnavailability = pgTable('recurring_unavailability', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	memberId: text('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	dayOfWeek: integer('day_of_week').notNull()
});

export const gigs = pgTable('gigs', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	date: text('date').notNull(),
	time: text('time').notNull().default(''),
	venue: text('venue').notNull(),
	venueAddress: text('venue_address').notNull().default(''),
	description: text('description').notNull().default(''),
	customerName: text('customer_name').notNull().default(''),
	customerEmail: text('customer_email').notNull().default(''),
	customerPhone: text('customer_phone').notNull().default(''),
	rate: text('rate').notNull().default('$1000'),
	withHorns: boolean('with_horns').notNull().default(true),
	private: boolean('private').notNull().default(false),
	status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] })
		.notNull()
		.default('confirmed'),
	notes: text('notes').notNull().default(''),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const gigVotes = pgTable('gig_votes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	gigId: text('gig_id')
		.notNull()
		.references(() => gigs.id, { onDelete: 'cascade' }),
	memberId: text('member_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	vote: text('vote', { enum: ['approve', 'reject', 'abstain'] }).notNull(),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const blogPosts = pgTable('blog_posts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	authorId: text('author_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content').notNull().default(''),
	publishedAt: text('published_at').notNull().default(''),
	archived: boolean('archived').notNull().default(false),
	views: integer('views').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const images = pgTable('images', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	uploaderId: text('uploader_id').references(() => members.id, { onDelete: 'set null' }),
	filename: text('filename').notNull(),
	path: text('path').notNull(),
	scope: text('scope').notNull().default(''),
	uploadedAt: text('uploaded_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const songs = pgTable('songs', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	uploaderId: text('uploader_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	pinned: boolean('pinned').notNull().default(false),
	plays: integer('plays').notNull().default(0),
	filename: text('filename').notNull(),
	path: text('path').notNull(),
	uploadedAt: text('uploaded_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const removalVotes = pgTable('removal_votes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	proposerId: text('proposer_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	targetId: text('target_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	voterId: text('voter_id')
		.notNull()
		.references(() => members.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const siteConfig = pgTable('site_config', {
	id: integer('id').primaryKey(),
	heroTitle: text('hero_title').notNull().default('FLYING FUNK'),
	heroSubtitle: text('hero_subtitle')
		.notNull()
		.default(
			'A funk cover band playing the best of the 70s, 80s, and beyond — from Stevie Wonder and Earth, Wind & Fire to Mark Ronson and Remi Wolf.'
		),
	heroImage: text('hero_image').notNull().default(''),
	instagram: text('instagram').notNull().default(''),
	facebook: text('facebook').notNull().default(''),
	youtube: text('youtube').notNull().default(''),
	spotify: text('spotify').notNull().default('')
});
