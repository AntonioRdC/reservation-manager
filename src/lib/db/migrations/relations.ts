import { relations } from "drizzle-orm/relations";
import { user, account, activityLogs, space, booking, resourceBooking, resource, session, conversations, conversationParticipants, messages } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	activityLogs: many(activityLogs),
	bookings: many(booking),
	sessions: many(session),
	conversations: many(conversations),
	conversationParticipants: many(conversationParticipants),
	messages: many(messages),
}));

export const activityLogsRelations = relations(activityLogs, ({one}) => ({
	user: one(user, {
		fields: [activityLogs.userId],
		references: [user.id]
	}),
}));

export const bookingRelations = relations(booking, ({one, many}) => ({
	space: one(space, {
		fields: [booking.spaceId],
		references: [space.id]
	}),
	user: one(user, {
		fields: [booking.userId],
		references: [user.id]
	}),
	resourceBookings: many(resourceBooking),
	conversations: many(conversations),
}));

export const spaceRelations = relations(space, ({many}) => ({
	bookings: many(booking),
}));

export const resourceBookingRelations = relations(resourceBooking, ({one}) => ({
	booking: one(booking, {
		fields: [resourceBooking.bookingId],
		references: [booking.id]
	}),
	resource: one(resource, {
		fields: [resourceBooking.resourceId],
		references: [resource.id]
	}),
}));

export const resourceRelations = relations(resource, ({many}) => ({
	resourceBookings: many(resourceBooking),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	user: one(user, {
		fields: [conversations.creatorId],
		references: [user.id]
	}),
	booking: one(booking, {
		fields: [conversations.bookingId],
		references: [booking.id]
	}),
	conversationParticipants: many(conversationParticipants),
	messages: many(messages),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({one}) => ({
	conversation: one(conversations, {
		fields: [conversationParticipants.conversationId],
		references: [conversations.id]
	}),
	user: one(user, {
		fields: [conversationParticipants.userId],
		references: [user.id]
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	user: one(user, {
		fields: [messages.senderId],
		references: [user.id]
	}),
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id]
	}),
}));