const router = require('express').Router()
const authorsController = require('../controllers/authors')
const validate = require('../helpers/validate')
const { 
    authorValidationRules,
    authorValidationQuery,
    authorValidationId
} = require('../helpers/authorsValidator')


// GET 
router.get("/", authorsController.getAll)
router.get("/id/:id", authorValidationId(), validate, authorsController.getSingleById)
router.get("/search", authorValidationQuery(), validate, authorsController.getByQueries)

// POST 
router.post("/", authorValidationRules(), validate, authorsController.addAuthors)

// PUT 
router.put("/id/:id", authorValidationRules(), validate, authorsController.updateAuthors)

// DELETE 
router.delete("/id/:id", authorValidationId(), validate, authorsController.deleteAuthors)


module.exports = router;