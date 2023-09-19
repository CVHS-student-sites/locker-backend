import {Sequelize, DataTypes} from "sequelize";

//dev db
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database1.sqlite',
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