import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { decodeAccessToken, deleteAccessToken, setAccessToken } from "../utils/auth"
import { getConnection } from "../utils/db"

export const register = async (req: Request, res: Response) => {

  const user = decodeAccessToken(req, res)

  if (user) {
    res.status(403).send("Questa operazione richiede il logout.")
    return
  }
  
  const { username, password, email } = req.body
  
  const connection = await getConnection()
  const [users] = await connection.execute("SELECT username, email FROM users WHERE username = ? OR email = ?" ,[
    username, email
  ])

  if (Array.isArray(users) && users.length > 0) {
    res.status(400).send("Username o email già in uso.")
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await connection.execute("INSERT INTO users (username, hashPassword, email) VALUES (?, ?, ?)", [
    username,
    passwordHash,
    email
  ])

  const [results] = await connection.execute(
    "SELECT email, username FROM users WHERE username=?",
    [username]
  )
  const newUser = (results as any)[0]

  setAccessToken(req, res, newUser)

  res.json({ message: "Registrazione effettuata con successo" })
}

export const getProfile = async (req: Request, res: Response) => {
  
  const user = decodeAccessToken(req, res)
  res.json(user)
}

export const getProfileParams = async (req: Request, res: Response) => {
  
  const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }
  
  const conn = await getConnection()
  const [list] = await conn.execute("SELECT email FROM users WHERE username = ?", [
      req.params.username,
  ])
  res.json(list)
}

export const logout = async (req: Request, res: Response) => {
  
  const user = decodeAccessToken(req, res)
  if (!user) {
    res.status(403).send("Questa operazione richiede l'autenticazione.")
    return
  }
  
  deleteAccessToken(req, res)
  res.json({ message: "Logout effettuato con successo" })
}

export const login = async (req: Request, res: Response) => {
  const user = decodeAccessToken(req, res)
  if (user) {
    res.status(403).send("Questa operazione richiede il logout.")
    return
  }

  const { email, password } = req.body

  const connection = await getConnection()
  const [results] = await connection.execute(
    "SELECT email, username, hashPassword FROM users WHERE email = ?",
    [email]
  )

  // Errore se l'utente non è stato trovato
  if (!Array.isArray(results) || results.length == 0) {
    res.status(400).send("Credenziali errate.")
    return
  }

  const userData = results[0] as any

  const passwordOk = await bcrypt.compare(password, userData.hashPassword)

  if (!passwordOk) {
    res.status(400).send("Credenziali errate.")
    return
  }

  delete userData.hashPassword
  setAccessToken(req, res, userData)

  res.json({ message: "Login effettuato con successo" })
}