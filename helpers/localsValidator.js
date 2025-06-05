const { check } = require('express-validator');

const localValidationRules = () =>{
    return [
    check('name')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Name is required and must be a string'),

    check('address')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Address is required and must be a string'),

    check('booksOnStockIDs')
        .isArray()
        .withMessage('BooksOnStockIDs must be an array')
        .custom((value) => {
            if (!Array.isArray(value)) return false;
            return value.every((id) => typeof id === 'string' || typeof id === 'number');
        })
        .withMessage('BooksOnStockIDs must contain valid IDs'),

    check('phone')
        .isNumeric()
        .notEmpty()
        .withMessage('Phone must be a valid number')
]
};

module.exports = localValidationRules;
