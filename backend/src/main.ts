import express, { Express } from "express"
import history from "connect-history-api-fallback"
import exp from "constants";

const app: Express = express();
const port: number = 3000;

app.use(history());
app.use(express.static("public"));





console.log("magar mur")