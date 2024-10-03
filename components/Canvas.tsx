"use client";

import { socketUrl } from "@/providers/Socket";
import type { DataToSend } from "@/types/typebox";
import { Eraser, Trash } from "lucide-react";
import {
	type PointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import useWebSocket from "react-use-websocket";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";
import { Slider } from "./ui/slider";

type CanvasProps = {
	room: string;
};

export default function Canvas({ room }: CanvasProps) {
	const { readyState, sendJsonMessage } = useWebSocket(socketUrl);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [eraserActive, setEraserActive] = useState(false);
	const colors: string[] = [
		"red",
		"green",
		"blue",
		"yellow",
		"violet",
		"orange",
	];
	const [color, setColor] = useState(colors[0]);
	const [previous, setPrevious] = useState<{ x: number; y: number } | null>({
		x: 0,
		y: 0,
	});
	const [size, setSize] = useState<number[]>([25]);
	const previousDataUrlRef = useRef<string | null>(null);

	const resize = useCallback(() => {
		const container = document.getElementById("canvasContainer");
		if (canvasRef.current && container) {
			// Save the current canvas content
			const dataUrl = canvasRef.current.toDataURL();
			previousDataUrlRef.current = dataUrl;

			// Resize the canvas
			canvasRef.current.width = container.clientWidth;
			canvasRef.current.height = container.clientHeight;

			// Restore the canvas content
			const img = new Image();
			img.src = previousDataUrlRef.current;
			img.onload = () => {
				if (ctx) {
					ctx.drawImage(img, 0, 0);
				}
			};
		}
	}, [ctx]);

	const onResize = useDebounceCallback(resize, 100);

	useResizeObserver<HTMLCanvasElement>({
		ref: canvasRef,
		onResize,
		box: "border-box",
	});

	useEffect(() => {
		if (canvasRef.current) {
			setCtx(canvasRef.current.getContext("2d"));
		}

		// sendJsonMessage({});
	}, []);

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

		if (!ctx) return;

		const fillColor = (eraserActive ? "rgba(0,0,0,1)" : color) ?? "black";
		const radius = (size[0] ?? 1) / ((size[0] ?? 1) < 10 ? 2 : 4);

		ctx.fillStyle = fillColor;
		ctx.globalCompositeOperation = eraserActive
			? "destination-out"
			: "source-over";
		ctx.beginPath();
		ctx.arc(coords.x, coords.y, radius, 0, 2 * Math.PI, true);
		ctx.fill();

		setPrevious(coords);
	}

	function pointerMove(e: PointerEvent<HTMLCanvasElement>) {
		const coords = getCoords(e);
		if (ctx && e.buttons === 1) {
			ctx.strokeStyle = eraserActive ? "rgba(0,0,0,1)" : (color ?? "black");
			ctx.lineWidth = size[0] ?? 1;
			ctx.lineCap = "round";
			ctx.globalCompositeOperation = eraserActive
				? "destination-out"
				: "source-over";

			if (previous) {
				const steps = 10;
				for (let i = 0; i <= steps; i++) {
					const t = i / steps;
					const x = previous.x + t * (coords.x - previous.x);
					const y = previous.y + t * (coords.y - previous.y);
					ctx.beginPath();
					ctx.moveTo(previous.x, previous.y);
					ctx.lineTo(x, y);
					ctx.stroke();
				}
			}

			setPrevious(coords);
		}
	}

	function mouseUp() {
		setPrevious(null);
	}

	function clear() {
		if (ctx && canvasRef.current) {
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		}
	}

	useEffect(() => {
		if (ctx) {
			ctx.strokeStyle = color ?? "black";
			ctx.lineWidth = size[0] ?? 1;
			ctx.lineCap = "round";
		}
	}, [color, ctx, size]);

	useEffect(() => {
		if (readyState === WebSocket.OPEN) {
			const sendCanvasData = () => {
				if (ctx?.canvas) {
					const currentDataUrl = ctx.canvas.toDataURL();
					if (currentDataUrl !== previousDataUrlRef.current) {
						const data: DataToSend = {
							type: "UPDATE_CANVAS",
							data: currentDataUrl,
						};
						sendJsonMessage(data);
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
	}, [ctx?.canvas, readyState, sendJsonMessage]);

	return (
		<div className="flex-col items-center gap-10 w-full">
			<div className="flex justify-between w-full">
				<div className="grid grid-cols-8 gap-2 min-h-fit h-full">
					{colors.map((indexColor) => (
						<button
							type="button"
							title={indexColor}
							key={indexColor}
							className={`rounded-full w-[2.6rem] h-full text-4xl border border-primary
                                 ${indexColor === "black" ? "text-white" : "text-black"}`}
							style={{ backgroundColor: indexColor }}
							onClick={() => {
								setColor(indexColor);
								setEraserActive(false);
							}}
						>
							{indexColor === color && !eraserActive && "✓"}
						</button>
					))}
					<Eraser
						className={`rounded-full p-2 ${eraserActive && "text-red-500"} hover:text-red-500 hover:cursor-pointer`}
						onClick={() => setEraserActive(true)}
						size={45}
					/>
					<Trash
						className="rounded-full p-2 hover:text-red-500 hover:cursor-pointer"
						onClick={clear}
						size={45}
					/>
				</div>
				<div className="flex justify-between items-center gap-2 w-[20%]">
					<span>1</span>
					<Slider
						defaultValue={[10, 90]}
						value={size}
						minStepsBetweenThumbs={1}
						max={100}
						min={1}
						step={1}
						onValueChange={setSize}
					/>
					<span>100</span>
				</div>
			</div>
			<br />
			<div
				id="canvasContainer"
				className="w-full min-h-[71vh] h-full max-h-[71vh]"
			>
				<canvas
					onPointerMove={pointerMove}
					onPointerDown={mouseDown}
					onPointerUp={mouseUp}
					className="border border-gray-500 h-full w-full"
					ref={canvasRef}
				/>
			</div>
		</div>
	);
}
