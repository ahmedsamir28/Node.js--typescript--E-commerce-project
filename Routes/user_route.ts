import express from 'express';
import {
    createUser, deleteUser,
    getSpecificUser,
    getUsers,
    resizeUserIMage,
    updateUser,
    uploadUserImage
} from '../Controllers/user_controllers';

const router = express.Router();


router.route('/').get(getUsers).post(uploadUserImage,resizeUserIMage, createUser)
router.route('/:id').get( getSpecificUser).put( updateUser).delete( deleteUser)

export default router;
