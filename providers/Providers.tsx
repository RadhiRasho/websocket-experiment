"use client";

import Navbar from "@/components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";
import { SocketProvider } from "./Socket";
import ThemeProvider from "./ThemeProvider";
import UserProvider from "./UserProvider";

export default function Providers({
	children,
}: Readonly<{ children: ReactNode }>) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<UserProvider>
					<SocketProvider>
						<div className="h-full max-h-screen">
							<Navbar />
							{children}
						</div>
					</SocketProvider>
				</UserProvider>
				<ReactQueryDevtools
					buttonPosition="bottom-left"
					position="left"
					initialIsOpen={false}
				/>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
