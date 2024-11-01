require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || null, {
        host: process.env.DB_HOST || 'localhost', // Default host for local testing
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: false, // Disable logging in test mode
    });
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false, // Set to true to see SQL queries
    });
}

module.exports = sequelize;
