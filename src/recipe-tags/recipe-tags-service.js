const RecipeTagsService = {
    getAllTags(knex) {
        return knex
            .select('*')
            .from('recipe_tags')
    }
}

module.exports = RecipeTagsService