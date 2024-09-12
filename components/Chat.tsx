"use client";
import {
	$getMessages,
	$postMessages,
	useHonoSocket,
} from "@/providers/HonoSocket";
import { useUserContext } from "@/providers/UserProvider";
import type { Message } from "@/types/types";
import { useEffect, useState } from "react";

export default function Chat() {
	const socket = useHonoSocket();
	const { user } = useUserContext();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState("");
	const [refetch, setRefetch] = useState<boolean | null>(null);

	useEffect(() => {
		async function getData() {
			if (refetch || refetch == null) {
				const response = await $getMessages();
				const ms = (await response.json()) satisfies Message[];

				setMessages(ms);
			}
			setRefetch(false);
		}
		getData();
	}, [refetch]);

	function sendMessage() {
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.log("socket not open");
			return;
		}

		if (socket.readyState === WebSocket.OPEN) {
			$postMessages({
				json: {
					id: messages.length + 1,
					text: message,
				},
			});

			setRefetch(true);
		}
	}

	return (
		<div className="flex flex-col justify-between items-center h-full">
			<>
				<h1>Chat</h1>
				<div className="flex justify-between flex-col items-start w-full h-full">
					<div className="border-t border-gray-500 w-full flex flex-col justify-between">
						<div className="px-2">
							{messages?.map((item, index) => {
								return (
									<li key={`${item.id}-${index}`} className={"list-none"}>
										{item.id}: {item.text}
									</li>
								);
							})}
						</div>
						<br />
					</div>
					<div className="flex justify-between gap-2 my-2 h-12 px-2">
						<input
							className="text-black text-xl px-2 w-full rounded-md"
							type="text"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									sendMessage();
								}
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
			</>
		</div>
	);
}
