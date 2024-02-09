"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const rooms_route_1 = __importDefault(require("./routes/rooms-route"));
const roles_routes_1 = __importDefault(require("./routes/roles-routes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = 3000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(auth_routes_1.default);
app.use(roles_routes_1.default);
app.use(rooms_route_1.default);
const userList = new Map();
const userMessages = new Map();
let messageCounter = 0;
io.on('connection', (socket) => {
    // Gestisco la creazione e l'ingresso nelle stanze
    socket.on('createRoom', (roomName) => {
        socket.join(roomName);
    });
    socket.on('joinRoom', (roomName, user) => {
        var _a;
        socket.join(roomName);
        if (!userList.has(roomName)) {
            userList.set(roomName, new Set());
        }
        (_a = userList.get(roomName)) === null || _a === void 0 ? void 0 : _a.add(user);
        io.to(roomName).emit('userList', Array.from(userList.get(roomName) || []));
        io.to(roomName).emit('userJoined', socket.id);
    });
    socket.on('sendMessage', (data) => {
        var _a;
        const { roomName, message, utente } = data;
        const newMessage = {
            userId: socket.id,
            message,
            utente,
            showimg: false,
            messageId: messageCounter
        };
        if (!userMessages.has(roomName)) {
            userMessages.set(roomName, []);
        }
        (_a = userMessages.get(roomName)) === null || _a === void 0 ? void 0 : _a.push(newMessage);
        messageCounter++;
        io.to(roomName).emit('messageReceived', newMessage);
    });
    socket.on('rimuoviMessaggio', (data) => {
        var _a;
        const { roomName, messageId } = data;
        if (userMessages.has(roomName)) {
            userMessages.set(roomName, ((_a = userMessages.get(roomName)) === null || _a === void 0 ? void 0 : _a.filter(msg => msg.messageId !== messageId)) || []);
        }
        io.to(roomName).emit('messaggiAggiornati', userMessages.get(roomName) || []);
    });
    socket.on('messaggioRimosso', (data) => {
        const { roomName, messageId } = data;
        const roomMessages = userMessages.get(roomName);
        if (roomMessages) {
            userMessages.set(roomName, roomMessages.filter(msg => msg.messageId !== messageId));
        }
        io.to(roomName).emit('messaggiAggiornati', userMessages.get(roomName) || []);
    });
    socket.on('disconnect', () => {
        var _a, _b;
        const rooms = io.sockets.adapter.rooms;
        for (const roomName of Object.keys(rooms)) {
            if (userList.has(roomName) && ((_a = userList.get(roomName)) === null || _a === void 0 ? void 0 : _a.has(socket.id))) {
                (_b = userList.get(roomName)) === null || _b === void 0 ? void 0 : _b.delete(socket.id);
                io.to(roomName).emit('userList', Array.from(userList.get(roomName) || []));
                break;
            }
        }
    });
});
app.use((0, connect_history_api_fallback_1.default)());
app.use(express_1.default.static("public"));
app.use(express_1.default.static("dist-frontend"));
app.use((_, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(404).send("Ops... Pagina non trovata");
});
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
