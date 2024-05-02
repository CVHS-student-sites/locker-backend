import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";
import {verificationQueue} from "../../models/verificationQueue.js";
import {sendEmail} from "../../utils/app/email/sendEmail.js";
import {queryAreaRestriction} from "../../controllers/admin/adminData.js";
import {throwApplicationError} from "../../middleware/errorHandler.js";

import {Op} from "sequelize";
import {v4 as uuidv4} from 'uuid';


//todo remove all logs
//todo fix async
export async function createLocker(lockerNumber, location) {
    try {
        let locker = await Locker.create({
            lockerNumber: lockerNumber, location: location,
        });
        return locker;
    } catch (err) {
        throw err;
    }
}

//todo fix async
export async function createUser(studentId, name, grade, email) {
    try {
        let user = await User.create({
            studentId: studentId, name: name, grade: grade, email: email,
        });
        return user;
    } catch (err) {
        throw err;
    }
}

//todo fix spagetti code, dont need 3 catches
export function joinUsertoLocker(studentId, lockerNumber) {
    return User.findByPk(studentId)
        .then((user) => {
            if (!user) {
                console.log("User not found.");
                return false;
            }

            // Find the locker by ID
            return Locker.findByPk(lockerNumber)
                .then((locker) => {
                    if (!locker) {
                        console.log("Locker not found.");
                        return false;
                    }

                    // Associate the user with the locker
                    return user.setLocker(locker)
                        .then(() => {
                            console.log("User has been associated with the locker.");
                            return true;
                        })
                        .catch((error) => {
                            console.error("Error associating user with locker:", error);
                            return false;
                        });
                })
                .catch((error) => {
                    console.error("Error finding locker:", error);
                    return false;
                });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
            return false;
        });
}

//todo add grade in function if required later
export async function createUserjoinLocker(studentId, name, email, lockerNumber) {
    try {
        const newUser = await User.create({
            studentId: studentId, name: name, email: email,
        });

        const existingLocker = await Locker.findByPk(lockerNumber);

        if (!existingLocker) {
            throw new Error("Locker not found.");
        }

        await newUser.setLocker(existingLocker);
        console.log("User has been created and added to the existing locker.");

        return newUser;
    } catch (error) {
        console.error("Error:", error);
        throw error;
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
            console.log("Locker not found.");
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// todo this is missing a logic case
//todo !!! use as example for all routes/controllers !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export async function validateID(studentId) {
    const student = await UserData.findByPk(studentId);
    if (student === null) throwApplicationError('Invalid student ID');

    const locker = await User.findByPk(studentId, {
        include: {
            model: Locker,
        },
    });

    if (locker === null) return {"grade": student.grade};

    if (locker.Locker !== null) throwApplicationError('Locker Exists');

    //catch all case
    return {"grade": student.grade};
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
                }, include: [{
                    model: User,
                }]
            });

            let emptyLockerCount = 0;
            let levels = [];

            //todo fix count not correct
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

//todo standardize return types
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

    console.log(queueUser);
    if (queueUser !== null) return false;


    //todo i think this is fxed, kinda confusing
    console.log(await checkVerification(studentID));
    if (await checkVerification(studentID)) return false;


    try {
        await verificationQueue.create({
            studentId: studentID, email: email, uuid: id, expiration: futureTime
        });
        await sendEmail(email, `https://locker.cvapps.net/verify?token=${id}`)
    } catch (err) {
        console.log(err);
        throw err;
    }
    return true;
}

//upgraded
//todo needs a service that empties expired rows in queue every minute
export async function verifyStudent(token) {
    //todo might be good to run verify student before

    let queueUser = await verificationQueue.findByPk(token);

    if (queueUser !== null) {
        let student = await UserData.findByPk(queueUser.studentId);

        await createUser(student.studentId, student.name, student.grade, student.email);

        await verificationQueue.destroy({
            where: {
                uuid: token
            }
        })

    } else {
        throwApplicationError('Token not Found')
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
