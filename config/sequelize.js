import {Sequelize} from "sequelize";
import path from 'path';

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';

try {
    dotenv.config();
} catch (error) {
    console.error('Error loading .env file:', error);
}


let sequelize; // Declare sequelize here

let deployType = process.env.DEPLOY_TYPE;

console.log("sequlize conf", deployType);

if (deployType == 'production') {
    // Production database configuration
    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'mysql-container',
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: 'test',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });

} else {
    // Dev database configuration
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../local-db', 'devDb.sqlite'),
        logging: true,
    });
}

export {sequelize}; // Export sequelize here
