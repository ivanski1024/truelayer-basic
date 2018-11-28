'use strict';

const { AuthAPIClient, DataAPIClient } = require('truelayer-client');
const crypto = require('crypto');
const config = require('config').get('AppConfig');

const authClient = new AuthAPIClient({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET });

const validateToken = async function (accessToken) {
  return await DataAPIClient.validateToken(accessToken);
};

const refreshTokens = async function (refreshToken) {
  return await authClient.refreshAccessToken(refreshToken);
};

const exchangeCodeForTokens = async function (redirectUrl, code) {
  const result = await authClient.exchangeCodeForToken(redirectUrl, code);
  return { accessToken: result.access_token, refreshToken: result.refresh_token };
};

const getAuthUrl = function (redirectUrl) {
  const nonce = crypto.randomBytes(12);
  return authClient.getAuthUrl(redirectUrl, config.trueLayer.scopes, nonce, false, false, config.trueLayer.enableMock);
};

const fetchAccounts = async function (accessToken) {
  return (await DataAPIClient.getAccounts(accessToken)).results;
};

const fetchBankTransactions = async function (accessToken, accountId) {
  return (await DataAPIClient.getTransactions(accessToken, accountId)).results;
};

const fetchCards = async function (accessToken) {
  return (await DataAPIClient.getCards(accessToken)).results;
};

const fetchCardTransactions = async function (accessToken, cardId) {    
  return (await DataAPIClient.getCardTransactions(accessToken, cardId)).results;
    
};

module.exports = {
  validateToken,
  refreshTokens,
  exchangeCodeForTokens,
  getAuthUrl,
  fetchAccounts,
  fetchBankTransactions,
  fetchCards,
  fetchCardTransactions
};