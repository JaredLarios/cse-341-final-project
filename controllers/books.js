const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const books = await mongodb.getDatabase().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid book id to find a book.');
    }
    const bookId = new ObjectId(req.params.id);
    const book = await mongodb.getDatabase().collection('books').findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json('Book not found');
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const book = {
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      language: req.body.language,
      authorsID: req.body.authorsID,
      quantity: req.body.quantity,
      available: req.body.available
    };

    const response = await mongodb.getDatabase().collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Book created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the book.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  //#swagger.tags=['Books']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid book id to update a book.');
    }

    const bookId = new ObjectId(req.params.id);
    const book = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        language: req.body.language,
        authorsID: req.body.authorsID,
        quantity: req.body.quantity,
        available: req.body.available
    };

    const response = await mongodb.getDatabase().collection('books').replaceOne({ _id: bookId }, book);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the book.' });
    }

  } catch (error) {
    console.error('Error in updateBook:', error);
    res.status(500).json({ message: 'Internal server error while updating the book.', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  //#swagger.tags=['Books']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid book id to delete a book.');
    }

    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('books').deleteOne({ _id: bookId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while deleting the book.' });
    }

  } catch (error) {
    console.error('Error in deleteBook:', error);
    res.status(500).json({ message: 'Internal server error while deleting the book.', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook
};
