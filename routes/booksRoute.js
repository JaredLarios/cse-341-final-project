const express = require('express');
const router = express.Router();
const booksController = require("../controllers/books");

const {
    booksValidationRules,
    bookValidationQuery,
    bookValidationId
} = require('../helpers/booksValidator');
const validate = require('../helpers/validate')
const { isAuthenticated } = require('../middlewares/authenticate')



// GET 
router.get('/', booksController.getAll);
router.get('/id/:id', bookValidationId(), validate, booksController.getSingleById);
router.get('/search', bookValidationQuery(), validate, booksController.getByQuery);

// POST 
router.post('/', isAuthenticated, booksValidationRules(), validate, booksController.createBook);

// PUT 
router.put('/id/:id', isAuthenticated, bookValidationId(), booksValidationRules(), validate, booksController.updateBook);


// DELETE 
router.delete('/id/:id', isAuthenticated, bookValidationId(), validate, booksController.deleteBook);



module.exports = router;