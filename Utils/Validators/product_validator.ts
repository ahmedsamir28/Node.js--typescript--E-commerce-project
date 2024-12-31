import { check, body } from "express-validator";
import { RequestHandler, Request } from "express";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";
import categoryModel from "../../Model/category_model";
import subCategoryModel from "../../Model/subCategory_model";
import ProductModel from "../../Model/product_model";
import slugify from "slugify";

// Helper type to define an array of middleware
type ValidatorMiddleware = RequestHandler[];

export const createProductValidator: ValidatorMiddleware = [
    check("title")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .notEmpty()
        .withMessage("Product title is required")
        // .custom(async (val, { req }) => {
        //     const product = await ProductModel.findOne({ title: req.body.title });
        //     if (product) {
        //         throw new Error('Product with this title already exists');
        //     }
        //     return true;
        // })
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        }),
    check("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ max: 2000 })
        .withMessage("Description is too long"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("Sold quantity must be a number"),
    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({ max: 32 })
        .withMessage("Price is too long"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Price after discount must be a number")
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error("Price after discount must be lower than price");
            }
            return true;
        }),
    check("colors")
        .optional()
        .isArray()
        .withMessage("Colors should be an array of strings"),
    check("imageCover").notEmpty().withMessage("Product image cover is required"),
    check("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array of strings"),
    check("category")
        .notEmpty()
        .withMessage("Product must belong to a category")
        .isMongoId()
        .withMessage("Invalid category ID format")
        .custom(async (categoryId) => {
            const category = await categoryModel.findById(categoryId);
            if (!category) {
                throw new Error(`No category found for ID: ${categoryId}`);
            }
        }),
    check("subcategories")
        .optional()
        .isArray()
        .withMessage("Subcategories should be an array")
        .custom(async (subcategoriesIds: string[]) => {
            const subcategories = await subCategoryModel.find({
                _id: { $in: subcategoriesIds },
            });
            if (subcategories.length !== subcategoriesIds.length) {
                throw new Error("Invalid subcategory IDs");
            }
        })
        .custom(async (val: string[], { req }) => {
            const subCategories = await subCategoryModel.find({
                category: req.body.category,
            });
            const subCategoriesIdsInDB = subCategories.map((sub) => (sub._id as string).toString());
            const isValid = val.every((id) => subCategoriesIdsInDB.includes(id));
            if (!isValid) {
                throw new Error("Some subcategories do not belong to the specified category");
            }
        }),

    check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),
    check("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("Ratings average must be a number")
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1.0 and 5.0"),
    check("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("Ratings quantity must be a number"),
    validatorMiddleware,
];

export const getProductValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid ID format"),
    validatorMiddleware,
];

export const updateProductValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid ID format"),
    body("title")
        .optional()
        .custom(async (val, { req }) => {
            const { id } = (req as Request<{ id: string }>).params
            const productName = await ProductModel.findById(id);
            if (productName?.title === req.body.title) {
                throw new Error('Product with this title already exists');
            }
            return true;
        })
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        }),
    validatorMiddleware,
];

export const deleteProductValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid ID format"),
    validatorMiddleware,
];
