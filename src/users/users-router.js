const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("./users-service");
const { json } = require("express");
const { hasUserWithUsername } = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  full_name: xss(user.full_name),
  username: xss(user.username),
  date_created: user.date_created,
  date_modified: user.date_modified,
});

usersRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    UsersService.getAllUsers(knexInstance)
      .then((users) => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { full_name, username, password } = req.body;
    const newUser = { full_name, username, password };

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing ${key} in request body`,
        });

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUsername(req.app.get('db'), username)
        .then((hasUserWithUsername) => {
          if(hasUserWithUsername)
            return res.status(400).json({error: 'Username already taken'})
        })

    return UsersService.hashPassword(password)
      .then((hashedPassword) => {
        const newUser = {
          username,
          password: hashedPassword,
          full_name,
          date_created: "now()"
        };
        return UsersService.insertUser(req.app.get("db"), newUser).then(
          (user) => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(serializeUser(user));
          }
        );
      })
      .catch(next);
  });

usersRouter
  .route("/:user_id")
  .all((req, res, next) => {
    UsersService.getById(req.app.get("db"), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: "User does not exist" },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get("db"), req.params.user_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { full_name, username, password } = req.body;
    const userToUpdate = { full_name, username, password };

    const numOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain either full_name, username, or password",
        },
      });
    UsersService.patchUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
