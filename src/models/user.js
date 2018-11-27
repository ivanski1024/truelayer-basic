'use strict';

module.exports = {
    user_id: {
        type: Sequalize.STRING,
        validate: {
            isUUID: 4
        }
    }
}