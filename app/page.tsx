"use client";

import { useHonoSocket } from "@/providers/HonoSocket";
import { useUserContext } from "@/providers/UserProvider";
import type { Room } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const socket = useHonoSocket();
	const userContext = useUserContext();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [createName, setCreateName] = useState("");
	const [createError, setCreateError] = useState<Error | null>(null);
	const [joinError, setJoinError] = useState<Error | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (!userContext?.user) {
			router.push("/login");
		}

		if (socket?.readyState === WebSocket.OPEN) {
			socket.send("getRooms");
			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.type === "getRoomsResponse") {
					if (data.success === false) {
						setJoinError(data);
						return;
					}
					setRooms(data.rooms);
				}
			};
		}
	}, [userContext?.user, router, socket, socket?.emit]);

	function createRoom() {
		if (socket?.readyState === WebSocket.OPEN) {
			const createEvent = JSON.stringify({
				type: "createRoom",
				data: { name: createName },
			});
			socket?.send(createEvent);

			socket.send("getRooms");
			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.success === false) {
					setCreateError(data);
					return;
				}
				setRooms(data.rooms);
			};

			router.push(`/drawer/${createName}`);
			setCreateName("");
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-start gap-2 p-4">
			<div className="flex gap-2 flex-col items-start">
				<div className="flex gap-2">
					<input
						className="text-black text-xl px-2 w-full rounded-md"
						onChange={(e) => setCreateName(e.target.value)}
						placeholder="Create A Room"
					/>
					<button
						type="button"
						onClick={createRoom}
						className="border rounded-md p-2 w-40 hover:bg-gray-800"
					>
						Create
					</button>
				</div>
				{createError && <span>{createError.message}</span>}
				<div className="flex gap-2">
					<input
						className="text-black text-xl px-2 w-full rounded-md"
						placeholder="Join A Room"
					/>
					<button
						type="button"
						className="border rounded-md p-2 w-40 hover:bg-gray-800"
					>
						Join
					</button>
				</div>
				{joinError && <span>{joinError.message}</span>}
			</div>
			<br />
			<span className="text-[2rem]">Live Rooms</span>
			<div className="grid grid-flow-row grid-cols-4 gap-2">
				{rooms?.length > 0 &&
					rooms.map((room) => (
						<button
							key={room.name}
							type="button"
							className="border rounded-md p-2 hover:bg-gray-800"
						>
							{room.name}
						</button>
					))}
			</div>
		</main>
	);
}
