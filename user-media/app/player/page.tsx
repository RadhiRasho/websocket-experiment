"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { WSStateContext } from "../socketProvider";
import Chat from "@/components/Chat";

export default function Home() {
	const socket = useContext(WSStateContext);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	const colors: string[] = ["red", "green", "blue", "yellow", "violet", "orange"];
	const [color, setColor] = useState(colors[0]);
	const [previous, setPrevious] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [size, setSize] = useState(25);

	// implment a function to resize the canvas but keep the current data within it

	function resize() {
		if (canvasRef.current) {
			canvasRef.current.width = window.innerWidth - 500;
			canvasRef.current.height = window.innerHeight - 150;
		}
	}

	useEffect(() => {
		setCtx(canvasRef?.current?.getContext("2d")!);

		window.addEventListener("resize", resize);
		resize();

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	function get_coords(e: { clientX: any; clientY: any }) {
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

	function mouseDown(e: any) {
		const coords = get_coords(e);

		if (ctx) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(coords.x, coords.y, size / 2, 0, 2 * Math.PI);
			ctx.fill();

			setPrevious(coords);
		}
	}

	useEffect(() => {
		if (ctx) {
			ctx.strokeStyle = color;
			ctx.lineWidth = size;
			ctx.lineCap = "round";
		}
	}, [color, ctx, size]);

	function pointerMove(e: any) {
		const coords = get_coords(e);
		if (ctx && e.buttons === 1) {
			ctx.strokeStyle = color;
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
		if (ctx) {
			ctx.clearRect(0, 0, canvasRef.current?.width!, canvasRef.current?.height!);
		}
	}

	useEffect(() => {
		if (canvasRef.current) socket?.emit("canvas", ctx?.canvas.toDataURL());

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, ctx?.canvas.toDataURL()]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-start gap-2 p-4">
			<div className="flex justify-between items-center gap-10">
				<div className="grid grid-cols-7">
					{colors.map((indexColor) => (
						<button
							key={indexColor}
							className={`rounded-full w-12 h-full text-4xl text-black`}
							style={{ backgroundColor: indexColor }}
							onClick={() => setColor(indexColor)}
						>
							{indexColor === color && "✓"}
						</button>
					))}
					<button className="rounded-full p-2" onClick={clear}>
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
