'use strict';

const app = require('express')();
const config = require('config').get('AppConfig');
const bodyParser = require('body-parser');

const authHandlers  =  require('./routes/authentication');
const userHandlers = require('./routes/user');
const helpers = require('./helpers');

module.exports = function() {
    
    app.use(bodyParser.json());

    app.get('/', async (req, res, next) => {
        try {
            await authHandlers.handleGetRoot(req, res);
        } catch (err) {
            res.status(501).send({ error: 'Internal Server Error' });
        }
    })
    
    app.get('/callback', async (req, res, next) => {
        try {
            let userId =  await authHandlers.handleCallback(req, res);
            res.send({ status: 'success', userId: userId });
        } catch (err) {
            res.status(501).send({ error: 'Internal Server Error' });
        }
    })

    app.get('/user/transactions', async (req, res, next) => {
        let userId = req.query.userId;
        if(!userId) { 
            next({ status: 'failed', error: 'userId query parameter missing'});
        }

        try {
            let transactions = await userHandlers.fetchUserTransactions(userId);
            res.send(transactions);
        } catch (err) {
            res.status(501).send({ error: 'Internal Server Error' });
            
        }
    })

    app.get('/user/debug', async (req, res, next) => {
        let userId = req.query.userId;
        if(!userId) { 
            next({ status: 'failed', error: 'userId query parameter missing'});
        }

        try {
            let debugInformation = await helpers.fetchDebugInformation(userId);
            res.send(debugInformation);
        } catch (err) {
            res.status(501).send({ error: 'Internal Server Error' });
        }
    })
    
    app.listen(config.port, () => {
        console.log(`Server listening at port ${config.port} `);
    })
}