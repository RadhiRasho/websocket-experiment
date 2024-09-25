import type { User } from "./typebox";

export type UserContext = {
	user: User | null;
	Login: (name: string, role: string, id?: string) => void;
	Logout: () => void;
};
