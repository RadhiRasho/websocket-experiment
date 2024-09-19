"use client";

import { useUserContext } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
	const router = useRouter();
	const userContext = useUserContext();

	const [name, setName] = useState("");

	function login() {
		userContext?.Login(name, "user");
		router.push("/");
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
			<div className="flex gap-2 flex-col items-start">
				<div className="flex gap-2">
					<input
						className="text-black text-xl px-2 w-full rounded-md"
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter Your Name"
					/>
					<button
						type="button"
						onClick={login}
						className="border rounded-md p-2 w-40 hover:bg-gray-800"
					>
						Login
					</button>
					<br />
				</div>
			</div>
		</main>
	);
}
