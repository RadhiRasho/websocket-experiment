import {
	type DataToSend,
	DataToSendSchema,
	FRONTEND_DEV_URL,
	type Message,
	MessageSchema,
	type Room,
	RoomSchema,
	type Rooms,
	RoomsSchema,
	publishActions,
} from "@/types/typebox";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const messages: Message[] = [];
const rooms: Rooms = [];
const topic = "chat-room";

const app = new Elysia({
	normalize: true,
	nativeStaticResponse: true,
	precompile: true,
})
	.use(cors({ origin: FRONTEND_DEV_URL }))
	.onError(({ code, error }) => {
		switch (code) {
			case "VALIDATION":
				return error.validator.Errors(error.value).First();
			default:
				return error.message;
		}
	})
	.get("/", "Hello, World!")
	.ws("/ws", {
		body: DataToSendSchema,
		message(ws, message) {
			if (message === "ping") {
				ws.send("pong");
			}
			ws.publish(topic, message);
		},
		open(ws) {
			ws.subscribe(topic);

			console.log(`WebSocket server opened and subscribed to topic '${topic}'`);
		},
		close(ws) {
			ws.unsubscribe(topic);
			console.log(
				`WebSocket server closed and unsubscribed from topic '${topic}'`,
			);
		},
	})
	.get("/messages", () => messages)
	.post(
		"/messages",
		async ({ body, server }) => {
			const { id, text } = body satisfies Message;
			const currentDateTime = new Date();

			const message: Message = {
				id,
				text,
				date: `${currentDateTime.toDateString()} ${currentDateTime.toDateString()}`,
			};

			const data: DataToSend = {
				type: publishActions.UPDATE_CHAT,
				data: message,
			};

			messages.push(message);
			server?.publish(topic, JSON.stringify(data));
			return { ok: true };
		},
		{
			body: MessageSchema,
		},
	)
	.delete(
		"/messages",
		async ({ set, body, server }) => {
			const newMessage = body satisfies Message;

			const index = messages.findIndex(
				(message) => message.id === newMessage.id,
			);

			if (index === -1 || messages[index] === undefined) {
				set.status = 404;
				return { ok: false, error: "Message not found" };
			}

			const data: DataToSend = {
				type: publishActions.DELETE_CHAT,
				data: messages[index],
			};

			messages.splice(index, 1);
			server?.publish(topic, JSON.stringify(data));

			return { ok: true };
		},
		{
			body: MessageSchema,
		},
	)
	.get("/rooms", () => rooms, {
		response: RoomsSchema,
	})
	.post(
		"/rooms",
		async ({ body }) => {
			const room = body satisfies Room;

			rooms.push(room);

			return { ok: true };
		},
		{
			body: RoomSchema,
		},
	)
	.listen(8080);

console.log(`🦊 is listening at ${app.server?.url}`);

export type AppType = typeof app;
