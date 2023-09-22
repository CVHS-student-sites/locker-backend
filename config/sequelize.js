import {Sequelize} from "sequelize";
import path from 'path';

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DEPLOY_TYPE);


let sequelize; // Declare sequelize here

let deployType = process.env.DEPLOY_TYPE;

if (deployType == 'production') {
    // Production database configuration
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: '10.1.13.12',
        username: 'birdpump',
        password: 'ggfdlkgg4',
        database: 'test',
        logging: false,
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
