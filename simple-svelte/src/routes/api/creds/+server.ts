import type { RequestHandler } from "@sveltejs/kit";
import { readFile } from "node:fs/promises";

export const GET: RequestHandler = async () => {
	const key = (await readFile("./key.pem")).toString();
	const cert = (await readFile("./cert.pem")).toString();

	return new Response(JSON.stringify({ key, cert }), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};