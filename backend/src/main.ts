import express, { Express } from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import history from "connect-history-api-fallback"
import authRouter from "./routes/auth-routes"
import roomsRoute from "./routes/rooms-route"
import rolesRoute from "./routes/roles-routes"
import http from 'http';
import { Server, Socket } from "socket.io"
import { messageBody } from "./utils/types"

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
const userMessages = new Map<string, messageBody[]>();

let messageCounter = 0;

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
      
      userList.get(roomName)?.add(user);
      io.to(roomName).emit('userList', Array.from(userList.get(roomName) || []));

      io.to(roomName).emit('userJoined', socket.id);
    });

    socket.on('sendMessage', (data: { roomName: string; message: string, utente: string}) => {
      const { roomName, message, utente } = data;
  
      const newMessage: messageBody = {
        userId: socket.id,
        message,
        utente,
        showimg: false,
        messageId: messageCounter
      };
  
      if (!userMessages.has(roomName)) {
        userMessages.set(roomName, []);
      }
      userMessages.get(roomName)?.push(newMessage);
      messageCounter++;
  
      io.to(roomName).emit('messageReceived', newMessage);
    });

    socket.on('rimuoviMessaggio', (data: { messageId: number, roomName: string }) => {
      
      const { roomName, messageId } = data;
  
      if (userMessages.has(roomName)) {
        userMessages.set(roomName, userMessages.get(roomName)?.filter(msg => msg.messageId !== messageId) || []);
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