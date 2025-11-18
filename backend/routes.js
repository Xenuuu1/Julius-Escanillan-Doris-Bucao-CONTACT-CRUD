const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const { search, genre } = req.query;
    const books = await Book.findAll({ search, genre });
    
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/books - Create new book
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/books/:id - Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.update(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/books/:id - Delete book
router.delete('/:id', async (req, res) => {
  try {
    await Book.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/books/stats - Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Book.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/books/genres - Get all genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await Book.getGenres();
    
    res.json({
      success: true,
      data: genres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;