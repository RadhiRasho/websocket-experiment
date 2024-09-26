import type { Room } from "@/types/typebox";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader } from "./ui/card";

interface RoomProps {
	room: Room;
	join: () => void;
}

export function RoomCard({ room, join }: RoomProps) {
	return (
		<Card>
			<CardHeader>{room.name}</CardHeader>
			<CardDescription>{room.drawer.name}</CardDescription>
			<Button onClick={join}>Join Room</Button>
		</Card>
	);
}
