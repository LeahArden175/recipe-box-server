module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://leaharden@localhost/recipe-box',
  TEST_DATABSE_URL: process.env.TEST_DATABASE_URL || 'postgresql://leaharden@localhost/recipe-box-test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}

//select recipe_tags.id, tags.tag_name from recipe_tags join tags on recipe_tags.tag_id = tags.id where recipe_tags.recipe_id = 2;
//^^ gets all tags for a certain recipe

//select * from recipes join recipe_tags on recipe_tags.recipe_id = recipes.id where recipe_tags.tag_id = 2;
//^^gets all recipes with certain tag