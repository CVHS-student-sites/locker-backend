//used for getting and interacting with locker data for admins
import {Op} from "sequelize";

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";
import {verificationQueue} from "../../models/verificationQueue.js";

import {createDataUser, createUser} from "../app/appData.js";
import {readConfig} from "../../utils/admin/config/configManager.js";
import {throwApplicationError} from "../../middleware/errorHandler.js";


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
    let lastHour = await User.count({
        where: {
            createdAt: {
                [Op.gt]: oneHourAgo
            }
        }
    });

    const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    let lastDay = await User.count({
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

export async function manualVerifyUser(studentId) {
    let student = await UserData.findByPk(studentId);
    await createUser(student.studentId, student.name, student.grade, student.permissions, student.email);
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

export async function queryAvailableLockersCount() {
    let jsonData = await queryAreaRestriction();

    const areas = {};
    for (const buildingKey in jsonData) {
        const buildingNumber = parseInt(buildingKey.split('_')[1]);
        const floors = [];
        for (const floorKey in jsonData[buildingKey]) {
            const floorNumber = parseInt(floorKey.split('_')[1]);
            floors.push(floorNumber);
        }
        areas[buildingNumber] = floors;
    }

    console.log(areas);

    const buildingCounts = {};

    // Iterate over each building
    for (const building in areas) {
        const floors = areas[building];
        const floorCounts = {};

        // Iterate over each floor in the current building
        for (const floor of floors) {
            // get levels
            let lockerArr = await Locker.findAll({
                where: {
                    "location.Building": {[Op.eq]: building}, // Extract building number
                    "location.Floor": {[Op.eq]: floor},
                    [Op.or]: [
                        {"status": {[Op.is]: null}},  // Include records where status is null
                        {"status": {[Op.not]: 1}}      // Include records where status is not equal to 1
                    ]
                }, include: [{
                    model: User,
                }]
            });
            // get levels in area
            let levels = [];
            for (let locker of lockerArr) {
                if (!levels.includes(locker.location.Level)) {
                    levels.push(locker.location.Level);
                }
            }

            let levelCounts = [];
            for (let level of levels) {
                let postLockerArr = await Locker.findAll({
                    where: {
                        "location.Building": {[Op.eq]: building},
                        "location.Floor": {[Op.eq]: floor},
                        "location.Level": {[Op.eq]: level},
                        [Op.or]: [
                            {"status": {[Op.is]: null}},  // Include records where status is null
                            {"status": {[Op.not]: 1}}      // Include records where status is not equal to 1
                        ]
                    }, include: [{
                        model: User,
                    }]
                });

                let emptyLockerCount = 0;
                for (let locker of postLockerArr) {
                    if (!locker.Users || locker.Users.length === 0) {
                        emptyLockerCount++;
                    }
                }

                levelCounts.push({[level]: emptyLockerCount});
            }

            floorCounts[floor] = {
                "Positions": levelCounts,
            };
        }

        buildingCounts[building] = floorCounts;
    }
    return buildingCounts;
}