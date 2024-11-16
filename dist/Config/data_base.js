"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = () => {
    // Add type for mongoose connection
    mongoose_1.default.connect(process.env.DB_URI || '')
        .then((conn) => {
        console.log(`database is connected : ${conn.connection.host}`);
    })
        .catch((err) => {
        console.error(`database error : ${err}`);
        process.exit(1);
    });
};
exports.default = dbConnection;
