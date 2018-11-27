'use strict';

require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:3306/${process.env.DB_TABLE}`
  );

const config = require('config').get('AppConfig');

global.Sequelize = Sequelize;
global.sequelize = sequelize;
global.baseUrl = (`${config.protocol}://${config.host}:${config.port}/`).toString();
global.redirectUrl = baseUrl + 'callback';

require('./src/index.js')
 


