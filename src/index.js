'use strict';

const app = require('express')();
const config = require('config').get('AppConfig');
const bodyParser = require('body-parser');

const authHandlers  =  require('./routes/authentication');
const userHandlers = require('./routes/user');

module.exports = function() {
    
    app.use(bodyParser.json());

    app.get('/', async (req, res, next) => {
        try {
            await authHandlers.handleGetRoot(req, res);
        } catch (err) {
            next({ status: 'failed', error: 'root request error'});
        }
    })
    
    app.get('/callback', async (req, res, next) => {
        try {
            let userId =  await authHandlers.handleCallback(req, res);
            res.send({ status: 'success', userId: userId });
        } catch (err) {
            next({ status: 'failed', error: 'callback error' });
        }
    })

    app.get('/transactions', async (req, res, next) => {
        let userId = req.query.userId;
        if(!userId) { 
            next({ status: 'failed', error: 'userId query parameter missing'});
        }

        let transactions = await userHandlers.fetchUserTransactions(userId);

        res.send(transactions);
    })
    
    app.listen(config.port, () => {
        console.log(`Server listening at port ${config.port} `);
    })
}