"use client";
import { hc } from "hono/client";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { AppType } from "../server";
import { BACKEND_DEV_URL } from "@/types/Constants";

export const HonoSocketContext = createContext<WebSocket | null>(null);

type HonoSocketProps = { children: ReactNode };

const client = hc<AppType>(BACKEND_DEV_URL);

export function HonoSocketProvider({ children }: HonoSocketProps) {
	const [ws, setWs] = useState<WebSocket>({} as WebSocket);

	useEffect(() => {
		const socket = client.ws.$ws();
		socket.onopen = () => {
			console.log("Websocket connected");
		};
		setWs(socket);
	}, []);

	return (
		<HonoSocketContext.Provider value={ws}>
			{children}
		</HonoSocketContext.Provider>
	);
}

// export client;
export const useHonoSocket = () => useContext(HonoSocketContext);
export const $getMessages = () => client.messages.$get();
export const $postMessages = (Data: { json: { id: number; text: string } }) =>
	client.messages.$post(Data);