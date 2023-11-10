'use client';
import { createContext } from "react";

export const SocketContext = createContext<WebSocket | null>(null);

type SocketProviderProps = {
    children: React.ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
    const socket = new WebSocket("wss://localhost:8080");

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}