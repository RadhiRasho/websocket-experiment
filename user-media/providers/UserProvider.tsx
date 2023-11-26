import { createContext } from "react";

type User = {
	id: string;
	username: string;
	avatar: string;
};

export const UserStateContext = createContext<User | null>(null);

type UserProviderProps = {
	children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
	return <UserStateContext.Provider value={null}>{children}</UserStateContext.Provider>;
}
