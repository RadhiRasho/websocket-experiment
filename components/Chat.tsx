"use client";
import {
	$getMessages,
	$postMessages,
	useHonoSocket,
} from "@/providers/HonoSocket";
import type { Message } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Chat() {
	const socket = useHonoSocket();
	const [message, setMessage] = useState("");
	const { data, isSuccess, refetch } = useQuery<Message[]>({
		queryKey: ["messages", socket?.pong],
		initialData: [],

		queryFn: async () => {
			const data = await $getMessages();

			return data.json();
		},
		refetchOnWindowFocus: "always",
		refetchIntervalInBackground: true,
		// refetchInterval: 5000,
	});
	const messagesRef = useRef<HTMLOListElement>(null);

	useEffect(() => {
		if (data) {
			messagesRef.current?.lastElementChild?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [data]);

	async function sendMessage() {
		if (message.length === 0) {
		}

		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.log("socket not open");
			return;
		}

		if (socket.readyState === WebSocket.OPEN) {
			setMessage("");

			await $postMessages({
				json: {
					id: isSuccess ? data.length + 1 : Math.floor(Math.random() * 100),
					text: message,
				},
			});
			await refetch();

			messagesRef.current?.lastElementChild?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}

	return (
		<div className="flex flex-col justify-between items-center min-h-[80vh] h-full max-h-min border border-gray-500">
			<h1>Chat</h1>
			<div className="flex justify-between flex-col items-start">
				<div className="border-t border-gray-500 w-full flex flex-col justify-between">
					<div className="p-2 overflow-auto">
						<ol ref={messagesRef}>
							{data?.map((item, index) => {
								return (
									<li key={`${item.id}-${index}`} className={"list-none"}>
										{item.id}: {item.text}
									</li>
								);
							})}
						</ol>
					</div>
				</div>
				<div className="flex justify-between gap-2 m-2">
					<Input
						type="text"
						onKeyDown={(e) => {
							if (e.key === "Enter") sendMessage();
						}}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button type="button" onClick={sendMessage}>
						Send
					</Button>
				</div>
			</div>
		</div>
	);
}
