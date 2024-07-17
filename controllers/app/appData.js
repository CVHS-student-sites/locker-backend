import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";
import {verificationQueue} from "../../models/verificationQueue.js";
import {sendVerificationEmail} from "../../utils/app/email/sendEmail.js";
import {queryAreaRestriction} from "../admin/adminData.js";
import {throwApplicationError} from "../../middleware/errorHandler.js";

import {validateToken} from "../../utils/app/turnstyle/validateToken.js";

import {Op} from "sequelize";
import {v4 as uuidv4} from 'uuid';


export async function createUser(studentId, name, grade, permissions, email) {
    try {
        return await User.create({
            studentId: studentId, name: name, grade: grade, permissions: permissions, email: email,
        });
    } catch (err) {
        throw err;
    }
}

export async function createDataUser(studentId, name, grade, permissions, email) {
    try {
        return await UserData.create({
            studentId: studentId, name: name, grade: grade, permissions: permissions, email: email,
        });
    } catch (err) {
        throw err;
    }
}

//todo standardize return types for all functions
export async function getUser(studentId) {
    try {
        const user = await User.findByPk(studentId, {
            include: {
                model: Locker,
            },
        });

        if (user && user.Locker) {
            return user.toJSON();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getLocker(lockerNumber) {
    try {
        const locker = await Locker.findOne({
            where: {
                lockerNumber: lockerNumber,
            }, include: {
                model: User,
            },
        });

        if (locker) {
            return locker.toJSON();
        } else {
            console.log("Locker not found."); //todo throw application error here
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

//todo !!! use as example for all routes/controllers !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export async function validateID(studentId) {
    const student = await UserData.findByPk(studentId);
    if (student === null) throwApplicationError('Invalid Student ID');

    const locker = await User.findByPk(studentId, {
        include: {
            model: Locker,
        },
    });

    if (locker === null) return {"grade": student.grade, "permissions": student.permissions};

    if (locker.Locker !== null) throwApplicationError('Locker Exists');

    //catch all case
    return {"grade": student.grade, "permissions": student.permissions};
}

export async function queryAvailableLockers() {
    let jsonData = await queryAreaRestriction();

    //new logic, todo buildings with no floors enabled remain in json and showed in frontend
    const areas = {};
    for (const buildingKey in jsonData) {
        const buildingNumber = parseInt(buildingKey.split('_')[1]);
        const floors = [];
        for (const floorKey in jsonData[buildingKey]) {
            if (jsonData[buildingKey][floorKey] === false) {
                const floorNumber = parseInt(floorKey.split('_')[1]);
                floors.push(floorNumber);
            }
        }
        areas[buildingNumber] = floors;
    }


    const buildingCounts = {};

    // Iterate over each building
    for (const building in areas) {
        const floors = areas[building];
        const floorCounts = {};

        // Iterate over each floor in the current building
        for (const floor of floors) {
            // Store the count for the current floor
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

            let emptyLockerCount = 0;
            let levels = [];

            //todo fix count not correct not sure if count is even needed, just make sure return array is not null
            for (let locker of lockerArr) {
                if (!locker.Users || locker.Users.length === 0) {
                    emptyLockerCount++;
                }

                if (!levels.includes(locker.location.Level)) {
                    levels.push(locker.location.Level);
                }
            }

            if (emptyLockerCount === 0) continue;

            floorCounts[floor] = {
                "Levels": levels,
            };
        }

        // Store the counts for the current building
        buildingCounts[building] = floorCounts;
    }

    // let availableAreas = {};
    // for (const key in buildingCounts) {
    //     if (buildingCounts.hasOwnProperty(key)) {
    //         const floors = Object.keys(buildingCounts[key]);
    //         // Convert the keys (floors) to numbers and sort them
    //         availableAreas[parseInt(key)] = floors.map(Number).sort((a, b) => a - b);
    //     }
    // }

    return buildingCounts;

}

//todo add application errors
export async function sendVerification(studentID, email) {
    let id = uuidv4();
    //todo check if student is already verified

    let currentTime = new Date();
    // Add 30 minutes to the current time for expiration
    let futureTime = new Date(currentTime.getTime() + 30 * 60000);

    let queueUser = await verificationQueue.findOne({
        where: {
            studentId: studentID
        }
    });

    if (queueUser !== null) return false;

    //todo return a message if user has existing request in queue
    if (await checkVerification(studentID)) return false;


    try {
        await verificationQueue.create({
            studentId: studentID, email: email, uuid: id, expiration: futureTime
        });
        await sendVerificationEmail(email, `https://locker.cvapps.net/verify?token=${id}&studentId=${studentID}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
    return true;
}

//this controller gets called from the route, will call send virefy and verify token
export async function sendVerifyStudents(data, token){


    let response = await validateToken(token);
    if (response.success){

        if(data.length > 2) throwApplicationError('cannot verify more than two students');

        for(const student of data){
            const user = await UserData.findByPk(student);
            await sendVerification(student, user.email); // todo removed return case here, make sure that is not needed
        } 
    } else {
        throwApplicationError('Captcha status invalid');
    }
}


export async function verifyStudent(token, id) {

    if(await checkVerification(id)){
        return;
    }

    if(token == null){
        throwApplicationError('Link Incomplete');
    }

    let queueUser = await verificationQueue.findByPk(token);

    if (queueUser !== null) {
        let student = await UserData.findByPk(queueUser.studentId);

        await createUser(student.studentId, student.name, student.grade, student.permissions, student.email);

        await verificationQueue.destroy({
            where: {
                uuid: token
            }
        });

    } else {
        throwApplicationError('Verification Link Expired');
    }
}


export async function checkVerification(studentId) {
    try {
        const student = await User.findByPk(studentId);
        return student !== null;
    } catch (error) {
        throw error;
    }
}
