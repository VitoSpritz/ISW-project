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
  
  await conn.execute("INSERT INTO rooms (roomName, roomCreator) VALUE (?, ?)", [
    req.body.roomname,
    user.email
  ])
  const [name] = await conn.execute("SELECT id from rooms where roomName = ? and roomCreator = ?", [
    req.body.roomname,
    user.email
  ])
  const id = (name as any)[0]
  await conn.execute("INSERT INTO moderators (email, id) VALUE (?, ?)", [
    user.email,
    id.id
  ])
  res.json({ success: true })
}

export const getRoomList = async (req: Request, res: Response) => {
  const user = decodeAccessToken(req, res)
  if (!user) {
    res.status(403).send("Questa operazione richiede l'autenticazione.")
    return
  }

  const conn = await getConnection()
  const [list] = await conn.execute("SELECT id, roomName from rooms")
  res.json(list)
}
