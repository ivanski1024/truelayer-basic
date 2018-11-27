const app = require('express')();
const authentication  =  require('./routes/authentication')

global.config = require('config').get('AppConfig');
global.baseUrl = (`${config.protocol}://${config.host}:${config.port}/`).toString();
global.redirectUrl = baseUrl + 'callback';


app.get('/', async (req, res) => {
    return await authentication.handleGetRoot(req, res);
})

app.get('/callback', async (req, res) => {
    return await authentication.handleCallback(req, res);
})

app.listen(config.port, () => {
    console.log(`Server listening at ${global.baseUrl} `);
})