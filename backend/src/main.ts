import express, { Express } from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import history from "connect-history-api-fallback"
import authRouter from "./routes/auth-routes"
import roomsRoute from "./routes/rooms-route"
import rolesRoute from "./routes/roles-routes"
import http from 'http';
import { Server, Socket } from "socket.io"
import { decodeAccessToken } from "./utils/auth"

const app: Express = express();
const port: number = 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
  },
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(authRouter);
app.use(rolesRoute);
app.use(roomsRoute);

const userList = new Map<string, Set<string>>();

io.on('connection', (socket: Socket) => {

    // Gestisco la creazione e l'ingresso nelle stanze
    socket.on('createRoom', (roomName: string) => {
      socket.join(roomName);
    });

    socket.on('joinRoom', (roomName: string, user: string) => {
      socket.join(roomName);
      if(!userList.has(roomName)){
        userList.set(roomName, new Set());
      }
      console.log("Utente entrato: " + user);
      userList.get(roomName)?.add(user);
      io.to(roomName).emit('userList', Array.from(userList.get(roomName) || []));

      io.to(roomName).emit('userJoined', socket.id);
    });

    socket.on('sendMessage', (data: { roomName: string; message: string, utente: string}) => {
      io.to(data.roomName).emit('messageReceived', {
          userId: socket.id,
          message: data.message,
          utente: data.utente
      });
    });

    // socket.on('rimuoviMessaggio', (removedMessage) => {
    //   socket.broadcast.emit('messaggioRimosso', removedMessage);
    // });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      const rooms = io.sockets.adapter.rooms;
      for (const roomName of Object.keys(rooms)) {
        if (userList.has(roomName) && userList.get(roomName)?.has(socket.id)) {
          userList.get(roomName)?.delete(socket.id);
          io.to(roomName).emit('userList', Array.from(userList.get(roomName) || []));
          break;
        }
      }
    });
});

app.use(history());
app.use(express.static("public"));

app.use((_, res) => {
    res.setHeader("Content-Type", "text/plain")
    res.status(404).send("Ops... Pagina non trovata")
})
  
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))
  