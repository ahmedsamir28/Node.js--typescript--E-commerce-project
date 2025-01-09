import express from 'express';
import {addProductToWishList} from "../Controllers/wishList_controller";
import {allowedTo, protect} from "../Controllers/auth_controller";

const router = express.Router();

router.use(protect, allowedTo('user'))

router.route('/').post(addProductToWishList)
router.delete('/:productId')


export default router;