"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMod = exports.createMod = exports.banUser = exports.getMods = exports.deleteBan = exports.bannedList = void 0;
const db_1 = require("../utils/db");
const auth_1 = require("../utils/auth");
const bannedList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    const [list] = yield conn.execute("SELECT * FROM bannedusers");
    res.json(list);
});
exports.bannedList = bannedList;
const deleteBan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    yield conn.execute("DELETE FROM bannedusers WHERE id = ? and email = ?", [
        req.params.id,
        req.params.email
    ]);
    res.json({ success: true });
});
exports.deleteBan = deleteBan;
const getMods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    const [list] = yield conn.execute("SELECT mods.id as id, mods.email as email, u.username as user FROM moderators as mods join users as u on (mods.email = u.email)");
    res.send(list);
});
exports.getMods = getMods;
const banUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    const { email, id, fine_sospensione } = req.body;
    yield conn.execute("INSERT INTO bannedusers (email, id, fine_sospensione) VALUE (?, ?, ?)", [
        email,
        id,
        fine_sospensione
    ]);
    res.status(200).send("Operazione andata a buon fine.");
});
exports.banUser = banUser;
const createMod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, db_1.getConnection)();
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    yield conn.execute("INSERT INTO moderators (email, id) VALUE (?, ?)", [
        req.params.email,
        req.params.id
    ]);
    res.status(200).send("Operazione andata a buon fine.");
});
exports.createMod = createMod;
const deleteMod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    yield conn.execute("DELETE FROM moderators WHERE id = ? AND email = ?", [
        req.params.id,
        req.params.email,
    ]);
    res.status(200).send("Operazione andata a buon fine.");
});
exports.deleteMod = deleteMod;
