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
const brandSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        unique: true,
        minlength: [3, "Brand name is too short"],
        maxlength: [20, "Brand name is too long"],
    },
    image: String,
    slug: {
        type: String,
        lowercase: true,
    },
}, { timestamps: true });
// Helper function to set the image URL
const setImageUrl = (doc) => {
    if (doc.image) {
        const baseUrl = process.env.BASE_URL || "http://localhost:8000";
        const imageUrl = `${baseUrl}/api/v1/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};
// Hook: Runs after retrieving a document from the database
brandSchema.post("init", (doc) => {
    setImageUrl(doc);
});
// Hook: Runs after saving a document to the database
brandSchema.post("save", (doc) => {
    setImageUrl(doc);
});
// Create the Brand model
const brandModel = mongoose_1.default.model("Brand", brandSchema);
exports.default = brandModel;
