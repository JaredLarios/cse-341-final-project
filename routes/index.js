const router = require('express').Router()
const authorRouter = require("./authorsRoute")

router.use("/author", authorRouter);


module.exports = router;