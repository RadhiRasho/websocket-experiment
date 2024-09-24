export type User = {
	id: string;
	name: string;
	role: string;
};

export type UserContext = {
	user: User | null;
	Login: (name: string, role: string, id?: string) => void;
	Logout: () => void;
};
