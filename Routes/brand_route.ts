import express from 'express';
import { createBrand, deleteBrand, getBrands, getSpecificBrand, updateBrand } from '../Controllers/brand_controllers';
import { createBrandValidator, deleteBrandValidator, getBrandValidator, updateBrandValidator } from '../Utils/Validators/brand_validator';

const router = express.Router();


router.route('/').get(getBrands).post(createBrandValidator, createBrand)
router.route('/:id').get(getBrandValidator, getSpecificBrand).put(updateBrandValidator, updateBrand).delete(deleteBrandValidator, deleteBrand)

export default router;
