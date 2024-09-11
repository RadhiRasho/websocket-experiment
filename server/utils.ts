import type { WSContext, WSMessageReceive } from "hono/ws";

export function eventHandler<T>(
	event: MessageEvent<WSMessageReceive>,
	ws: WSContext,
) {
	if (typeof event !== "object") {
		return "No Strings";
	}

	const { type, data }: MessageEvent<WSMessageReceive> = event;

	switch (type) {
		case "message": {
			const messageEvent = new MessageEvent("message", {
				data,
			});

			ws?.send(JSON.stringify(messageEvent));
			break;
		}
		case "join":
			break;
		default:
	}
}
