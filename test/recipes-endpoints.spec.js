const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const helpers = require("./test-helpers");

describe("Recipes Endpoints", function () {
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

  describe('GET /api/recipes', () => {
      context('Given no recicpes in the db', () => {
          const testUsers = helpers.makeUsersArray();

          beforeEach('insert users', () => {
              return db
                .insert(testUsers)
                .into('recipe_box_users')
          })

          it('responds with 200 and an empty list', () => {
              return supertest(app)
                .get('/api/recipes')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
          })
      })
      context('Given recipes in the db', () => {
          const testUsers =  helpers.makeUsersArray();
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
          it('responds with 200 and list of recipes', () => {
              return supertest(app)
                .get('/api/recipes')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, testRecipes)
          })
      })
      context('given an xss attack', () => {
        const testUsers =  helpers.makeUsersArray();
        const {maliciousRecipe, expectedRecipe} = helpers.makeMaliciousRecipe();

        beforeEach('insert malicious recipe', () => {
            return db
                .into('recipe_box_users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('recipes')
                        .insert([ maliciousRecipe ])
                })
        })
        it('removes xss attack', () => {
            return supertest(app)
                .get('/api/recipes')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => [
                    expect(res.body[0].title).to.eql(expectedRecipe.title)
                ])
        })
      })
  })
  describe.only('GET /api/recipes/:recipe_id', () => {
      context('Given no recipes in the db', () => {
          const testUsers =  helpers.makeUsersArray();

          beforeEach('insert users', () => {
              return db 
                .into('recipe_box_users')
                .insert(testUsers)
          })

          it('responds with 404', () => {
              const recipeId = 123
              return supertest(app)
                .get(`/api/recipes/${recipeId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: {message : 'Recipe does not exist'}
                })
          })
      })
      context('Given recipes in the db', () => {
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

          it('responds with 200 and specified recipe', () => {
              const recipeId = 1;
              const expectedRecipe = testRecipes[recipeId - 1]

              return supertest(app)
                .get(`/api/recipes/${recipeId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedRecipe)
          })
      })
      context('Given xss attack', () => {
          const testUsers = helpers.makeUsersArray();
          const {maliciousRecipe, expectedRecipe} = helpers.makeMaliciousRecipe()

          beforeEach('insert malicious recipe', () => {
              return db
                .into('recipe_box_users')
                .insert(testUsers)
                .then(() => {
                    return db 
                        .into('recipes')
                        .insert(maliciousRecipe)
                })
          })
          it('removes xss attack', () => {
              return supertest(app)
                .get(`/api/recipes/${maliciousRecipe.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body.title).to.eql(expectedRecipe.title)
                })
          })
      })
  })
});
