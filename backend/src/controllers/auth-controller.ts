import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { decodeAccessToken, deleteAccessToken, setAccessToken } from "../utils/auth"
import { getConnection } from "../utils/db"

export const register = async (req: Request, res: Response) => {
    // Blocca la richiesta se l'utente ha già effettuato il login
    const user = decodeAccessToken(req, res)
    if (user) {
      res.status(403).send("Questa operazione richiede il logout.")
      return
    }
    
    const { username, password, email } = req.body
    
    // Verifica che l'username sia disponibile
    const connection = await getConnection()
    const [users] = await connection.execute("SELECT username FROM users WHERE username=? and email = ?" ,[
      username, email
    ])
  
    if (Array.isArray(users) && users.length > 0) {
      res.status(400).send("Username già in uso.")
      return
    }
  
    // Crea l'hash della password per non salvarla in chiaro
    const passwordHash = await bcrypt.hash(password, 10)
  
    // Inserisce l'utente nel database
    await connection.execute("INSERT INTO users (username, hashPassword, email) VALUES (?, ?, ?)", [
      username,
      passwordHash,
      email
    ])
  
    // Estrae i dati per il nuovo utente
    const [results] = await connection.execute(
      "SELECT email, username FROM users WHERE username=?",
      [username]
    )
    const newUser = (results as any)[0]
  
    // Crea un JWT contenente i dati dell'utente e lo imposta come cookie
    setAccessToken(req, res, newUser)
  
    res.json({ message: "Registrazione effettuata con successo" })
  }