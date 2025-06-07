const router = require('express').Router()
const localsController = require('../controllers/locals')
const validate = require('../helpers/validate')
const { 
    localValidationRules,
    localValidationQuery,
    localValidationId
} = require('../helpers/localsValidator')


// GET 
router.get("/", localsController.getAll)
router.get("/id/:id", localValidationId(), validate, localsController.getSingleById)
router.get("/search", localValidationQuery(), validate, localsController.getByQueries)

// POST 
router.post("/", localValidationRules(), validate, localsController.addLocals)

// PUT 
router.put("/id/:id", localValidationId(), validate, localsController.updateLocals)

// DELETE 
router.delete("/id/:id", localValidationId(), validate, localsController.deleteLocals)


module.exports = router;