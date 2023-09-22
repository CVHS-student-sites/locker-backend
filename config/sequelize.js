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


console.log(process.env.USERNAME);


let sequelize; // Declare sequelize here

let deployType = process.env.DEPLOY_TYPE;

if (deployType == 'production') {
    // Production database configuration
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: '10.1.13.12',
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: 'test',
        logging: false,
    });
} else {
    // Dev database configuration
    console.log("sir we have a problem")
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../local-db', 'devDb.sqlite'),
        logging: true,
    });
}

export {sequelize}; // Export sequelize here
