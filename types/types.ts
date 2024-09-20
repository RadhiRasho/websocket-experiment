import type { publishActions } from "./Constants";

export type Message = {
	id: number;
	text: string;
	date: string;
};

type PublishAction = (typeof publishActions)[keyof typeof publishActions];

export type DataToSend = {
	action: PublishAction;
	message: Message;
};

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

export type Room = {
	name: string;
	users: string[];
};

export type CanvasMessage = {
	type: "canvas";
	src: string;
};