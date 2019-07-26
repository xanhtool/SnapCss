
import * as socketio from "socket.io";
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { SelectorResult } from "./project-checker";

export class ServerListener {
    app: any;
    io: socketio.Server;
    server: http.Server;
    currentSocket: socketio.Socket | undefined;
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.server = new http.Server(this.app);
        
        this.io = socketio(this.server, { serveClient: false });
        this.startServer();
    }

    startServer() {
        // console.log("kick start server");
        // whenever a user connects on port 3000 via
        // a websocket, log that a user has connected
        this.io.on("connection", (socket: socketio.Socket) => {
            this.currentSocket = socket;
            // console.log("a user connected", socket);
            // socket.on("message", (message: any) => {
            //     console.log('new message!!!!!!!!!!!!!', message);
            //     // echo the message back down the websocket connection
            //     socket.emit("message", 'Server:' + message);
            // });
        });



        this.io.listen(1995);
    }

    // listenForAngularSelectorId(selectorSocket: socketio.Namespace): Promise<string | null> {
    listenForAngularSelectorId(): Promise<string | null> {
        return new Promise(resolve => {
            if (this.currentSocket) {
                // console.log("start wait: trigger selectorResult waiter...");
                this.currentSocket.once('selectorResult', (message: any) => {
                    // console.log("selectorResult", message);
                    resolve(message);
                });
            } else {
                console.log('cannot wait...');
            }
        });
    }

    async requestAngularAtribute(selectorResult: SelectorResult) {
        const checker = selectorResult.selector;
        if (checker) {
            if (this.currentSocket) {
                // console.log('good, sending selector request', selectorResult.selector);
                const selectorSocket = this.currentSocket.emit('selectorRequest', selectorResult.selector);
                // console.log("selectorSocket", selectorSocket);
                return await this.listenForAngularSelectorId();
            } else {
                console.log("cannot send selector request...");
            }
        } else {
            console.log("not request...");
            return;
        }
    }

}

