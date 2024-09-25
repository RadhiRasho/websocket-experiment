import { type Static, t } from "elysia";

export const FRONTEND_DEV_URL = "http://localhost:3000";
export const BACKEND_DEV_URL = "http://localhost:8080";
export const BACKEND_DEV_WS_URL = "ws://localhost:8080/ws";

export const publishActions = {
	UPDATE_CHAT: "UPDATE_CHAT",
	DELETE_CHAT: "DELETE_CHAT",
	UPDATE_CANVAS: "UPDATE_CANVAS",
} as const;

export const MessageSchema = t.Object({
	id: t.String(),
	text: t.String(),
	date: t.Optional(t.String()),
});

export type Message = Static<typeof MessageSchema>;

export const PublishActionSchema = t.Union([
	t.Literal(publishActions.UPDATE_CHAT),
	t.Literal(publishActions.DELETE_CHAT),
	t.Literal(publishActions.UPDATE_CANVAS),
]);

export type PublishAction = Static<typeof PublishActionSchema>;

const DataToSendMapSchema = t.Record(t.String(), t.Any(), {
	[publishActions.UPDATE_CHAT]: MessageSchema,
	[publishActions.DELETE_CHAT]: MessageSchema,
	[publishActions.UPDATE_CANVAS]: t.String(),
});

export type DataToSendMap = Static<typeof DataToSendMapSchema>;

const UpdateChatSchema = t.Object({
	type: t.Literal(publishActions.UPDATE_CHAT),
	data: MessageSchema,
});

const DeleteChatSchema = t.Object({
	type: t.Literal(publishActions.DELETE_CHAT),
	data: MessageSchema,
});

const UpdateCanvasSchema = t.Object({
	type: t.Literal(publishActions.UPDATE_CANVAS),
	data: t.String(),
});

const PingMessageSchema = t.String();

// Combine them into a union type
export const DataToSendSchema = t.Union([
	UpdateChatSchema,
	DeleteChatSchema,
	UpdateCanvasSchema,
	PingMessageSchema,
]);

export type DataToSend = Static<typeof DataToSendSchema>;

// Assuming the User type is defined as follows:
export const UserSchema = t.Object({
	id: t.String(),
	name: t.String(),
	role: t.String(),
});

export type User = Static<typeof UserSchema>;

export const UsersSchema = t.Array(UserSchema);

export type Users = Static<typeof UsersSchema>;

export const RoomSchema = t.Object({
	name: t.String({ maxLength: 255 }),
	drawer: UserSchema,
	users: t.Optional(t.Array(UserSchema)),
	word: t.String(),
	hints: t.Optional(
		t.Array(t.String(), {
			minItems: 3,
		}),
	),
});

export type Room = Static<typeof RoomSchema>;

export const RoomsSchema = t.Array(RoomSchema);

export type Rooms = Static<typeof RoomsSchema>;

export const RoomCreationSchema = t.Object({
	name: t.String({
		maxLength: 255,
		minLength: 1,
		error: { minLength: "Room Name is required" },
	}),
	word: t.String({ error: "Word is required", minLength: 1 }),
	hints: t.Optional(
		t.Array(t.String(), {
			minItems: 3,
			error: "At least 3 hints are required",
		}),
	),
	password: t.Optional(t.String(), true),
});

export type RoomCreation = Static<typeof RoomCreationSchema>;
