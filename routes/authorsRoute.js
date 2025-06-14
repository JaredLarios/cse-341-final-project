const router = require('express').Router()
const authorsController = require('../controllers/authors')
const validate = require('../helpers/validate')
const { 
    authorValidationRules,
    authorValidationQuery,
    authorValidationId
} = require('../helpers/authorsValidator')

const { isAuthenticated } = require('../middlewares/authenticate')


// GET 
router.get("/", authorsController.getAll)
router.get("/id/:id", authorValidationId(), validate, authorsController.getSingleById)
router.get("/search", authorValidationQuery(), validate, authorsController.getByQueries)

// POST 
router.post("/", isAuthenticated(), authorValidationRules(), validate, authorsController.addAuthors)

// PUT 
router.put("/id/:id", isAuthenticated(), authorValidationId(), authorValidationRules(), validate, authorsController.updateAuthors)

// DELETE 
router.delete("/id/:id", isAuthenticated(), authorValidationId(), validate, authorsController.deleteAuthors)


module.exports = router;