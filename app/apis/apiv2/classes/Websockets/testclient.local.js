import { io } from "socket.io-client";
import 'dotenv/config'

class SocketClient {
    constructor(url) {
        this.socket = io(url, {
            path: process.env.SOCKET_IO_PATH,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
        this.setupListeners();
        this.setupPeriodicEvent();
    }

    setupListeners() {
        this.socket.on('connect', () => {
            console.log(`Websocket server and nginx reverse proxy are working on https://${process.env.DB_DOMAIN}`);
            process.exit();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        this.socket.on('reconnect_attempt', () => {
            console.log('Attempting to reconnect...');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error.message);
        });
    }

    setupPeriodicEvent() {
        setInterval(() => {

        }, 15000);
    }
}
// node --loader esm-module-alias/loader --no-warnings classes/Websockets/testclient.js
console.log(50, "Connnecting to", `http://127.0.0.1:${process.env.WEBSOCKET_2}`);
const client = new SocketClient(`http://127.0.0.1:${process.env.WEBSOCKET_2}`);

// Keep the Node.js process running
setInterval(() => {
    //console.log('Keeping the process alive...');
}, 5000);
