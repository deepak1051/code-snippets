import Category from '../../models/Category.js';

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

    const categoryExist = await Category.findOne({ name });

    if (categoryExist) {
      return res.status(400).json({ message: 'category already exist' });
    }

    const category = await Category.create({
      name,
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};
