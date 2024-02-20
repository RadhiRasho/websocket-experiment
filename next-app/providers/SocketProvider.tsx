"use client";
import { createContext, useEffect, ReactNode, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

type SocketProviderProps = { children: ReactNode };

export const WSStateContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
	const [ws, setWS] = useState<Socket | null>(null);

	useEffect(() => {
		const socket = io("wss://localhost:8080");

		socket.on("connect", () => {
			console.log("connected");
		});

		setWS(socket);
	}, []);

	return (
		<WSStateContext.Provider value={ws}>{children}</WSStateContext.Provider>
	);
}
