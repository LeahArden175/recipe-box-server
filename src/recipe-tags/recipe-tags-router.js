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
    .route('/:recipeId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipeTagsService.getTagsForRecipe(knexInstance, req.params.recipeId)
            .then((tags) => {
                console.log(req.params.recipeId)
                res.json(tags)
            })
            .catch(next)
    })


module.exports = recipeTagsRouter


