const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database', 'database.sqlite3'),
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

module.exports = sequelize;
