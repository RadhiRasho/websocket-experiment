"use client";

import { WSStateContext } from "@/providers/SocketProvider";
import { useContext, useEffect, useState } from "react";

export default function Home() {
	const socket = useContext(WSStateContext);
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		socket?.emit("getRooms");
		socket?.on("getRoomsResponse", (rooms) => {
			setRooms(rooms);
		});
	}, [socket]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-start gap-2 p-4">
			<div className="flex gap-2">
				<label className="flex items-center gap-2">Create a new room</label>
				<input className="text-black text-xl px-2 w-full rounded-md" placeholder="Room name" />
				<button className="border rounded-md p-2 hover:bg-gray-800">Create</button>
			</div>
			<div className="flex gap-2">
				<label className="flex items-center gap-2">Join a room</label>
				<input className="text-black text-xl px-2 w-full rounded-md" placeholder="Room name" />
				<button className="border rounded-md p-2 hover:bg-gray-800">Join</button>
			</div>
		</main>
	);
}
