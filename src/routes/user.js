const userController = require('./../controllers/user');

const fetchUserTransactions = async function(userId) {
  return userController.getTransactions(userId);
};

module.exports = {
  fetchUserTransactions
};