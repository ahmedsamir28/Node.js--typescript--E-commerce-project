import express from 'express'
import { createFilterObj, createSubCategory, deleteSubCategory, getSpecificSubCategory, getSubCategories, setCategoryIdToBody, updateSubCategory } from '../Controllers/subCategory_controllers'
import { createSubCategoryValidator, deleteSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator } from '../Utils/Validators/subCategory_validator';

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(createFilterObj,getSubCategories)
    .post(setCategoryIdToBody,createSubCategoryValidator, createSubCategory)
router
    .route('/:id')
    .get(getSubCategoryValidator, getSpecificSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)


export default router;
