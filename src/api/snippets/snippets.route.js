import express from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import {
  createSnippet,
  deleteSnippet,
  getAllSnippets,
  getSingleSnippet,
} from './snippets.ct.js';

const router = express.Router();

router.get('/', getAllSnippets);

router.post('/', auth, createSnippet);

router.get('/user', auth, getSnippetsByUser);

router.get('/:id', getSingleSnippet);

router.put('/:id', auth, updateSnippet);

router.delete('/:id', auth, deleteSnippet);

export default router;
