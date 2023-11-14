import { WSStateContext } from "@/app/socketProvider";
import { useContext, useEffect, useState } from "react";

type User = {
	name: string;
	message: string;
};

export default function Chat() {
	const socket = useContext(WSStateContext);
	const [name, setName] = useState("");
	const [checkIn, setCheckIn] = useState(false);
	const [messages, setMessages] = useState<User[]>([]);
	const [message, setMessage] = useState("");

	function CheckIn() {
		socket?.emit("join", JSON.stringify({ name }));

		setCheckIn(!checkIn);
	}

	useEffect(() => {
		socket?.on("messageResponse", (data) => {
			const parsedData: User = JSON.parse(data);
			console.log(parsedData);
			setMessages((curr) => [...curr, parsedData]);
		});
	}, [socket]);

	function sendMessage() {
		socket?.emit("message", JSON.stringify({ message, name }));
		setMessage("");
	}

	return (
		<div className="flex flex-col justify-between items-center h-full">
			{!checkIn ? (
				<div className="flex justify-between gap-2 m-2 h-12">
					<input
						onKeyDown={(e) => {
							if (e.key === "Enter") CheckIn();
						}}
						className="text-black text-xl px-2 w-64"
						type="text"
						onChange={(e) => setName(e.target.value)}
					/>
					<button className="border rounded-md p-2 hover:bg-gray-800" onClick={CheckIn}>
						Check In
					</button>
				</div>
			) : (
				<>
					<h1>Chat</h1>
					<div className="flex justify-between flex-col items-start w-full h-full">
						<div className="border-t border-gray-500 w-full flex flex-col justify-between">
							<div className="px-2">
								{messages.map((item, index) => {
									return (
										<li key={index} className={`list-none`}>
											{item.name}: {item.message}
										</li>
									);
								})}
							</div>
							<br />
							<div className="flex justify-between gap-2 mt-2 h-12 px-2">
								<input
									className="text-black text-xl px-2 w-full"
									type="text"
									onKeyDown={(e) => {
										if (e.key === "Enter") sendMessage();
									}}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
								<button className="border rounded-md p-2 hover:bg-gray-800" onClick={sendMessage}>
									Send
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
