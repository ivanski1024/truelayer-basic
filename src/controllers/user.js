'use string';

const uuidv4 = require('uuid/v4');
const User = global.models.User;

createUser = async function (tokens) {    
    let user = await User.create({access_token: tokens.accessToken, refresh_token: tokens.refreshToken});
    return user.id;
}

storeTransactions = async function (transactions) {
    // return await transactions.forEach(async transactionsPerAccount => {
    //     return await Transaction.createEach(transactionsPerAccount);
    // });
    
    throw new Error('NOT IMPLEMENTED!');
}

getTransactions = async function (userId) {
    // let result = await Transaction.find({ where: { user_id: userId }, groupBy: ['account_id'] });
    // let result = await Transaction.query('SELECT * ')
    // let transactions = await Transaction.

    console.log('NOT IMPLEMENTED!');
    throw new Error('NOT IMPLEMENTED!');
    //Transaction.query('SELECT * ')
}

module.exports = {
    createUser,
    storeTransactions,
    getTransactions
}