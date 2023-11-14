"use client";
import { useContext, useEffect, useState } from "react";
import { WSStateContext } from "../socketProvider";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Chat from "@/components/Chat";

export default function View() {
	const socket = useContext(WSStateContext);
	const [src, setSrc] = useState<string | StaticImport>();

	socket?.on("canvas", (data) => {
		setSrc(data);
	});

	return (
		<div className="flex justify-between gap-2">
			<div className="w-7/12">{src && <Image src={src} alt="stuck" title="shit" width={1000} height={1000} />}</div>
			<div className="w-4/12">
				<Chat />
			</div>
		</div>
	);
}
