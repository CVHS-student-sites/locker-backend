import {sequelize} from './sequelize.js';
import {Admin} from "../models/admin.js";
import {Config} from "../models/config.js";
import {Locker} from "../models/locker.js";
import {User} from "../models/user.js";
import {UserData} from "../models/userData.js";
import {verificationQueue} from "../models/verificationQueue.js";

async function syncDatabase() {
    try {
        console.log("Starting DB Sync");
        await Admin.sync();
        await Config.sync();
        await Locker.sync();
        await User.sync();
        await UserData.sync();
        await verificationQueue.sync();

        await sequelize.sync();
        console.log('Database tables synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
