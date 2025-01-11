import express from 'express';
import {allowedTo, protect} from "../Controllers/auth_controller";
import {addAddress, getLoggedUserAddresses, removeAddress,} from "../Controllers/address_controller";

const router = express.Router();

router.use(protect, allowedTo('user'))

router.route('/').post(addAddress).get(getLoggedUserAddresses)
router.delete('/:addressId',removeAddress)


export default router;
