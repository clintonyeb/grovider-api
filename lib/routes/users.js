const usersHandler = require('../handlers').users
const schemas = require('../schemas/').users

const users = {
  name: 'user-routes',
  register: async function (server, options) {

    server.route({
      method: 'GET',
      path: '/',
      handler: usersHandler.getAllUsers,
      options: {
        validate: {
          query: schemas.paginationQueries
        }
      }
    })

    server.route({
      method: 'POST',
      path: '/',
      handler: usersHandler.createUser,
      options: {
        validate: {
          payload: schemas.createUser
        },
        auth: false
      }
    })

    server.route({
      method: ['PUT', 'PATCH'],
      path: '/{id}',
      handler: usersHandler.updateUser,
      options: {
        validate: {
          payload: schemas.updateUser,
          params: schemas.updateUserParam
        }
      }
    })

    server.route({
      method: 'DELETE',
      path: '/{id}',
      handler: usersHandler.deleteUser,
      options: {
        validate: {
          params: schemas.updateUserParam
        }
      }
    })

    server.route({
      method: ['POST'],
      path: '/login',
      handler: usersHandler.login,
      options: {
        validate: {
          payload: schemas.login
        },
        auth: {
          mode: 'optional',
        }
      }
    })

    server.route({
      method: 'POST',
      path: '/logout',
      handler: usersHandler.logout,
      options: {
        validate: {
          payload: schemas.logout
        },
        auth: false
      }
    })

    server.route({
      method: ['POST', 'GET'],
      path: '/twitter',
      handler: (request, reply) => {
        if (!request.auth.isAuthenticated) {
            return 'Authentication failed due to: ' + request.auth.error.message;
        }
        return reply.redirect('/home');
    },
      options: {
        auth: {
          mode: 'try',
          strategy: 'twitter'
        }
      }
    })

    server.route({
      method: ['POST', 'GET'],
      path: '/facebook',
      handler: (request, reply) => {
        if (!request.auth.isAuthenticated) {
            return 'Authentication failed due to: ' + request.auth.error.message;
        }
        return reply.redirect('/home');
    },
      options: {
        auth: {
          mode: 'try',
          strategy: 'facebook'
        }
      }
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