import { createServer, ServerOptions } from "https";
import { readFileSync } from "fs";
import { Server } from "socket.io";

const options: ServerOptions = {
	key: readFileSync("./certificates/key.pem"),
	cert: readFileSync("./certificates/cert.pem"),
};

const server = createServer(options);

const io = new Server(server, {
	/* options */
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	socket.on("message", (data) => {
		console.log(data);
		io.emit("messageResponse", JSON.stringify(JSON.parse(data)));
	});

	socket.on("canvas", (data) => {
		io.emit("canvas", data);
	});
});

server.listen(8080, () => {
	console.log("listening on *:8080");
});
