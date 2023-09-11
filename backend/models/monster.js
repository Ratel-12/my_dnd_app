const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Monster extends Model {}

Monster.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    str: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dex: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    con: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    int: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wis: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cha: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pb: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
        },
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Monster'
});

module.exports = Monster;
