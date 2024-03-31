import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

const myWS = app.get(
	"/ws",
	upgradeWebSocket((c) => {
		return {
			onMessage(event, ws) {
				console.log(`Message from client: ${event.data}`);

				ws.send("Hello from server");
			},
			onClose: () => {
				console.log("Connection closed");
			},
			onError(evt) {
				console.error(evt);
			},
		};
	}),
);

export type WebSocketApp = typeof myWS;

Bun.serve({
	fetch: app.fetch,
	port: 8080,
	websocket,
});