import express from 'express';
import {login, signup} from "../Controllers/auth_controller";
import {loginValidator, signupValidator} from "../Utils/Validators/auth_validator";

const router = express.Router();


router.route('/signup').post(signupValidator,signup)
router.route('/login').post(loginValidator,login)



export default router;
