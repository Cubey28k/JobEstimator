const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

class Material extends Model {}

Material.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userId: { // This line adds a foreign key to associate with the User model
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // This should match the name of your Users table
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Material',
});

module.exports = Material;
