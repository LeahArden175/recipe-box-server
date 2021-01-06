const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const helpers = require("./test-helpers");
const IngredientsService = require("../src/ingredients/ingredients-service");

describe("Instructions endpoints", () => {
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

  describe("GET /api/instructions", () => {
    context("Given no instructions in db", () => {
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
          .get("/api/instructions")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });
    context("given instructions in db", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();
      const testinstructions = helpers.makeInstructionsArray();

      beforeEach("insert users and recipes", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db.into("instructions").insert(testinstructions);
              });
          });
      });
      it("responds with 200 and list of instructions", () => {
        return supertest(app)
          .get("/api/instructions")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, testinstructions);
      });
    });
    context("given xss attack", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();
      const {
        maliciousInstruction,
        expectedInstruction,
      } = helpers.makeMaliciousInstruction();

      beforeEach("insert malicious instruction", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db.into("instructions").insert([maliciousInstruction]);
              });
          });
      });
      it("removes xss attack", () => {
        return supertest(app)
          .get("/api/instructions")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body[0].step_info).to.eql(expectedInstruction.step_info);
          });
      });
    });
  });
  describe("GET /api/instructions/:instuction_id", () => {
    context("given no instructions in db", () => {
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
      it("responds with 404", () => {
        const instructionId = 123;
        return supertest(app)
          .get(`/api/instructions/${instructionId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: "Instruction does not exist" },
          });
      });
    });
    context("given instruction in db", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();
      const testInstructions = helpers.makeInstructionsArray();

      beforeEach("insert users and recipes", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db.into("instructions").insert(testInstructions);
              });
          });
      });
      it("responds with 200 and specified instruction", () => {
        const instructionId = 1;
        const expectedInstruction = testInstructions[instructionId - 1];

        return supertest(app)
          .get(`/api/instructions/${instructionId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedInstruction);
      });
    });
    context("given xss attack", () => {
      const testUsers = helpers.makeUsersArray();
      const testRecipes = helpers.makeRecipesArray();
      const {
        maliciousInstruction,
        expectedInstruction,
      } = helpers.makeMaliciousInstruction();

      beforeEach("insert malicious instruction", () => {
        return db
          .into("recipe_box_users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("recipes")
              .insert(testRecipes)
              .then(() => {
                return db.into("instructions").insert([maliciousInstruction]);
              });
          });
      });
      it("removes xss attack", () => {
        return supertest(app)
          .get(`/api/instructions/${maliciousInstruction.id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.step_info).to.eql(expectedInstruction.step_info);
          });
      });
    });
  });
  describe("POST /api/instructions", () => {
    const testUsers = helpers.makeUsersArray();
    const testRecipes = helpers.makeRecipesArray();
    const testinstructions = helpers.makeInstructionsArray();

    beforeEach("insert users and recipes", () => {
      return db
        .into("recipe_box_users")
        .insert(testUsers)
        .then(() => {
          return db
            .into("recipes")
            .insert(testRecipes)
            .then(() => {
              return db.into("instructions").insert(testinstructions);
            });
        });
    });
    it("creates new instructions. responding with 201 and new instruction", () => {
      const newInstruction = {
        recipe_id: 1,
        list_order: 1,
        step_info: "test",
      };

      return supertest(app)
        .post("/api/instructions")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newInstruction)
        .expect(201)
        .expect((res) => {
          expect(res.body.recipe_id).to.eql(newInstruction.recipe_id);
          expect(res.body.list_order).to.eql(newInstruction.list_order);
          expect(res.body.step_info).to.eql(newInstruction.step_info);
        })
        .then((res) => {
          supertest(app)
            .get(`/api/instructions/${res.body.id}`)
            .expect(res.body);
        });
    });

    const requiredFields = ["recipe_id", "step_info", "list_order"];

    requiredFields.forEach((field) => {
      const newInstruction = {
        recipe_id: 1,
        list_order: 1,
        step_info: "test",
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newInstruction[field];

        return supertest(app)
          .post("/api/instructions")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newInstruction)
          .expect(400, {
            error: `Missing ${field} in request body`,
          });
      });
      it('removes an xss attack', () => {
          const {
              maliciousInstruction,
              expectedInstruction
          } = helpers.makeMaliciousInstruction();

          return supertest(app)
            .post('/api/instructions')
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(maliciousInstruction)
            .expect(201)
            .expect((res) => {
                expect(res.body.step_info).to.eql(expectedInstruction.step_info)
            })
      })
    });
  });
  describe('DELETE /api/instructions/:instruction_id', () => {
      context('given no instructions in db', () => {
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
            const instuctionId = 123
            return supertest(app)
                .delete(`/api/instructions/${instuctionId}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {error: {message: 'Instruction does not exist'}})
        })
      })
      context('given instructions in db', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testInstructions = helpers.makeInstructionsArray();
  
        beforeEach("insert users and recipes", () => {
          return db
            .into("recipe_box_users")
            .insert(testUsers)
            .then(() => {
              return db
                .into("recipes")
                .insert(testRecipes)
                .then(() => {
                  return db.into("instructions").insert(testInstructions);
                });
            });
        });
        it('responds with 204 and removes specified instructions', () => {
            const idToDelete = 1;
            const expectedInstructions = testInstructions.filter((instruction) => instruction.id !== idToDelete);
            return supertest(app)
                .delete(`/api/instructions/${idToDelete}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(204)
                .then((res) => {
                    supertest(app)
                        .get('/api/instructions')
                        .expect(expectedInstructions)
                })
        })
      })
  })
  describe.only('PATCH /api/instructions/:instruction_id', () => {
      context('given instructions in db', () => {
        const testUsers = helpers.makeUsersArray();
        const testRecipes = helpers.makeRecipesArray();
        const testInstructions = helpers.makeInstructionsArray();
  
        beforeEach("insert users and recipes", () => {
          return db
            .into("recipe_box_users")
            .insert(testUsers)
            .then(() => {
              return db
                .into("recipes")
                .insert(testRecipes)
                .then(() => {
                  return db.into("instructions").insert(testInstructions);
                });
            });
        });
        it('responds with 200 and update instructions', () => {
            const idToUpdate = 1;
            const updatedInstructions = {
                recipe_id: 2,
                list_order: 1,
                step_info:
                  'updated'
              }
              const expectedInstructions = {
                  ...testInstructions[idToUpdate - 1],
                  ...updatedInstructions
              }
              return supertest(app)
                .patch(`/api/instructions/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updatedInstructions)
                .expect(200)
                .then(res => {
                    supertest(app)
                        .get(`/api/instructions/${idToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedInstructions)
                })
        })
        it('responds with 400 when no fields are supplied', () => {
            const idToUpdate = 1;
            return supertest(app)
                .patch(`/api/instructions/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({irrelevantField: 'foo'})
                .expect(400, {
                    error: {message: 'Request body must contain either list_order or step_info'}
                })
        })
        it('responds with 200 when only editing some fields', () => {
            const idToUpdate = 1;
            const updatedInstructions = {
                recipe_id: 2,
                list_order: 1,
                step_info:
                  'updated'
              }
              const expectedInstructions = {
                  ...testInstructions[idToUpdate - 1],
                  ...updatedInstructions
              }
              return supertest(app)
                .patch(`/api/instructions/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({
                    ...updatedInstructions,
                    fieldToIgnore: 'Should not be in GET response'
                })
                .expect(200)
                .then(res => {
                    supertest(app)
                        .get(`/api/instructions/${idToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedInstructions)
                })
        })
      })
  })
});
