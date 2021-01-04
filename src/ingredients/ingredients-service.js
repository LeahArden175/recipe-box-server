const knex = require('knex')

const IngredientsService = {
    getAllIngredients(knex, id) {
        return knex
            .select('*')
            .from('ingredients')
    },
    addIngredient(knex, newIngredient) {
        return knex
            .insert(newIngredient)
            .into('ingredients')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = IngredientsService