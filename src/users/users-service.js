
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
    }
}

module.exports = UsersService