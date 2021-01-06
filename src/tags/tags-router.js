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
    tag_name : xss(tag.tag_name)
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
    .post(jsonParser, (req, res, next) => {
        const {tag_name} = req.body;
        const newTag = {tag_name}

        if(!newTag.tag_name) {
            res.status(400).json({
                error: 'Missing tag_name in request body'
            })
        }

        TagsService.addTag(
            req.app.get('db'),
            newTag
        )
        .then(tag => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${tag.id}`))
                .json(serializeTag(tag))
        })
        .catch(next)
    })
tagsRouter
    .route('/:tag_id')
    .all((req, res, next)=> {
        TagsService.getById(
            req.app.get('db'),
            req.params.tag_id
        )
        .then(tag => {
            if(!tag) {
                return res.status(404).json({
                    error: {message: 'Tag does not exist'}
                })
            }
            res.tag = tag
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeTag(res.tag))
    })
    .delete((req, res, next) => {
        TagsService.deleteTag(
            req.app.get('db'),
            req.params.tag_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {tag_name} = req.body
        const tagToUpdate = {tag_name}

        const numOfValues = Object.values(tagToUpdate).filter(Boolean).length
        if(numOfValues === 0) {
            return res.status(400).json({
                error: {message: 'Request body must contain tag_name'}
            })
        }

        TagsService.editTag(
            req.app.get('db'),
            req.params.tag_id,
            tagToUpdate
        )
        .then(numRowsAffected => {
            res.status(200).json(numRowsAffected)
        })
        .catch(next)
    })

module.exports = tagsRouter;
