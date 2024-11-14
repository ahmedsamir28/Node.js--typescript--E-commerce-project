// category_route.ts
import express from 'express';
import { createCategory } from '../Controllers/Category_controllers'; 

const router = express.Router();

router.post('/', createCategory);

export default router;
