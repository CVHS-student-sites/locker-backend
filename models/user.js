import {sequelize} from "../config/sequelize.js";
import {DataTypes} from "sequelize";


const User = sequelize.define('User', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
    },
});

export {User};
