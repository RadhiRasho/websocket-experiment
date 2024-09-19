"use client";
import { useUserContext } from "@/providers/UserProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReadLocalStorage } from "usehooks-ts";

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
			<Link className="text-lg" href={"/participant"}>
				Participant
			</Link>
			<Link className="text-lg" href={"/drawer"}>
				drawer
			</Link>
			{userContext?.user && (
				<div className="flex justify-between items-center min-w-36 text-lg">
					<div>{userContext.user.name}</div>
					<button
						type="button"
						onClick={logout}
						className="border rounded-md p-2 hover:bg-gray-600"
					>
						Logout
					</button>
				</div>
			)}
		</nav>
	);
}
