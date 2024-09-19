const FRONTEND_DEV_URL = "http://localhost:3000";
const BACKEND_DEV_URL = "http://localhost:8080";
const BACKEND_DEV_WS_URL = "ws://localhost:8080/ws";

export const publishActions = {
	UPDATE_CHAT: "UPDATE_CHAT",
	DELETE_CHAT: "DELETE_CHAT",
} as const;

export { FRONTEND_DEV_URL, BACKEND_DEV_URL, BACKEND_DEV_WS_URL };
