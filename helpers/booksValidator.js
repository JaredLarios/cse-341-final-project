const { body, query, param } = require('express-validator')


const booksValidationRules = () => {
    return [
        body('title')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Title is required and must be a string'),

        body('releaseDate')
            .isDate()
            .notEmpty()
            .withMessage('Release date is required and must be a valid date'),

        body('language')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Language is required and must be a string'),

        body('authorId')
            .isLength({ min: 24, max: 24 })
            .withMessage('ID must be a 24 character hex string')
            .isHexadecimal()
            .withMessage('ID must be hexadecimal'),

        body('quantity')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Quantity is required and must be a string'),

        body('available')
            .isBoolean()
            .notEmpty()
            .withMessage('Available status is required and must be a boolean')
    ]
};

const bookValidationQuery = () => {
    return [
    query('title')
        .isString()
        .trim()
        .withMessage('Name must be a String')
    ]
}

const bookValidationId = () => {
    return [
        param('id')
            .isLength({ min: 24, max: 24 })
            .withMessage('ID must be a 24 character hex string')
            .isHexadecimal()
            .withMessage('ID must be hexadecimal')
    ]
}

module.exports = {
    booksValidationRules,
    bookValidationQuery,
    bookValidationId
};