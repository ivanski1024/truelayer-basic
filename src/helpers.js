const parseTransaction = (transaction, accountId) => {
  return {
    account_id: accountId,
    data: JSON.stringify(transaction)
  };

};

module.exports = {
  parseTransaction
};