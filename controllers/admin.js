import bcrypt from "bcrypt";
import {Admin} from "../models/admin.js";

const saltRounds = 10;

export async function createUser(username, plainpassword) {
    try {
        const hash = await bcrypt.hash(plainpassword, saltRounds);
        await Admin.create({username: username, password: hash});
        // console.log("User created successfully.")
        return true;
    } catch (err) {
        // console.error("Error creating user:", err);
        return false;
    }
}

export async function validateUser(username, plainpassword) {
    try {
        const user = await Admin.findOne({where: {username}});
        if (user) {
            const result = await bcrypt.compare(plainpassword, user.password);
            return result;
        } else {
            return false;
        }
    } catch (error) {
        // console.error("Error finding user:", error.message);
        return false;
    }
}

export async function getId(username) {
    try {
        const user = await Admin.findOne({where: {username}});
        if (user) {
            return user.userId;
        }
    } catch (error) {
        // console.error("Error finding user:", error.message);
        return false;
    }
}

export async function getUser(username) {
    try {
        const user = await Admin.findOne({where: {username}});

        if (user) {
            return user.toJSON();
        }
    } catch (error) {
        console.error("Error finding user:", error.message);
        return false;
    }
}

export async function getUserfromId(userId) {
    try {
        const user = await Admin.findOne({where: {userId}});
        if (user) {
            return user.toJSON();
        }
    } catch (error) {
        // console.error("Error finding user:", error.message);
        return false;
    }
}
