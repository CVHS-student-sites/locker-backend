import { sequelize } from '../models/admin.js'

async function syncDatabase() {
  try {
    // Sync all defined models with the database
    await sequelize.sync({ force: true }); // Use force: true to recreate tables on every run

    // If you don't want to recreate tables every time, use this instead:
    // await sequelize.sync();

    console.log('Database tables synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Call the syncDatabase function to create tables and sync models
syncDatabase();
