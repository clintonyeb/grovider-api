'use strict';

const Hapi = require('hapi');

require('dotenv').config()

const plugins = require('./plugins')

const init = async () => {

  const server = Hapi.server({
    port: +process.env.PORT || 8000,
    host: process.env.HOST || "0.0.0.0"
  });

  /* Default Route */
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  });

  /* Displaying Server Logs */
  server.events.on('log', (event, tags) => {
    if (tags.error) {
      console.log(`Server error::: ${event.error ? event.error.message : tags.error.output.message}`, new Date().toDateString());
    } else {
      console.log('Server event:::', event.data, new Date(event.timestamp).toTimeString());
    }
  });

  /* Displaying Request Logs */
  server.events.on('request', (event, tags) => {
    console.log(tags.error)

    // if (tags.error) {
    //   console.log('Request error:::', event.error ? event.error.message : tags.error, new Date().toDateString());
    // } else {
    //   console.log('Request event::: ', event.data, new Date(event.timestamp).toTimeString());
    // }
  });

  /* Register Plugins */
  await server.register(plugins)
  server.log('info', 'Plugins successfully registered.')

  /* Register Routes */
  await server.register(require('./routes'))

  if (!module.parent) {
    /* Start Server */
    await server.start();
    server.log('Server running on %s', server.info.uri);
  }

  return server;
};

/* Handle Uncaught Errors */
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


module.exports =  init();