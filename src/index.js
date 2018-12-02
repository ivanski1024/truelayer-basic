'use strict';

const app = require('express')();
const config = require('config').get('AppConfig');
const bodyParser = require('body-parser');
const isUUID = require('validator/lib/isUUID');

const authHandlers  =  require('./routes/authentication');
const userHandlers = require('./routes/user');
const helpers = require('./helpers');

module.exports = function() {
    app.use(bodyParser.json());

    app.all('/user/*', (req, res, next) => {
        let userId = req.query.userId;
        if (!userId) {
            return res.status(400).send({ status: 'failed', error: 'userId query parameter required'});
        } else if (!isUUID(userId)) {
            return res.status(400).send({ status: 'failed', error: 'userId should be a valid UUID'});
        } else {
            next();
        }
    })

    app.get('/', (req, res) => {
        return authHandlers.handleGetRoot(req, res);
    })
    
    app.get('/callback', async (req, res) => {
        return res.send({ status: 'success', result: { userId: await authHandlers.handleCallback(req, res) } });
    })

    app.get('/user/transactions', async (req, res) => {
        return res.send({ status: 'success', result: { transactions: await userHandlers.fetchUserTransactions(req.query.userId)}});
    })

    app.get('/user/debug', async (req, res) => {
        return res.send({ status: 'success', result: { debugInformation: await helpers.fetchDebugInformation(req.query.userId)}});
    })

    app.use('/*', async (req, res, next) => {
        console.log(JSON.stringify(req, null, 4))
        next()
    })

    app.use((err, req, res, next) => {
        return res.status(500).send({ status: 'failed', error: 'Internal Server Error' })
    })
    
    app.listen(config.port, () => {
        console.log(`Server listening at port ${config.port} `);
    })
}