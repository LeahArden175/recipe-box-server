
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
}

module.exports = UsersService