import { FRONTEND_DEV_URL, publishActions } from "@/types/Constants";
import type { DataToSend, Message } from "@/types/types";
import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { cors } from "hono/cors";

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

const server = Bun.serve({
	fetch: app.fetch,
	reusePort: true,
	port: 8080,
	websocket,
});

const messages: Message[] = [];
const topic = "chat-room";

app.use(cors({ origin: FRONTEND_DEV_URL }));

const messageRoute = app
	.get("/messages", (c) => {
		return c.json(messages);
	})
	.post("/messages", async (c) => {
		const { id, text } = await c.req.json();
		const currentDateTime = new Date();

		const message: Message = {
			id,
			text,
			date: `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`,
		};

		const data: DataToSend = {
			action: publishActions.UPDATE_CHAT,
			message: message,
		};

		messages.push(message);
		server.publish(topic, JSON.stringify(data));
		return c.json({ ok: true }, 200);
	})
	.delete("/messages/:id{[0-9]+}", async (c) => {
		const messageId = Number.parseInt(c.req.param("id"));
		const index = messages.findIndex((message) => message.id === messageId);

		if (index === -1 || messages[index] === undefined) {
			return c.json({ ok: false, error: "Message not found" }, 404);
		}

		const data: DataToSend = {
			action: publishActions.DELETE_CHAT,
			message: messages[index],
		};

		messages.splice(index, 1);
		server.publish(topic, JSON.stringify(data));

		return c.json({ ok: true });
	})
	.get(
		"/ws",
		upgradeWebSocket((c) => {
			return {
				onOpen: (_, ws) => {
					const rawWs = ws.raw as ServerWebSocket;
					rawWs.subscribe(topic);

					console.log(`WebSocket server opened and subscribed to topic '${topic}'`);
				},
				onClose: (_, ws) => {
					const rawWs = ws.raw as ServerWebSocket;
					rawWs.unsubscribe(topic);

					console.log(
						`WebSocket server closed and unsubscribed from topic '${topic}'`,
					);
				},
			};
		}),
	);

export default {
	fetch: app.fetch,
	reusePort: true,
	port: 8080,
	websocket,
};
export type AppType = typeof messageRoute;
