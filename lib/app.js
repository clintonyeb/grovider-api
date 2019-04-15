'use strict';

const Hapi = require('hapi');
const utils = require('./utils')
var Fs = require('fs');

require('dotenv').config()

const plugins = require('./plugins')

const init = async () => {

  const server = Hapi.server({
    port: 4433 || 8000,
    host: process.env.HOST || "0.0.0.0",
    debug: {
      request: ['error']
    },
    tls: {
      key: Fs.readFileSync('/home/clint/server.key'),
      cert: Fs.readFileSync('/home/clint/server.cert')
    }
  });

  const corsOptions = {
    origins: ['*'],
    allowCredentials: 'true',
    exposeHeaders: ['content-type', 'content-length'],
    maxAge: 600,
    methods: ['POST, GET, OPTIONS'],
    headers: ['Accept', 'Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
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

  // Register bell with the server
  await server.register([require('hapi-auth-cookie'), require('bell')]);

  //Setup the session strategy
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'social-login',
      password: process.env.COOKIE_PASSWORD,
      isSecure: process.env.NODE_ENV === 'production'
    },
    redirectTo: '/users/twitter',
  });

  /* Social Authentication Plugins */
  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: process.env.COOKIE_PASSWORD,
    clientId: process.env.TWITTER_API_KEY,
    clientSecret: process.env.TWITTER_SECRET_KEY,
    isSecure: process.env.NODE_ENV === 'production',
    location: () => 'https://127.0.0.1',
  });

  server.auth.strategy('facebook', 'bell', {
    provider: 'facebook',
    password: process.env.COOKIE_PASSWORD,
    clientId: process.env.FACEBOOK_API_KEY,
    clientSecret: process.env.FACEBOOK_SECRET_KEY,
    isSecure: process.env.NODE_ENV === 'production',
    location: () => 'https://127.0.0.1',
  });

  /* Register Routes */
  await server.register(require('./routes'))

  /* Register CORS */
  await server.register({
    plugin: require('hapi-cors'),
    options: corsOptions
  })

  server.log('info', 'Plugins successfully registered.')

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