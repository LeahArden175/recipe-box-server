const RecipesService = {
    getAllRecipes(knex, id) {
        return knex 
        .select('*')
        .from('recipes')
        .where({user_id : id})
    },
    addRecipe(knex, newRecipe) {
        return knex
            .insert(newRecipe)
            .into('recipes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('recipes')
            .select('*')
            .where({ id })
            .first()
    },
    deleteRecipe(knex, id) {
        return knex('recipes')
            .where({ id })
            .delete()
    },
    editRecipe(knex, id, newRecipeFields) {
        return knex('recipes')
            .where({ id })
            .update(newRecipeFields)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = RecipesService;