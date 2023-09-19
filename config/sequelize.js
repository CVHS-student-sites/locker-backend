import {Sequelize, DataTypes} from "sequelize";
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//dev db
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../local-db', 'devDb.sqlite'),
    logging: true,
});

//prod db
// export const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: '10.1.13.12',
//     username: 'birdpump',
//     password: 'ggfdlkgg4',
//     database: 'test',
//     logging: false,
// });