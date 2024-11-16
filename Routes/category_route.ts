import express from 'express';
import { createCategory, deleteCategory, getCategories, getSpecificCategory, updateCategory } from '../Controllers/Category_controllers';
import { deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from '../Utils/Validators/category_validator';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategoryValidator,getSpecificCategory).put(updateCategoryValidator,updateCategory).delete(deleteCategoryValidator,deleteCategory)

export default router;
