"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMixOfImages = exports.uploadSingleImage = void 0;
const apiError_1 = __importDefault(require("../Utils/apiError"));
const multer_1 = __importDefault(require("multer"));
const multerOption = () => {
    // const multerStorage: StorageEngine = multer.diskStorage({
    //     destination: (req: Request, file: Express.Multer.File, cb: any) => {
    //         cb(null, "Uploads/Categories");
    //     },
    //     filename: (req: Request, file: Express.Multer.File, cb: any) => {
    //         //category-${id}-Date.now().jpeg
    //         const ext = file.mimetype.split("/")[1];
    //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    //         cb(null, filename);
    //     },
    // });
    const multerStorage = multer_1.default.memoryStorage();
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            // Note: `cb` expects an `Error` object, not `Error | null`
            cb(new apiError_1.default("Only images are allowed", 400), false);
        }
    };
    const upload = (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
};
// Export utility functions
const uploadSingleImage = (fieldName) => multerOption().single(fieldName);
exports.uploadSingleImage = uploadSingleImage;
const uploadMixOfImages = (arrayOfFields) => multerOption().fields(arrayOfFields);
exports.uploadMixOfImages = uploadMixOfImages;
