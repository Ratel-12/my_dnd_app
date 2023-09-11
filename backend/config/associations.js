const User = require('../models/user');
const Monster = require('../models/monster');
const Formula = require('../models/formula');

User.hasMany(Monster, { foreignKey: 'userId', onDelete: 'CASCADE' });
Monster.belongsTo(User, { foreignKey: 'userId' });

Monster.hasMany(Formula, { foreignKey: 'monsterId', onDelete: 'CASCADE' });
Formula.belongsTo(Monster, { foreignKey: 'monsterId' });
