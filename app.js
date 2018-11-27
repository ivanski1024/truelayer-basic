'use strict';

// enviroment variables init
require('dotenv').config()

// set up database connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME , process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      idle: 10000
  }
});

// get config
const config = require('config').get('AppConfig');

// set globals
global.Sequelize = Sequelize;
global.sequelize = sequelize;
global.baseUrl = (`${config.protocol}://${config.host}:${config.port}/`).toString();
global.redirectUrl = baseUrl + 'callback';


// start db
require('./src/db/index.js');

// run server
require('./src/index.js')


 


