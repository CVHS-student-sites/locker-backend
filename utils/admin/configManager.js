import {Config} from "../../models/config.js";

// Function to create a new configuration
export async function createConfig(key, value) {
    try {
        await Config.create({key, value});
    } catch (error) {
        console.error('Error creating config:', error);
    }
}

// Function to edit an existing configuration
export async function editConfig(key, newValue) {
    try {
        const [updatedRows] = await Config.update({value: newValue}, {
            where: {key},
        });
        return updatedRows > 0;
    } catch (error) {
        console.error('Error updating config:', error);
    }
}

// Function to read a configuration
export async function readConfig(key) {
    try {
        const config = await Config.findOne({
            where: {key},
        });
        if (config) {
            return config.value;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error reading config:', error);
        throw error;
    }
}
