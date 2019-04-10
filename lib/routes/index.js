module.exports = {
  name: 'routes',
  register: async function (server, options) {
    require('./users')(server)
  }
}