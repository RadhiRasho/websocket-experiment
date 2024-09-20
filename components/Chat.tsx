"use client";
import {
	$getMessages,
	$postMessages,
	useHonoSocket,
} from "@/providers/HonoSocket";
import type { Message } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
	const socket = useHonoSocket();
	const [message, setMessage] = useState("");
	const { data, isSuccess, refetch } = useQuery<Message[]>({
		queryKey: ["messages"],
		initialData: [],
		queryFn: async () => {
			const data = await $getMessages();

			return data.json();
		},
		refetchOnWindowFocus: true,
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
		<div className="flex flex-col justify-between items-center h-full max-h-screen">
			<h1>Chat</h1>
			<div className="flex justify-between flex-col items-start w-full h-full max-h-screen">
				<div className="border-t border-gray-500 w-full flex flex-col justify-between">
					<div className="px-2 h-96 max-h-full overflow-auto">
						<ol ref={messagesRef} className="overflow-auto">
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
				<div className="flex justify-between gap-2 my-2 h-12 px-2">
					<input
						className="text-black text-xl px-2 w-full rounded-md"
						type="text"
						onKeyDown={(e) => {
							if (e.key === "Enter") sendMessage();
						}}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button
						type="button"
						className="border rounded-md p-2 hover:bg-gray-800"
						onClick={sendMessage}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
