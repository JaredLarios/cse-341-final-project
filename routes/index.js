const router = require('express').Router()
const authorRouter = require("./authorsRoute")
const booksRouter = require("./booksRoute")
const usersRouter = require("./usersRoute")
const localsRouter = require("./localsRoute")

router.use("/", require("./swagger"))
router.use("/author", authorRouter);
router.use("/books", booksRouter);
router.use("/users", usersRouter);
router.use("/locals", localsRouter);


module.exports = router;