
import * as socketio from "socket.io";
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';

let app = express();
app.use(cors());
let server = new http.Server(app);
let io = socketio(server);

export class ServerListener {
    app:any;
    io:socketio.Server;
    server: http.Server;
    constructor() {
        this.app = express();
        app.use(cors());
        this.server = new http.Server(app);
        this.io = socketio(server);
        this.startServer();
    }

    startServer() {
        console.log("kick start server");
        // whenever a user connects on port 3000 via
        // a websocket, log that a user has connected
        io.on("connection", function (socket: any) {
            console.log("a user connected");
            socket.on("message", function (message: any) {
                console.log(message);
                // echo the message back down the
                // websocket connection
                socket.emit("message", message);
            });
        });

        server.listen(1995, () => {
            console.log("magic happen on port 1995");
        });
    }

}

