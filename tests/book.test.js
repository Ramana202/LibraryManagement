const request = require('supertest');
const mongoose = require('mongoose');
const { app, Book } = require('../server');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/librarydb-test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Library Management System - Full CRUD Tests', () => {
  let bookId;

  test('POST /books - add a book with all valid fields', async () => {
    const book = {
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      genre: 'Test Genre',
      year: 2023,
      publisher: 'Test Publisher'
    };

    const res = await request(app).post('/books').send(book);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Book added to library.');
  });

  test('POST /books - missing fields should return 400', async () => {
    const res = await request(app).post('/books').send({
      title: 'Incomplete Book'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please fill all fields.');
  });

  test('GET /books - should return all books and capture ID', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    bookId = res.body[0]._id;
  });

  test('GET /books - should include a known book title', async () => {
    const res = await request(app).get('/books');
    const titles = res.body.map(book => book.title);
    expect(titles).toContain('Test Book');
  });

  test('PUT /books/:id - update genre/year/publisher', async () => {
    const res = await request(app).put(`/books/${bookId}`).send({
      genre: 'Updated Genre',
      year: 2024,
      publisher: 'Updated Publisher'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.book.genre).toBe('Updated Genre');
  });

  test('PUT /books/:id - missing update fields returns 400', async () => {
    const res = await request(app).put(`/books/${bookId}`).send({
      genre: 'Only Genre'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing fields');
  });

  test('PUT /books/:id - invalid ID returns 500', async () => {
    const res = await request(app).put('/books/invalid-id').send({
      genre: 'Drama',
      year: 2020,
      publisher: 'Fake Pub'
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error updating book');
  });

  test('DELETE /books/:id - delete book successfully', async () => {
    const res = await request(app).delete(`/books/${bookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted successfully');
  });

  test('DELETE /books/:id - deleting already deleted book returns 404', async () => {
    const res = await request(app).delete(`/books/${bookId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });

  test('GET /books - should return 0 or less books after deletion', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});