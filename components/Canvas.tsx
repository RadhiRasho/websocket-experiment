"use client";

import { useSocket } from "@/providers/Socket";
import { type DataToSend, publishActions } from "@/types/types";
import {
	type PointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Chat from "./Chat";

export default function Canvas() {
	const socket = useSocket();
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
	    const previousDataUrlRef = useRef<string | null>(null);


	const resize = useCallback(() => {
		const container = document.getElementById("canvasContainer");
		if (canvasRef.current && container) {
			canvasRef.current.width = container?.clientWidth;
			canvasRef.current.height = container?.clientHeight;
		}
	}, []);

	useEffect(() => {
		if (canvasRef.current) {
			resize();
			setCtx(canvasRef.current.getContext("2d"));
			window.addEventListener("resize", resize);
		}

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
			if (socket?.ws?.readyState === WebSocket.OPEN) {
				const sendCanvasData = () => {
					if (ctx?.canvas && socket?.send) {
						const currentDataUrl = ctx.canvas.toDataURL();
						if (currentDataUrl !== previousDataUrlRef.current) {
							const data: DataToSend = {
								type: "UPDATE_CANVAS",
								data: currentDataUrl,
							};
							socket.send(JSON.stringify(data));
							previousDataUrlRef.current = currentDataUrl;
						}
					}
					requestAnimationFrame(sendCanvasData);
				};

				const observer = new MutationObserver(sendCanvasData);
				if (ctx?.canvas) {
					observer.observe(ctx.canvas, {
						attributes: true,
						childList: true,
						subtree: true,
					});
				}

				sendCanvasData(); // Start the loop

				return () => {
					observer.disconnect();
				};
			}
		}, [socket?.send, ctx?.canvas, socket?.ws?.readyState]);


	return (
		<>
			<div className="flex justify-between items-center gap-10">
				<div className="grid grid-cols-8">
					{colors.map((indexColor) => (
						<button
							type="button"
							title={indexColor}
							key={indexColor}
							className={`rounded-full w-[2.6rem] h-full text-4xl ${
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
			<div className="flex justify-between w-full max-h-[80vh] gap-2">
				<div id="canvasContainer" className="w-full max-w-[90%]">
					<div>
						<canvas
							onPointerMove={pointerMove}
							onPointerDown={mouseDown}
							className="border border-gray-500 bg-black"
							ref={canvasRef}
						/>
					</div>
				</div>
				<Chat />
			</div>
		</>
	);
}
