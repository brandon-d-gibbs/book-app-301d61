DROP TABLE IF EXISTS books;

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    authors_names VARCHAR(255),
    description TEXT,
    isbn VARCHAR(100),
    bookshelf VARCHAR(255),
    imageurl VARCHAR(500)
);

INSERT INTO books (title, authors_names, description, isbn, bookshelf, imageurl) VALUES (
  'Dune',
  'Frank Herbert',
  'Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.',
  'ISBN_13 9780441013593',
  'Fantasy',
  'https://books.google.com/books/content?id=QdX94z_OoukC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'  
);
INSERT INTO books (title, authors_names, description, isbn, bookshelf, imageurl) VALUES (
  'What Alice Forgot',
  'Liane Moriarty',
  'Alice Love is twenty-nine, crazy about her husband, and pregnant with her first child. So imagine Alice''s surprise when she comes to on the floor of a gym (a gym! She HATES the gym) and is whisked off to the hospital where she discovers the honeymoon is truly over—she''s getting divorced, she has three kids, and she''s actually 39 years old.',
  'ISBN_13 1101515376',
  'Fiction',
  'http://books.google.com/books/content?id=8iBGzeqj45YC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api'  
);