import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { eventHandler } from "./utils";

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

const ws = app.get(
	"/ws",
	upgradeWebSocket((c) => {
		return {
			onMessage: (evt, ws) => eventHandler(evt, ws),
		};
	}),
);

export type WebSocketApp = typeof ws;

Bun.serve({
	fetch: app.fetch,
	port: 8080,
	websocket,
});

console.log("Listening on port: ", 8080);
