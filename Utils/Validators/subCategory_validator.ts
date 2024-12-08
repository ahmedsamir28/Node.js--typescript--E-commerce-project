import { body, check } from 'express-validator';
import slugify from "slugify";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";

export const getSubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory required')
    .isLength({ min: 2 })
    .withMessage('Too short Subcategory name')
    .isLength({ max: 32 })
    .withMessage('Too long Subcategory name')
    .custom((val , { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('SubCategory must belong to a category')
    .isMongoId()
    .withMessage('Invalid Category id format'),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  body('name').custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid SubCategory id format'),
  validatorMiddleware,
];
