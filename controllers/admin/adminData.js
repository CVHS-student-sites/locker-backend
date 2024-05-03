//used for getting and interacting with locker data for admins
import {Op} from "sequelize";

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";

import {createUser} from "../app/appData.js";
import {readConfig} from "../../utils/admin/configManager.js";
import {throwApplicationError} from "../../middleware/errorHandler.js";



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
        let totalUsers = await UserData.count();
        let lockerNum = await Locker.count();
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
            "regUsersByGrade": gradeCounts,
            "regLockers": registeredLockerCount,
            "availableLockers": availableLockers,
            "totalUsers": totalUsers,
            "lastHour": lastHour,
            "lastDay": lastDay,
        };
    } catch (err) {
        throw err; // Throw the error to be handled by the caller
    }
}

export async function getUsersDB() {
    // Fetch projects for the specified page
    const data = await User.findAll();

    return data.map(item => [
        item.name,
        // item.email,
        item.studentId,
        item.grade,
        item.permissions,
        item.LockerLockerNumber,
        item.createdAt
    ]);
}

export async function getLockersDB() {

    // Fetch projects for the specified page
    const data = await Locker.findAll({
        include: [{
            model: User,
        }]
    });

    // console.log(data[0]);
    return data.map(item => [
        item.lockerNumber,
        item.location.Floor,
        item.location.Level,
        item.location.Building,
        item.status,
        item.Users,
    ]);
}


export async function getUserEditData(userID){
    return await User.findByPk(userID);
}

export async function getLockerEditData(lockerNum){
    return await Locker.findByPk(lockerNum);
}


export async function updateUserEditData(userID, data){
    const user = await User.findByPk(userID);

    await user.update({ 
        studentId: data.studentId,
        grade: data.grade,
        permissions: data.permissions,
        email: data.email,
        name: data.name
    });
}

export async function updateLockerEditData(lockerNum, data){
    const locker = await Locker.findByPk(lockerNum);

    await locker.update({ 
        status: data.status,
    });
}

export async function deleteUser(studentId){
    let user = await User.findByPk(studentId)
    if (user) {
        await user.destroy();
    } else {
        throwApplicationError('User not found')
    }
}

export async function removeLockerFromUser(studentId){
    let user = await User.findByPk(studentId)
    if (user) {
        await user.setLocker(null);
    } else {
        throwApplicationError('User not found')
    }
}

export async function manualCreateUser(data){
    await createUser(data.studentId, data.name, data.grade, data.permissions, data.email);
}