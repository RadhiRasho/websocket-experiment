export const FRONTEND_DEV_URL = "http://localhost:3000";
export const BACKEND_DEV_URL = "http://localhost:8080";
export const BACKEND_DEV_WS_URL = "ws://localhost:8080/ws";

export const publishActions = {
	UPDATE_CHAT: "UPDATE_CHAT",
	DELETE_CHAT: "DELETE_CHAT",
	UPDATE_CANVAS: "UPDATE_CANVAS",
} as const;

export type Message = {
	id: number;
	text: string;
	date: string;
};
export type PublishAction =
	(typeof publishActions)[keyof typeof publishActions];

type DataToSendMap = {
	[publishActions.UPDATE_CHAT]: Message;
	[publishActions.DELETE_CHAT]: Message;
	[publishActions.UPDATE_CANVAS]: string;
};

export type DataToSend = {
	[K in keyof typeof publishActions]: {
		type: (typeof publishActions)[K];
		data: DataToSendMap[(typeof publishActions)[K]];
	};
}[keyof typeof publishActions];

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
