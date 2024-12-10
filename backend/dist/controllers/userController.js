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
exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: "Please provide all fields." });
            return;
        }
        const existingUser = yield User_1.User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(400).json({ error: "User with this email or username already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.User({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, email: newUser.email }, config_1.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({ message: "User registered successfully", token });
    }
    catch (error) {
        next(error); // Pass errors to Express error handler
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Invalid Fields" });
            return;
        }
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "User does not exist" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials." });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, config_1.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        next(error); // Pass errors to Express error handler
    }
});
exports.login = login;
