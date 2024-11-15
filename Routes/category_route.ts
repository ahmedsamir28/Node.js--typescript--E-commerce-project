import express from 'express';
import { createCategory, deleteCategory, getCategories, getSpecificCategory, updateCategory } from '../Controllers/Category_controllers';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getSpecificCategory).put(updateCategory).delete(deleteCategory)

export default router;
