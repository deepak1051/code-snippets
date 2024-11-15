import express from 'express';
import Snippet from '../models/Snippet.js';
import { auth } from '../middleware/auth.middleware.js';
import { userTypes } from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('req.user', req.user);
    const snippets = await Snippet.find({});

    return res.status(200).json(snippets);
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, steps } = req.body;

    console.log(req.body);

    if (!title || !steps) {
      return res.status(400).json({ message: 'all fields are required.' });
    }

    if (steps.length === 0) {
      return res.status(400).json({ message: 'please add steps' });
    }

    if (
      steps.some((step) => step.stepCode.trim() === '') ||
      steps.some((step) => step.stepTitle.trim() === '')
    ) {
      return res
        .status(400)
        .json({ message: 'please add code and title for each step' });
    }

    const snippet = await Snippet.create({
      title,
      steps,
      author: req.user._id,
    });

    return res.status(201).json(snippet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const snippet = await Snippet.findById(id);

    if (!snippet) return res.status(404).json({ message: 'snippet not found' });

    return res.status(200).json(snippet);
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong' });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const snippets = await Snippet.find({ author: req.user._id });

    return res.status(200).json(snippets);
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, steps } = req.body;

    if (!title || !steps) {
      return res.status(400).json({ message: 'all fields are required.' });
    }

    const _snippet = await Snippet.findById(id);

    if (!_snippet)
      return res.status(404).json({ message: 'snippet not found' });

    if (req.user.role === userTypes.ADMIN) {
      // Admins can update any snippet
      const snippet = await Snippet.findByIdAndUpdate(
        id,
        { title, steps },
        { new: true }
      );

      return res.status(200).json(snippet);
    }

    if (_snippet?.author?.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'you are not authorized to update this snippet' });
    }

    const snippet = await Snippet.findByIdAndUpdate(
      id,
      { title, steps },
      { new: true }
    );

    return res.status(200).json(snippet);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const _snippet = await Snippet.findById(id);
    if (!_snippet)
      return res.status(404).json({ message: 'snippet not found' });

    if (req.user.role === userTypes.ADMIN) {
      // Admins can delete any snippet
      const snippet = await Snippet.findByIdAndDelete(id);
      return res.status(200).json(snippet);
    }

    if (_snippet?.author?.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'you are not authorized to delete this snippet' });
    }

    const snippet = await Snippet.findByIdAndDelete(id);
    return res.status(200).json(snippet);
  } catch (error) {
    console.log('ERROR', error);
    return res.status(500).json({ message: 'something went wrong' });
  }
});

export default router;
