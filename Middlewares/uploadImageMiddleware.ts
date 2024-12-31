import { Request } from "express";
import ApiError from "../Utils/apiError";
import { v4 as uuidv4 } from "uuid";
import multer, { StorageEngine, FileFilterCallback } from "multer";

const multerOption = () => {
    const multerStorage: StorageEngine = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: any) => {
            cb(null, "Uploads/Categories");
        },
        filename: (req: Request, file: Express.Multer.File, cb: any) => {
            //category-${id}-Date.now().jpeg
            console.log(file);
            
            const ext = file.mimetype.split("/")[1];
            const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
            cb(null, filename);
        },
    });

    const multerFilter = (req: Request, file: Express.Multer.File, cb: any) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            // Note: `cb` expects an `Error` object, not `Error | null`
            cb(new ApiError("Only images are allowed", 400) as Error, false);
        }
    };

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
};

// Export utility functions
export const uploadSingleImage = (fieldName: string) => multerOption().single(fieldName);

export const uploadMixOfImages = (arrayOfFields: multer.Field[]) => multerOption().fields(arrayOfFields);
