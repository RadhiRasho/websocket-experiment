import { DataToSendSchema } from "@/types/typebox";
import {
	FRONTEND_DEV_URL,
	publishActions,
	type DataToSend,
	type Message,
} from "@/types/types";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const messages: Message[] = [];
const topic = "chat-room";

const app = new Elysia()
	.use(cors({ origin: FRONTEND_DEV_URL }))
	.get("/", "Hello, World!")
	.ws("/ws", {
		body: DataToSendSchema,
		message(ws, message) {
			console.log(message);
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
	.post("/messages", async ({ request, server }) => {
		const { id, text } = await request.json();
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
	})
	.delete("/messages", async ({ set, request, server }) => {
		const body = await request.json();

		const messageId = Number.parseInt(body.id);

		const index = messages.findIndex((message) => message.id === messageId);

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
	})
	.onError(({ error }) => {
		console.error(error);
	})
	.listen(8080);

console.log(`🦊 is listening at ${app.server?.url}`);

export type AppType = typeof app;
