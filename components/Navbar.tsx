"use client";
import { useUserContext } from "@/providers/UserProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
	const userContext = useUserContext();
	const router = useRouter();

	function logout() {
		userContext?.Logout();
		router.push("/login");
	}

	return (
		<nav className="flex justify-between items-center p-2 bg-black text-white border-b-2 min-h-20 max-h-min">
			<Link href={"/"} as={"/"} className="text-2xl font-bold">
				Clone.IO
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
			<div>
				<ThemeToggle />
			</div>
		</nav>
	);
}
