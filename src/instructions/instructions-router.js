const express = require('express')
const path = require('path')
const xss = require('xss')
const InstructionsService = require('./instructions-service')
const {requireAuth} = require('../middleware/jwt-auth')

const instructionsRouter = express.Router()
const jsonParser = express.json()

const serializeInstructions = instructions => ({
    id: instructions.id,
    recipe_id: instructions.recipe_id,
    list_order: instructions.list_order,
    step_info: xss(instructions.step_info)
})

instructionsRouter
    .route('/')
    // .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        InstructionsService.getAllInstructions(knexInstance)
        .then((instructions) => {
            res.json(instructions.map(serializeInstructions))
        })
        .catch(next)
    })

module.exports = instructionsRouter