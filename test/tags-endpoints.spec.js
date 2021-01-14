const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const helpers = require("./test-helpers");

describe('Tags endpoints', () => {
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

  describe('GET /api/tags', () => {
      context('given no tags in db', () => {
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
                .get('/api/tags')
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
        })
      })
      context('given tags in db', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testTags = helpers.makeTagsArray();
  
        beforeEach("insert users and recipes", () => {
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
        it('responds with 200 and list of tags', () => {
            return supertest(app)
                .get('/api/tags')
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(200, testTags)
        })
      })
      context('given xss attack', () => {
          const testUsers = helpers.makeUsersArray();
          const testRecipes = helpers.makeRecipesArray();
          const {
              maliciousTag,
              expectedTag 
          } = helpers.makeMaliciousTag();

          beforeEach('insert malicious tag', () => {
            return db
            .into("recipe_box_users")
            .insert(testUsers)
            .then(() => {
              return db
                .into("recipes")
                .insert(testRecipes)
                .then(() => {
                  return db.into("tags").insert([maliciousTag]);
                });
            });
          })
          it('removes xss attack', () => {
              return supertest(app)
                .get('/api/tags')
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect((res => {
                    expect(res.body[0].tag_name).to.eql(expectedTag.tag_name)
                }))
          })
      })
  })
  describe('GET /api/tags/:tag_id', () => {
      context('given no tags in db', () => {
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
        it('responds with 404', () => {
            const tagId = 123;
            return supertest(app)
                .get(`/api/tags/${tagId}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Tag does not exist'}
                })
        })
      })
      context('given tags in db', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testTags = helpers.makeTagsArray();
  
        beforeEach("insert users and recipes", () => {
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
        it('responds with 200 and specified tag', () => {
            const tagId = 1;
            const expectedTag = testTags[tagId - 1];
            return supertest(app)
                .get(`/api/tags/${tagId}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedTag)
        })
      })
      context('given xss attack', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const {
            maliciousTag,
            expectedTag 
        } = helpers.makeMaliciousTag();

        beforeEach('insert malicious tag', () => {
          return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db.into("tags").insert([maliciousTag]);
              });
          });
        })
        it('removes xss attack', () => {
            return supertest(app)
                .get(`/api/tags/${maliciousTag.id}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect((res) => {
                    expect(res.body.tag_name).to.eql(expectedTag.tag_name)
                })
        })
      })
  })
  describe.only('POST /api/tags', () => {
    const testUsers = helpers.makeUsersArray();
    const testRecipes = helpers.makeRecipesArray();
    const testTags = helpers.makeTagsArray();

    beforeEach("insert users and recipes", () => {
      return db
        .into("recipe_box_users")
        .insert(testUsers)
        .then(() => {
          return db
            .into("recipes")
            .insert(testRecipes)
            // .then(() => {
            //   return db.into("tags").insert(testTags);
            // });
        });
    });
    it('creates new tag, responding with 201 and new tag', () => {
        const newTag = {
            tag_name: 'test'
        }

        return supertest(app)
            .post('/api/tags')
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(newTag)
            .expect(201)
            .expect((res) => {
                expect(res.body.tag_name).to.eql(newTag.tag_name)
            })
            .then((res) => {
                supertest(app)
                    .get(`/api/tags/${res.body.id}`)
                    .expect(res.body)
            })
    })
    const requiredFields = ['tag_name']

    requiredFields.forEach((field) => {
        const newTag = {
            tag_name: 'test'
        }
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newTag[field]
    
            return supertest(app)
                .post(`/api/tags`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .send(newTag)
                .expect(400, {
                    error: `Missing ${field} in request body`
                })
        })
        it('removes an xss attack', () => {
            const {
                maliciousTag,
                expectedTag
            } = helpers.makeMaliciousTag();

            return supertest(app)
                .post('/api/tags')
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .send(maliciousTag)
                .expect(201)
                .expect((res) => {
                    expect(res.body.tag_name).to.eql(expectedTag.tag_name)
                })
        })
    })
  })
  describe('DELETE /api/tags/:tag_id', () => {
      context('given no tags in db', () => {
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
        it('responds with 404', () => {
            const tagId = 123
            return supertest(app)
                .delete(`/api/tags/${tagId}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {error: {message: 'Tag does not exist'}})
        })
      })
      context('given tags in db', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testTags = helpers.makeTagsArray();
  
        beforeEach("insert users and recipes", () => {
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
        it('responds with 204 and removes specified tags', () => {
            const idToDelete = 1;
            const expectedTag = testTags.filter((tag) => tag.id !== idToDelete)
            return supertest(app)
                .delete(`/api/tags/${idToDelete}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(204)
                .then((res) => {
                    supertest(app)
                        .get('/api/tags')
                        .expect(expectedTag)
                })
        }) 
      })
  })
  describe('PATCH /api/tags/:tag_id', () => {
      context('given tags in db', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testTags = helpers.makeTagsArray();
  
        beforeEach("insert users and recipes", () => {
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
        it('responds with 200 and updated tags', () => {
            const idToUpdate = 1;
            const updatedTag = {
                tag_name: 'test'
            }
            const expectedTag = {
                ...testTags[idToUpdate - 1],
                ...updatedTag
            }
            return supertest(app)
                .patch(`/api/tags/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updatedTag)
                .expect(200)
                .then(res => {
                    supertest(app)
                        .get(`/api/tags/${idToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedTag)
                })
        })
        it('responds with 400 when no fields are supplied', () => {
            const idToUpdate = 1;
            return supertest(app)
                .patch(`/api/tags/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({irrelevantField: 'foo'})
                .expect(400, {
                    error: {message :'Request body must contain tag_name'}
                })
        })
      })
  })
})