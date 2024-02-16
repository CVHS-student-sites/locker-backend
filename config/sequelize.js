import {Sequelize} from "sequelize";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let sequelize;

let deployType = process.env.DEPLOY_TYPE;

if (deployType === 'production') {
    // Production database configuration
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'mysql-container',
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: 'locker',
        logging: false
    });

} else {
    // Dev database configuration
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../local-db', 'devDb.sqlite'),
        logging: true,
    });
}

export {sequelize};
