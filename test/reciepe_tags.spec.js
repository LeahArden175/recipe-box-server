const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const helpers = require("./test-helpers");

describe("All recipe_tags endpoints", () => {
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

  describe("GET /api/recipe_tags", () => {
    context("given tags and recipes in db", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();
      const testTags = helpers.makeTagsArray();
      const testRecipeTags = helpers.makeRecipeTagsArray();

      beforeEach("insert users, recipes, tags", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db
                  .into("tags")
                  .insert(testTags)
                  .then(() => {
                    return db.into("recipe_tags").insert(testRecipeTags);
                  });
              });
          });
      });
      it("responds with 200 and list of ingredients", () => {
        return supertest(app)
          .get("/api/recipe_tags")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, testRecipeTags);
      });
    });
    context("given no recipe_tags in db", () => {
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

      it("responds with 200 and empty list", () => {
        return supertest(app)
          .get("/api/recipe_tags")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });
  });
  describe("POST /api/recipe_tags", () => {
    const testUsers = helpers.makeUsersArray();
    const testRecipes = helpers.makeRecipesArray();
    const testTags = helpers.makeTagsArray();
    const testRecipeTags = helpers.makeRecipeTagsArray();

    beforeEach("insert users, recipes, tags", () => {
      return db
        .into("recipe_box_users")
        .insert(testUsers)
        .then(() => {
          return db
            .into("recipes")
            .insert(testRecipes)
            .then(() => {
              return db.into("tags").insert(testTags);
            });
        });
    });
    it("creates a new recipe_tag", () => {
      const recipeTag = {
        recipe_id: 1,
        tag_id: 1,
      };

      return supertest(app)
        .post("/api/recipe_tags")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(recipeTag)
        .expect(201)
        .expect((res) => {
          expect(res.body.recipe_id).to.eql(recipeTag.recipe_id);
          expect(res.body.tag_id).to.eql(recipeTag.tag_id);
        })
        .then((res) => {
          supertest(app).get(`api/recipe_tags/${res.body.id}`).expect(res.body);
        });
    });

    const requiredFields = ["recipe_id", "tag_id"];

    requiredFields.forEach((field) => {
      const newRecipeTag = {
        recipe_id: 1,
        tag_id: 1,
      };
      it(`responds with 400 and error message when the ${field} is missing`, () => {
        delete newRecipeTag[field];

        return supertest(app)
          .post("/api/recipe_tags")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newRecipeTag)
          .expect(400, {
            error: { message: `Missing ${field} in request body` },
          });
      });
    });
  });
  describe("GET /api/recipe_tags/tag/:recipeId", () => {
    context("given no recipe_tags in db", () => {
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
      it("responds with 200 and empty lisy", () => {
        const recipeId = 1;
        return supertest(app)
          .get(`/api/recipe_tags/tag/${recipeId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });
    context("given recipe_tags in db", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();
      const testTags = helpers.makeTagsArray();
      const testRecipeTags = helpers.makeRecipeTagsArray();

      beforeEach("insert users, recipes, tags", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db
                  .into("tags")
                  .insert(testTags)
                  .then(() => {
                    return db.into("recipe_tags").insert(testRecipeTags);
                  });
              });
          });
      });
      it('responds with 200 and specified tag', () => {
          const recipeId = 1
          const tag_name = 'Breakfast'
          const expectedTag = [{id: recipeId, tag_name: tag_name}]

          return supertest(app)
            .get(`/api/recipe_tags/tag/${recipeId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedTag)
      })
    });
  });
  describe('GET /api/recipe_tags/recipe/:tagId', () => {
    context("given no recipe_tags in db", () => {
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
        it("responds with 200 and empty lisy", () => {
          const tagId = 1;
          return supertest(app)
            .get(`/api/recipe_tags/recipe/${tagId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, []);
        });
      });
      context("given recipe_tags in db", () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testTags = helpers.makeTagsArray();
        const testRecipeTags = helpers.makeRecipeTagsArray();
  
        beforeEach("insert users, recipes, tags", () => {
          return db
            .into("recipe_box_users")
            .insert(testUsers)
            .then(() => {
              return db
                .into("recipes")
                .insert(testRecipes)
                .then(() => {
                  return db
                    .into("tags")
                    .insert(testTags)
                    .then(() => {
                      return db.into("recipe_tags").insert(testRecipeTags);
                    });
                });
            });
        });
        it('responds with 200 and specified tag', () => {
            const tagId = 2
            const expectedTag = testRecipeTags[tagId - 1]
  
            return supertest(app)
              .get(`/api/recipe_tags/recipe/${tagId}`)
              .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
              .expect(200)
              .then((res) => {
                console.log(res.body)
                expect(res.body).to.be.an('array')
                expect(res.body[0]).to.eql({
                    id: 3,
                    title: 'Pasta',
                    date_created: '2021-01-04T15:01:51.041Z',
                    user_id: 1,
                    tag_id: 2,
                    recipe_id: 2
                  })
              })
        })
      });
  })
});
