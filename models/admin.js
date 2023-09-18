import {Sequelize, DataTypes} from "sequelize";
import {v4 as uuidv4} from "uuid";

//dev db

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database1.sqlite'
});

//prod db

// const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: '10.1.13.12',
//     username: 'birdpump',
//     password: 'ggfdlkgg4',
//     database: 'test'
// });


const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID, // Use UUID data type for the user ID
        primaryKey: true,     // Mark it as the primary key
        defaultValue: Sequelize.UUIDV4, // Use UUID v4 for default value
        allowNull: false,
        unique: true,
    }
});

// Hook to generate a UUID
Admin.beforeCreate((admin) => {
    admin.userId = uuidv4();
});

//for dev
Admin.sync();

export {Admin, sequelize};
