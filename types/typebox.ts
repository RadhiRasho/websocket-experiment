import { publishActions } from "./types";
import { t, type Static } from "elysia";

export const MessageSchema = t.Object({
	id: t.Number(),
	text: t.String(),
	date: t.String(),
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

// Combine them into a union type
export const DataToSendSchema = t.Union([
	UpdateChatSchema,
	DeleteChatSchema,
	UpdateCanvasSchema,
]);

export type DataToSend = Static<typeof DataToSendSchema>;
