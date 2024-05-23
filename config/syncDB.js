import {sequelize} from './sequelize.js';


async function syncDatabase() {
    try {
        console.log("Starting DB Sync");
        await sequelize.sync();
        console.log('Database tables synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
