"use client";

import Canvas from "@/components/Canvas";
import Chat from "@/components/Chat";

type Props = {
	params: {
		room: string;
	};
};

export default function Home({ params }: Props) {
	return (
		<main className="flex items-center justify-start gap-2 h-full max-h-[80vh] m-4">
			<Canvas />
			<Chat />
		</main>
	);
}
