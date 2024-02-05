import { Request, Response } from "express"
import { getConnection } from "../utils/db"
import { decodeAccessToken } from "../utils/auth"
import { roomOwner } from "../utils/types" 

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

  const [name] = await conn.execute("SELECT id FROM rooms WHERE roomName = ? and roomCreator = ?", [
    req.body.roomname,
    user.email
  ])

  const id = (name as any)[0]
  await conn.execute("INSERT INTO moderators (email, id) VALUE (?, ?)", [
    user.email,
    id.id
  ])
  const obj: roomOwner ={
    id: id.id,
    roomName: req.body.roomname,
    roomCreator: user.email
  } 
  res.json(obj)
}

export const getRoomList = async (req: Request, res: Response) => {
  const user = decodeAccessToken(req, res)
  if (!user) {
    res.status(403).send("Questa operazione richiede l'autenticazione.")
    return
  }

  const conn = await getConnection()
  const [list] = await conn.execute("SELECT id, roomName FROM rooms")
  res.json(list)
}

export const getRoomOwner = async (req: Request, res: Response) => {
  const user = decodeAccessToken(req, res)
  if (!user) {
    res.status(403).send("Questa operazione richiede l'autenticazione.")
    return
  }

  const conn = await getConnection()
  const [list] = await conn.execute("SELECT id, roomName, roomCreator FROM rooms")
  res.json(list)

}

export const deleteRoom = async (req: Request, res: Response) => {
  const user = decodeAccessToken(req, res)
  if (!user) {
    res.status(403).send("Questa operazione richiede l'autenticazione.")
    return
  }

  const conn = await getConnection()
  
  await conn.execute("DELETE FROM bannedusers WHERE id = ?", [
    req.params.id
  ])

  await conn.execute("DELETE FROM moderators WHERE id = ?",[
    req.params.id
  ])

  await conn.execute("DELETE FROM rooms WHERE id = ?", [
    req.params.id
  ])

  res.json({ success: true })
}
