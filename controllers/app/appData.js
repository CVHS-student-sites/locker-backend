import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";

//todo remove all logs
//todo fix async
export async function createLocker(lockerNumber, location) {
    try {
        let locker = await Locker.create({
            lockerNumber: lockerNumber,
            location: location,
        });
        return locker;
    } catch (err) {
        throw err;
    }
}

//todo fix async
export async function createUser(studentId, name, email) {
    try {
        let user = await User.create({
            studentId: studentId,
            name: name,
            email: email,
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

export async function createUserjoinLocker(studentId, name, email, lockerNumber) {
    try {
        const newUser = await User.create({
            studentId: studentId,
            name: name,
            email: email,
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

export async function getUser(studentId) {
    try {
        const user = await User.findByPk(studentId, {
            include: {
                model: Locker,
            },
        });

        if (user) {
            return user.toJSON();
        } else {
            console.log("User not found.");
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
            },
            include: {
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

export async function validateIDs(students) {

    for (const studentId of students) {
        const student = await UserData.findByPk(studentId);
        if (student === null) return "invalid";

        const locker = await User.findByPk(studentId, {
            include: {
                model: Locker,
            },
        });
        console.log(await locker)

    }
    return "ok";
}
