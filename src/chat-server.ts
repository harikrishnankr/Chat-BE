import * as express from 'express';
import { createServer, Server } from 'http'; //new
import * as socketIo from 'socket.io';
import { PORT, SEND_MESSAGE } from '../config/chat.config';

export class ChatServer {

    public static readonly PORT:number = PORT;
    private app: express.Application;
    private port: string | number;
    private server: Server; // new
    private io: socketIo;
    private socketsArray = [];

    constructor() {
        this.createApp();
        this.config();
        this.createServer(); // new
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        // new
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connection', (socket) => {
            socket.on(SEND_MESSAGE, (msg) => {
                this.io.emit(SEND_MESSAGE, msg);
            });
            socket.on('disconnect', () => {
                this.socketsArray.splice(this.socketsArray.indexOf(socket.id), 1);
                this.io.emit('remove-user', socket.id);
            });
        });
    }

    // new
    private createServer(): void {
        this.server = createServer(this.app);
    }

    public getApp(): express.Application {
        return this.app;
    }
}