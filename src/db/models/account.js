'use strict';

module.exports = (sequelize, DataTypes, options = null) => {
  let model = sequelize.define('account', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    user_id: {
      type: DataTypes.UUID,
      foreignKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(['bank', 'card']),
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, options);

  return model;
};