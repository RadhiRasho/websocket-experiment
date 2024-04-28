import type { WSContext, WSMessageReceive } from "hono/ws";

export function eventHandler<T>(
	event: MessageEvent<WSMessageReceive>,
	ws: WSContext,
) {
	const data: { type: string; data: any } = JSON.parse(event?.data.toString());

	console.log(data);

	switch (data.type) {
		case "message": {
			const event = JSON.stringify({
				type: "messageResponse",
				data: JSON.stringify(data.data),
			});
			console.log(event);
			ws?.send(event);
			break;
		}
		case "join":
			break;
	}
}