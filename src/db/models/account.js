'use strict';

module.exports = (sequelize, DataTypes, options = null, parentModel = null) => {
    let model = sequelize.define('account', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            type: DataTypes.UUID,
            allowNull: false,
            autoIncrement: false,
        },
        user_id: {
            type: DataTypes.UUID,
            foreignKey: true,
            allowNull: false,
        }
    }, options);

    return model;
}