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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config"); // Make sure you have JWT_SECRET exported from your config.
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization || req.header('Authorization');
    if (!authHeader) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return; // Explicitly return
    }
    // Expected format: 'Bearer <token>'
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        res.status(401).json({
            error: 'Invalid Authorization header format. Expected "Bearer <token>"',
        });
        return; // Explicitly return
    }
    const token = tokenParts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.user = decoded; // Attach decoded info to request
        return next(); // Explicitly return
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return; // Explicitly return
    }
});
exports.auth = auth;
