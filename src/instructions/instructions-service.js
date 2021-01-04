const knex = require('knex')

const InstructionsService = {
    getAllInstructions(knex, id) {
        return knex
            .select('*')
            .from('instructions')
    },
    addInstructions(knex, newInstruction) {
        return knex
            .insert(newInstruction)
            .into('instructions')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('instructions')
            .returning('*')
            .where({ id })
            .first()
    }
}

module.exports = InstructionsService