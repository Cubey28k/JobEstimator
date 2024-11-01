const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Material = require('./Material');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
});

User.hasMany(Material, {
    foreignKey: 'userId',
    sourceKey: 'id'
});

module.exports = User;
