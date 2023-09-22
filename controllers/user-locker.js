import {User} from "../models/user.js";
import {Locker} from "../models/locker.js";


export async function createLocker(lockerNumber, location) {
    try {
        let locker = await Locker.create({
            lockerNumber: lockerNumber, location: location,
        });
        return locker;
    } catch (err) {
        console.error("Error creating locker:", err);
        return false;
    }

}


export async function createUser(studentId, name, email) {
    try {
        let user = await User.create({
            studentId: studentId, name: name, email: email,
        });
        return user;
    } catch (err) {
        console.error("Error creating user:", err);
        return false;
    }

}

export async function joinUsertoLocker(studentId, lockerNumber) {


    // Find the user by ID
    User.findByPk(studentId)
        .then((user) => {
            if (!user) {
                console.log("User not found.");
                return;
            }

            // Find the locker by ID
            Locker.findByPk(lockerNumber)
                .then((locker) => {
                    if (!locker) {
                        console.log("Locker not found.");
                        return;
                    }

                    // Associate the user with the locker
                    user.setLocker(locker)
                        .then(() => {
                            console.log("User has been associated with the locker.");
                        })
                        .catch((error) => {
                            console.error("Error associating user with locker:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error finding locker:", error);
                });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
        });

}


export async function createUserjoinLocker(studentId, name, email, lockerNumber) {
    try {
        let user = await User.create({
            studentId: studentId, name: name, email: email,
        }).then((newUser) => {
            return Locker.findByPk(lockerNumber)
                .then((existingLocker) => {
                    if (!existingLocker) {
                        throw new Error("Locker not found.");
                    }

                    // Associate the user with the existing locker
                    return newUser.setLocker(existingLocker)
                        .then(() => {
                            console.log("User has been created and added to the existing locker.");
                        });
                });
        })
            .catch((error) => {
                console.error("Error:", error);
            });
        return user;
    } catch (err) {
        console.error("Error creating user:", err);
        return false;
    }

}


export async function getUser(studentId) {
    try {
        // Query the user by student ID and include the associated locker
        const user = await User.findByPk(studentId, {
            include: {
                model: Locker, // Include the Locker model
            },
        });

        if (user) {
            // Access the user's locker through the association and return it
            return user.toJSON();
        } else {
            console.log("User not found.");
            return null; // Return null or throw an error as needed
        }
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}


export async function getLocker(lockerNumber) {
    try {
        // Query the locker by locker number and include the associated users
        const locker = await Locker.findOne({
            where: {
                lockerNumber: lockerNumber,
            }, include: {
                model: User, // Include the User model
            },
        });

        if (locker) {
            // Access the locker's users through the association and return it
            const lockerUsers = locker.toJSON();
            return lockerUsers;
        } else {
            console.log("Locker not found.");
            return null; // Return null or throw an error as needed
        }
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
