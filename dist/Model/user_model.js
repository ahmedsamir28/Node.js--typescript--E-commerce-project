"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trime: true,
        required: [true, 'nmae required']
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
        lowercase: true
    },
    phone: String,
    profileImage: String,
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [3, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordresetExpire: Date,
    passwordResetVerified: Boolean,
    role: {
        type: String,
        enum: ['user', 'admin', 'manager', 'user'],
        default: 'user'
    },
}, { timestamps: true });
// Helper function to set the image URL
const setImageUrl = (doc) => {
    if (doc.profileImage) {
        const baseUrl = process.env.BASE_URL || "http://localhost:8000";
        const imageUrl = `${baseUrl}/api/v1/users/${doc.profileImage}`;
        doc.profileImage = imageUrl;
    }
};
// Create the Brand model
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
