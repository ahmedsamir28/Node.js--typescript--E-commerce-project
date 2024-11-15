"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: [true, 'Category require'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [20, 'Too long category name']
    },
    image: String,
    slug: {
        type: String,
        lowercase: true
    },
}, { timestamps: true });
const categoryModel = mongoose_1.default.model('Category', categorySchema);
exports.default = categoryModel;
