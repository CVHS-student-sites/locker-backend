import {Config} from "../models/config.js";

// Function to create a new configuration
export async function createConfig(key, value) {
    try {
        const config = await Config.create({key, value});
        console.log('Config created:', config.toJSON());
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
        if (updatedRows > 0) {
            console.log('Config updated successfully.');
        } else {
            console.log('Config not found.');
        }
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
            return config;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error reading config:', error);
        throw error;
    }
}
