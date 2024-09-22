"use client";
import Chat from "@/components/Chat";
import { useHonoSocket } from "@/providers/HonoSocket";
import { useEffect, useRef, useState } from "react";

export default function View() {
	const socket = useHonoSocket();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [base64Image, setBase64Image] = useState<string>("");

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");
			if (ctx) {
				const img = new Image();
				img.src = base64Image;
				img.onload = () => {
					if (!canvasRef.current) return;

					canvasRef.current.width = img.width;
					canvasRef.current.height = img.height;

					// Draw the image onto the canvas
					ctx.clearRect(0, 0, img.width, img.height);
					ctx.drawImage(img, 0, 0, img.width, img.height);
				};
			}
		}
	}, [base64Image]);

	useEffect(() => {
		if (socket) {
			socket.onmessage = (event) => {
				setBase64Image(event.data);
			};
		}
	}, [socket]);

	return (
		<main className="flex flex-col items-center justify-start gap-2 p-4">
			<div className="flex justify-between w-full max-h-[80vh] gap-2">
				<div id="canvasContainer" className="w-full max-w-[90%]">
					<canvas
						className="border border-gray-500 bg-black h-full w-full"
						ref={canvasRef}
					/>
				</div>
				<Chat />
			</div>
		</main>
	);
}
