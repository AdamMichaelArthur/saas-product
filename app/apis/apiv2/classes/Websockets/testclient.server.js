import { io } from "socket.io-client";
import 'dotenv/config'

class SocketClient {
    constructor(url) {
        this.socket = io(url, {
            path: process.env.SOCKET_IO_PATH,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 5000,
        });
        this.setupListeners();
        this.setupPeriodicEvent();
    }

    setupListeners() {
        this.socket.on('connect', () => {
            console.log('Websocket server and nginx reverse proxy are working');
            process.exit();
        });

        this.socket.on('list_order', (data) => {
            console.log(23, `list order ${data}`);
        });

        this.socket.on('remove_order', (data) => {
            console.log(26, `remove order ${data}`);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        this.socket.on('reconnect_attempt', () => {
            console.log('Attempting to reconnect...');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error.message);
            process.exit();
        });
    }

    setupPeriodicEvent() {
        setInterval(() => {
            //this.socket.emit('update_document_location', { 'collection': 'items', _id: "65591200b02bcab454693ff7", GPS: [10, 10]});
            //this.socket.emit('request_nearby_order_updates', {  GPS: { latitude: 41.02440968559823, longitude: 28.979657313573792 }, 'distance':2000});
        }, 15000);
    }
}

// node --loader esm-module-alias/loader --no-warnings classes/Websockets/testclient.js
console.log(50, "Connnecting to", `http://${process.env.DB_DOMAIN}:${process.env.WEBSOCKET_2}`);
const client = new SocketClient(`https://${process.env.DB_DOMAIN}`);

// Keep the Node.js process running
setInterval(() => {
    //console.log('Keeping the process alive...');
}, 5000);