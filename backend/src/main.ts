import express, { Express } from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import history from "connect-history-api-fallback"
import authRouter from "./routes/auth-routes"
import roomsRoute from "./routes/rooms-route"
import exp from "constants";

const app: Express = express();
const port: number = 3000;

app.use(bodyParser.json())
app.use(cookieParser())

app.use(authRouter);
app.use(roomsRoute);

app.use(history());
app.use(express.static("public"));

app.use((_, res) => {
    res.setHeader("Content-Type", "text/plain")
    res.status(404).send("Ops... Pagina non trovata")
})
  
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
  