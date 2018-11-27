'use strict';

module.exports = function(sequalize, DataTypes) {
    return {
        user_id: {
            type: DataTypes.STRING,
            validate: {
                isUUID: 4
            }
        },
        access_token: {
            type: DataTypes.STRING,
            columnType: "varchar(1280)",
            required: true
        },
        refresh_token: {
            type: DataTypes.STRING,
            required: true
        }
    }
}