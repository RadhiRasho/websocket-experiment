"use client";

import { RoomCard } from "@/components/Room";
import { Button } from "@/components/ui/button";
import { $getRooms } from "@/providers/Socket";
import type { Rooms } from "@/types/typebox";
import type { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useReadLocalStorage } from "usehooks-ts";

export default function Home() {
	const user = useReadLocalStorage<User>("user");
	const router = useRouter();

	const { data: rooms, isSuccess } = useQuery<Rooms>({
		initialData: [],
		queryKey: ["Rooms"],
		queryFn: async () => {
			const { data: resData, error } = await $getRooms();

			if (error) {
				console.log("something went wrong");
			}

			return resData ?? [];
		},
	});

	useEffect(() => {
		if (!user) {
			router.push("login");
		}
	}, [router, user]);

	async function createRoom() {
		console.log("clicked");
	}

	async function join(name: string) {
		console.log(name);
	}

	return (
		<main className="flex flex-col items-center justify-start gap-2 p-4">
			<div className="grid gap-2 max-w-sm w-full">
				<Button type="button" onClick={createRoom}>
					Create
				</Button>
			</div>
			<br />
			<span className="text-[2rem]">Live Rooms</span>
			<div className="grid grid-flow-row grid-cols-4 gap-2">
				{isSuccess &&
					rooms.map((room) => (
						<RoomCard
							key={room.name}
							join={() => join(room.name)}
							room={room}
						/>
					))}
			</div>
		</main>
	);
}
