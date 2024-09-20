"use client";

import Canvas from "@/components/Canvas";

type Props = {
	params: {
		room: string;
	};
};

export default function Home({ params }: Props) {
	return (
		<main className="flex flex-col items-center justify-start gap-2 p-4">
			<Canvas />
		</main>
	);
}
