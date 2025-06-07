const createError = require('http-errors');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


const lookup = {
    $lookup: {
        from: "Authors",
        localField: "authorId",
        foreignField: "_id",
        as: "author"
    }
}

const unwindAuthor = {
    $unwind: "$author"
}

const aggregateSetting = {
    $project: {
        title: 1,
        releaseDate: 1,
        language: 1,
        author: {
          name: "$author.name",
          lastname: "$author.lastname"
        },
        quantity: 1,
        available: 1
    }
}

const getAll = async (req, res, next) => {
  try {
    //#swagger.tags=['Books']
    const response = await mongodb
                            .getDatabase()
                            .db()
                            .collection('Books')
                            .aggregate([
                              lookup,
                              unwindAuthor,
                              aggregateSetting
                            ]).toArray();
    
    if(!response) throw createError(404, "Not Books found");
    
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const getSingleById = async (req, res, next) => {
  try {
    //#swagger.tags=['Books']
    const bookId = new ObjectId(req.params.id)

    const validID = await validateExistingID(bookId);
    if(!validID) throw createError(404, "Authors ID does not exist");

    const book = await mongodb
                            .getDatabase()
                            .db()
                            .collection('Books')
                            .aggregate([
                              { $match: {_id: bookId} },
                              lookup,
                              unwindAuthor,
                              aggregateSetting
                            ]).toArray();

    res.status(200).json(book[0]);
  } catch (err) {
    next(err);
  }
};

const getByQuery = async (req, res, next) => {
  try {
    //#swagger.tags=['Books']
    const bookTitle = req.query.title

    const response = await mongodb
                            .getDatabase()
                            .db()
                            .collection('Books')
                            .aggregate([
                              { $match: {title: { $regex: bookTitle, $options: 'i' }} },
                              lookup,
                              unwindAuthor,
                              aggregateSetting
                            ]).toArray();

    if(!response) throw createError(404, "Book title not found");

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    //#swagger.tags=['Books']
    const book = {
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      language: req.body.language,
      authorsID: req.body.authorsID,
      quantity: req.body.quantity,
      available: req.body.available
    };

    const response = await mongodb.getDatabase().collection('Books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Book created successfully', id: response.insertedId });
    } else {
      return next({message: 'Some error occurred while creating the book.'});
    }
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  //#swagger.tags=['Books']
  try {
    const bookId = new ObjectId(req.params.id);
    const book = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        language: req.body.language,
        authorsID: req.body.authorsID,
        quantity: req.body.quantity,
        available: req.body.available
    };

    const validID = await validateExistingID(bookId);
    if(!validID) throw createError(404, "Authors ID does not exist");

    const response = await mongodb.getDatabase().collection('Books').replaceOne({ _id: bookId }, book);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      return next({message: 'Some error occurred while updating the book.' });
    }

  } catch (error) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  //#swagger.tags=['Books']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid book id to delete a book.');
    }

    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('Books').deleteOne({ _id: bookId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      return next({message: 'Some error occurred while deleting the book.'});
    }

  } catch (error) {
    next(err);
  }
};

const validateExistingID = async (id) => {
    const authorsID = await mongodb.getDatabase().db().collection("Books").findOne({_id: id});
    return !!authorsID;
}

module.exports = {
  getAll,
  getSingleById,
  getByQuery,
  createBook,
  updateBook,
  deleteBook
};
