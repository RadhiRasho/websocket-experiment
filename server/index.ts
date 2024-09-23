import { FRONTEND_DEV_URL, publishActions } from "@/types/Constants";
import type { DataToSend, Message } from "@/types/types";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const messages: Message[] = [];
const topic = "chat-room";

const app = new Elysia()
	.use(cors({ origin: FRONTEND_DEV_URL }))
	.ws("/ws", {
		open(ws) {
			ws.subscribe(topic);

			console.log(`WebSocket server opened and subscribed to topic '${topic}'`);
		},
		message(ws, message) {
			ws.publish(topic, JSON.stringify(message));
		},
		close(ws, code, message) {
			ws.unsubscribe(topic);
			console.log(
				`WebSocket server closed and unsubscribed from topic '${topic}'`,
			);
		},
	})
	.get("/", (c) => "Hello, World!")
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
			action: publishActions.UPDATE_CHAT,
			message: message,
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
			action: publishActions.DELETE_CHAT,
			message: messages[index],
		};

		messages.splice(index, 1);
		server?.publish(topic, JSON.stringify(data));

		return { ok: true };
	})
	.listen(8080);

export type AppType = typeof app;
