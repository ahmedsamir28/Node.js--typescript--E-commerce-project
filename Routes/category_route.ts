import express from 'express';
import { createCategory, deleteCategory, getCategory, getSpecificCategory, updateCategory } from '../Controllers/Category_controllers';

const router = express.Router();

router.route('/').get(getCategory).post(createCategory)
router.route('/:id').get(getSpecificCategory).put(updateCategory).delete(deleteCategory)

export default router;
