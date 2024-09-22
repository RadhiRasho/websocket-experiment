"use client";
import type { User, UserContext as uContext } from "@/types/types";
import { type ReactNode, createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";

export const UserContext = createContext<uContext | null>(null);

type UserProviderProps = { children: ReactNode };

export default function UserProvider({ children }: UserProviderProps) {
	const [value, setValue, removeValue] = useLocalStorage<User | null>(
		"user",
		null,
		{
			initializeWithValue: false,
		},
	);

	function Login(name: string, role: string, id?: string) {
		const data = {
			id: id ? `${id}` : `${name}-${Math.random() * 100}`,
			name,
			role,
		};

		if (!value) {
			setValue(data);
		}
	}
	function Logout() {
		removeValue();
	}

	return (
		<UserContext.Provider value={{ user: value ?? null, Login, Logout }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUserContext = () => useContext(UserContext);
