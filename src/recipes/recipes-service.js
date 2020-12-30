const RecipesService = {
    getAllRecipes(knex) {
        return knex 
        .select('*')
        .from('recipes')
        //.where({user_id : id})
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
}

module.exports = RecipesService;