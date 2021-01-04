const express = require('express')
const path = require('path')
const xss = require('xss')
const IngredientsService = require('./ingredients-service')

const ingredientsRouter = express.Router()
const jsonParser = express.json()

const serializeIngredient = ingredient => ({
    id: ingredient.id,
    food_item: xss(ingredient.food_item),
    amount: xss(ingredient.amount),
    recipe_id: ingredient.recipe_id,
    unit: ingredient.unit
})

ingredientsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        IngredientsService.getAllIngredients(knexInstance)
        .then((ingredients) => {
            res.json(ingredients.map(serializeIngredient))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {food_item, amount, recipe_id, unit} = req.body
        const newIngredient = {food_item, amount, recipe_id, unit}

        for(const [key, value] of Object.entries(newIngredient)) {
            if(value ==  null) {
                return res.status(400).json({
                    error: {message: `Message ${key} from request body`}
                })
            }
        }

        IngredientsService.addIngredient(
            req.app.get('db'),
            newIngredient
        )
        .then(ingredient => [
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${ingredient.id}`))
                .json(serializeIngredient(ingredient))
        ])
        .catch(next)
    })

ingredientsRouter
    .route('/:ingredient_id')
    .all((req, res, next) => {
        IngredientsService.getById(
            req.app.get('db'),
            req.params.ingredient_id
        )
        .then(ingredient => {
            if(!ingredient) {
                return res.status(404).json({
                    error: {message: 'Ingredient does not exist'}
                })
            }
            res.ingredient = ingredient
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeIngredient(res.ingredient))
    })
    .delete((req, res, next) => {
        IngredientsService.deleteIngredient(
            req.app.get('db'),
            req.params.ingredient_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {food_item, amount, recipe_id, unit} = req.body
        const ingredientToUpdate = {food_item, amount, recipe_id, unit}

        const numOfValues = Object.values(ingredientToUpdate).filter(Boolean).length
            if(numOfValues === 0) {
                return res.json(404).json({
                    error: {message: 'Request body must contain either food_item, amount, recipe_id, unit'}
                })
            }
        IngredientsService.editIngredient(
            req.app.get('db'),
            req.params.ingredient_id,
            ingredientToUpdate
        )
        .then(numRowsAffected => {
            res.status(200).json(numRowsAffected)
        })
        .catch(next)
    })

 module.exports = ingredientsRouter   