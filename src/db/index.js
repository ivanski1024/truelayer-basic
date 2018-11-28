'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME , process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
});

module.exports = async function () {
    const modelOptions = {
        underscored: true 
    };

    const Transaction = require('./models/transaction')(sequelize, DataTypes, modelOptions);
    const Account = require('./models/account')(sequelize, DataTypes, modelOptions);
    const User = require('./models/user')(sequelize, DataTypes, modelOptions);

    User.hasMany(Account, {foreignKey: 'user_id', targetKey: 'id'});
    Account.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

    Account.hasMany(Transaction, {foreignKey: 'account_id', targetKey: 'id'});
    Transaction.belongsTo(Account, {foreignKey: 'account_id', targetKey: 'id'});

    sequelize.sync({
        force: true // TODO: remove thi
    });

    return {
        User,
        Account,
        Transaction
    }
}
