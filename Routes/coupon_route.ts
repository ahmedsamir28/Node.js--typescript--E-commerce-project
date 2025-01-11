import express from 'express';
import {allowedTo, protect} from "../Controllers/auth_controller";
import {
    createCoupon,
    deleteCoupon,
    getCoupons,
    getSpecificCoupon,
    updateCoupon
} from "../Controllers/coupon_controller";

const router = express.Router();

router.use(protect, allowedTo('user'))

router.route('/').get(getCoupons).post(createCoupon)
router.route('/:id').get(getSpecificCoupon).put(updateCoupon).delete(deleteCoupon)


export default router;
