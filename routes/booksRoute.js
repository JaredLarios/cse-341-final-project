const express = require('express');
const router = express.Router();
const booksController = require("../controllers/books");

const {
    booksValidationRules,
    bookValidationQuery,
    bookValidationId
} = require('../helpers/booksValidator');
const validate = require('../helpers/validate')



// GET 
router.get('/', booksController.getAll);
router.get('/id/:id', bookValidationId(), validate, booksController.getSingleById);
router.get('/search', bookValidationQuery(), validate, booksController.getByQuery);

// POST 
router.post('/', booksValidationRules(), validate, booksController.createBook);

// PUT 
router.put('/id/:id', bookValidationId(), booksValidationRules(), validate, booksController.updateBook);


// DELETE 
router.delete('/id/:id', bookValidationId(), validate, booksController.deleteBook);



module.exports = router;