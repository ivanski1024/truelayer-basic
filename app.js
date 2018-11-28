'use strict';

// enviroment variables init
require('dotenv').config()

// get config
const config = require('config').get('AppConfig');

global.baseUrl = (`${config.protocol}://${config.host}:${config.port}/`).toString();
global.redirectUrl = baseUrl + 'callback';

// start db
global.models = require('./src/db/index')();

// run serverda
require('./src/index.js')();
