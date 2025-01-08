import express from 'express';
import {
    createProduct,
    deleteProducts,
    getProducts,
    getSpecificProduct,
    resizeProductImages,
    updateProduct,
    uploadProductImages
} from '../Controllers/product_controllers';
import {
    createProductValidator,
    deleteProductValidator,
    getProductValidator,
    updateProductValidator
} from '../Utils/Validators/product_validator';
import reviewRoute from './review_route'

const router = express.Router();

router.use('/:productId/reviews', reviewRoute)

router.route('/')
    .get(getProducts)
    .post(uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct)
router.route('/:id')
    .get(getProductValidator, getSpecificProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProducts)


export default router;
