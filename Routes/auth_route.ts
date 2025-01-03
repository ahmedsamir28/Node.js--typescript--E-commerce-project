import express from 'express';
import {signup} from "../Controllers/auth_controller";

const router = express.Router();


router.route('/signup').post(signup)

export default router;
