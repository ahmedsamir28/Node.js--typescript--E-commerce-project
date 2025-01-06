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
exports.allowedTo = exports.protect = exports.login = exports.signup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = __importDefault(require("../Model/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
const createToken_1 = require("../Utils/createToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_2 = __importDefault(require("../Utils/apiError"));
/**
 * @desc    SignUp
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm } = req.body;
    // Check if passwords match
    if (password !== passwordConfirm) {
        return next(new apiError_1.default("Passwords do not match", 400));
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield user_model_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    // Generate token
    const token = (0, createToken_1.createToken)(user._id);
    // Remove the password from the response
    const userResponse = Object.assign(Object.assign({}, user.toObject()), { password: undefined });
    res.status(201).json({ data: userResponse, token });
}));
/**
 * @desc    Login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    // Check if email and password are provided
    if (!email || !password) {
        return next(new apiError_1.default("Please provide email and password", 400));
    }
    // Find the user by email and include the password field
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    console.log(user); // تحقق من وجود المستخدم
    // Check if the user exists
    if (!user) {
        return next(new apiError_1.default("Incorrect email or password", 401));
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    console.log(isPasswordValid); // تحقق من صحة كلمة المرور
    if (!isPasswordValid) {
        return next(new apiError_1.default("Incorrect email or password", 401));
    }
    // Generate a JWT token
    const token = (0, createToken_1.createToken)(user._id);
    // Remove the password from the response
    const userResponse = Object.assign(Object.assign({}, user.toObject()), { password: undefined });
    // Send the response
    res.status(200).json({ data: userResponse, token });
}));
/**
 * @desc    Protect routes - Ensure user is logged in
 * @access  Private
 */
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Check if the token is in the headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new apiError_1.default("You are not logged in. Please log in to access this route.", 401));
    }
    // 2) Verify token
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
    // 3) Check if the user still exists
    const currentUser = yield user_model_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new apiError_1.default("The user belonging to this token no longer exists.", 401));
    }
    // 4) Check if user changed their password after the token was created
    if (currentUser.passwordChangedAt) {
        const passwordChangedTimestamp = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
        if (passwordChangedTimestamp > decoded.iat) {
            return next(new apiError_1.default("User recently changed their password. Please log in again.", 401));
        }
    }
    req.user = currentUser;
    next();
}));
/**
 * @desc    Authorization (User permission)
 * @access  ["admin","manager"]
 */
const allowedTo = (...roles) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) access roles
    // 2) access register user (req.user.role)
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
        return next(new apiError_2.default("You are not allowed to access this route.", 401));
    }
    next();
}));
exports.allowedTo = allowedTo;
