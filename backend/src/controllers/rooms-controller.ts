import { Request, Response } from "express"
import { getConnection } from "../utils/db"
import { decodeAccessToken } from "../utils/auth"

export const createRoom = async (req: Request, res: Response) => {
    // Verifica che l'utente abbia effettuato il login
    const user = decodeAccessToken(req, res)
    if (!user) {
      res.status(403).send("Questa operazione richiede l'autenticazione.")
      return
    }
  
    const conn = await getConnection()
    await conn.execute("INSERT INTO rooms (roomName) VALUE (?)", [
      req.body.roomname
    ])
    res.json({ success: true })
}