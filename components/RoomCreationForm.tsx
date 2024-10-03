"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useForm } from "react-hook-form";

import { $postRooms } from "@/providers/Socket";
import { useUserContext } from "@/providers/UserProvider";
import {
	type Room,
	type RoomCreation,
	RoomCreationSchema,
} from "@/types/typebox";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function RoomCreationForm() {
	const router = useRouter();
	const { user } = useUserContext();
	const client = useQueryClient();
	const form = useForm<RoomCreation>({
		resolver: typeboxResolver(RoomCreationSchema),
		defaultValues: {
			name: "",
			word: "",
			password: "",
		},
	});

	function onSubmit(values: RoomCreation) {
		if (!user) {
			throw new Error("no User");
		}

		const room: Room = {
			...values,
			drawer: user,
		};

		$postRooms(room);
		client.refetchQueries({ queryKey: ["Rooms"] });

		router.push(`/drawer/${values.name}`);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="name">
									Room Name <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Picaso's Playground" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="word"
						render={({ field }) => (
							<FormItem className="">
								<FormLabel htmlFor="word">
									Word <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Sky" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="password">Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="******" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
