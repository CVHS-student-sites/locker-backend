import bcrypt from "bcrypt";
import {Admin} from "../../models/admin.js";

const saltRounds = 10;

export async function createAdminUser(username, plainpassword) {
    try {
        const hash = await bcrypt.hash(plainpassword, saltRounds);
        await Admin.create({username: username, password: hash});
        return true;
    } catch (err) {
        // console.error("Error creating user:", err);
        return false;
    }
}

export async function validateAdminUser(username, plainpassword) {
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

export async function getAdminId(username) {
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

export async function getAdminUser(username) {
    try {
        const user = await Admin.findOne({where: {username}});

        if (user) {
            return user.toJSON();
        }
    } catch (error) {
        // console.error("Error finding user:", error.message);
        return false;
    }
}

export async function getAdminUserfromId(userId) {
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
