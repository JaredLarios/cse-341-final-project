const { body, query, param } = require('express-validator')

const localValidationRules = () => {
    return [
        body('name')
            .isString()
            .trim()
            .isLength({ min: 2 })
            .notEmpty()
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Name must be a String'),
        body('address')
            .isString()
            .trim()
            .isLength({ min: 2 })
            .notEmpty()
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Address must be a String'),
        body('booksOnStockIDs')
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
        body('phone')
            .isInt()
            .notEmpty()
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Phone must be a valid phone number'),
    ]
}

const localValidationQuery = () => {
    return [
        query('name')
        .isString()
        .trim()
        .withMessage('Name must be a String'),
    ]
}

const localValidationId = () => {
    return [
        param('id')
            .isLength({ min: 24, max: 24 })
            .withMessage('ID must be a 24 character hex string')
            .isHexadecimal()
            .withMessage('ID must be hexadecimal')
    ]
}

module.exports = {
    localValidationRules,
    localValidationQuery,
    localValidationId
}