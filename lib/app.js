'use strict';

const Hapi = require('hapi');
const utils = require('./utils')

require('dotenv').config()

const plugins = require('./plugins')

const init = async () => {

  const server = Hapi.server({
    port: +process.env.PORT || 8000,
    host: process.env.HOST || "0.0.0.0"
  });

  const corsOptions = {
    origins: ['*'],
    allowCredentials: 'true',
    exposeHeaders: ['content-type', 'content-length'],
    maxAge: 600,
    methods: ['POST, GET, OPTIONS'],
    headers: ['Accept', 'Content-Type', 'Authorization']
  }

  const options = {
    ops: {
      interval: 1000
    },
    reporters: {
      myConsoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*'
          }]
        },
        {
          module: 'good-console'
        },
        'stdout'
      ]
    }
  };

  await server.register({
    plugin: require('good'),
    options,
  });

  // register validation plugin
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET,
    validate: utils.validateJWT,
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.auth.default('jwt');

  /* Default Route */
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    },
    options: {
      auth: false
    }
  });

  /* Register Plugins */
  await server.register(plugins)
  server.log('info', 'Plugins successfully registered.')

  /* Register Routes */
  await server.register(require('./routes'))

  /* Register CORS */
  await server.register({
    plugin: require('hapi-cors'),
    options: corsOptions
  })

  /* Start Server */
  await server.start();
  server.log('Server running on %s', server.info.uri);

  return server;
};

/* Handle Uncaught Errors */
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


module.exports = init();