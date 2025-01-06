import express from 'express';
import {
    changeUserPassword,
    createUser, deleteLoggedUserData,
    deleteUser,
    getLoggedUserData,
    getSpecificUser,
    getUsers,
    resizeUserIMage, updateLoggedUserData, updateLoggedUserPassword,
    updateUser,
    uploadUserImage
} from '../Controllers/user_controllers';
import { allowedTo, protect } from "../Controllers/auth_controller";
import {
    changeUserPasswordValidator,
    createUserValidator,
    updateLoggedUserValidator, updateUserValidator
} from "../Utils/Validators/user_validator";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Routes for logged-in users
router.get('/getMe', getLoggedUserData);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe',updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);
// router.put('/change-password/:id', changeUserPassword);


// Routes for admins and managers
router.use(allowedTo('admin', 'manager'));
router.put('/change-password/:id',changeUserPasswordValidator, changeUserPassword);
router.route('/')
    .get(getUsers)
    .post(uploadUserImage, resizeUserIMage, createUserValidator,createUser);

router.route('/:id')
    .get(getSpecificUser)
    .put(uploadUserImage, resizeUserIMage, updateUserValidator,updateUser)
    .delete(deleteUser);

export default router;