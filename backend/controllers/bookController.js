const Book = require('../models/Book');
const path = require('path');
const fs = require('fs').promises;

exports.uploadBook = async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    const file = req.file;

    if (!title || !categoryId || !file) {
      return res.status(400).json({ error: 'Title, category, and PDF file are required' });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const newBook = new Book({
      title,
      categoryId,
      fileUrl,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error uploading book:', error);
    res.status(500).json({ error: 'Failed to upload book' });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('categoryId', 'category');
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};