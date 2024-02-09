"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesRoutes = __importStar(require("../controllers/roles-controller"));
const router = (0, express_1.Router)();
router.get("/api/roles/banned", rolesRoutes.bannedList);
router.post("/api/roles/delete/:id/:email", rolesRoutes.deleteBan);
router.get("/api/roles/mods", rolesRoutes.getMods);
router.post("/api/roles/banUser", rolesRoutes.banUser);
router.post("/api/roles/createMod/:id/:email", rolesRoutes.createMod);
router.post("/api/roles/deleteMod/:id/:email", rolesRoutes.deleteMod);
exports.default = router;
