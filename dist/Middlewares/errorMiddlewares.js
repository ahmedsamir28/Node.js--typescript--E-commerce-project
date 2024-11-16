"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalError = (err, req, res, next) => {
    // Ensure default values for error properties
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    }
    else {
        sendErrorForProd(err, res);
    }
};
const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        //Find out where the error is
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Hide stack in production
    });
};
const sendErrorForProd = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
exports.default = globalError;
