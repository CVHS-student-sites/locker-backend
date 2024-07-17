//used for getting and interacting with locker data for admins
import {Op} from "sequelize";

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";
import {verificationQueue} from "../../models/verificationQueue.js";

import {createDataUser, createUser} from "../app/appData.js";
import {readConfig} from "../../utils/admin/config/configManager.js";
import {throwApplicationError} from "../../middleware/errorHandler.js";
import {generateLockerCSV, generateUserCSV} from "../../utils/admin/csvgen/generateCSV.js";


//todo fix try catch here
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

    let userCount = await User.count();
    let totalUsers = await UserData.count();
    let lockerNum = await Locker.count();
    let verificationQueues = await verificationQueue.count();
    let gradeCounts = {};

    for (const targetGrade of targetGrades) {
        gradeCounts[targetGrade] = await User.count({
            where: {
                grade: targetGrade,
            },
        });
    }

    let lockers = await Locker.findAll({
        include: [{
            model: User,
        }]
    });

    let registeredLockerCount = 0;
    for (let locker of lockers) {
        if (locker.Users && locker.Users.length > 0) {
            registeredLockerCount++;
        }
    }
    let availableLockers = lockerNum - registeredLockerCount;

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
        "verificationQueues": verificationQueues,
        "regUsersByGrade": gradeCounts,
        "regLockers": registeredLockerCount,
        "availableLockers": availableLockers,
        "totalUsers": totalUsers,
        "lastHour": lastHour,
        "lastDay": lastDay,
    };
}

export async function getUsersDB() {
    const data = await User.findAll();

    return data.map(item => [
        item.name,
        item.studentId,
        item.grade,
        item.permissions,
        item.LockerLockerNumber,
        item.createdAt
    ]);
}

export async function getLockersDB() {
    const data = await Locker.findAll({
        include: [{
            model: User,
        }]
    });

    return data.map(item => [
        item.lockerNumber,
        item.location.Floor,
        item.location.Level,
        item.location.Building,
        item.status,
        item.Users,
    ]);
}

export async function getUserEditData(userID) {
    return await User.findByPk(userID, {
        include: Locker
    });
}

export async function getLockerEditData(lockerNum) {
    return await Locker.findByPk(lockerNum);
}

export async function checkLocker(lockerNum) {
    const locker = await Locker.findByPk(lockerNum);
    return {"exists": locker !== null};
}

export async function updateUserEditData(userID, data) {
    const user = await User.findByPk(userID);

    await user.update({
        studentId: data.studentId,
        grade: data.grade,
        permissions: data.permissions,
        email: data.email,
        name: data.name
    });

    if (data.LockerLockerNumber !== null && data.LockerLockerNumber !== undefined) {
        const locker = await Locker.findOne({where: {lockerNumber: data.LockerLockerNumber}});
        if (locker) {
            await user.setLocker(locker); // Set the association to the new locker
        } else {
            throw new Error(`Locker with number ${data.LockerLockerNumber} not found`);
        }
    } else {
        // Remove association with locker
        await user.setLocker(null);
    }

}

export async function updateLockerEditData(lockerNum, data) {
    const locker = await Locker.findByPk(lockerNum);

    await locker.update({
        status: data.status,
    });
}

export async function deleteUser(studentId) {
    let user = await User.findByPk(studentId);
    if (user) {
        await user.destroy();
    } else {
        throwApplicationError('User not found');
    }
}

export async function removeLockerFromUser(studentId) {
    let user = await User.findByPk(studentId);
    if (user) {
        await user.setLocker(null);
    } else {
        throwApplicationError('User not found');
    }
}

export async function manualCreateUser(data) {
    try {
        await createUser(data.studentId, data.name, data.grade, data.permissions, data.email);
        await createDataUser(data.studentId, data.name, data.grade, data.permissions, data.email);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throwApplicationError('Student Email or ID exists');
        } else {
            throw error;
        }
    }
}

//todo this doesnt work, gives an error
export async function clearLockerDB(data) {
    if (data.areYouSure) {
        await Locker.destroy({
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
}

export async function clearUserDB(data) {
    if (data.areYouSure) {
        await User.destroy({
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
}

export async function sendUsersCSV() {
    await generateUserCSV();
}

export async function sendLockerCSV() {
    await generateLockerCSV();

}