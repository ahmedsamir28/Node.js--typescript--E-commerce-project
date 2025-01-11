import express from 'express';
import {addProductToWishList, getLoggedUserWishList, removeProductFromWishList} from "../Controllers/wishList_controller";
import {allowedTo, protect} from "../Controllers/auth_controller";

const router = express.Router();

router.use(protect, allowedTo('user'))

router.route('/').post(addProductToWishList).get(getLoggedUserWishList)
router.delete('/:productId',removeProductFromWishList)


export default router;
