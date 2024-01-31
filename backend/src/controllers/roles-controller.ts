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

    const [list] = await conn.execute("SELECT * from bannedusers")
    res.json(list)
}

export const deleteBan = async (req: Request, res: Response) => {

    const user = decodeAccessToken(req, res)
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.")
        return
    }

    const conn = await getConnection()
    await conn.execute("DELETE FROM bannedusers where id = ? and email = ?", [
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