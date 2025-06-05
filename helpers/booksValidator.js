const { body } = require('express-validator');


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
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Author ID is required and must be a string'),

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

module.exports = {
    booksValidationRules
};