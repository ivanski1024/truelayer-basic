'use strict';

(async () => {
  // enviroment variables init
  require('dotenv').config();

  // get config
  const config = require('config').get('AppConfig');

  global.baseUrl = (`${config.protocol}://${config.host}:${config.port}/`);
  global.redirectUrl = baseUrl + 'callback';

  // start db and load models
  global.models = await require('./src/db/index')();

  // run server
  require('./src/index.js')();
})();