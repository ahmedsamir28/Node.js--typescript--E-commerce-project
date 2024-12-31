import express from 'express';
import { createCategory, deleteCategory, getCategories, getSpecificCategory, resizeImage, updateCategory, uploadCategoryImage } from '../Controllers/category_controllers';
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from '../Utils/Validators/category_validator';
import subcategoriesRoute from './subCategory_Route'

const router = express.Router();

router.use('/:categoryId/subcategories', subcategoriesRoute);

router.route('/').get(getCategories).post(uploadCategoryImage,resizeImage,createCategoryValidator,createCategory)
router.route('/:id').get(getCategoryValidator, getSpecificCategory).put(updateCategoryValidator, updateCategory).delete(deleteCategoryValidator, deleteCategory)

export default router;
