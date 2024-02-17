//used for getting and interacting with locker data for admins
import {Op} from "sequelize";

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {LockerData} from "../../models/lockerData.js";
import {UserData} from "../../models/userData.js";


//todo will have functions for getting data for dashboard, locker lists, user lists
import {readConfig} from "../../utils/admin/configManager.js";


export async function queryGradeRestriction() {
    try {
        console.log(await readConfig('enabled_grades'))
        return await readConfig('enabled_grades');

    } catch (err) {
        return false;
    }
}

export async function queryAreaRestriction() {
    try {
        return await readConfig('restricted_areas');
    } catch (err) {
        return false;
    }
}

export async function queryStats() {
    let userCount;
    let lockerCount;
    let totalUsers;
    let totalLockers;

    let lastHour;
    let lastDay;

    await User.count()
        .then(count => {
            userCount = count;
        })
        .catch(err => {
            return false;
        });

    await Locker.count()
        .then(count => {
            lockerCount = count;
            console.log(lockerCount)
        })
        .catch(err => {
            return false;
        });

    await LockerData.count()
        .then(count => {
            totalLockers = count;
            console.log(lockerCount)
        })
        .catch(err => {
            return false;
        });

    await UserData.count()
        .then(count => {
            totalUsers = count;
            console.log(lockerCount)
        })
        .catch(err => {
            return false;
        });


    // Calculate the timestamp for one hour ago
    const oneHourAgo = new Date(new Date() - 60 * 60 * 1000);
    // Count the number of rows created less than one hour ago
    Locker.count({
        where: {
            createdAt: {
                [Op.lt]: oneHourAgo // createdAt < one hour ago
            }
        }
    })
        .then(count => {
            lastHour = count;
        })
        .catch(err => {
            console.error('Error occurred while counting rows:', err);
        });



    const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    // Count the number of rows created less than one hour ago
    Locker.count({
        where: {
            createdAt: {
                [Op.lt]: oneDayAgo // createdAt < one hour ago
            }
        }
    })
        .then(count => {
            lastDay = count;
        })
        .catch(err => {
            console.error('Error occurred while counting rows:', err);
        });

    return {
        "regUsers": userCount,
        "regLockers": lockerCount,
        "totalUsers": totalUsers,
        "totalLockers": totalLockers,
        "lastHour": lastHour,
        "lastDay": lastDay,
    };
}