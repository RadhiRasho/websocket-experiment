"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/providers/Socket";
import type { Room, User } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";

export default function Home() {
	const socket = useSocket();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [createName, setCreateName] = useState("");
	const [createError, setCreateError] = useState<Error | null>(null);
	const [joinRoomName, setJoinRoomName] = useState("");
	const [joinError, setJoinError] = useState<Error | null>(null);
	const user = useReadLocalStorage<User>("user");
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("login");
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
	}, [router, user, socket, socket?.emit]);

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

	function joinRoom() {
		if (socket?.readyState === WebSocket.OPEN) {
			const joinEvent = JSON.stringify({
				type: "joinRoom",
				data: { name: joinRoomName },
			});
			socket?.send(joinEvent);

			socket.send("getRooms");
			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.success === false) {
					setCreateError(data);
					return;
				}
				setRooms(data.rooms);
			};

			router.push(`/participant/${joinRoomName}`);
			setCreateName("");
		}
	}

	return (
		<main className="flex flex-col items-center justify-start gap-2 p-4">
			<div className="grid gap-2 max-w-sm w-full">
				<div className="grid gap-2 grid-flow-col">
					<Input
						onChange={(e) => setCreateName(e.target.value)}
						placeholder="Create A Room"
					/>
					<Button type="button" onClick={createRoom}>
						Create
					</Button>
				</div>
				{createError && <span>{createError.message}</span>}
				<div className="grid gap-2  grid-flow-col">
					<Input
						placeholder="Join A Room"
						onChange={(e) => setJoinRoomName(e.target.value)}
					/>
					<Button type="button" onClick={joinRoom}>
						Join
					</Button>
				</div>
				{joinError && <span>{joinError.message}</span>}
			</div>
			<br />
			<span className="text-[2rem]">Live Rooms</span>
			<div className="grid grid-flow-row grid-cols-4 gap-2">
				{rooms?.length > 0 &&
					rooms.map((room) => (
						<Button key={room.name} type="button">
							{room.name}
						</Button>
					))}
			</div>
		</main>
	);
}
