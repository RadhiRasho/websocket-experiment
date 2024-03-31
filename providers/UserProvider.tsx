"use client";
import type { User, UserContext as uContext } from "@/types/User";
import { createContext, useContext, useState, type ReactNode } from "react";

export const UserContext = createContext<uContext | null>(null);

type UserProviderProps = {
	children: ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User | null>(null);

	function Login(name: string, role: string) {
		setUser({ id: `${name}-${Math.random() * 1000}`, name, role });
	}

	function Logout() {
		setUser(null);
	}

	return (
		<UserContext.Provider value={{ user, Login, Logout }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUserContext = () => useContext(UserContext);
