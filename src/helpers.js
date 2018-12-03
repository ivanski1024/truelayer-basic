'use strict';
const UserController = require('./controllers/user');
const TrueLayerController = require('./controllers/truelayer');

const parseTransaction = async (transaction, accountId) => {
  return {
    account_id: accountId,
    data: JSON.stringify(transaction)
  };
};

const fetchTransactions = async (fetchParentFn, fetchChildFn, userId, accessToken, parentType) => {
  // fetch the parents
  let parentItems = await fetchParentFn(accessToken);

  parentItems.forEach(async (parent) => {
    // store parent
    let storedParent = await UserController.storeAccount(userId, parent, parentType);

    // fetch child transactions
    let fetchedTransactions = await fetchChildFn(accessToken, parent.account_id);

    // parse transactions
    let parsedTransactions = await Promise.all(fetchedTransactions.map((transaction) => { return parseTransaction(transaction, storedParent.id); }));

    //store transactions
    UserController.storeTransactions(parsedTransactions);
  });
}

const getDebugInformationForCall = async ( method, params ) => {
  let result = {
    timing: null,
    error: null,
    status: null,
    callResult: null
  };

  let start = Date.now();
  try {
    let callResult = await method(params.accessToken, params.accountId);
    result.timing = Date.now() - start;
    result.status = 'succeded';
    result.callResult = callResult;
  } catch (err) {
    result.timing = Date.now() - start;
    result.status = 'failed';
    result.error = err;
  }

  return result;
}

const fetchDebugInformation = async function (userId) {
  let user = await UserController.getUser(userId);
  let accessToken = null;

  let isTokenValid = await TrueLayerController.validateToken(user.access_token);
  if (!isTokenValid) {
    let newTokens = await TrueLayerController.refreshTokens(user.refresh_token);
    accessToken = newTokens.access_token;
    await UserController.updateUser(userId, { ...newTokens });
  } else {
    accessToken = user.access_token;
  }

  let result = {};
  result['getAccounts'] = await getDebugInformationForCall(TrueLayerController.fetchAccounts, {accessToken: accessToken})
  if ( result.getAccounts.status == 'succeded' ) {
    let accounts = result.getAccounts.callResult;
    result['getTransactions'] = {};

    for (let index = 0; index < accounts.length; index++) {
      const account = accounts[index];
      let debugInfo = await getDebugInformationForCall(TrueLayerController.fetchBankTransactions, { accessToken, accountId: account.account_id })
      result.getTransactions[account.account_id] = debugInfo;
    }
  }
  
  result['getCards'] = await getDebugInformationForCall(TrueLayerController.fetchCards, {accessToken: accessToken})
  if ( result.getCards.status == 'succeded' ) {
    let cards = result.getCards.callResult;
    result['getCardTransactions'] = {};

    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      let debugInfo = await getDebugInformationForCall(TrueLayerController.fetchCardTransactions, { accessToken, accountId: card.account_id })
      result.getCardTransactions[card.account_id] = debugInfo;
    }
  }

  return result
}



module.exports = {
  parseTransaction,
  fetchTransactions,
  fetchDebugInformation
};