import express from 'express';
import { auth } from '../../middleware/auth.middleware.js';

import {
  createCategory,
  getAllCategory,
  getCategorySnippet,
} from './category.ct.js';

const router = express.Router();

router.get('/', getAllCategory);

router.get('/:categoryId', getCategorySnippet);

router.post('/', auth, createCategory);

export default router;
