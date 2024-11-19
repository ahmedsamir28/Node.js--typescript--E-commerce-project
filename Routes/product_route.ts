import express from 'express';
import { createProduct, deleteProducts, getProducts, getSpecificProduct, updateProduct } from '../Controllers/product_controllers';

const router = express.Router();


router.route('/').get(getProducts).post(createProduct)
router.route('/:id').get(getSpecificProduct).put(updateProduct).delete(deleteProducts)


export default router;
