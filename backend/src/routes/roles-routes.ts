import { Router } from "express"
import * as rolesRoutes from "../controllers/roles-controller"

const router = Router();

router.get("/api/roles/banned", rolesRoutes.bannedList);
router.post("/api/roles/delete/:id/:email", rolesRoutes.deleteBan);
router.get("/api/roles/mods", rolesRoutes.getMods);

export default router;