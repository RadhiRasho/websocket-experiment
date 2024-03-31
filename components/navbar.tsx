"use client";
import { useUserContext } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const userContext = useUserContext();
	const router = useRouter();

	function logout() {
		userContext?.Logout();
		router.push("/login");
	}

	if (!userContext?.user) {
		return null;
	}

	return (
		<nav className="flex justify-between items-center p-4 bg-black text-white border-b-2">
			<h1 className="text-2xl font-bold">Clone.IO</h1>
			{userContext?.user && (
				<button
					type="button"
					onClick={logout}
					className="border rounded-md p-2 hover:bg-gray-600"
				>
					Logout
				</button>
			)}
		</nav>
	);
}
