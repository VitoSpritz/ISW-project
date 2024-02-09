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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.logout = exports.getProfileParams = exports.getProfile = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../utils/auth");
const db_1 = require("../utils/db");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (user) {
        res.status(403).send("Questa operazione richiede il logout.");
        return;
    }
    const { username, password, email } = req.body;
    const connection = yield (0, db_1.getConnection)();
    const [users] = yield connection.execute("SELECT username, email FROM users WHERE username = ? OR email = ?", [
        username, email
    ]);
    if (Array.isArray(users) && users.length > 0) {
        res.status(400).send("Username o email già in uso.");
        return;
    }
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    yield connection.execute("INSERT INTO users (username, hashPassword, email) VALUES (?, ?, ?)", [
        username,
        passwordHash,
        email
    ]);
    const [results] = yield connection.execute("SELECT email, username FROM users WHERE username=?", [username]);
    const newUser = results[0];
    (0, auth_1.setAccessToken)(req, res, newUser);
    res.json({ message: "Registrazione effettuata con successo" });
});
exports.register = register;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    res.json(user);
});
exports.getProfile = getProfile;
const getProfileParams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    const conn = yield (0, db_1.getConnection)();
    const [list] = yield conn.execute("SELECT email FROM users WHERE username = ?", [
        req.params.username,
    ]);
    res.json(list);
});
exports.getProfileParams = getProfileParams;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (!user) {
        res.status(403).send("Questa operazione richiede l'autenticazione.");
        return;
    }
    (0, auth_1.deleteAccessToken)(req, res);
    res.json({ message: "Logout effettuato con successo" });
});
exports.logout = logout;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, auth_1.decodeAccessToken)(req, res);
    if (user) {
        res.status(403).send("Questa operazione richiede il logout.");
        return;
    }
    const { email, password } = req.body;
    const connection = yield (0, db_1.getConnection)();
    const [results] = yield connection.execute("SELECT email, username, hashPassword FROM users WHERE email = ?", [email]);
    // Errore se l'utente non è stato trovato
    if (!Array.isArray(results) || results.length == 0) {
        res.status(400).send("Credenziali errate.");
        return;
    }
    const userData = results[0];
    const passwordOk = yield bcrypt_1.default.compare(password, userData.hashPassword);
    if (!passwordOk) {
        res.status(400).send("Credenziali errate.");
        return;
    }
    delete userData.hashPassword;
    (0, auth_1.setAccessToken)(req, res, userData);
    res.json({ message: "Login effettuato con successo" });
});
exports.login = login;
