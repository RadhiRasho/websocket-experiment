import { readFileSync } from "fs";
import { Server } from "socket.io";
import { createSecureServer, SecureServerOptions } from "http2";

const options: SecureServerOptions = {
	key: readFileSync("./key.pem"),
	cert: readFileSync("./cert.pem"),
};

const server = createSecureServer(options, (req, res) => {
	res.writeHead(200);
	res.end("hello world");
});

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

type Room = {
	name: string;
	users: string[];
};

const rooms: Room[] = [];

io.on("connection", (socket) => {
	socket.on("message", (data) => {
		console.log(data);
		io.emit("messageResponse", JSON.stringify(JSON.parse(data)));
	});

	socket.on("canvas", (data) => {
		io.emit("canvas", data);
	});

	socket.on("createRoom", (data) => {
		console.log(data);
		rooms.push(JSON.parse(data));
		socket.join(JSON.parse(data).name);
	});

	socket.on("getRooms", (data) => {
		console.log(data);
		socket.emit("getRoomsResponse", JSON.stringify({ rooms }));
	});
});

server.listen(8080, () => {
	console.log("listening on *:8080");
});
