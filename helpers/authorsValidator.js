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
            .isString()
            .withMessage('Date Of Birth must be a Date'),
        body('country')
            .isString()
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