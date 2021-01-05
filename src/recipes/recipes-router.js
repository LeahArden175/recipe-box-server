const express = require('express')
const path = require('path')
const xss = require('xss')
const RecipesService = require('./recipes-service')
const {requireAuth} = require('../middleware/jwt-auth')


const recipesRouter = express.Router()
const jsonParser = express.json()

serializeRecipe = recipe => ({
    id: recipe.id,
    title: xss(recipe.title),
    date_created: recipe.date_created,
    user_id: recipe.user_id
})

recipesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipesService.getAllRecipes(knexInstance, req.user.id)
            .then((recipes) => {
                res.json(recipes.map(serializeRecipe))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const {title} = req.body
        const newRecipe = {title}

        if(title == null) {
            return res.status(400).json({
                error: {message : 'Missing title from request body'}
            })
        }

        newRecipe.user_id = req.user.id

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

recipesRouter
    .route('/:recipe_id')
    .all(requireAuth)
    .all((req, res, next) => {
        RecipesService.getById(
            req.app.get('db'),
            req.params.recipe_id
        )
        .then(recipe => {
            if(!recipe) {
                return res.status(404).json({
                    error: {message: 'Recipe does not exist'}
                })
            }
            res.recipe = recipe
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeRecipe(res.recipe))
    })
    .delete((req, res, next) => {
        RecipesService.deleteRecipe(
            req.app.get('db'),
            req.params.recipe_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {title} = req.body
        const recipeToUpdate = {title}

        const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {message : 'Request body must contain title'}
            })
        }

        RecipesService.editRecipe(
            req.app.get('db'),
            req.params.recipe_id,
            recipeToUpdate
        )
        .then(numRowsAffected => {
            res.status(200).json(numRowsAffected)
        })
        .catch(next)
    })

module.exports = recipesRouter