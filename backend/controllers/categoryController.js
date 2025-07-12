const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const newCategory = new Category({ category });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};