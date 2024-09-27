"use client";
import { $getMessages, $postMessages, socketUrl } from "@/providers/Socket";
import { type Message, publishActions } from "@/types/typebox";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Chat() {
	const { readyState, lastMessage } = useWebSocket(socketUrl, {
		onOpen: () => console.log("Opened"),
		shouldReconnect: (e) => true,
		heartbeat: {
			interval: 20000,
			timeout: 60000,
			returnMessage: "pong",
			message: "ping",
		},
	});

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

		if (readyState !== ReadyState.OPEN) {
			console.log("Socket Not Ready");
			return;
		}

		if (readyState === ReadyState.OPEN) {
			setMessage("");

			await $postMessages({
				id: isSuccess
					? (data.length + 1).toString()
					: Math.floor(Math.random() * 100).toString(),
				text: message,
			});
			await refetch();

			messagesRef.current?.lastElementChild?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}

	useEffect(() => {
		async function handle() {
			if (lastMessage?.type === publishActions.UPDATE_CHAT) {
				await refetch();
				messagesRef.current?.lastElementChild?.scrollIntoView({
					behavior: "smooth",
				});
			}
		}
		handle();
	}, [refetch, lastMessage]);

	return (
		<div className="flex flex-col justify-between min-h-[80vh] h-full border border-gray-500">
			<h1 className="border border-b-gray-500 w-full text-center shadow shadow-white">
				Chat
			</h1>
			<div className="flex justify-between flex-col items-start">
				<div className="w-full flex flex-col justify-between">
					<ol className="p-2 overflow-auto h-full" ref={messagesRef}>
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
