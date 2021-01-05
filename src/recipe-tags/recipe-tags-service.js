const recipeTagsRouter = require("./recipe-tags-router")

const RecipeTagsService = {
    getAllTags(knex) {
        return knex
            .select('*')
            .from('recipe_tags')
    },
    getTagsForRecipe(knex, recipeId) {
        return knex
            .select('recipe_tags.id', 'tags.tag_name')
            .from('recipe_tags')
            .join('tags', 'recipe_tags.tag_id', '=', 'tags.id')
            .where({'recipe_tags.recipe_id' : recipeId})
    },
    getRecipesForTag(knex, tagId) {
        return knex
            .select('*')
            .from('recipes')
            .join('recipe_tags', 'recipe_tags.recipe_id', '=', 'recipes.id')
            .where({'recipe_tags.tag_id' : tagId})
    }
}

module.exports = RecipeTagsService