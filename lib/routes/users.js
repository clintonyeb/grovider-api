const usersHandler = require('../handlers').users

const users = {
  name: 'user-routes',
  register: async function (server, options) {
    
    server.route({
      method: 'GET',
      path: '/',
      handler: usersHandler.getAllUsers
    })

    server.route({
      method: 'POST',
      path: '/',
      handler: usersHandler.createUser
    })

    server.route({
      method: ['PUT', 'PATCH'],
      path: '/',
      handler: usersHandler.updateUser
    })

    server.route({
      method: 'DELETE',
      path: '/',
      handler: usersHandler.deleteUser
    })
  }
}

module.exports = async (server) => {
  await server.register(
    users, {
      routes: {
        prefix: '/users'
      }
    })
}