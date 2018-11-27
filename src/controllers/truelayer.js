const { AuthAPIClient, DataAPIClient } = require('truelayer-client');
const crypto = require('crypto');

const authClient = new AuthAPIClient({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET });

parseTransaction = function (transaction, additionalFields) {
    return {
        ...additionalFields,
        transaction_id: transaction.transaction_id,
        amount: transaction.amount,
        currency: transaction.currency,
        transaction_type: transaction.transaction_type,
        transaction_category: transaction.transaction_category,
        timestamp: transaction.timestamp,
        merchant_name: transaction.merchant_name,
        description: transaction.description,
        transaction_classification: transaction.transaction_classification ? transaction.transaction_classification.join(' ') : '',
    };
}

validateToken = async function (accessToken) {
    return await DataAPIClient.validateToken(accessToken)
}

refreshTokens = async function (accessToken, refreshToken) {
    return await authClient.refreshAccessToken(refreshToken);
}

exchangeCodeForTokens = async function (redirectUrl, code) {
    const result = await authClient.exchangeCodeForToken(redirectUrl, code);
    return { accessToken: result.access_token, refreshToken: result.refresh_token };
}

getAuthUrl = function (redirectUrl) {
    const nonce = crypto.randomBytes(12);
    return authClient.getAuthUrl(redirectUrl, config.trueLayer.scopes, nonce, false, false, config.trueLayer.enableMock);
}

fetchBankTransactions = async function (accessToken, userId) {
    let accounts = (await DataAPIClient.getAccounts(accessToken)).results;
    let allTransactions = await Promise.all(accounts.map(async account => {
        return ((await DataAPIClient.getTransactions(accessToken, account.account_id)).results).map(transaction => {
            return parseTransaction(transaction, { account_id: account.account_id, user_id: userId, account_type: 'bank_account' })
        }); 
    }));
    return allTransactions;
}

fetchCardTransactions = async function (accessToken, userId) {
    let cards = (await DataAPIClient.getCards(accessToken)).results;
    let allTransactions = await Promise.all(cards.map(async card => {
        return ((await DataAPIClient.getCardTransactions(accessToken, card.account_id)).results).map(transaction => {
            return parseTransaction(transaction, { account_id: card.account_id, user_id: userId, account_type: 'card' })
        });
    }));
    return allTransactions;
}

module.exports = {
    validateToken,
    refreshTokens,
    exchangeCodeForTokens,
    getAuthUrl,
    fetchBankTransactions,
    fetchCardTransactions
};