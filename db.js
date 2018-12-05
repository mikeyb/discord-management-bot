const secrets = require('./.secrets.json');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(secrets.mysql.connection);

Donations = sequelize.import('./models/donations');
Funds = sequelize.import('./models/funds');

module.exports = {
    Donations, Funds
};