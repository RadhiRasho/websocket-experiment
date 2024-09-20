"use client";
import Chat from "@/components/Chat";
import { useHonoSocket } from "@/providers/HonoSocket";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function View() {
	const socket = useHonoSocket();
	const [src, setSrc] = useState<string | StaticImport>();

	useEffect(() => {
		if (socket?.readyState === WebSocket.OPEN) {
			console.log(socket.readyState);
			socket.onmessage = (evt) => {
				console.log(evt);
			};
		}
	}, [socket?.onmessage, socket]);

	return (
		<main className="flex flex-col items-center justify-start gap-2 p-4">
			<div className="w-7/12">
				{src && (
					<Image
						src={src}
						title="shit"
						alt="stuck"
						width={1000}
						height={1000}
					/>
				)}
			</div>
			<Chat />
		</main>
	);
}
