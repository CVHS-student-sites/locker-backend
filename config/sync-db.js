import {sequelize} from './sequelize.js'
import {LockerData} from "../models/lockerData.js";
import {UserData} from "../models/userData.js";

console.log(process.env.DEPLOY_TYPE); // This will output "development"

async function syncDatabase() {
    try {
        // Sync all defined models with the database
        // await sequelize.sync(); // Use force: true to recreate tables on every run
        await sequelize.sync({force: true})
        console.log("run sync")

        await LockerData.sync({force: true});
        await UserData.sync({force: true});

        // await Locker.sync({force: true});
        // await User.sync({force: true});


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
