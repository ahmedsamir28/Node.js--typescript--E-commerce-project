import express from 'express';
import {
    createBrand,
    deleteBrand,
    getBrands,
    getSpecificBrand,
    resizeBrandImage,
    updateBrand,
    uploadBrandImage
} from '../Controllers/brand_controllers';
import {
    createBrandValidator,
    deleteBrandValidator,
    getBrandValidator,
    updateBrandValidator
} from '../Utils/Validators/brand_validator';
import {allowedTo, protect} from "../Controllers/auth_controller";

const router = express.Router();


router.route('/')
    .get(getBrands)
    .post(
        protect,
        allowedTo('admin','manager'),
        uploadBrandImage,
        resizeBrandImage,
        createBrandValidator,
        createBrand)
router.route('/:id').get(getBrandValidator, getSpecificBrand).put(updateBrandValidator, updateBrand).delete(deleteBrandValidator, deleteBrand)

export default router;
