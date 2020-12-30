const express = require('express')
const path = require('path')
const RecipesService = require('./recipes-service')


const recipesRouter = express.Router()
const jsonParser = express.json()

recipesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipesService.getAllRecipes(knexInstance)
            .then((recipes) => {
                res.json(recipes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {title} = req.body
        const newRecipe = {title}

        if(title == null) {
            return res.status(400).json({
                error: {message : 'Missing title from request body'}
            })
        }

        newRecipe.user_id = req.user.user_id

        RecipesService.addRecipe(
            req.app.get('db'),
            newRecipe
        )
        .then(recipe => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
                .json(recipe)
        })
        .catch(next)
    })

module.exports = recipesRouter