import path from 'node:path';
import Category from '../../models/Category.js';
import Snippet from '../../models/Snippet.js';

import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({});

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    console.log('req.files', req.files);

    if (!req.files?.image?.[0]) {
      return res.status(400).json({ message: 'image is required' });
    }

    const files = req.files;

    const filePath = files?.image?.[0]?.path;

    const fileName = files?.image?.[0]?.filename;

    console.log('filename', files);

    const categoryExist = await Category.findOne({ name });

    if (categoryExist) {
      fs.unlinkSync(filePath);

      return res.status(400).json({ message: 'category already exist' });
    }

    const category = await Category.create({
      name,
      image: fileName,
    });

    return res.status(201).json(category);
  } catch (error) {
    if (req.files?.image?.[0]?.path) {
      fs.unlinkSync(req.files?.image?.[0]?.path);
    }
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getCategorySnippet = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categorySnippet = await Snippet.find({
      category: categoryId,
    });

    return res.status(201).json(categorySnippet);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('categoryId', id);

    const category = await Category.findById(id);

    console.log('category', category);

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};
