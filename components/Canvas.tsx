"use client";

import { useHonoSocket } from "@/providers/HonoSocket";
import {
	type PointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Chat from "./Chat";

export default function Canvas() {
	const socket = useHonoSocket();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const colors: string[] = [
		"red",
		"green",
		"blue",
		"yellow",
		"violet",
		"orange",
		"black",
	];
	const [color, setColor] = useState(colors[0]);
	const [previous, setPrevious] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const [size, setSize] = useState(25);

	const resize = useCallback(() => {
		if (canvasRef.current) {
			canvasRef.current.width = window.innerWidth - 500;
			canvasRef.current.height = window.innerHeight - 150;
		}
	}, []);

	useEffect(() => {
		if (canvasRef.current) {
			setCtx(canvasRef.current.getContext("2d"));
		}

		window.addEventListener("resize", resize);
		resize();

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, [resize]);

	function getCoords(e: PointerEvent<HTMLCanvasElement>) {
		const { clientX, clientY } = e;
		const current = canvasRef.current?.getBoundingClientRect();
		let x = 0;
		let y = 0;

		if (current) {
			x = clientX - current.left;
			y = clientY - current.top;
		}

		return { x, y };
	}

	function mouseDown(e: PointerEvent<HTMLCanvasElement>) {
		const coords = getCoords(e);

		if (ctx) {
			ctx.fillStyle = color ?? "black";
			ctx.beginPath();
			ctx.arc(coords.x, coords.y, size / 2, 0, 2 * Math.PI);
			ctx.fill();

			setPrevious(coords);
		}
	}

	useEffect(() => {
		if (ctx) {
			ctx.strokeStyle = color ?? "black";
			ctx.lineWidth = size;
			ctx.lineCap = "round";
		}
	}, [color, ctx, size]);

	function pointerMove(e: PointerEvent<HTMLCanvasElement>) {
		const coords = getCoords(e);
		if (ctx && e.buttons === 1) {
			ctx.strokeStyle = color ?? "black";
			ctx.lineWidth = size;
			ctx.lineCap = "round";
			ctx?.beginPath();
			ctx?.moveTo(previous?.x, previous?.y);
			ctx?.lineTo(coords.x, coords.y);
			ctx?.stroke();
		}
		setPrevious(coords);
	}

	function clear() {
		if (ctx && canvasRef.current) {
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		}
	}

	useEffect(() => {
		if (ctx?.canvas && socket?.emit) {
			socket.send(
				JSON.stringify({
					type: "canvas",
					data: ctx.canvas.toDataURL(),
				}),
			);
		}
	}, [socket?.emit, ctx?.canvas.toDataURL, ctx?.canvas, socket]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-start gap-2 p-4">
			<div className="flex justify-between items-center gap-10">
				<div className="grid grid-cols-8">
					{colors.map((indexColor) => (
						<button
							type="button"
							title={indexColor}
							key={indexColor}
							className={`rounded-full w-12 h-full text-4xl ${
								indexColor === "black" ? "text-white" : "text-black"
							} border border-white`}
							style={{ backgroundColor: indexColor }}
							onClick={() => setColor(indexColor)}
						>
							{indexColor === color && "✓"}
						</button>
					))}
					<button type="button" className="rounded-full p-2" onClick={clear}>
						clear
					</button>
				</div>
				<div className="flex justify-between gap-2">
					<span>1</span>
					<input
						className="flex items-center"
						type="range"
						min="1"
						max="100"
						value={size}
						onChange={(e) => setSize(+e.target.value)}
					/>
					<span>100</span>
				</div>
			</div>
			<div className="flex justify-between gap-2">
				<canvas
					onPointerMove={pointerMove}
					onPointerDown={mouseDown}
					className="flex border border-gray-500"
					ref={canvasRef}
				/>
				<div className="border border-gray-500 w-96 max-h-screen">
					<Chat />
				</div>
			</div>
		</main>
	);
}
