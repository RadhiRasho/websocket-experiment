"use client";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

type SocketProviderProps = { children: ReactNode };

export const WSStateContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
	const [ws, setWs] = useState<Socket | null>(null);

	useEffect(() => {
		const socket = io("wss://localhost:8080", {
			passphrase: "HYAM",
		});

		socket.on("connect", () => {
			console.log("connected");
		});

		setWs(socket);
	}, []);

	return (
		<WSStateContext.Provider value={ws}>{children}</WSStateContext.Provider>
	);
}

export const useSocketContext = () => useContext(WSStateContext);
