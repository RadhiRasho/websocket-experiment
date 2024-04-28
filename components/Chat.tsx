import { useHonoSocket } from "@/providers/HonoSocket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Message = {
	name: string;
	message: string;
};

export default function Chat() {
	const socket = useHonoSocket();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState("");
	const { room } = useParams<{ room: string }>();

	useEffect(() => {
		if (socket?.readyState === WebSocket.OPEN) {
			socket?.send(JSON.stringify({ type: "joinRoom", data: { room } }));

			socket.onmessage = (event) => {
				const data: { type: string; name: string; message: string } =
					JSON.parse(event.data);
				if (data.type === "messageResponse") {
					setMessages((prev) => [
						...prev,
						{ name: data.name, message: data.message },
					]);
				}
			};
		}
	}, [room, socket]);

	function sendMessage() {
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.log("socket not open");
			return;
		}

		if (socket.readyState === WebSocket.OPEN) {
			const messageEvent = JSON.stringify({
				type: "message",
				data: { message, room },
			});
			socket.send(messageEvent);
		}
	}

	return (
		<div className="flex flex-col justify-between items-center h-full">
			<>
				<h1>Chat</h1>
				<div className="flex justify-between flex-col items-start w-full h-full">
					<div className="border-t border-gray-500 w-full flex flex-col justify-between">
						<div className="px-2">
							{messages.map((item, index) => {
								return (
									<li key={`${item.name}-${index}`} className={"list-none"}>
										{item.name}: {item.message}
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
