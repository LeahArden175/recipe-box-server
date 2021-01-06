const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const helpers = require("./test-helpers");

describe("Ingredients Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET /api/ingredients", () => {
    context("Given no ingredients in db", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();

      beforeEach("insert users and recipes", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db.into("recipes").insert(testRecipes);
          });
      });
      it('responds with 200 and empty list', () => {
          return supertest(app)
            .get('/api/ingredients')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200, [])
      })
    });
    context('given ingredients in db', () => {
        const testUsers =  helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testIngredients = helpers.makeIngredientsArray();

        beforeEach('insert users and recipes', () => {
            return db 
              .into('recipe_box_users')
              .insert(testUsers)
              .then(() => {
                  return db
                      .into('recipes')
                      .insert(testRecipes)
                      .then(() => {
                          return db
                            .into('ingredients')
                            .insert(testIngredients)
                      })
              })
        })
        it('responds with 200 and list of ingredients', () => {
            return supertest(app)
                .get('/api/ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, testIngredients)
        })
    })
    context('given xss attack', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const {maliciousIngredient, expectedIngredient} = helpers.makeMaliciousIngredient();

        beforeEach('insert malicious ingredient', () => {
            return db
            .into('recipe_box_users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('recipes')
                    .insert(testRecipes)
                    .then(() => {
                        return db
                            .into('ingredients')
                            .insert([maliciousIngredient])
                    })
            })
        })
        it('removes xss attack', () => {
            return supertest(app)
                .get('/api/ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body[0].food_item).to.eql(expectedIngredient.food_item)
                })
        })
    })
  });
  describe('GET /api/ingredients/:ingredient:id', () => {
      context('Given no ingredients in db', () => {
          const testUsers = helpers.makeUsersArray();
          const testRecipes = helpers.makeRecipesArray();

          beforeEach('insert users and recipes', () => {
              return db
                .into('recipe_box_users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('recipes')
                        .insert(testRecipes)
                })
          })
          it('responds with 404', () => {
              const ingredientId = 123
              return supertest(app)
                .get(`/api/ingredients/${ingredientId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: {message: 'Ingredient does not exist'}
                })
          })
      })
      context('Given ingredient in db', () => {
        const testUsers =  helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testIngredients = helpers.makeIngredientsArray();

        beforeEach('insert users and recipes', () => {
            return db 
              .into('recipe_box_users')
              .insert(testUsers)
              .then(() => {
                  return db
                      .into('recipes')
                      .insert(testRecipes)
                      .then(() => {
                          return db
                            .into('ingredients')
                            .insert(testIngredients)
                      })
              })
        })
        it('responds with 200 and specified ingredient', () => {
            const ingredientId = 1;
            const expectedIngredient = testIngredients[ingredientId - 1]

            return supertest(app)
                .get(`/api/ingredients/${ingredientId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedIngredient)
        })
      })
      context('given xss attack', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const {maliciousIngredient, expectedIngredient} = helpers.makeMaliciousIngredient();

        beforeEach('insert malicious ingredient', () => {
            return db
            .into('recipe_box_users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('recipes')
                    .insert(testRecipes)
                    .then(() => {
                        return db
                            .into('ingredients')
                            .insert([maliciousIngredient])
                    })
            })
        })
        it('removes xss attack', () => {
            return supertest(app)
                .get(`/api/ingredients/${maliciousIngredient.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body.food_item).to.eql(expectedIngredient.food_item)
                })
        })
      })
  })
  describe.only('POST /api/ingredients', () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();

      beforeEach('insert users and recipes', () => {
          return db
            .into('recipe_box_users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('recipes')
                    .insert(testRecipes)
            })
      })
      it('creates a new ingredient, responding with 201 and new ingredient', () => {
          const newIngredient = {
            "food_item": "pepper",
            "amount": 2,
            "recipe_id": 5,
           "unit": "tsp",
          }

          return supertest(app)
            .post('/api/ingredients')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newIngredient)
            .expect(201)
            .expect(res => {
                expect(res.body.food_item).to.eql(newIngredient.food_item)
                expect(res.body.amount).to.eql(newIngredient.amount)
                expect(res.body.recipe_id).to.eql(newIngredient.recipe_id)
                expect(res.body.unit).to.eql(newIngredient.unit)
            })
            .then(res => {
                supertest(app)
                    .get(`/api/ingredients/${res.body.id}`)
                    .expect(res.body)
            })
      })

      const requiredFields = ['food_item', 'recipe_id', 'amount', 'unit']

      requiredFields.forEach((field) => {
          const newIngredient = {
            food_item: "pepper",
            amount: 2,
            recipe_id: 5,
            unit: "tsp",
          }
          it(`responds with 400 and an error message when the '${field}' is missing`, () => {
              delete newIngredient[field]

              return supertest(app)
                .post('/api/ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newIngredient)
                .expect(400, {
                    error: {message: `Missing ${field} in request body`}
                })
          })
          it('removes an xss attack', () => {
              const {maliciousIngredient, expectedIngredient} = helpers.makeMaliciousIngredient();

              return supertest(app)
                .post('/api/ingredients')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(maliciousIngredient)
                .expect(201)
                .expect(res => {
                    expect(res.body.food_item).to.eql(expectedIngredient.food_item)
                })
          })
      })
  })
});
