const knex = require('knex')

const IngredientsService = {
    getAllIngredients(knex, id) {
        return knex
            .select('*')
            .from('ingredients')
    }
}

module.exports = IngredientsService