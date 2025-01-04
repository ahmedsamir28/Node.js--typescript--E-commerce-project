"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign({ id: payload }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
};
exports.createToken = createToken;
