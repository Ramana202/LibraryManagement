// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Mongoose Schema and Model for Books
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  publisher: { type: String, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// Routes

// Create a new book
app.post('/books', async (req, res) => {
  try {
    const { title, author, isbn, genre, year, publisher } = req.body;

    if ([title, author, isbn, genre, year, publisher].some(field => field === undefined || field === '')) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const newBook = new Book({ title, author, isbn, genre, year, publisher });
    await newBook.save();
    res.status(201).json({ message: "Book added to library." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const { genre, year, publisher } = req.body;

    if (!genre || !year || !publisher) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { genre, year, publisher },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated successfully", book: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book" });
  }
});

module.exports = { app, Book };