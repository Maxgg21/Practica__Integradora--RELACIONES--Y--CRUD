const { check } = require('express-validator')

module.exports = [
    check('title').notEmpty().withMessage('Required TITLE'),
    check('rating').notEmpty().withMessage('Required RATING'),
    check('release_date').notEmpty().withMessage('Required DATE'),
    check('length').notEmpty().withMessage('Required LENGTH'),
    check('genre_id').notEmpty().withMessage('Required GENERE'),

]
