import {sequelize} from "../config/sequelize.js";
import {DataTypes} from "sequelize";


const UserData = sequelize.define('UserData', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permissions: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export {UserData};
