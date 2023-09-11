const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Formula extends Model {}

Formula.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    diceFormula: {
        type: DataTypes.STRING,
        allowNull: false
    },
    monsterId: {
        type: DataTypes.INTEGER,
        references: {
                model: 'Monster',
                key: 'id',
        },
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Formula'
});

module.exports = Formula;
