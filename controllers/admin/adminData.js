//used for getting and interacting with locker data for admins
import {Op} from "sequelize";

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {LockerData} from "../../models/lockerData.js";
import {UserData} from "../../models/userData.js";

import {readConfig} from "../../utils/admin/configManager.js";


//todo implement try catch for all routes
export async function queryGradeRestriction() {
    try {
        return await readConfig('enabled_grades');

    } catch (err) {
        throw err;
    }
}

export async function queryAreaRestriction() {
    try {
        return await readConfig('restricted_areas');
    } catch (err) {
        throw err;
    }
}

export async function queryStats() {
    let targetGrades = [9, 10, 11, 12];
    //todo there needs to be a list of buildings that can be added to the model. this can steal from enabled areas

    try {
        let userCount = await User.count();
        let lockerCount = await Locker.count();
        let totalUsers = await UserData.count();
        let totalLockers = await LockerData.count();
        let gradeCounts = {};

        for (const targetGrade of targetGrades) {
            gradeCounts[targetGrade] = await User.count({
                where: {
                    grade: targetGrade,
                },
            });
        }

        const oneHourAgo = new Date(new Date() - 60 * 60 * 1000);
        let lastHour = await Locker.count({
            where: {
                createdAt: {
                    [Op.gt]: oneHourAgo
                }
            }
        });

        const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
        let lastDay = await Locker.count({
            where: {
                createdAt: {
                    [Op.gt]: oneDayAgo
                }
            }
        });

        return {
            "regUsers": userCount,
            "regUsersByGrade": gradeCounts,
            "regLockers": lockerCount,
            "totalUsers": totalUsers,
            "totalLockers": totalLockers,
            "lastHour": lastHour,
            "lastDay": lastDay,
        };
    } catch (err) {
        throw err; // Throw the error to be handled by the caller
    }
}

export async function getUsersDB(page, pageSize){
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // Fetch projects for the specified page
    const data = await User.findAll({
      offset,
      limit,
    });
    
    return data.map(user => user.dataValues);;
}
