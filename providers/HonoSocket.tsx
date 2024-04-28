"use client";
import { hc } from "hono/client";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { WebSocketApp } from "../server";

export const HonoSocketContext = createContext<WebSocket | null>(null);

type HonoSocketProps = { children: ReactNode };

const client = hc<WebSocketApp>("ws://localhost:8080");

export function HonoSocketProvider({ children }: HonoSocketProps) {
	const [ws, setWs] = useState<WebSocket | null>(null);

	useEffect(() => {
		const socket = client.ws.$ws(0);
		socket.onopen = () => {
			console.log("connected to server");
		};

		setWs(socket);
	}, []);

	return (
		<HonoSocketContext.Provider value={ws}>
			{children}
		</HonoSocketContext.Provider>
	);
}

export const useHonoSocket = () => useContext(HonoSocketContext);
export const $get = client.ws.$get;
