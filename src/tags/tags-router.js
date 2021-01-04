const express = require("express");
const path = require("path");
const xss = require("xss");
const TagsService = require("./tags-service");
const { Router } = require("express");
const { serialize } = require("v8");

const tagsRouter = express.Router();
const jsonParser = express.json();

serializeTag = tag => ({
    id : tag.id,
    tag_name : tag.tag_name
})

tagsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        TagsService.getAllTags(knexInstance)
            .then((tags) => {
                res.json(tags.map(serializeTag))
                console.log(tags.map(serializeTag))
            })
            .catch(next)
    })


module.exports = tagsRouter;
