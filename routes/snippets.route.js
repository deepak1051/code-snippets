import express from 'express';
import Snippet from '../models/Snippet.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find({});

    return res.status(200).json(snippets);
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong' });
  }
});

export default router;
