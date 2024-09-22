"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
	const router = useRouter();
	const userContext = useUserContext();
	const [name, setName] = useState("");
	const [error, setError] = useState("");

	function Login() {
		if (!name) {
			setError("Please enter a username");
			return;
		}

		userContext?.Login(name, "user");
		router.push("/");
	}

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>Enter a username to login</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							type="username"
							placeholder="Radhi"
							required
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === "NumpadEnter") Login();
							}}
							onChange={(e) => setName(e.target.value)}
						/>
						{error && <span className="text-red-500 text-sm">{error}</span>}
					</div>
					<Button type="button" className="w-full" onClick={Login}>
						Login
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
