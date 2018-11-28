'use strict';

const app = require('express')();
const config = require('config').get('AppConfig');

const authentication  =  require('./routes/authentication');

module.exports = function() {
    app.get('/', async (req, res) => {
        return await authentication.handleGetRoot(req, res);
    })
    
    app.get('/callback', async (req, res) => {
        return await authentication.handleCallback(req, res);
    })
    
    app.listen(config.port, () => {
        console.log(`Server listening at ${global.baseUrl} `);
    })
}