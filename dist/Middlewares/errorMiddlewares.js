"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../Utils/apiError"));
const sendErrorForDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorForProd = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
    });
};
const handleJwtInvalidSignature = () => new apiError_1.default('Invalid token, please login again..', 401);
const handleJwtExpired = () => new apiError_1.default('Expired token, please login again..', 401);
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    }
    else {
        if (err.name === 'JsonWebTokenError')
            err = handleJwtInvalidSignature();
        if (err.name === 'TokenExpiredError')
            err = handleJwtExpired();
        sendErrorForProd(err, res);
    }
};
exports.default = globalError;
