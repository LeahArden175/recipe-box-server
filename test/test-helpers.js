const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      full_name: "Leah",
      username: "leah",
      password: "$2a$12$.yPZ0O4snWoYH/QG3I0EiujhAoLmAfNr8YxHmIsTMJuHlO1MB3VjG",
      date_created: "2021-01-04T15:01:51.041Z",
      date_modified: null,
    },
    {
      id: 2,
      full_name: "nick d",
      username: "nick",
      password: "$2a$12$xwnjhIiXL8bKl214MyWzZO6EbEk25wzhg1Z7j/ViPZwq77QdIHFTW",
      date_created: "2021-01-04T15:01:51.041Z",
      date_modified: null,
    },
    {
      id: 3,
      full_name: "Joy",
      username: "Joy",
      password: "$2a$12$xwnjhIiXL8bKl214MyWzZO6EbEk25wzhg1Z7j/ViPZwq77QdIHFTW",
      date_created: "2021-01-04T15:01:51.041Z",
      date_modified: null,
    },
  ];
}
function makeRecipesArray() {
  return [
    {
      id: 1,
      title: "Pancakes",
      date_created: "2021-01-04T15:01:51.041Z",
      user_id: 1,
    },
    {
      id: 2,
      title: "Pasta",
      date_created: "2021-01-04T15:01:51.041Z",
      user_id: 1,
    },
    {
      id: 3,
      title: "Granola",
      date_created: "2021-01-04T15:01:51.041Z",
      user_id: 1,
    },
    {
      id: 4,
      title: "Waffles",
      date_created: "2021-01-04T15:01:51.041Z",
      user_id: 1,
    },
    {
      id: 5,
      title: "Pea Soup",
      date_created: "2021-01-04T15:01:51.041Z",
      user_id: 1,
    },
    {
      id: 6,
      title: "Test recipe EDITED",
      date_created: "2021-01-04T16:54:59.939Z",
      user_id: 1,
    },
  ];
}
function makeIngredientsArray() {
  return [
    {
      id: 1,
      food_item: "olive oil",
      amount: "4",
      recipe_id: 2,
      unit: "tbs",
    },
    {
      id: 2,
      food_item: "choppped onion",
      amount: "1",
      recipe_id: 2,
      unit: "cup",
    },
    {
      id: 3,
      food_item: "minced garlic",
      amount: "2",
      recipe_id: 2,
      unit: "tsp",
    },
    {
      id: 4,
      food_item: "spaghetti",
      amount: "1",
      recipe_id: 2,
      unit: "lb",
    },
    {
      id: 5,
      food_item: "crushed tomatoes",
      amount: "24",
      recipe_id: 2,
      unit: "oz",
    },
    {
      id: 6,
      food_item: "salt",
      amount: "1",
      recipe_id: 2,
      unit: "tsp",
    },
    {
      id: 7,
      food_item: "pepper",
      amount: "1",
      recipe_id: 2,
      unit: "tsp",
    },
    {
      id: 8,
      food_item: "olive oil",
      amount: "5",
      recipe_id: 5,
      unit: "tbs",
    },
    {
      id: 9,
      food_item: "chopped onion",
      amount: "1",
      recipe_id: 5,
      unit: "cup",
    },
    {
      id: 10,
      food_item: "split peas",
      amount: "1",
      recipe_id: 5,
      unit: "lb",
    },
    {
      id: 11,
      food_item: "minced garlic",
      amount: "2",
      recipe_id: 5,
      unit: "tsp",
    },
    {
      id: 12,
      food_item: "ham hocks",
      amount: "2",
      recipe_id: 5,
      unit: "lbs",
    },
    {
      id: 13,
      food_item: "chicken stock",
      amount: "8",
      recipe_id: 5,
      unit: "cups",
    },
    {
      id: 14,
      food_item: "salt",
      amount: "1",
      recipe_id: 5,
      unit: "tsp",
    },
    {
      id: 15,
      food_item: "pepper",
      amount: "2",
      recipe_id: 5,
      unit: "tsp",
    },
    {
      id: 16,
      food_item: "test EDITED",
      amount: "10",
      recipe_id: 5,
      unit: "cup",
    },
  ];
}
function makeInstructionsArray() {
  return [
    {
      id: 1,
      recipe_id: 2,
      list_order: 1,
      step_info:
        "Heat olive oil in medium saute pan over medium heat until oil is shimmering. Add onions and cook until translucent, about 5-8 min. Add garlic and cook 1 min or until fragrant",
    },
    {
      id: 2,
      recipe_id: 2,
      list_order: 2,
      step_info:
        "Add salt, pepper, and crushed tomatoes to the saute pan. Stir until combined",
    },
    {
      id: 3,
      recipe_id: 2,
      list_order: 3,
      step_info:
        "Bring tomato mixture to a boil and then set the heat to low. Let simmer covered for 1hr",
    },
    {
      id: 4,
      recipe_id: 2,
      list_order: 4,
      step_info:
        "While the sauce simmers, bring a large pot of heavily salted water to a boil. Add spaghetti and cook until al dente",
    },
    {
      id: 5,
      recipe_id: 2,
      list_order: 5,
      step_info:
        "Drain pasta and add it to the simmering sauce. Mix until pasta is covered and serve!",
    },
    {
      id: 6,
      recipe_id: 5,
      list_order: 1,
      step_info: "Heat olive oil in a large cast iron pot over medium heat",
    },
    {
      id: 7,
      recipe_id: 5,
      list_order: 2,
      step_info:
        "Add onions to oil and cook until translucent. About 5-8 min. Add garlic and cook 1 min or until fragrant",
    },
    {
      id: 8,
      recipe_id: 5,
      list_order: 3,
      step_info: "Add split peas and mix until coated with oil",
    },
    {
      id: 9,
      recipe_id: 5,
      list_order: 4,
      step_info:
        "Add ham hocks, chicken stock, salt, and peper. Bring soup to a boil, then set the heat to low and let simmer, uncovered, for 1 hour. Be sure to mix every 20 min",
    },
    {
      id: 10,
      recipe_id: 5,
      list_order: 5,
      step_info: "When soup is thick, take off heat and serve.",
    },
  ];
}
function makeTagsArray() {
  return [
    {
      id: 1,
      tag_name: "Dinner",
    },
    {
      id: 2,
      tag_name: "Lunch",
    },
    {
      id: 3,
      tag_name: "Breakfast",
    },
    {
      id: 4,
      tag_name: "Dessert",
    },
  ];
}
function makeRecipeTagsArray() {
  return [
    {
      id: 1,
      tag_id: 3,
      recipe_id: 1,
    },
    {
      id: 2,
      tag_id: 1,
      recipe_id: 2,
    },
    {
      id: 3,
      tag_id: 2,
      recipe_id: 2,
    },
    {
      id: 4,
      tag_id: 3,
      recipe_id: 4,
    },
    {
      id: 5,
      tag_id: 1,
      recipe_id: 5,
    },
  ];
}
function makeAuthHeader(user, secret = process.env.JWT_SECRET){
    const token = jwt.sign({ user_id: user.id}, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`;
}
function makeRecipesFixtures() {
    const testUsers = makeUsersArray()
    const testRecipes = makeRecipesArray(testUsers)
    const testIngredients = makeIngredientsArray()
    const testInstructions =  makeInstructionsArray()
    const testTags = makeTagsArray()
    const testRecipeTags = makeRecipeTagsArray(testRecipes, testTags)
    return {
        testUsers,
        testRecipes,
        testIngredients,
        testInstructions,
        testTags,
        testRecipeTags
    }
}
function seedUsers(db, users) {
    const preppedUsers = users.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db
        .into('recipe_box_users')
        .insert(preppedUsers)
        .then(() => [
            db.raw(`SELECT setval('recipe_box_users_id_seq, ?)`, [
                users[users.length - 1].id,
            ])
        ])
}
function cleanTables(db) {
    return db.transaction((trx) => 
        trx
            .raw(
                `TRUNCATE
                    ingredients,
                    instructions,
                    recipe_tags,
                    tags,
                    recipes,
                    recipe_box_users
                `
            )
            .then(() => 
                Promise.all([
                    trx.raw(
                        'ALTER SEQUENCE ingredients_id_seq minvalue 0 START WITH 1'
                    ),
                    trx.raw(
                        'ALTER SEQUENCE instructions_id_seq minvalue 0 START WITH 1'
                    ),
                    trx.raw(
                        'ALTER SEQUENCE recipe_tags_id_seq minvalue 0 START WITH 1'
                    ),
                    trx.raw(
                        'ALTER SEQUENCE tags_id_seq minvalue 0 START WITH 1'
                    ),
                    trx.raw(
                        'ALTER SEQUENCE recipes_id_seq minvalue 0 START WITH 1'
                    ),
                    trx.raw(
                        'ALTER SEQUENCE recipe_box_users_id_seq minvalue 0 START WITH 1'
                    ),
                    trx.raw(`SELECT setval('ingredients_id_seq', 0)`),
                    trx.raw(`SELECT setval('instructions_id_seq', 0)`),
                    trx.raw(`SELECT setval('recipe_tags_id_seq', 0)`),
                    trx.raw(`SELECT setval('tags_id_seq', 0)`),
                    trx.raw(`SELECT setval('recipes_id_seq', 0)`),
                    trx.raw(`SELECT setval('recipe_box_users_id_seq', 0)`),
                ])
            )
    )
}
function seedRecipes(db, users, recipes) {
    return db.transaction(async(trx) => {
        await seedUsers(trx, users);
        await trx.into('recipes').insert(recipes);
        await trx.raw(`SELECT setval('recipe_id_seq', ?)`, [
            recipes[recipes.length - 1].id
        ])
    })
}
function seedIngredients(db, users, recipes, ingredients) {
    return db.transaction(async (trx) => {
        await seedUsers(trx, users);
        await seedRecipes(trx, users, recipes)
        await trx.into('ingrediets').insert(ingredients)
        await trx.raw(`SELECT setval('ingredients_id_seq', ?)`, [
            ingredients[ingredients.length -1].id
        ])
    })
}
function seedInstructions(db, users, recipes, instructions) {
    return db.transaction(async (trx) => {
        await seedUsers(trx, users);
        await seedRecipes(trx, users, recipes)
        await trx.into('instructions').insert(instructions);
        await trx.raw(`SELECT setval('instrutions_id_seq', ?)`, [
            instructions[instructions.length - 1].id
        ])
    })
}
function seedTags(db, tags) {
    return db
        .into('tags')
        .insert('tags')
        .then(() => {
            db.raw(`SELECT setval('tags_id_seq, ?)`, [
                tags[tags.length - 1].id
            ])
        })
}

module.exports = {
  makeUsersArray,
  makeRecipesArray,
  makeIngredientsArray,
  makeInstructionsArray,
  makeTagsArray,
  makeRecipeTagsArray,
  makeAuthHeader,
  makeRecipesFixtures,
  seedUsers,
  cleanTables,
  seedRecipes,
  seedIngredients,
  seedInstructions,
  seedTags
};
