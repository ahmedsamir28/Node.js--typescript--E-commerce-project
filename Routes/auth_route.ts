import express from 'express';
import {login, signup} from "../Controllers/auth_controller";

const router = express.Router();


router.route('/signup').post(signup)
router.route('/login').post(login)


export default router;
