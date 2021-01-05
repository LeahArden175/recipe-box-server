const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");

describe('Auth Endpoints', function () {
    let db,

    const { testUsers } =  helpers.makePlantsFixtures();
})