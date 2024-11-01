const sequelize = require('./config/database');
const User = require('./models/User');
const Material = require('./models/Material');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Use force: true only in development
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
};

syncDatabase();