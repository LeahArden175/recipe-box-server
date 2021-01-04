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
    },
    getById(knex, id) {
        return knex
            .from('ingredients')
            .select('*')
            .where({ id })
            .first()
    },
    deleteIngredient(knex, id) {
        return knex('ingredients')
            .where({ id })
            .delete()
    },
    editIngredient(knex, id, newIngredientFields) {
        return knex('ingredients')
            .where({ id })
            .update(newIngredientFields)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = IngredientsService