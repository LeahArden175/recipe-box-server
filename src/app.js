require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router')
const recipesRouter = require('./recipes/recipes-router')
const authRouter = require('./auth/auth-router')
const instructionsRouter = require('./instructions/instructions-router')
const ingredientsRouter = require('./ingredients/ingredients-router')
const tagsRouter = require('./tags/tags-router')
const recipeTagsRouter = require('./recipe-tags/recipe-tags-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/instructions', instructionsRouter)
app.use('/api/ingredients', ingredientsRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/recipe_tags', recipeTagsRouter)

app.get('/', (req, res) =>{
    res.send('Hello, boilerplate!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = { error : { message : 'server error'} }
    } else {
        console.error(error)
        response= {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app