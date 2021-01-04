const express = require('express')
const path = require('path')
const xss = require('xss')
const InstructionsService = require('./instructions-service')
const {requireAuth} = require('../middleware/jwt-auth')
const { json } = require('express')

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
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        InstructionsService.getAllInstructions(knexInstance)
        .then((instructions) => {
            res.json(instructions.map(serializeInstructions))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {recipe_id, list_order, step_info} = req.body
        const newInstruction = {recipe_id, list_order, step_info}

        for(const [key, value] of Object.entries(newInstruction))
            if(value == null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                })
        
        InstructionsService.addInstructions(
            req.app.get('db'),
            newInstruction
        )
        .then(instruction => {
            res 
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${instruction.id}`))
                .json(serializeInstructions(instruction))
        })
        .catch(next)
    })

instructionsRouter
    .route('/:instruction_id')
    .all((req, res, next) => {
        InstructionsService.getById(
            req.app.get('db'),
            req.params.instruction_id
        )
        .then(instruction => {
            if(!instruction) {
                return res.status(404).json({
                    error: { message: 'Instruction does not exist'}
                })
            }
            res.instruction = instruction
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeInstructions(res.instruction))
    })

module.exports = instructionsRouter