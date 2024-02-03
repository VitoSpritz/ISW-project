import { Request, Response } from "express"
import { getConnection } from "../utils/db"
import { decodeAccessToken } from "../utils/auth"

export const bannedList = async (req: Request, res: Response) => {

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    const conn = await getConnection()

    const [list] = await conn.execute("SELECT * FROM bannedusers")
    res.json(list)
}

export const deleteBan = async (req: Request, res: Response) => {

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    const conn = await getConnection()
    await conn.execute("DELETE FROM bannedusers WHERE id = ? and email = ?", [
        req.params.id,
        req.params.email
    ])
    res.json({ success: true })
}

export const getMods = async (req: Request, res: Response) =>{

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    const conn = await getConnection()

    const [list] = await conn.execute("SELECT mods.id as id, mods.email as email, u.username as user FROM moderators as mods join users as u on (mods.email = u.email)")
    res.send(list)
}

export const banUser = async (req: Request, res: Response) =>{

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    const conn = await getConnection()
    const { email, id, fine_sospensione } = req.body;
    console.log(email + " " + fine_sospensione + " " +id)

    await conn.execute("INSERT INTO bannedusers (email, id, fine_sospensione) VALUE (?, ?, ?)", [
        email,
        id,
        fine_sospensione
    ])
    res.status(200).send("Operazione andata a buon fine.");
}

export const createMod = async (req: Request, res: Response) =>{

    const conn = await getConnection()

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    await conn.execute("INSERT INTO moderators (email, id) VALUE (?, ?)", [
        req.params.email,
        req.params.id
    ])
    res.status(200).send("Operazione andata a buon fine.");
}

export const deleteMod = async (req: Request, res: Response) =>{

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    const conn = await getConnection()

    await conn.execute("DELETE FROM moderators WHERE id = ? AND email = ?", [
        req.params.id,
        req.params.email,
    ])
    res.status(200).send("Operazione andata a buon fine.");
}