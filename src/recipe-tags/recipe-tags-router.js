const express = require('express')
const path = require('path')
const xss = require('xss')
const RecipeTagsService = require('./recipe-tags-service')

const recipeTagsRouter = express.Router()
const jsonParser = express.json()

recipeTagsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipeTagsService.getAllTags(knexInstance)
            .then((tags) => {
                res.json(tags)
            })
            .catch(next)
    })
recipeTagsRouter
    .route('/tag/:recipeId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipeTagsService.getTagsForRecipe(knexInstance, req.params.recipeId)
            .then((tags) => {
                res.json(tags)
            })
            .catch(next)
    })
recipeTagsRouter
    .route('/recipe/:tagId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipeTagsService.getRecipesForTag(knexInstance, req.params.tagId)
            .then((recipes) => {
                res.json(recipes)
            })
            .catch(next)
    })


module.exports = recipeTagsRouter


