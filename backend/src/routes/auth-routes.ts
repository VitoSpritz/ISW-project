import { Router } from "express"
import * as authController from "../controllers/auth-controller"

const router = Router()

router.post("/api/auth/register", authController.register)

export default router
