'use strict';

const TrueLayerController = require('./../controllers/truelayer');
const UserController = require('./../controllers/user');
const { fetchTransactions } = require('./../helpers');

const handleGetRoot = async (req, res) => {
  let authUrl = TrueLayerController.getAuthUrl(redirectUrl);
  return res.redirect(authUrl);
}

const handleCallback = async (req, res) => {
  let tokens = await TrueLayerController.exchangeCodeForTokens(redirectUrl, req.query.code);
  let userId = await UserController.storeUser(tokens);

  let accessToken = tokens.accessToken;

  // fetch and store bank transactions
  fetchTransactions(TrueLayerController.fetchAccounts, TrueLayerController.fetchBankTransactions, userId, accessToken, 'bank');

  // fetch and store card transactions
  fetchTransactions(TrueLayerController.fetchCards, TrueLayerController.fetchCardTransactions, userId, accessToken, 'card');
      
  return userId;
}

module.exports = {
  handleGetRoot,
  handleCallback
};