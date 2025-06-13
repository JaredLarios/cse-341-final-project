const { body, query, param } = require('express-validator')

const authorValidationRules = () => {
    return [
        body('name')
            .isString()
            .isLength({ min: 1 })
            .notEmpty()
            .trim()
            .withMessage('Name must be a String'),
        body('lastname')
            .isString()
            .isLength({ min: 1 })
            .notEmpty()
            .trim()
            .withMessage('Last Name must be a String'),
        body('dateOfBirth')
            .isString()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage('Date Of Birth must be a Date'),
        body('country')
            .isString()
            .isLength({ min: 1 })
            .notEmpty()
            .trim()
            .withMessage('Country must be a String'),
        body('books')
            .optional()
            .isArray()
            .withMessage('Books must be an Array')
            .custom((value) => {
                if (!value.every(id => 
                    id.length === 24 && 
                    /^[0-9A-Fa-f]{24}$/.test(id)
                )) {
                    throw new Error('Each book ID must be a 24 character hex string');
                }
                return true;
            }),
        body('gender')
            .isString()
            .isLength({ min: 1 })
            .notEmpty()
            .trim()
            .withMessage('Gender must be a String'),
        body('biography')
            .isString()
            .isLength({ min: 1 })
            .notEmpty()
            .trim()
            .withMessage('Biography must be a String'),
        body('alive')
            .isBoolean().withMessage('Alive must be a boolean'),
    ]
}

const authorValidationQuery = () => {
    return [
        query('name')
        .isString()
        .trim()
        .withMessage('Name must be a String'),
    query('last_name')
        .optional()
        .isString()
        .trim()
        .withMessage('Last Name must be a String')
    ]
}

const authorValidationId = () => {
    return [
        param('id')
            .isLength({ min: 24, max: 24 })
            .withMessage('ID must be a 24 character hex string')
            .isHexadecimal()
            .withMessage('ID must be hexadecimal')
    ]
}

module.exports = {
    authorValidationRules,
    authorValidationQuery,
    authorValidationId
}