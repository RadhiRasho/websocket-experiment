import { hc } from "hono/client";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import type { WebSocketApp } from "../server/hono";

export const WSStateContext = createContext<WebSocket | null>(null);

type SocketProviderProps = { children: ReactNode };

export function SocketProvider({ children }: SocketProviderProps) {
	const [ws, setWs] = useState<WebSocket | null>(null);

	const init = useCallback(async () => {
		const client = hc<WebSocketApp>("http://localhost:8080");
		const socket = client.ws.$ws("/ws");

		setWs(socket);
	}, []);

	useEffect(() => {
		init();
	}, [init]);

	return (
		<WSStateContext.Provider value={ws}>{children}</WSStateContext.Provider>
	);
}
