import { readFileSync } from "node:fs";
import { type SecureServerOptions, createSecureServer } from "http2";
import { Server } from "socket.io";
import type { Room } from "../types";

const options: SecureServerOptions = {
	key: readFileSync("./key.pem"),
	cert: readFileSync("./cert.pem"),
	passphrase: "HYAM",
};

const server = createSecureServer(options, (_, res) => {
	res.writeHead(200);
	res.end("hello world");
});

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

const rooms: Room[] = [];

io.on("connection", (socket) => {
	socket.on("message", (data) => {
		io.emit("messageResponse", JSON.stringify(JSON.parse(data)));
	});

	socket.on("canvas", (data) => io.emit("canvas", data));

	socket.on("createRoom", (data) => {
		if (rooms.find((room) => room.name === data.name)) {
			socket.emit("getRoomsResponse", {
				success: false,
				message: "Room already exists",
			});
			return;
		}

		rooms.push({ ...data });
		socket.join(data.name);
	});

	socket.on("joinRoom", (data) => {
		const room = rooms.find((room) => room.name === data.name);

		if (!room) {
			socket.emit("joinRoomResponse", {
				success: false,
				message: "Room does not exist",
			});
			return;
		}

		socket.join(data.name);
	});

	socket.on("getRooms", () => {
		socket.emit("getRoomsResponse", { rooms });
	});
});

server.listen(8080, () => {
	console.log("listening on *:8080");
});
