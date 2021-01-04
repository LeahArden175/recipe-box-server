const knex = require('knex')

TagsService = {
    getAllTags(knex) {
        return knex
            .select('*')
            .from('tags')
    },
    addTag(knex, newTag) {
        return knex
            .insert(newTag)
            .into('tags')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('tags')
            .select('*')
            .where({ id })
            .first()
    },
    deleteTag(knex, id) {
        return knex('tags')
            .where({ id })
            .delete()
    },
    editTag(knex, id, newTagField) {
        return knex('tags')
            .where({ id })
            .update(newTagField)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = TagsService