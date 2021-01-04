const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/


const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('recipe_box_users')
    },
    insertUser( knex, newUser) {
        return knex
            .insert(newUser)
            .into('recipe_box_users')
            .returning('*')
            .then(([user]) => user)
    },
    getById(knex, id) {
        return knex
            .from('recipe_box_users')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteUser(knex, id) {
        return knex('recipe_box_users')
            .where({ id })
            .delete()
    },
    patchUser(knex, id, newUserFields) {
        return knex('recipe_box_users')
            .where({ id })
            .update(newUserFields)
    },
    validatePassword(password) {
        if(password.length < 8) {
            return 'Password must by longer than 8 characters'
        }
        if(password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty space'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'password must contain one uppercase, lowercase, number, and special character'
        }
        return null
    },
    hasUserWithUsername(db, username) {
        return db('recipe_box_users')
            .where({ username })
            .first()
            .then(user => !!user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
}

module.exports = UsersService