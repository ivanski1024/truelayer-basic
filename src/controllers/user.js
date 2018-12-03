'use string';

const User = global.models.User;
const Account = global.models.Account;
const Transaction = global.models.Transaction;

const storeUser = async function(tokens)  {
  return (await User.create({ access_token: tokens.accessToken, refresh_token: tokens.refreshToken })).id;
}

const storeAccount = async function (userId, account, type) {
  return await Account.create({ user_id: userId, data: JSON.stringify(account), type: type });
};

const storeTransactions = async function (transactions) {
  return await Transaction.bulkCreate(transactions);
};

const getUser = async function (userId) {
  return await User.findByPk(userId);
};

const updateUser = async function (userId, newValues) {
  let user = await User.findByPk(userId);
  return await user.update( newValues, Object.keys(newValues));
}

const getTransactions = async function (userId) {
  let result = {};

  let accounts = await Account.findAll({ where: { user_id: userId }});

  await Promise.all(accounts.map(async (account) => {
    let accountData = JSON.parse(account.data);

    let transactions = await Transaction.findAll({ where: { account_id: account.id }});

    let parsedTransactions = await transactions.map((transaction) => {
      return JSON.parse(transaction.data);
    });

    accountData.transactions = parsedTransactions;
    result[accountData.account_id] = accountData;
  }));

  return result;
};

module.exports = {
  storeUser,
  storeAccount,
  storeTransactions,
  getUser,
  getTransactions,
  updateUser
};