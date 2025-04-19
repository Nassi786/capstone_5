CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  rating INTEGER,
  review TEXT,
  cover_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
