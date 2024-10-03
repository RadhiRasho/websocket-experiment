import type { Room } from "@/types/typebox";
import Image from "next/image";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

interface RoomProps {
	room: Room;
	join: () => void;
}

export function RoomCard({ room, join }: RoomProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{room.name}</CardTitle>
				<CardDescription>{room.drawer.name}</CardDescription>
			</CardHeader>
			<CardContent>
				<Image alt="Placeholder" src={"/next.svg"} width={200} height={200} />
			</CardContent>
			<CardFooter>
				<Button onClick={join}>Join Room</Button>
			</CardFooter>
		</Card>
	);
}
