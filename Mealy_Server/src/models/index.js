const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: (str) => console.log(str),
    timezone: 'Asia/Seoul',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

const models = {};

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

// 스키마 동기화
sequelize.sync({ force: false }).then(() => {
  console.log('Schema is synchronized');
}).catch((err) => {
  console.error('An error has occurred: ', err);
});

module.exports = models;
