"use client";
import { $getMessages, $postMessages, useSocket } from "@/providers/Socket";
import { type DataToSend, type Message, publishActions } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Chat() {
	const socket = useSocket();
	const [message, setMessage] = useState("");
	const { data, isSuccess, refetch } = useQuery<Message[]>({
		queryKey: ["messages"],
		initialData: [],
		queryFn: async () => {
			const { data: resData, error } = await $getMessages();

			if (error) {
				console.log("something went wrong");
			}

			return resData ?? [];
		},
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

		if (!socket || socket.ws?.readyState !== WebSocket.OPEN) {
			console.log("socket not open");
			return;
		}

		if (socket.ws?.readyState === WebSocket.OPEN) {
			setMessage("");

			await $postMessages({
				id: isSuccess ? data.length + 1 : Math.floor(Math.random() * 100),
				text: message,
			});
			await refetch();

			messagesRef.current?.lastElementChild?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}
	if (!socket) {
		return <div>Connecting...</div>;
	}

	useEffect(() => {
		if ("on" in socket) {
			socket.on("message", async (event) => {
				const data: DataToSend = event.data as DataToSend;
				if (data.type === publishActions.UPDATE_CHAT) {
					await refetch();
					messagesRef.current?.lastElementChild?.scrollIntoView({
						behavior: "smooth",
					});
				}
			});
		}
	}, [refetch, socket]);

	return (
		<div className="flex flex-col justify-between items-center !min-h-[80vh] h-full max-h-[80vh] border border-gray-500">
			<h1>Chat</h1>
			<div className="flex justify-between flex-col items-start">
				<div className="border-t border-gray-500 w-full flex flex-col justify-between">
					<ol
						className="p-2 overflow-auto h-fit max-h-[70vh]"
						ref={messagesRef}
					>
						{data?.map((item, index) => {
							return (
								<li key={`${item.id}-${index}`} className={"list-none"}>
									{item.id}: {item.text}
								</li>
							);
						})}
					</ol>
				</div>
				<div className="flex justify-between gap-2 p-2 border-t border-gray-500">
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
