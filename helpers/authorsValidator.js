const { body, query, param } = require('express-validator')

const authorValidationRules = () => {
    return [
        body('name')
            .isString()
            .trim()
            .withMessage('Name must be a String'),
        body('lastname')
            .isString()
            .trim()
            .withMessage('Last Name must be a String'),
        body('dateOfBirth')
            .isDate()
            .withMessage('Date Of Birth must be a Date'),
        body('country')
            .isString()
            .trim()
            .withMessage('Country must be a String'),
        body('books')
            .isArray()
            .withMessage('Books must be an Array'),
        body('gender')
            .isString()
            .trim()
            .withMessage('Gender must be a String'),
        body('biography')
            .isString()
            .trim()
            .withMessage('Biography must be a String'),
        body('alive')
            .isBoolean().withMessage('Alive must be a boolean'),
    ]
}

module.exports = {
    authorValidationRules
}