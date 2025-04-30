import { pgTable, unique, uuid, varchar, timestamp, text, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const passwordResetToken = pgTable("password_reset_token", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	unique("password_reset_token_token_unique").on(table.token),
]);

export const verificationToken = pgTable("verification_token", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
});

export const account = pgTable("account", {
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const activityLogs = pgTable("activity_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	action: text().notNull(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
	ipAddress: varchar("ip_address", { length: 45 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "activity_logs_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const booking = pgTable("booking", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	spaceId: uuid("space_id").notNull(),
	userId: uuid("user_id").notNull(),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }).notNull(),
	category: varchar({ length: 50 }).notNull(),
	status: varchar({ length: 20 }).default('REQUESTED').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.spaceId],
			foreignColumns: [space.id],
			name: "booking_space_id_space_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "booking_user_id_user_id_fk"
		}),
]);

export const resourceBooking = pgTable("resource_booking", {
	bookingId: uuid("booking_id").notNull(),
	resourceId: uuid("resource_id").notNull(),
	quantity: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [booking.id],
			name: "resource_booking_booking_id_booking_id_fk"
		}),
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resource.id],
			name: "resource_booking_resource_id_resource_id_fk"
		}),
]);

export const resource = pgTable("resource", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	quantity: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const conversations = pgTable("conversations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	creatorId: uuid("creator_id"),
	bookingId: uuid("booking_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [user.id],
			name: "conversations_creator_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [booking.id],
			name: "conversations_booking_id_booking_id_fk"
		}).onDelete("cascade"),
	unique("conversations_booking_id_unique").on(table.bookingId),
]);

export const conversationParticipants = pgTable("conversation_participants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	conversationId: uuid("conversation_id").notNull(),
	userId: uuid("user_id").notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "conversation_participants_conversation_id_conversations_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "conversation_participants_user_id_user_id_fk"
		}),
]);

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	senderId: uuid("sender_id"),
	conversationId: uuid("conversation_id"),
}, (table) => [
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [user.id],
			name: "messages_sender_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "messages_conversation_id_conversations_id_fk"
		}),
]);

export const space = pgTable("space", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	image: text(),
	capacity: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	address: varchar({ length: 255 }),
	city: varchar({ length: 100 }),
	state: varchar({ length: 50 }),
	zipCode: varchar("zip_code", { length: 20 }),
	country: varchar({ length: 100 }).default('Brasil'),
});

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 255 }),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	image: text(),
	password: text(),
	role: varchar({ length: 20 }).default('USER').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }).defaultNow().notNull(),
	telefone: varchar({ length: 20 }),
	address: varchar({ length: 255 }),
	city: varchar({ length: 100 }),
	state: varchar({ length: 50 }),
	zipCode: varchar("zip_code", { length: 20 }),
	country: varchar({ length: 100 }).default('Brasil'),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);
