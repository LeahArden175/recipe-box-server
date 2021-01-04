const knex = require('knex')

TagsService = {
    getAllTags(knex) {
        return knex
            .select('*')
            .from('tags')
    }
}

module.exports = TagsService