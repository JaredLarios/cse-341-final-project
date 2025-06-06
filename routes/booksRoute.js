const express = require('express');
const router = express.Router();
const booksController = require("../controllers/books");



// GET 
// router.get("/", (req, res) => res.send("Get All"))
// router.get("/:id", (req, res) => res.send("Get Single by ID"))
// router.get("/search", (req, res) => res.send("Get Single by Title"))

//
router.get('/', booksController.getAll);
router.get('/:id', booksController.getSingle);

// POST 
// router.post("/", (req, res) => res.send("Hello Books"))

router.post('/', booksController.createBook);

// PUT 
// router.put("/:id", (req, res) => res.send("Hello Books"))
router.put('/:id', booksController.updateBook);


// DELETE 
// router.delete("/:id", (req, res) => res.send("Hello Books"))
router.delete('/:id', booksController.deleteBook);



module.exports = router;