import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";


const User = sequelize.define('User', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

export {User};
