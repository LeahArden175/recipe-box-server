
const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('recipe_box_users')
    },
}

module.exports = UsersService