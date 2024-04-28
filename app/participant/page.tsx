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
			socket.onmessage = (event) => {
				const data: { type: string; data: string } = JSON.parse(event.data);
				setSrc(data.data);
			};
		}
	}, [socket]);

	return (
		<div className="flex justify-between gap-2">
			<div className="w-7/12">
				{src && (
					<Image
						src={src}
						alt="stuck"
						title="shit"
						width={1000}
						height={1000}
					/>
				)}
			</div>
			<div className="w-4/12">
				<Chat />
			</div>
		</div>
	);
}
