'use strict';

module.exports = (sequelize, DataTypes, options = null) => {
    let model = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false,
        },
        access_token: {
            type: DataTypes.STRING(1280),
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, options);
    
    return model;
};