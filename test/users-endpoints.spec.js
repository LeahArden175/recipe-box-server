const knex = require("knex");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Users Endpoints", function () {
  let db;

  const { testUsers } = helpers.makeRecipesFixtures();
  const testUser = testUsers[0];

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

  describe("POST /api/users", () => {
    context("User Validation", () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["username", "password", "full_name"];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          username: "testusername",
          password: "testpassword",
          full_name: "test full_name",
        };

        it(`responds with 400 and error when ${field} is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing ${field} in request body`,
            });
        });
      });
      it(`responds with 400 'Password must be longer than 8 char' when no empty password`, () => {
        const userShortPassword = {
          username: "testusername",
          password: "1234567",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userShortPassword)
          .expect(400, {
            error: "Password must be longer than 8 characters",
          });
      });
      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          username: "testusername",
          password: "*".repeat(73),
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });
      it("responds with 400 when password starts with spaces", () => {
        const userPasswordSpaceStart = {
          username: "testusername",
          password: " testpass",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordSpaceStart)
          .expect(400, {
            error: `Password must not start or end with empty space`,
          });
      });
      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          username: "test user_name",
          password: "1Aa!2Bb@ ",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty space`,
          });
      });
      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          username: "test user_name",
          password: "11AAaabb",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordNotComplex)
          .expect(400, {
            error: `password must contain one uppercase, lowercase, number, and special character`,
          });
      });
    });
    context("Happy path", () => {
      it("responds with 201, serialized user, storing bcrypt password", () => {
        const newUser = {
          username: "testusername",
          password: "testPassword1!",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .expect((res) => {
            // console.log(res)
            expect(res.body).to.have.property("id");
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.full_name).to.eql(newUser.full_name);
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
            const expectedDate = new Date().toLocaleString("en", {
              timeZone: "UTC",
            });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
          .expect((res) => {
            db.from("recipe_box_users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.username).to.eql(newUser.username);
                expect(row.full_name).to.eql(newUser.full_name);
                const expectedDate = new Date().toLocaleString("en", {
                  timeZone: "UTC",
                });
                const actualDate = new Date(row.date_created).toLocaleString();
                expect(actualDate).to.eql(expectedDate);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              });
          });
      });
    });
  });
});