require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected 🎉'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  rating: Number,
  review: String,
  cover_id: String,
  created_at: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/', async (req, res) => {
  const books = await Book.find().sort({ created_at: -1 });
  res.render('index', { books });
});

app.get('/book', (req, res) => {
  res.render('book');
});

app.post('/book', async (req, res) => {
  const { title, author, rating, review } = req.body;
  const olRes = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
  const cover_id = olRes.data.docs[0]?.cover_i || null;

  const newBook = new Book({ title, author, rating, review, cover_id });
  await newBook.save();
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
