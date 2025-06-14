const router = require('express').Router()
const authorRouter = require("./authorsRoute")
const booksRouter = require("./booksRoute")
const usersRouter = require("./usersRoute")
const localsRouter = require("./localsRoute")
const passport = require('passport')

router.use("/", require("./swagger"))
router.use("/author", authorRouter);
router.use("/books", booksRouter);
router.use("/users", usersRouter);
router.use("/locals", localsRouter);

router.get('/login', passport.authenticate('github'), (req, res) => {});
router.get('/logout', (req, res, next) => {
    req.logOut( function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;