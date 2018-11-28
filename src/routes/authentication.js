'use strict';

const TrueLayerController = require('./../controllers/truelayer');
const UserController = require('./../controllers/user');
const { parseTransaction } = require('./../helpers');

const handleGetRoot = async (req, res) => {
  let authUrl = TrueLayerController.getAuthUrl(redirectUrl);
  return res.redirect(authUrl);
}

const handleCallback = async (req, res) => {
  try {
    let tokens = await TrueLayerController.exchangeCodeForTokens(redirectUrl, req.query.code);
    let userId = await UserController.storeUser(tokens);

    let accessToken = tokens.accessToken;

    // fetch accounts 
    let accounts = await TrueLayerController.fetchAccounts(accessToken);

    accounts.forEach(async (account) => {
      //store account
      let storedAccount = await UserController.storeAccount(userId, account, 'bank');

      // fetch transaction
      let fetchedTransactions = await TrueLayerController.fetchBankTransactions(accessToken, account.account_id);

      // parse transactions 
      let parsedTransactions = fetchedTransactions.map((transaction) => { return parseTransaction(transaction, storedAccount.id); });

      // store transactions
      UserController.storeTransactions(parsedTransactions, storedAccount.id);
    });

    let cards = await TrueLayerController.fetchCards(accessToken);

    cards.forEach(async (card) => {
      // store card   
      let storedCard = await UserController.storeAccount(userId, card, 'card');

      // fetch transaction
      let fetchedTransactions = await TrueLayerController.fetchCardTransactions(accessToken, card.account_id);

      // parse Transactions
      let parsedTransaction = fetchedTransactions.map((transaction) => { return parseTransaction(transaction, storedCard.id); });

      //store transactions
      UserController.storeTransactions(parsedTransaction, storedCard.id);
    });
        
    return res.status(200).send({status: 'success', userId});
  } catch (err) {
    return res.status(500).send(JSON.stringify(err, null, 2));
  }
}

module.exports = {
  handleGetRoot,
  handleCallback
};