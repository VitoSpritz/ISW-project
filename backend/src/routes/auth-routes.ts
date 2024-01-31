import { Router } from "express"
import * as authController from "../controllers/auth-controller"

const router = Router()

router.post("/api/auth/register", authController.register)
router.get("/api/auth/profile", authController.getProfile)
router.get("/api/auth/profile/:username", authController.getProfileParams)
router.post("/api/auth/logout", authController.logout)
router.post("/api/auth/login", authController.login)

export default router
