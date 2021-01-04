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

 module.exports = ingredientsRouter   