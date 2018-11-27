'use strict';

const fs = require('fs');
const path = require('path');

const modelsFolderPath = path.join(__dirname, 'models');

const models = {};

fs.readdirSync(modelsFolderPath).forEach((file) => {
    const model = sequelize.import(path.join(modelsFolderPath, file));
    models[model.name] = model;
})