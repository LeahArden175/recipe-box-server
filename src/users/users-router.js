const path = require("path");
const express = require("express");
const UsersService = require("./users-service");
const { json } = require("express");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        UsersService.getAllUsers(knexInstance)
          .then((users) => {
            res.json(users);
          })
          .catch(next);
      })
      .post(jsonParser, (req, res, next) => {
          const{full_name, username, password} = req.body;
          const newUser = {full_name, username, password};

          for(const [key, value] of Object.entries(newUser))
            if(value == null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                });

            return UsersService.insertUser(req.app.get('db'), newUser)
                .then(user => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json((user) => {
                            res.json(user)
                        })
                })
                .catch(next)
      })

    module.exports = usersRouter