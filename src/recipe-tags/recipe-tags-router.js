const express = require('express')
const path = require('path')
const xss = require('xss')
const RecipeTagsService = require('./recipe-tags-service')
const {requireAuth} = require('../middleware/jwt-auth')

const recipeTagsRouter = express.Router()
const jsonParser = express.json()

recipeTagsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipeTagsService.getAllTags(knexInstance)
            .then((tags) => {
                res.json(tags)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {recipe_id, tag_id} = req.body
        const newTag = {recipe_id, tag_id}

        for(const [key, value] of Object.entries(newTag)) {
            if(value == null || value === '') {
                return res.status(400).json({
                    error: {message: `Missing ${key} in request body`}
                })
            }
        }

        RecipeTagsService.addTag(
            req.app.get('db'),
            newTag
        )
        .then(tag => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${tag.id}`))
                .json(tag)
        })
        .catch(next)

    })
recipeTagsRouter
    .route('/tag/:recipeId')
    .all(requireAuth)
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
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        RecipeTagsService.getRecipesForTag(knexInstance, req.params.tagId, req.user.id)
            .then((recipes) => {
                res.json(recipes)
            })
            .catch(next)
    })


module.exports = recipeTagsRouter


