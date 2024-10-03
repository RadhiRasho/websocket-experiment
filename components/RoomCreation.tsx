import type { Room } from "@/types/typebox";
import { RoomCreationForm } from "./RoomCreationForm";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

type Props = {
	onCreate: (info: Room) => void;
};

export function RoomCreation({ onCreate }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">Create Room</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle className="text-center">Create a room</DialogTitle>
					<DialogDescription>
						Enter the name of the room and the word to be guessed. You can also
						optionally set a password for the room, as well as hints for the
						word, but these are not required.
					</DialogDescription>
				</DialogHeader>
				<RoomCreationForm />
			</DialogContent>
		</Dialog>
	);
}
