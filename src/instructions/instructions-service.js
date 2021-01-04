const knex = require('knex')

const InstructionsService = {
    getAllInstructions(knex, id) {
        return knex
            .select('*')
            .from('instructions')
    }
}

module.exports = InstructionsService