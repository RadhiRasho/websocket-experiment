"use client";
import type { AppType } from "@/server";
import {
	BACKEND_DEV_URL,
	BACKEND_DEV_WS_URL,
	type Message,
	type Room,
} from "@/types/typebox";
import { treaty } from "@elysiajs/eden";

const api = treaty<AppType>(BACKEND_DEV_URL);

export const $getMessages = () => api.messages.get();
export const $postMessages = (data: Message) => api.messages.post(data);
export const $deleteMessage = (data: Message) => api.messages.delete(data);
export const $getRooms = () => api.rooms.get();
export const $postRooms = (data: Room) => api.rooms.post(data);
export const socketUrl = BACKEND_DEV_WS_URL;
