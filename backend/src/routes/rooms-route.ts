import { Router } from "express"
import * as RoomsController from "../controllers/rooms-controller"

const router = Router()

router.post("/api/room/createRoom", RoomsController.createRoom)
router.get("/api/room/getAllRooms", RoomsController.getRoomList)
router.get("/api/room/roomOwners", RoomsController.getRoomOwner)
router.post("/api/rooms/deleteRoom/:id", RoomsController.deleteRoom)

export default router
