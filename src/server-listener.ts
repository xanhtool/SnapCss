
import socketio from "socket.io";
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import { SelectorResult } from "./project-checker";
import * as vscode from 'vscode';
export class ServerListener {
    app: any;
    io: socketio.Server | undefined;
    server: http.Server | undefined;
    currentSocket: socketio.Socket | undefined;
    constructor() {
        try {
            this.app = express();
            this.app.use(cors());
            this.server = new http.Server(this.app);
            this.io = socketio(this.server, { serveClient: false });
            this.socketOnConnection();
            this.startServer();
            this.projectHomePath();
        } catch (error) {
            console.error('server listener error', error);
        }
    }

    projectHomePath() {
        this.app.get("/", (req: express.Request, res: express.Response) => {
            res.send({
                workspaceName: vscode.workspace.name
            });
        });

    }

    socketOnConnection() {
        if (this.io) {this.io.on("connection", (socket: socketio.Socket) => {
            this.currentSocket = socket;
            // console.log("a user connected", socket);
            // socket.on("message", (message: any) => {
            //     console.log('new message!!!!!!!!!!!!!', message);
            //     // echo the message back down the websocket connection
            //     socket.emit("message", 'Server:' + message);
            // });
        });}
    }

    startServer(port = 1995) {
        if (this.server) {this.server.listen(port).on('error', (error: { errno: string, code: any, syscall: any, address: any, port: any }) => {
            if (error.errno === 'EADDRINUSE') {
                console.log(`[${error.errno}] port ${error.port} is busy`);
                this.startServer(port + 1);
            } else {
                console.log('server error', error);
            }
        })
            .on('listening', () => {
                console.log('Snap Style magic happen ^_^ on port:', port);
            });}
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

