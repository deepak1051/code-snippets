import express from 'express';
import { auth } from '../../middleware/auth.middleware.js';

import { createCategory, getAllCategory } from './category.ct.js';

const router = express.Router();

router.get('/', getAllCategory);

router.post('/', auth, createCategory);

export default router;
