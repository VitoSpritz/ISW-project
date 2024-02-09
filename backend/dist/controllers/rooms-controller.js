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
exports.deleteRoom = exports.getRoomOwner = exports.getRoomList = exports.createRoom = void 0;
const db_1 = require("../utils/db");
const auth_1 = require("../utils/auth");
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Verifica che l'utente abbia effettuato il login
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    yield conn.execute("INSERT INTO rooms (roomName, roomCreator) VALUE (?, ?)", [
        req.body.roomname,
        user.email
    ]);
    const [name] = yield conn.execute("SELECT id FROM rooms WHERE roomName = ? and roomCreator = ?", [
        req.body.roomname,
        user.email
    ]);
    const id = name[0];
    yield conn.execute("INSERT INTO moderators (email, id) VALUE (?, ?)", [
        user.email,
        id.id
    ]);
    const obj = {
        id: id.id,
        roomName: req.body.roomname,
        roomCreator: user.email
    };
    res.json(obj);
});
exports.createRoom = createRoom;
const getRoomList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    const [list] = yield conn.execute("SELECT id, roomName FROM rooms");
    res.json(list);
});
exports.getRoomList = getRoomList;
const getRoomOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    const [list] = yield conn.execute("SELECT id, roomName, roomCreator FROM rooms");
    res.json(list);
});
exports.getRoomOwner = getRoomOwner;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    yield conn.execute("DELETE FROM bannedusers WHERE id = ?", [
        req.params.id
    ]);
    yield conn.execute("DELETE FROM moderators WHERE id = ?", [
        req.params.id
    ]);
    yield conn.execute("DELETE FROM rooms WHERE id = ?", [
        req.params.id
    ]);
    res.json({ success: true });
});
exports.deleteRoom = deleteRoom;
