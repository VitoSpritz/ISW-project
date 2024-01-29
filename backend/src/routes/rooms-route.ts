import { Router } from "express"
import * as RoomsController from "../controllers/rooms-controller"

const router = Router()

router.post("/api/room/createRoom", RoomsController.createRoom)

export default router
