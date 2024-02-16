import {sequelize} from './sequelize.js'

import {LockerData} from "../models/lockerData.js";
import {UserData} from "../models/userData.js";
import {User} from "../models/user.js";
import {Locker} from "../models/locker.js";
import {Admin} from "../models/admin.js";
import {Config} from "../models/config.js";


//todo make sure force is removed

async function syncDatabase() {
    try {
        console.log("run sync")

        // Sync all defined models with the database
        // await sequelize.sync(); // Use force: true to recreate tables on every run
        await sequelize.sync({force: true})

        //todo find why this is needed
        await LockerData.sync({force: true});
        await UserData.sync({force: true});
        await User.sync({force: true});
        await Locker.sync({force: true});
        await Admin.sync({force: true});
        await Config.sync({force: true});

        // If you don't want to recreate tables every time, use this instead:
        // await sequelize.sync();

        console.log('Database tables synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
