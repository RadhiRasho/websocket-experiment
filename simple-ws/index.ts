import ws from 'ws';
import https from 'https';
import { readFileSync } from 'fs';

const server = https.createServer({
	key: readFileSync('key.pem'),
	cert: readFileSync('cert.pem'),
});
const wss = new ws.Server({ server });

wss.on('connection', (ws) => {
	console.log('connected');

	ws.on('message', (message) => {
		console.log('received: %s', message);
	});

	ws.on('stream', (stream) => {
		console.log('received: %s', stream);
		ws.emit('stream', stream);
	});
});

server.listen(8080, () => {
	console.log('Server started on port 8080');
});
