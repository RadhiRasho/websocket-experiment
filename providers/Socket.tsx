"use client";
import type { AppType } from "@/server";
import { BACKEND_DEV_URL, BACKEND_DEV_WS_URL } from "@/types/Constants";
import { treaty } from "@elysiajs/eden";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const SocketContext = createContext<WebSocket | null>(null);

type SocketProps = { children: ReactNode };

const api = treaty<AppType>(BACKEND_DEV_URL);

export function SocketProvider({ children }: SocketProps) {
	const [ws, setWs] = useState<WebSocket>({} as WebSocket);

	useEffect(() => {
		const socket = api.ws.subscribe();

		socket.on("open", () => {
			console.log("Socket Opened");

			setWs(socket as unknown as WebSocket);
		});
	}, []);

	return <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
export const $getMessages = () => api.messages.get();
export const $postMessages = (data: { id: number; text: string }) =>
	api.messages.post(data);
export const $deleteMessage = (data: { id: number; text: string }) =>
	api.messages.delete(data);
