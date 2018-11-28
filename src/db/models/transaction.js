'use strict';

module.exports = (sequelize, DataTypes, options = null) => {
    let model = sequelize.define('transaction', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false,
        },
        account_id: {
            type: DataTypes.UUID,
            foreignKey: true,
            allowNull: false,
        }
    }, options);

    return model;
}