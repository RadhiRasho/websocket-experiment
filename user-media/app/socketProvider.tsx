'use client'
import { createContext, useEffect, ReactNode, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client'

type SocketProviderProps = { children: ReactNode; };

export const WSStateContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
    const [ws, setWS] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io('wss://localhost:8080/websocket');

        setWS(socket);
    }, []);


    return <WSStateContext.Provider value={ws}>{children}</WSStateContext.Provider>;
};