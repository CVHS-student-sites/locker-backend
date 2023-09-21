import {Sequelize} from "sequelize";
import path from 'path';

// process.env.NODE_ENV = 'development';

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {NODE_ENV} = process.env;

console.log(NODE_ENV)

let sequelize; // Declare sequelize here

if (NODE_ENV === 'production') {
    // Production database configuration
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: '10.1.13.12',
        username: 'birdpump',
        password: 'ggfdlkgg4',
        database: 'cvhs',
        logging: false,
    });
} else {
    // Dev database configuration
    console.log("weird")
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../local-db', 'devDb.sqlite'),
        logging: true,
    });
}

export {sequelize}; // Export sequelize here
