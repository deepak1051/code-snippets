import Snippet from '../../models/Snippet.js';
import { userTypes } from '../../models/User.js';

export const getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({}).populate('author');

    return res.status(200).json(snippets);
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createSnippet = async (req, res) => {
  try {
    const { title, steps, category } = req.body;

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
      category,
      title,
      steps,
      author: req.user._id,
    });

    return res.status(201).json(snippet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getSnippetsByUser = async (req, res) => {
  // throw new Error('snippet error');
  try {
    const snippets = await Snippet.find({ author: req.user._id });

    console.log('snippets', snippets);

    return res.status(200).json(snippets);
  } catch (err) {
    console.log('err', err);
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getSingleSnippet = async (req, res) => {
  try {
    const { id } = req.params;

    const snippet = await Snippet.findById(id).populate('author');

    if (!snippet) return res.status(404).json({ message: 'snippet not found' });

    return res.status(200).json(snippet);
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, steps, category } = req.body;

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
        { title, steps, category },
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
      { title, steps, category },
      { new: true }
    );

    return res.status(200).json(snippet);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteSnippet = async (req, res) => {
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
};
